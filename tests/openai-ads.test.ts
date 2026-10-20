import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

interface BrowserOptions {
  environment?: string;
  hostname?: string;
  pixelId?: string;
  consent?: string;
  privacyControl?: boolean;
  blockedStorage?: boolean;
  blockedScript?: boolean;
  browser?: boolean;
}

function run(
  scenario: string,
  options: BrowserOptions = {},
): Record<string, unknown> {
  const script = `
    const scripts = [], events = [], calls = [];
    const local = new Map(), session = new Map();
    const consentKey = 'saint6:openai-ads-consent:v1';
    const initialConsent = ${JSON.stringify(options.consent ?? null)};
    if (initialConsent !== null) local.set(consentKey, initialConsent);
    function storage(values) {
      return {
        getItem(key) {
          if (${options.blockedStorage === true}) throw new Error('Storage blocked');
          return values.get(key) ?? null;
        },
        setItem(key, value) {
          if (${options.blockedStorage === true}) throw new Error('Storage blocked');
          values.set(key, value);
        }
      };
    }
    if (${options.browser !== false}) {
      global.window = {
        location: {hostname:${JSON.stringify(options.hostname ?? "saint6.studio")}},
        navigator: {globalPrivacyControl:${options.privacyControl === true}},
        localStorage: storage(local), sessionStorage: storage(session),
        dispatchEvent(event) {
          events.push({type:event.type, detail:event.detail});
          return true;
        }
      };
      global.CustomEvent = class {
        constructor(type, options) {this.type=type; this.detail=options.detail;}
      };
      global.document = {
        createElement() {return {src:'',async:false,id:'',onload:null,onerror:null};},
        head: {appendChild(script) {
          if (${options.blockedScript === true}) throw new Error('Script blocked');
          scripts.push(script); return script;
        }}
      };
    }
    const modulePath = './app/lib/openai-ads.ts';
    let api = require(modulePath);
    function finishLoading() {
      calls.push(...(window.oaiq.q ?? []));
      window.oaiq = (...command) => calls.push(command);
      scripts[0].onload();
    }
    function output(extra = {}) {
      console.log(JSON.stringify({
        enabled:api.isOpenAIAdsEnabled(), consent:api.getOpenAIAdsConsent(),
        commands:global.window?.oaiq?.q ?? calls,
        scripts:scripts.map(({src,async,id}) => ({src,async,id})), events, ...extra
      }));
    }
    ${scenario}
  `;
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "-e", script],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        NEXT_PUBLIC_SITE_ENVIRONMENT: options.environment ?? "production",
        NEXT_PUBLIC_OPENAI_ADS_PIXEL_ID: options.pixelId ?? "pixel-test-1",
      },
    },
  );
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout) as Record<string, unknown>;
}

test("server rendering never initializes or records an enquiry", () => {
  const result = run(
    `api.initializeOpenAIAds(); api.setOpenAIAdsConsent(true);
     api.trackRentalEnquiry('booking-1'); output();`,
    { browser: false },
  );
  assert.equal(result.enabled, false);
  assert.equal(result.consent, null);
  assert.deepEqual(result.commands, []);
  assert.deepEqual(result.scripts, []);
});

test("preview, development, untrusted hosts, and missing pixels cannot load the SDK", () => {
  const cases: BrowserOptions[] = [
    { environment: "preview" },
    { environment: "development" },
    { hostname: "saint6-preview.vercel.app" },
    { hostname: "localhost" },
    { hostname: "saint6.studio.example.com" },
    { pixelId: "" },
  ];
  for (const options of cases) {
    const result = run(
      `api.setOpenAIAdsConsent(true); api.initializeOpenAIAds();
       api.trackRentalEnquiry('booking-1'); output();`,
      options,
    );
    assert.equal(result.enabled, false, JSON.stringify(options));
    assert.deepEqual(result.commands, []);
    assert.deepEqual(result.scripts, []);
  }
});

