import { Metadata } from "next";
import { changelogConfig } from "@prexo/utils/config";

export const metadata: Metadata = {
  title: changelogConfig.name,
  description: changelogConfig.description,
  keywords: [
    "Prexo AI",
    "React",
    "Prexo AI Chat BOT",
    "Prexo AI Chat SDK",
    "Changelogs",
    "Prexo AI Changelog",
    "Saidev Dhal"
  ],
  authors: [
    {
      name: "Saidev Dhal",
      url: "https://devwtf.in",
    },
  ],
  creator: "Saidev Dhal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: changelogConfig.url,
    title: changelogConfig.name,
    description: changelogConfig.description,
    siteName: changelogConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: changelogConfig.name,
    description: changelogConfig.description,
    creator: "@SaidevDhal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
