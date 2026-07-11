import type { Metadata } from "next";

const IMG = "https://i.pinimg.com/736x/6f/69/94/6f699457d35927bd3ea33cb6f789dd6e.jpg";

export const metadata: Metadata = {
  title: "점운 파트너 — 내 브랜드로 AI 사주 서비스 운영하기",
  description: "앱·결제·DB 시스템 전부 제공. 홍보만 하면 됩니다. 점운 파트너 프로그램에 무료로 신청하세요",
  openGraph: {
    title: "🤝 점운 파트너 — 내 브랜드로 AI 사주 서비스 운영하기",
    description: "앱·결제·DB 시스템 전부 제공. 홍보만 하면 됩니다. 점운 파트너 프로그램에 무료로 신청하세요",
    url: "https://jeomun.com/partner",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "점운 파트너 — AI 사주 파트너 프로그램" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "🤝 점운 파트너 — 내 브랜드로 AI 사주 서비스 운영하기",
    description: "점운 파트너로 내 브랜드 AI 사주 서비스를 무료로 시작하세요",
    images: [IMG],
  },
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
