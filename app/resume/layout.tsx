import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "점운 합격 — 사주로 보는 합격 가능성 분석",
  description: "생년월일 + 지원 직무로 합격 가능성을 분석해드려요. 오행 기질, 면접 예상 질문, 기업별 전략까지",
  openGraph: {
    title: "🎯 점운 합격 — 사주로 보는 합격 가능성 분석",
    description: "생년월일 + 지원 직무로 합격 가능성을 분석해드려요. 오행 기질, 면접 예상 질문, 기업별 전략까지",
    url: "https://jeomun.com/resume",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://i.pinimg.com/736x/7c/b2/22/7cb22262844ff11bc8c1800a309f0b99.jpg",
        width: 1200,
        height: 630,
        alt: "점운 합격 — 합격 가능성 분석",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🎯 점운 합격 — 사주로 보는 합격 가능성 분석",
    description: "내 사주로 합격 가능성과 면접 전략을 알아보세요",
    images: ["https://i.pinimg.com/736x/7c/b2/22/7cb22262844ff11bc8c1800a309f0b99.jpg"],
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
