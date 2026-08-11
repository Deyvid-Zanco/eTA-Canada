import { NextRequest, NextResponse } from "next/server";

function getAllowedOrigins(req: NextRequest) {
  const requestOrigin = new URL(req.url).origin;
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const origins = new Set([requestOrigin]);

  if (configuredSiteUrl) {
    const configuredUrl = new URL(configuredSiteUrl);
    origins.add(configuredUrl.origin);
    origins.add(
      configuredUrl.hostname.startsWith("www.")
        ? `${configuredUrl.protocol}//${configuredUrl.hostname.replace(/^www\./, "")}`
        : `${configuredUrl.protocol}//www.${configuredUrl.hostname}`,
    );
  }

  return origins;
}

export function rejectCrossSiteRequest(req: NextRequest) {
  const allowedOrigins = getAllowedOrigins(req);
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const secFetchSite = req.headers.get("sec-fetch-site");

  if (secFetchSite && !["same-origin", "same-site", "none"].includes(secFetchSite)) {
    return NextResponse.json({ error: "Request blocked" }, { status: 403 });
  }

  const source = origin || referer;
  if (source) {
    try {
      if (!allowedOrigins.has(new URL(source).origin)) {
        return NextResponse.json({ error: "Request blocked" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Request blocked" }, { status: 403 });
    }
  }

  const blockDirectRequests =
    process.env.BLOCK_DIRECT_API_REQUESTS === "true" ||
    (process.env.NODE_ENV === "production" && process.env.BLOCK_DIRECT_API_REQUESTS !== "false");

  if (!source && blockDirectRequests) {
    return NextResponse.json({ error: "Request blocked" }, { status: 403 });
  }

  return null;
}
