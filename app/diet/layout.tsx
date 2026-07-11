import type { Metadata } from "next";

const IMG = "https://i.pinimg.com/1200x/f1/11/77/f11177335015269c22af426b13f423bc.jpg";

export const metadata: Metadata = {
  title: "점운 다이어트 — 오행 체질로 찾는 나만의 다이어트",
  description: "내 오행 체질에 맞는 다이어트 플랜과 음식 칼로리를 무료로 확인하세요",
  openGraph: {
    title: "🥗 점운 다이어트 — 오행 체질로 찾는 나만의 다이어트",
    description: "내 오행 체질에 맞는 다이어트 플랜과 음식 칼로리를 무료로 확인하세요",
    url: "https://jeomun.com/diet",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "점운 다이어트 — 오행 체질 다이어트" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "🥗 점운 다이어트 — 오행 체질로 찾는 나만의 다이어트",
    description: "오행 체질별 다이어트 플랜 + 칼로리 계산기 무료",
    images: [IMG],
  },
};

export default function DietLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
