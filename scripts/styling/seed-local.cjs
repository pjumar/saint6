/* Safe local demonstration/import verification. Never connects to Strapi Cloud. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const appDir = path.join(root, 'strapi');
const localDir = path.join(appDir, '.tmp/styling-preview');
fs.mkdirSync(localDir, { recursive: true });
const envPath = path.join(localDir, '.env');
if (!fs.existsSync(envPath)) {
  const secret = () => crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(envPath, ['APP_KEYS='+[secret(),secret()].join(','), ...['ADMIN_JWT_SECRET','API_TOKEN_SALT','TRANSFER_TOKEN_SALT','ENCRYPTION_KEY','JWT_SECRET'].map(k=>k+'='+secret())].join('\n'), {mode:0o600});
}
// ENV_PATH prevents loading the real CMS .env; all DB/network settings are forced.
Object.assign(process.env, { ENV_PATH: envPath, NODE_ENV: 'development', DATABASE_CLIENT: 'sqlite', DATABASE_FILENAME: '.tmp/styling-preview/data.db', DATABASE_URL: '', HOST: '127.0.0.1', PORT: '1346', STRAPI_TELEMETRY_DISABLED: 'true', STRAPI_DISABLE_UPDATE_NOTIFICATION: 'true', RESEND_API_KEY: '', SMTP_PASSWORD: '' });
process.chdir(appDir);
const { createStrapi, compileStrapi } = require(path.join(appDir, 'node_modules/@strapi/strapi'));
const seed = require(path.join(root, 'app/lib/styling/seed.json'));
async function run() {
  const context = await compileStrapi({ appDir, ignoreDiagnostics: true });
  const app = createStrapi({...context, serveAdminPanel: false});
  await app.load();
  app.cron.destroy();
  if (process.argv.includes("--generate-types")) {
    await require(path.join(appDir, "node_modules/@strapi/typescript-utils")).generators.generate({strapi:app,pwd:appDir,artifacts:{contentTypes:true,components:true}});
  }
  try {
    const uploads = new Map();
    async function image(asset) {
      if (uploads.has(asset.url)) return uploads.get(asset.url);
      const name = path.basename(asset.url);
      let existing = await app.db.query('plugin::upload.file').findOne({where:{name}});
      if (!existing) {
        const filepath = path.join(root, 'public', asset.url);
        const uploaded = await app.plugin('upload').service('upload').upload({
          data: { fileInfo: { name, alternativeText: asset.alternativeText } },
          files: { filepath, originalFilename: name, mimetype: 'image/webp', size: fs.statSync(filepath).size },
        });
        existing = uploaded[0];
      }
      uploads.set(asset.url, existing.id);
      return existing.id;
    }
    for (const locale of ['en','vi']) {
      const uid = 'api::styling-page.styling-page';
      const existing = await app.documents(uid).findFirst({locale});
      if (!existing) {
        const data = {...seed.pages[locale], hero_image: await image(seed.pages[locale].hero_image)};
        const base = locale === 'vi' ? await app.documents(uid).findFirst({locale:'en'}) : null;
        if (base) await app.documents(uid).update({documentId:base.documentId,locale,data,status:'published'});
        else await app.documents(uid).create({locale,data,status:'published'});
      }
      for (const project of seed.projects[locale]) {
        const uid = 'api::styling-project.styling-project';
        const existing = await app.documents(uid).findFirst({locale,filters:{slug:project.slug}});
        if (existing) continue; // Never overwrite edits on rerun.
        const data = {...project, cover:await image(project.cover),gallery:await Promise.all(project.gallery.map(async g=>({...g,image:await image(g.image)})))};
        const base = locale === 'vi' ? await app.documents(uid).findFirst({locale:'en',filters:{slug:project.slug}}) : null;
        if (base) await app.documents(uid).update({documentId:base.documentId,locale,data,status:'published'});
        else await app.documents(uid).create({locale,data,status:'published'});
      }
    }
    // Read-only anonymous access on this isolated local database, for preview testing.
    const role = await app.db.query('plugin::users-permissions.role').findOne({where:{type:'public'}});
    for (const action of ['api::styling-page.styling-page.find','api::styling-project.styling-project.find','api::styling-project.styling-project.findOne']) {
      if (!await app.db.query('plugin::users-permissions.permission').findOne({where:{action,role:role.id}})) await app.db.query('plugin::users-permissions.permission').create({data:{action,role:role.id}});
    }
    for (const locale of ['en','vi']) {
      const projects = await app.documents('api::styling-project.styling-project').findMany({locale,status:'published',populate:{cover:true,gallery:{populate:{image:true}},credits:true}});
      if (projects.length !== 8 || projects.some(p=>!p.cover || !p.gallery.length || !p.credits.some(c=>c.name==='Trần Hoài Trang'))) throw new Error('Local CMS verification failed');
      console.log(`${locale}: ${projects.length} published projects, images and personal credits verified`);
    }
    if (process.argv.includes('--serve')) {
      await new Promise((resolve) => app.server.listen(1346, "127.0.0.1", resolve));
      console.log('Isolated styling CMS available at http://127.0.0.1:1346');
      return;
    }
  } finally {
    if (!process.argv.includes('--serve')) await app.destroy();
  }
}
run().catch(error=>{console.error(error);process.exitCode=1;});
