import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme.provider";
import { PosthogProvider } from "@/hooks/use-posthog";
import { AuthProvider } from "@/context/auth.context";
import { ContentProvider } from "@/context/store.context";

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
  title: "Prexo Ai Console",
  description: "Operated by Plexy HQ",
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
      </body>
    </html>
  );
}
