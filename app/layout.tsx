import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "🔮 점운 - AI 사주 분석";
const SITE_DESC = "AI가 정밀하게 읽어내는 사주 분석, 점운에서 무료로 받아보세요";
const SITE_IMAGE = "https://i.pinimg.com/1200x/21/92/2c/21922cc59f29ba66e12cc4546e316079.jpg";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESC,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [SITE_IMAGE],
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
      className={`${geistSans.variable} ${geistMono.variable}`}
      translate="no"
    >
      <head>
        <meta name="google" content="notranslate" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-Y2MVHQYPMQ" />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-Y2MVHQYPMQ');
      `}</Script>
    </html>
  );
}