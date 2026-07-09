import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "점운 맘케어 — AI 육아 도우미",
  description: "성장 위기 캘린더, 육아 일기, 타임캡슐, 아기 말 사전까지. 소아과 전문의 데이터 기반 맞춤 육아 앱",
  openGraph: {
    title: "👶 점운 맘케어 — AI 육아 도우미",
    description: "성장 위기 캘린더, 육아 일기, 타임캡슐, 아기 말 사전까지. 소아과 전문의 데이터 기반 맞춤 육아 앱",
    url: "https://jeomun.com/momcare",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://i.pinimg.com/1200x/8d/cb/e4/8dcbe40a87faf9679d0f6065d09ec1bf.jpg",
        width: 1200,
        height: 630,
        alt: "점운 맘케어 — AI 육아 도우미",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "👶 점운 맘케어 — AI 육아 도우미",
    description: "성장 위기 캘린더부터 육아 일기까지, 맞춤 육아 앱",
    images: ["https://i.pinimg.com/1200x/8d/cb/e4/8dcbe40a87faf9679d0f6065d09ec1bf.jpg"],
  },
};

export default function MomcareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
