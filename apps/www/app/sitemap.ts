import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://prexoai.xyz",
      lastModified: "2025-08-10",
      changeFrequency: "weekly",
      priority: 0,
      images: ["https://example.com/og.png"],
    },
  ];
}
