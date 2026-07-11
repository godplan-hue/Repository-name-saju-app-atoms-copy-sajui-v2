import type { Metadata } from "next";

const IMG = "https://i.pinimg.com/736x/bb/20/f3/bb20f354e8a443be9f6a4b71d0022f07.jpg";

export const metadata: Metadata = {
  title: "점운 궁합 — 오행으로 보는 두 사람의 궁합",
  description: "두 사람의 생년월일로 오행 궁합 점수와 연애 패턴을 무료로 분석해드려요",
  openGraph: {
    title: "💑 점운 궁합 — 오행으로 보는 두 사람의 궁합",
    description: "두 사람의 생년월일로 오행 궁합 점수와 연애 패턴을 무료로 분석해드려요",
    url: "https://jeomun.com/gunghap",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "점운 궁합 — 오행 궁합 분석" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "💑 점운 궁합 — 오행으로 보는 두 사람의 궁합",
    description: "두 사람의 오행 궁합 점수와 연애 패턴을 무료로 분석",
    images: [IMG],
  },
};

export default function GunghapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
