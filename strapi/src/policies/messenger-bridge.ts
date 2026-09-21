import { constantTimeEqual } from "../api/messenger/lib/protocol";

export default (ctx) => {
  const secret = process.env.MESSENGER_BRIDGE_SECRET;
  return (
    process.env.MESSENGER_TRACKING_ENABLED === "true" &&
    typeof secret === "string" &&
    secret.length >= 32 &&
    constantTimeEqual(
      ctx.request.headers.authorization || "",
      `Bearer ${secret}`,
    )
  );
};