test("no choice or denial loads nothing and blocked enquiries are never replayed on opt-in", () => {
  const result = run(`
    api.initializeOpenAIAds(); api.trackRentalEnquiry('booking-before-choice');
    const beforeChoice = {hasSDK:!!window.oaiq, scripts:scripts.length};
    api.setOpenAIAdsConsent(false); api.trackRentalEnquiry('booking-denied');
    const afterDenial = {hasSDK:!!window.oaiq, scripts:scripts.length};
    api.setOpenAIAdsConsent(true); output({beforeChoice,afterDenial});
  `);
  assert.deepEqual(result.beforeChoice, { hasSDK: false, scripts: 0 });
  assert.deepEqual(result.afterDenial, { hasSDK: false, scripts: 0 });
  assert.deepEqual(result.commands, [
    ["consent", false],
    ["init", { pixelId: "pixel-test-1" }],
    ["consent", true],
  ]);
  assert.deepEqual(result.events, [
    { type: "saint6:openai-ads-consent", detail: { consent: "denied" } },
    { type: "saint6:openai-ads-consent", detail: { consent: "granted" } },
  ]);
});

test("opt-in initializes once and sends only the documented event with stable ID deduplication", () => {
  const result = run(`
    api.setOpenAIAdsConsent(true); api.initializeOpenAIAds(); api.initializeOpenAIAds();
    for (const id of ['booking-1','booking-1','contact-1']) api.trackRentalEnquiry(id);
    output();
  `);
  assert.equal(result.consent, "granted");
  assert.deepEqual(result.scripts, [
    {
      src: "https://bzrcdn.openai.com/sdk/oaiq.min.js",
      async: true,
      id: "saint6-openai-ads-sdk",
    },
  ]);
  assert.deepEqual(result.commands, [
    ["consent", false],
    ["init", { pixelId: "pixel-test-1" }],
    ["consent", true],
    [
      "measure",
      "lead_created",
      { type: "customer_action" },
      { event_id: "booking-1", opt_out: true },
    ],
    [
      "measure",
      "lead_created",
      { type: "customer_action" },
      { event_id: "contact-1", opt_out: true },
    ],
  ]);
});

test("malformed and missing IDs are discarded without capturing PII or form fields", () => {
  const result = run(`
    api.setOpenAIAdsConsent(true);
    for (const id of [undefined,null,{},'', ' ', 'name@example.com',
      'https://example.com', 'booking id', 'x'.repeat(129)]) api.trackRentalEnquiry(id);
    output();
  `);
  assert.deepEqual(result.commands, [
    ["consent", false],
    ["init", { pixelId: "pixel-test-1" }],
    ["consent", true],
  ]);
});

test("Global Privacy Control overrides saved and newly requested opt-in", () => {
  const result = run(
    `api.initializeOpenAIAds(); api.setOpenAIAdsConsent(true);
     api.trackRentalEnquiry('booking-1'); output();`,
    { privacyControl: true, consent: "granted" },
  );
  assert.equal(result.consent, "denied");
  assert.deepEqual(result.commands, []);
  assert.deepEqual(result.scripts, []);
});

test("stored opt-in initializes on the www production host, while malformed storage does not", () => {
  const enabled = run(`api.initializeOpenAIAds(); output();`, {
    hostname: "www.saint6.studio",
    consent: "granted",
  });
  assert.equal(enabled.enabled, true);
  assert.equal((enabled.scripts as unknown[]).length, 1);
  const malformed = run(`api.initializeOpenAIAds(); output();`, {
    consent: "true",
  });
  assert.equal(malformed.consent, null);
  assert.deepEqual(malformed.scripts, []);
});

test("a newly enabled Global Privacy Control revokes an already loaded SDK", () => {
  const result = run(`
    api.setOpenAIAdsConsent(true); finishLoading();
    window.navigator.globalPrivacyControl = true;
    api.trackRentalEnquiry('booking-1'); output();
  `);
  assert.equal(result.consent, "denied");
  assert.deepEqual(result.commands, [
    ["consent", false],
    ["init", { pixelId: "pixel-test-1" }],
    ["consent", true],
    ["consent", false],
  ]);
});

