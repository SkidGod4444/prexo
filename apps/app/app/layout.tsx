import "./globals.css";
import { consoleConfig } from "@prexo/utils/config";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme.provider";
import { AppProviders } from "@/components/providers";
import { Spinner } from "@/components/ui/spinner";
// import { PosthogProvider } from "@/hooks/use-posthog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: consoleConfig.name,
    template: `%s - ${consoleConfig.name}`,
  },
  metadataBase: new URL(consoleConfig.url),
  description: consoleConfig.description,
  keywords: [
    "Saidev Dhal",
    "Prexo Ai",
    "Sales Ai Agents",
    "Customer Support",
    "Chat Ai Agents",
    "Chat bot",
    "AI Chatbot",
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
    url: consoleConfig.url,
    title: consoleConfig.name,
    description: consoleConfig.description,
    siteName: consoleConfig.name,
    images: [
      {
        url: consoleConfig.ogImage,
        width: 1200,
        height: 630,
        alt: consoleConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: consoleConfig.name,
    description: consoleConfig.description,
    images: [consoleConfig.ogImage],
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
    // <PosthogProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen w-full">
                  <Spinner className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <AppProviders>{children}</AppProviders>
            </Suspense>
          </ThemeProvider>
        </body>
      </html>
    // </PosthogProvider>
  );
}
