import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "무료 꿈해몽 — 점운",
  description: "돼지꿈, 뱀꿈, 이빨빠지는꿈 등 인기 꿈 40가지를 무료로 해석해드립니다. AI 사주앱 점운의 꿈해몽 서비스.",
  openGraph: {
    title: "🌙 무료 꿈해몽 — 점운",
    description: "오늘 꾼 꿈이 무슨 의미일까요? 돼지꿈·뱀꿈·이빨빠지는꿈 등 40가지 인기 꿈 무료 해석",
    images: [
      {
        url: "https://i.pinimg.com/1200x/31/e5/d0/31e5d07256c46586a7a89977f720b96f.jpg",
        width: 1200,
        height: 630,
        alt: "점운 꿈해몽",
      },
    ],
    type: "website",
  },
};

export default function HaemongLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
