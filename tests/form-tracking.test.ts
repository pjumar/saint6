import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

function run(environment: string, enabled: boolean) {
  const script = `
    global.window={dataLayer:[]};
    const {submissionData,trackFormConversion,formSubmissionsEnabled}=require('./app/lib/form-submissions.ts');
    let data,blocked=false;
    try { data=submissionData({name:'QA',trafficSource:'google',utmCampaign:'real-campaign'}); } catch { blocked=true; }
    for(const transaction_id of ['contact-1','contact-1','booking-1']) trackFormConversion({event:'test',transaction_id});
    console.log(JSON.stringify({data,blocked,formSubmissionsEnabled,events:window.dataLayer}));
  `;
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "-e", script],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        NEXT_PUBLIC_SITE_ENVIRONMENT: environment,
        NEXT_PUBLIC_PREVIEW_FORM_TESTS_ENABLED: String(enabled),
      },
    },
  );
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}
test("previews cannot submit by default and never emit conversion events", () => {
  const data = run("preview", false);
  assert.equal(data.blocked, true);
  assert.deepEqual(data.events, []);
});
test("explicit preview tests are labelled and have test attribution without conversions", () => {
  const data = run("preview", true);
  assert.match(data.data.name, /PREVIEW TEST/);
  assert.equal(data.data.trafficSource, "test");
  assert.equal(data.data.utmCampaign, "styling-preview-readiness");
  assert.deepEqual(data.events, []);
});
test("production preserves visitor data and deduplicates successful submission IDs", () => {
  const data = run("production", false);
  assert.equal(data.data.name, "QA");
  assert.equal(data.data.utmCampaign, "real-campaign");
  assert.deepEqual(
    data.events.map((e: { transaction_id: string }) => e.transaction_id),
    ["contact-1", "booking-1"],
  );
});
