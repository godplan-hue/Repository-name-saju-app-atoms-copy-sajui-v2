import type { Metadata } from "next";

const IMG = "https://i.pinimg.com/736x/bc/72/81/bc7281694d741c357b826a29c17023b3.jpg";

export const metadata: Metadata = {
  title: "점운 복문 — 내 띠 전용 부적 무료로 받기",
  description: "내 생년월일로 12띠 중 내 부적을 무료로 받아보세요. 캡처해서 간직할 수 있어요",
  openGraph: {
    title: "🧧 점운 복문 — 내 띠 전용 부적 무료로 받기",
    description: "내 생년월일로 12띠 중 내 부적을 무료로 받아보세요. 캡처해서 간직할 수 있어요",
    url: "https://jeomun.com/bokmun",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "점운 복문 — 띠별 부적" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "🧧 점운 복문 — 내 띠 전용 부적 무료로 받기",
    description: "내 생년월일로 12띠 중 내 부적을 무료로 받아보세요",
    images: [IMG],
  },
};

export default function BokmunLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
