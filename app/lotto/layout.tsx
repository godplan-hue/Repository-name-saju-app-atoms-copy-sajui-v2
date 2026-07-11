import type { Metadata } from "next";

const IMG = "https://i.pinimg.com/736x/bc/72/81/bc7281694d741c357b826a29c17023b3.jpg";

export const metadata: Metadata = {
  title: "점운 행운번호 — 오행으로 뽑는 이번 주 행운 번호",
  description: "내 생년월일 오행으로 이번 주 행운 번호 6개를 뽑아드려요. 무료로 확인하세요",
  openGraph: {
    title: "🍀 점운 행운번호 — 오행으로 뽑는 이번 주 행운 번호",
    description: "내 생년월일 오행으로 이번 주 행운 번호 6개를 뽑아드려요. 무료로 확인하세요",
    url: "https://jeomun.com/lotto",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "점운 행운번호 — 오행 행운 번호 뽑기" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "🍀 점운 행운번호 — 오행으로 뽑는 이번 주 행운 번호",
    description: "오행으로 뽑는 행운 번호 6개, 무료로 확인하세요",
    images: [IMG],
  },
};

export default function LottoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
