import type { Metadata } from "next";

const IMG = "https://i.pinimg.com/736x/3a/36/30/3a3630aa53fc14c5076ab4851d783b6e.jpg";

export const metadata: Metadata = {
  title: "점운 별자리 — 별자리와 사주 오행으로 보는 나의 운세",
  description: "내 별자리와 사주 오행을 결합해 오늘의 운세와 나의 기질을 무료로 분석해드려요",
  openGraph: {
    title: "⭐ 점운 별자리 — 별자리와 사주 오행으로 보는 나의 운세",
    description: "내 별자리와 사주 오행을 결합해 오늘의 운세와 나의 기질을 무료로 분석해드려요",
    url: "https://jeomun.com/zodiac",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "점운 별자리 — 별자리 오행 운세" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "⭐ 점운 별자리 — 별자리와 사주 오행으로 보는 나의 운세",
    description: "별자리 + 사주 오행으로 오늘 운세 무료 확인",
    images: [IMG],
  },
};

export default function ZodiacLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
