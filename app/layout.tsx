import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import RefTracker from "@/app/_components/RefTracker";
import RefRewardNotice from "@/app/_components/RefRewardNotice";
import KakaoInit from "@/components/KakaoInit";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "점운 - AI 사주 분석 | 재물운·연애운·건강운";
const SITE_DESC = "점운에서 AI 사주 분석 무료로 받아보세요. 재물운·연애운·건강운·성공운 990원부터. 대한민국 AI 사주 플랫폼 점운(jeomun.com)";
const SITE_IMAGE = "https://i.pinimg.com/1200x/21/92/2c/21922cc59f29ba66e12cc4546e316079.jpg";
const SITE_URL = "https://jeomun.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
  keywords: "점운, AI사주, 무료사주, 사주분석, 재물운, 연애운, 건강운, 성공운, 오늘의운세, 사주풀이, 만세력, jeomun",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [SITE_IMAGE],
    url: SITE_URL,
    siteName: "점운",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
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
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable}`}
      translate="no"
    >
      <head>
        <meta name="google" content="notranslate" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="naver-site-verification" content="3d2048299405b51629792c9344b06287da0b184e" />
        <meta name="msvalidate.01" content="417C086BA7FE5A50231C28C3C9875B10" />
        <link rel="preconnect" href="https://i.pinimg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.pinimg.com" />
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        <link rel="preload" as="image" href="https://i.pinimg.com/736x/43/62/22/436222b26a1aeebae92aaa7eaa2f5ea3.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "점운",
          "alternateName": ["jeomun", "점운 사주", "AI 사주 점운"],
          "url": "https://jeomun.com",
          "logo": SITE_IMAGE,
          "description": SITE_DESC,
          "sameAs": ["https://pf.kakao.com/_xbwtPX"],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": "Korean"
          }
        })}} />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <RefTracker />
        <RefRewardNotice />
        {children}
        <Analytics />
      </body>
      <KakaoInit />
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-Y2MVHQYPMQ" />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-Y2MVHQYPMQ');
        gtag('config', 'AW-459070148');
      `}</Script>
    </html>
  );
}