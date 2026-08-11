import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.immicenter-online.com";
  const paths = ["", "/terms", "/privacy", "/refund", "/delivery", "/cookies"];

  return paths.map((path, index) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.5,
  }));
}
