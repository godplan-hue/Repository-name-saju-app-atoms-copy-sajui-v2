import type { Metadata } from "next";

const IMG = "https://i.pinimg.com/736x/7e/ad/71/7ead71fd8ff5c3d3d57abab4b5b01347.jpg";

export const metadata: Metadata = {
  title: "점운 감정일기 — 오늘의 감정을 기록하세요",
  description: "오늘의 감정을 일기로 남기고, 사주 오행으로 감정의 흐름을 파악하세요. 무료",
  openGraph: {
    title: "📔 점운 감정일기 — 오늘의 감정을 기록하세요",
    description: "오늘의 감정을 일기로 남기고, 사주 오행으로 감정의 흐름을 파악하세요. 무료",
    url: "https://jeomun.com/gamjung",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "점운 감정일기 — 감정 기록 앱" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "📔 점운 감정일기 — 오늘의 감정을 기록하세요",
    description: "감정 일기 + 사주 오행으로 감정 흐름 파악, 무료",
    images: [IMG],
  },
};

export default function GamjungLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
