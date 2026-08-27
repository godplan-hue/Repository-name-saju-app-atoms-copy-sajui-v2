import type { Metadata } from "next";

const IMG = "https://images.unsplash.com/photo-1591347887817-173e3d5c4891?w=1200&q=80";

export const metadata: Metadata = {
  title: "연락기록통계 점운 — 내가 놓치고 있던 관계 신호 찾기",
  description: "요즘 나와 멀어진 사람이 있나요? 연락 빈도·주도권·답장 패턴으로 내가 놓치고 있던 관계 신호를 무료로 찾아보세요",
  openGraph: {
    title: "📡 연락기록통계 점운 — 내가 놓치고 있던 관계 신호 찾기",
    description: "요즘 나와 멀어진 사람이 있나요? 연락 빈도·주도권·답장 패턴으로 관계 신호를 무료로 분석해드려요",
    url: "https://jeomun.com/gwangyeoradar",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "연락기록통계 점운 — 관계 신호 분석" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "📡 연락기록통계 점운 — 내가 놓치고 있던 관계 신호 찾기",
    description: "연락 패턴으로 보는 관계 신호를 무료로 분석",
    images: [IMG],
  },
};

export default function GwangyeoradarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
