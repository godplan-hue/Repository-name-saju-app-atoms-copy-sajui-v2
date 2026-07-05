import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "무료 꿈해몽 — 점운",
  description: "오늘 꾼 꿈이 길몽일까요? 돼지꿈·뱀꿈·용꿈 등 100가지 무료 해석",
  openGraph: {
    title: "🌙 무료 꿈해몽 — 점운",
    description: "오늘 꾼 꿈이 길몽일까요? 돼지꿈·뱀꿈·용꿈 등 100가지 무료 해석",
    url: "https://jeomun.com/haemong",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://i.pinimg.com/1200x/31/e5/d0/31e5d07256c46586a7a89977f720b96f.jpg",
        width: 1200,
        height: 630,
        alt: "점운 꿈해몽 — 오늘 꾼 꿈 무료 해석",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🌙 무료 꿈해몽 — 점운",
    description: "오늘 꾼 꿈이 무슨 의미일까요?",
    images: ["https://i.pinimg.com/1200x/31/e5/d0/31e5d07256c46586a7a89977f720b96f.jpg"],
  },
};

export default function HaemongLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
