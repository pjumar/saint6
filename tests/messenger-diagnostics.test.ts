import assert from "node:assert/strict";
import test from "node:test";
import { summarizeMessengerEnvelope } from "../app/lib/messenger/diagnostics";

test("diagnoses skipped notifications without recording personal identifiers or content", () => {
  const now = 1_790_000_000_000;
  const result = summarizeMessengerEnvelope(
    {
      object: "page",
      entry: [
        {
          id: "103955275891976",
          messaging: [
            {
              sender: { id: "987654321" },
              recipient: { id: "103955275891976" },
              timestamp: now,
              message: {
                mid: "private-message-id",
                text: "private message content",
                is_echo: true,
                attachments: [
                  {
                    type: "image",
                    payload: { url: "https://private.example/image" },
                  },
                ],
              },
              referral: {
                ref: `s6_${"a".repeat(32)}`,
                source: "SHORTLINK",
                type: "OPEN_THREAD",
              },
            },
          ],
        },
      ],
    },
    "wrong-page-setting",
    now,
  );
  assert.equal(result.configuredPageIdValid, false);
  assert.deepEqual(result.observedPageIds, ["103955275891976"]);
  assert.equal(result.matchingPages, 0);
  assert.equal(result.echoes, 1);
  assert.equal(result.validTimes, 1);
  assert.equal(result.validReferences, 1);
  for (const value of [
    "987654321",
    "private",
    `s6_${"a".repeat(32)}`,
    String(now),
  ])
    assert.equal(JSON.stringify(result).includes(value), false);
});

test("distinguishes missing and seconds timestamps without logging timestamp values", () => {
  const now = 1_790_000_000_000;
  const result = summarizeMessengerEnvelope(
    {
      entry: [
        {
          id: "123",
          time: now,
          messaging: [
            { timestamp: 0 },
            { timestamp: now / 1000 },
            { timestamp: now - 31 * 86400000 },
          ],
        },
      ],
    },
    "123",
    now,
  );
  assert.equal(result.expiredTimes, 3);
  assert.equal(result.zeroTimes, 1);
  assert.equal(result.currentSecondsTimes, 1);
  assert.equal(result.validEntryTimes, 1);
  assert.equal(JSON.stringify(result).includes(String(now)), false);
  assert.equal(JSON.stringify(result).includes(String(now / 1000)), false);
});
