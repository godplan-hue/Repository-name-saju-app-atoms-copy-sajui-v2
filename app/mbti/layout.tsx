import type { Metadata } from "next";

const IMG = "https://i.pinimg.com/1200x/aa/7a/e3/aa7ae3b66dc315f01fedf552b101f033.jpg";

export const metadata: Metadata = {
  title: "점운 MBTI — 사주 오행으로 보는 나의 기질",
  description: "16문항으로 나의 MBTI 유형과 사주 오행 기질을 무료로 분석해드려요",
  openGraph: {
    title: "🧠 점운 MBTI — 사주 오행으로 보는 나의 기질",
    description: "16문항으로 나의 MBTI 유형과 사주 오행 기질을 무료로 분석해드려요",
    url: "https://jeomun.com/mbti",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "점운 MBTI — 사주 오행 기질 분석" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "🧠 점운 MBTI — 사주 오행으로 보는 나의 기질",
    description: "16문항 무료 MBTI + 사주 오행 기질 분석",
    images: [IMG],
  },
};

export default function MbtiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
