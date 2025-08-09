import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth.context";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@prexo/utils/config";

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
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
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
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
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
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col items-center bg-background overflow-hidden">
              {children}
            </div>
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
