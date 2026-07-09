import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "직운 — 나에게 딱 맞는 부업 찾기",
  description: "8가지 질문으로 나에게 딱 맞는 부업 TOP 3를 찾아드려요. 사주 오행으로 천직까지 분석",
  openGraph: {
    title: "💼 직운 — 나에게 딱 맞는 부업 찾기",
    description: "8가지 질문으로 나에게 딱 맞는 부업 TOP 3를 찾아드려요. 사주 오행으로 천직까지 분석",
    url: "https://jeomun.com/jigun",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://i.pinimg.com/736x/8d/a1/5b/8da15bc3c1f172395976e379ded6c558.jpg",
        width: 1200,
        height: 630,
        alt: "직운 — 나에게 딱 맞는 부업 찾기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "💼 직운 — 나에게 딱 맞는 부업 찾기",
    description: "8가지 질문으로 나에게 딱 맞는 부업 TOP 3를 추천드려요",
    images: ["https://i.pinimg.com/736x/8d/a1/5b/8da15bc3c1f172395976e379ded6c558.jpg"],
  },
};

export default function JigunLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
