import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { changelogConfig } from "@prexo/utils/config";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};
export const metadata: Metadata = {
  title: {
    default: changelogConfig.name,
    template: `%s - ${changelogConfig.name}`,
  },
  metadataBase: new URL(changelogConfig.url),
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
    images: [
      {
        url: changelogConfig.ogImage,
        width: 1200,
        height: 630,
        alt: changelogConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: changelogConfig.name,
    description: changelogConfig.description,
    images: [changelogConfig.ogImage],
    creator: "@SaidevDhal",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
