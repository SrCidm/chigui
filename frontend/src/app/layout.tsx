import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "Chigui — Learn Spanish",
  description: "AI-powered Spanish tutor. Learn from any language — English, French, German, Portuguese, Italian, Chinese, Japanese, Arabic, and more!",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1F2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
