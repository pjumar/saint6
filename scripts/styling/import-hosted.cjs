/* Additive REST import. Never transfers a database or overwrites existing content. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
require('dotenv').config({ path: path.join(root, '.env.local'), quiet: true });
const seed = require(path.join(root, 'app/lib/styling/seed.json'));
const apply = process.argv.includes('--apply');
const origin = process.env.STYLING_IMPORT_ORIGIN || 'https://strapi.saint6.studio';
if (origin !== 'https://strapi.saint6.studio' && !/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) throw new Error('Unapproved import destination');
const token = process.env.STYLING_IMPORT_TOKEN || process.env.STRAPI_API_TOKEN;
if (!token) throw new Error('A server-only Strapi token is required');
const logDir = path.join(root, '.backups/2026-09-29-before-styling-launch');
fs.mkdirSync(logDir, {recursive:true, mode:0o700});
const manifestPath = path.join(logDir, 'styling-import.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath)) : {origin, assets:{}, documents:[]};
if (manifest.origin !== origin) throw new Error('Manifest destination mismatch');
const persist = () => fs.writeFileSync(manifestPath, JSON.stringify(manifest,null,2), {mode:0o600});
async function api(route, options = {}, allowMissing = false) {
  const response = await fetch(origin + '/api/' + route, {
    ...options, headers:{Authorization:`Bearer ${token}`, ...(options.body instanceof FormData ? {} : {'Content-Type':'application/json'}), ...options.headers},
    signal:AbortSignal.timeout(120000),
  });
  if (response.status === 404 && allowMissing) return {data:null};
  if (!response.ok) {
    const data = await response.json().catch(()=>({}));
    throw new Error(`${options.method || 'GET'} ${route.split('?')[0]}: ${response.status} ${data.error?.message || ''}`);
  }
  return response.json();
}
const query = data => new URLSearchParams(data).toString();
const assets = new Map();
function collect(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.url === 'string' && value.url.startsWith('/images/')) assets.set(value.url,value);
  else Object.values(value).forEach(collect);
}
collect(seed);
async function upload(asset) {
  const filepath = path.resolve(root,'public'+asset.url);
  if (!filepath.startsWith(path.join(root,'public/images/') )) throw new Error('Unsafe asset path');
  const bytes = fs.readFileSync(filepath);
  const name = 'styling-' + crypto.createHash('sha256').update(asset.url).update(bytes).digest('hex').slice(0,24) + path.extname(filepath);
  const found = await api('upload/files?'+query({'filters[name][$eq]':name}));
  if (found.length > 1) throw new Error('Ambiguous existing image: '+name);
  if (found[0]) return found[0].id;
  const body = new FormData();
  const ext = path.extname(filepath).toLowerCase();
  const mime = {'.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp'}[ext];
  if (!mime) throw new Error('Unsupported image type');
  body.append('files',new Blob([bytes],{type:mime}),name);
  body.append('fileInfo',JSON.stringify({name,alternativeText:asset.alternativeText || ''}));
  const result = await api('upload',{method:'POST',body});
  if (!result[0]?.id) throw new Error('Upload missing ID');
  return result[0].id;
}
function materialize(value) {
  if (Array.isArray(value)) return value.map(materialize);
  if (!value || typeof value !== 'object') return value;
  if (typeof value.url === 'string' && assets.has(value.url)) {
    if (!manifest.assets[value.url]) throw new Error('Missing uploaded image');
    return manifest.assets[value.url];
  }
  return Object.fromEntries(Object.entries(value).map(([key,val])=>[key,materialize(val)]));
}
async function existing(endpoint, locale, slug, status='draft') {
  const result = await api(endpoint+'?'+query({locale,status,...(slug?{'filters[slug][$eq]':slug}:{} )}),{},!slug);
  if (!slug) return result.data;
  if (result.data.length > 1) throw new Error('Duplicate slug: '+slug);
  return result.data[0];
}
async function create(endpoint, locale, source, single=false) {
  const slug = single ? null : source.slug;
  const current = await existing(endpoint,locale,slug);
  if (current) return; // Preserve every existing editor change, including unpublished drafts.
  const base = locale==='vi' && !single ? await existing(endpoint,'en',slug) : null;
  const route = endpoint + (base ? '/'+base.documentId : '') + '?'+query({locale,status:'published'});
  const result = await api(route,{method:single || base ? 'PUT':'POST',body:JSON.stringify({data:materialize(source)})});
  if (!result.data?.documentId || !result.data.publishedAt) throw new Error('New content did not publish: '+(slug||endpoint));
  manifest.documents.push({endpoint,locale,slug,documentId:result.data.documentId});persist();
}
async function verify() {
  for (const locale of ['en','vi']) {
    for (const [endpoint] of [['shared-contact'],['styling-page']]) {
      const item=await existing(endpoint,locale,null,'published');
      if (!item?.documentId) throw new Error(`Missing published ${endpoint} ${locale}`);
    }
    let rows=[];
    for(let page=1;;page++) {
      const result=await api('styling-projects?'+query({locale,status:'published','pagination[pageSize]':'100','pagination[page]':String(page),'fields[0]':'slug','populate[cover]':'true'}));
      rows.push(...result.data);
      if(page>=result.meta.pagination.pageCount) break;
    }
    const missing=seed.projects[locale].filter(p=>!rows.some(r=>r.slug===p.slug && r.cover?.url));
    if(missing.length) throw new Error(`Missing ${missing.length} published ${locale} projects or covers`);
    console.log(`${locale}: ${seed.projects[locale].length} approved projects published with covers`);
  }
}
async function main() {
  for(const asset of assets.values()) fs.accessSync(path.join(root,'public',asset.url));
  // Verify schemas/token before any upload.
  for(const endpoint of ['styling-page','shared-contact','styling-projects']) await existing(endpoint,'en',endpoint==='styling-projects'?'schema-check':null);
  console.log(JSON.stringify({mode:apply?'additive-import':'read-only-plan',origin,images:assets.size,projects:seed.projects.en.length,locales:['en','vi']}));
  if(process.argv.includes('--verify')) return verify();
  if(!apply) return;
  let completed=0;
  const pending=[...assets.values()];
  await Promise.all(Array.from({length:3},async()=>{
    while(pending.length) {
      const asset=pending.shift();
      manifest.assets[asset.url]=await upload(asset);persist();
      if(++completed%50===0) console.log(`Images verified/uploaded: ${completed}/${assets.size}`);
    }
  }));
  for(const locale of ['en','vi']) {
    await create('shared-contact',locale,seed.contactSections[locale],true);
    await create('styling-page',locale,seed.pages[locale],true);
    for(const project of seed.projects[locale]) await create('styling-projects',locale,project);
    console.log(`Completed ${locale} content`);
  }
  await verify();
}
main().catch(error=>{console.error(error.message.replace(token,'<redacted>'));process.exitCode=1;});
