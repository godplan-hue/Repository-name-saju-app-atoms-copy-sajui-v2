import type { Metadata } from "next";

const IMG = "https://i.pinimg.com/1200x/0f/8e/e2/0f8ee29760fa339bfdf211369cf2d100.jpg";

export const metadata: Metadata = {
  title: "점운 펫운 — 반려동물 오행 궁합 & 오늘 운세",
  description: "반려동물과 나의 오행 궁합 점수, 오늘 운세 뽑기, 추천 음식까지 무료로 확인하세요",
  openGraph: {
    title: "🐾 점운 펫운 — 반려동물 오행 궁합 & 오늘 운세",
    description: "반려동물과 나의 오행 궁합 점수, 오늘 운세 뽑기, 추천 음식까지 무료로 확인하세요",
    url: "https://jeomun.com/petun",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "점운 펫운 — 반려동물 오행 궁합" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "🐾 점운 펫운 — 반려동물 오행 궁합 & 오늘 운세",
    description: "반려동물과 나의 오행 궁합 + 오늘 운세 뽑기 무료",
    images: [IMG],
  },
};

export default function PetunLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
