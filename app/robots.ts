import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/canada/apply", "/obrigado"],
    },
    sitemap: "https://www.immicenter-online.com/sitemap.xml",
  };
}