test("revocation discards pending events before a delayed SDK download can process them", () => {
  const result = run(`
    api.setOpenAIAdsConsent(true); api.trackRentalEnquiry('booking-before-revoke');
    api.setOpenAIAdsConsent(false); const revokedCommands = [...window.oaiq.q];
    api.trackRentalEnquiry('booking-denied'); finishLoading();
    api.setOpenAIAdsConsent(true); output({revokedCommands});
  `);
  assert.deepEqual(result.revokedCommands, [["consent", false]]);
  assert.deepEqual(result.commands, [
    ["consent", false],
    ["consent", false],
    ["init", { pixelId: "pixel-test-1" }],
    ["consent", true],
  ]);
});

test("loaded SDK receives consent false and later opt-in does not reinitialize or replay", () => {
  const result = run(`
    api.setOpenAIAdsConsent(true); finishLoading(); api.trackRentalEnquiry('booking-1');
    api.setOpenAIAdsConsent(false); api.trackRentalEnquiry('booking-denied');
    api.setOpenAIAdsConsent(true); api.trackRentalEnquiry('booking-1'); output();
  `);
  assert.deepEqual(result.commands, [
    ["consent", false],
    ["init", { pixelId: "pixel-test-1" }],
    ["consent", true],
    [
      "measure",
      "lead_created",
      { type: "customer_action" },
      { event_id: "booking-1", opt_out: true },
    ],
    ["consent", false],
    ["consent", true],
  ]);
});

test("storage denial preserves consent and deduplication in session memory", () => {
  const result = run(
    `api.setOpenAIAdsConsent(true);
     api.trackRentalEnquiry('booking-1'); api.trackRentalEnquiry('booking-1'); output();`,
    { blockedStorage: true },
  );
  assert.equal(result.consent, "granted");
  const commands = result.commands as unknown[][];
  assert.equal(
    commands.filter((command) => command[0] === "measure").length,
    1,
  );
});

test("saved consent and session deduplication survive a page reload and stay pixel-scoped", () => {
  const result = run(`
    api.setOpenAIAdsConsent(true); api.trackRentalEnquiry('booking-1');
    window.oaiq = undefined; scripts.length = 0;
    delete require.cache[require.resolve(modulePath)]; api = require(modulePath);
    api.initializeOpenAIAds(); api.trackRentalEnquiry('booking-1');
    const afterReload = [...window.oaiq.q];
    process.env.NEXT_PUBLIC_OPENAI_ADS_PIXEL_ID = 'pixel-test-2';
    api.trackRentalEnquiry('booking-1'); output({afterReload});
  `);
  assert.deepEqual(result.afterReload, [
    ["consent", false],
    ["init", { pixelId: "pixel-test-1" }],
    ["consent", true],
  ]);
  const commands = result.commands as unknown[][];
  assert.equal(
    commands.filter((command) => command[0] === "measure").length,
    1,
  );
});

test("ad blocking, script insertion failures, and throwing SDK functions never break submission", () => {
  const blocked = run(`
    api.setOpenAIAdsConsent(true); api.trackRentalEnquiry('booking-before-error');
    scripts[0].onerror();
    api.trackRentalEnquiry('booking-1'); api.initializeOpenAIAds(); output();
  `);
  assert.deepEqual(blocked.commands, []);
  assert.equal((blocked.scripts as unknown[]).length, 1);
  const failedInsertion = run(
    `api.setOpenAIAdsConsent(true); api.trackRentalEnquiry('booking-1');
     api.setOpenAIAdsConsent(false); output();`,
    { blockedScript: true },
  );
  assert.equal(failedInsertion.consent, "denied");
  const throwingSDK = run(`
    api.setOpenAIAdsConsent(true); finishLoading();
    window.oaiq = (...command) => {calls.push(command); throw new Error('SDK unavailable');};
    api.trackRentalEnquiry('booking-1'); api.setOpenAIAdsConsent(false);
    api.trackRentalEnquiry('booking-after-revoke'); output();
  `);
  assert.equal(throwingSDK.consent, "denied");
  const commands = throwingSDK.commands as unknown[][];
  assert.deepEqual(commands.at(-1), ["consent", false]);
});
