import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const locales = ["en", "vi"];
const defaultLocale = "vi";

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
  // Custom aliases — browsers strip known names (gclid, fbclid) but not custom ones.
  // Set Final URL Suffix in Google Ads: s6clid={gclid}&s6cid={campaignid}
  "s6clid",
  "s6cid",
];

const UTM_COOKIE = "saint6_utm_params";

// Map custom param aliases back to standard names
const PARAM_ALIASES: Record<string, string> = {
  s6clid: "gclid",
  s6cid: "gad_campaignid",
};

function captureUtmParams(request: NextRequest, response: NextResponse): void {
  if (request.cookies.get(UTM_COOKIE)) return;

  const captured: Record<string, string> = {};
  let found = false;

  for (const param of TRACKING_PARAMS) {
    const value = request.nextUrl.searchParams.get(param);
    if (value) {
      const key = PARAM_ALIASES[param] || param;
      // Don't overwrite standard param with alias if both present
      if (!captured[key]) {
        captured[key] = value;
      }
      found = true;
    }
  }

  if (found) {
    captured._landing = request.nextUrl.pathname;
    response.cookies.set(UTM_COOKIE, JSON.stringify(captured), {
      path: "/",
      maxAge: 60 * 60, // 1 hour
      httpOnly: false, // JS needs to read it
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    const response = NextResponse.next();
    captureUtmParams(request, response);
    return response;
  }

  const locale = getLocale(request) || defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(request.nextUrl);
  captureUtmParams(request, response);
  return response;
}

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, q] = lang.trim().split(";q=");
      return { code: code.split("-")[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .find((lang) => locales.includes(lang.code));

  return preferred?.code || defaultLocale;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets|images|.*\\..*).*)",
  ],
};
