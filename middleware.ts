import { NextRequest, NextResponse } from "next/server";

const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gad_source",
  "gad_campaignid",
  "gbraid",
];

const COOKIE_NAME = "saint6_utm_params";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl;

  // Don't overwrite if already captured in this session
  if (request.cookies.get(COOKIE_NAME)) return response;

  const captured: Record<string, string> = {};
  let found = false;

  for (const param of TRACKING_PARAMS) {
    const value = url.searchParams.get(param);
    if (value) {
      captured[param] = value;
      found = true;
    }
  }

  if (found) {
    // Store landing page alongside params
    captured._landing = url.pathname;

    response.cookies.set(COOKIE_NAME, JSON.stringify(captured), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false, // JS needs to read it
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  matcher: ["/(en|vi)/:path*"],
};
