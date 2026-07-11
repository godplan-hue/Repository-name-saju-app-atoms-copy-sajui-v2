import type { Metadata } from "next";

const IMG = "https://i.pinimg.com/1200x/0c/27/99/0c27999149b93230b696dce0918a4e8e.jpg";

export const metadata: Metadata = {
  title: "점운 타로 — 오늘의 타로카드로 보는 나의 운명",
  description: "지금 내 마음의 질문에 타로카드가 답해드려요. 무료로 뽑아보세요",
  openGraph: {
    title: "🃏 점운 타로 — 오늘의 타로카드로 보는 나의 운명",
    description: "지금 내 마음의 질문에 타로카드가 답해드려요. 무료로 뽑아보세요",
    url: "https://jeomun.com/tarot",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "점운 타로 — 오늘의 타로카드" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "🃏 점운 타로 — 오늘의 타로카드로 보는 나의 운명",
    description: "타로카드로 오늘 내 운명을 확인하세요, 무료",
    images: [IMG],
  },
};

export default function TarotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
