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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${gmarket.variable} font-sans bg-white dark:bg-gray-900`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
