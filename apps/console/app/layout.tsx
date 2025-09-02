import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme.provider";
import { PosthogProvider } from "@/hooks/use-posthog";
import { AuthProvider } from "@/context/auth.context";
import { ContentProvider } from "@/context/store.context";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { consoleConfig } from "@prexo/utils/config";
import WIPAlert from "@/components/wip";

const uxumGrotesque = localFont({
  src: [
    {
      path: "../fonts/uxumGrotesque/uxumGrotesqueRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/uxumGrotesque/uxumGrotesqueRegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/uxumGrotesque/uxumGrotesqueMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/uxumGrotesque/uxumGrotesqueMediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/uxumGrotesque/uxumGrotesqueBold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/uxumGrotesque/uxumGrotesqueBoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-uxum",
  display: "swap",
});

const untitledSans = localFont({
  src: [
    {
      path: "../fonts/untitledSans/untitledSansRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/untitledSans/untitledSansRegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/untitledSans/untitledSansMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/untitledSans/untitledSansMediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/untitledSans/untitledSansBold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/untitledSans/untitledSansBoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-untitled-sans",
  display: "swap",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${uxumGrotesque.variable} ${untitledSans.variable} antialiased`}
      >
        <AuthProvider>
          <ContentProvider>
            <PosthogProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </PosthogProvider>
          </ContentProvider>
        </AuthProvider>
        <Toaster />
        <Analytics />
        <WIPAlert open />
      </body>
    </html>
  );
}
