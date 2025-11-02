import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prexo AI Console",
    short_name: "Prexo AI",
    description:
      "The dashboard for managing your Prexo AI agents, settings, and analytics. Access and control all your AI-powered sales and support tools in one place.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "../favicons/web-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "../favicons/web-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
