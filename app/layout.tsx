import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/common/ThemeProvider";

import "./globals.css";

import { Toaster } from 'react-hot-toast';

const gmarket = localFont({
  src: [
    {
      path: "../fonts/GmarketSansLight.otf",
      weight: "300",
    },
    {
      path: "../fonts/GmarketSansMedium.otf",
      weight: "500",
    },
    {
      path: "../fonts/GmarketSansBold.otf",
      weight: "700",
    },
  ],
  variable: "--font-gmarket",
});

export const metadata: Metadata = {
  title: "일심동네",
  description: "우리 동네 사람들과 함께하는 챌린지",
  manifest: "/images/favicon_io/site.webmanifest",
  icons: {
    icon: "/images/favicon_io/favicon-32x32.png",
    shortcut: "/images/favicon_io/favicon.ico",
    apple: "/images/favicon_io/apple-touch-icon.png",
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/images/favicon_io/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/images/favicon_io/android-chrome-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/images/favicon_io/android-chrome-512x512.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${gmarket.variable} font-sans bg-white dark:bg-gray-900`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Toaster position="top-center" />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
