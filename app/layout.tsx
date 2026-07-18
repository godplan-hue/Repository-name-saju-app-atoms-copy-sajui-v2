import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import RefTracker from "@/app/_components/RefTracker";
import RefRewardNotice from "@/app/_components/RefRewardNotice";
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
        <meta name="naver-site-verification" content="3d2048299405b51629792c9344b06287da0b184e" />
        <meta name="msvalidate.01" content="417C086BA7FE5A50231C28C3C9875B10" />
        {/* LCP 개선: 이미지 CDN 연결 미리 열기 */}
        <link rel="preconnect" href="https://i.pinimg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.pinimg.com" />
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        {/* /main-v2 첫 번째 배너 이미지 미리 로드 */}
        <link rel="preload" as="image" href="https://i.pinimg.com/736x/43/62/22/436222b26a1aeebae92aaa7eaa2f5ea3.jpg" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <RefTracker />
        <RefRewardNotice />
        {children}
        <Analytics />
      </body>
      <Script
        id="kakao-sdk"
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const k = (window as any).Kakao;
          if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }}
      />
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