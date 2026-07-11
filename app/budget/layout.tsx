import type { Metadata } from "next";

const IMG = "https://i.pinimg.com/736x/73/84/95/738495640e6c2d69d0632c59be89818f.jpg";

export const metadata: Metadata = {
  title: "점운 가계부 — 일기식으로 쓰는 가계부",
  description: "날짜·금액·메모를 일기처럼 기록하는 가계부. 사주 재물운과 연결해 씀씀이를 파악하세요. 무료",
  openGraph: {
    title: "💰 점운 가계부 — 일기식으로 쓰는 가계부",
    description: "날짜·금액·메모를 일기처럼 기록하는 가계부. 사주 재물운과 연결해 씀씀이를 파악하세요. 무료",
    url: "https://jeomun.com/budget",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "점운 가계부 — 일기식 가계부" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "💰 점운 가계부 — 일기식으로 쓰는 가계부",
    description: "일기식 가계부 + 사주 재물운 연결, 무료",
    images: [IMG],
  },
};

export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
