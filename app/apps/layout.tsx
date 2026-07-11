import type { Metadata } from "next";

const IMG = "https://i.pinimg.com/736x/45/8c/cc/458ccc4777dec685605f4cae0ae87336.jpg";

export const metadata: Metadata = {
  title: "점운 전체앱 14개 — 꿈해몽·궁합·MBTI·타로·다이어트",
  description: "꿈해몽·맘케어·직운·합격·궁합·MBTI·행운번호·펫운·타로·별자리·감정일기·다이어트·가계부·파트너 14개 앱 전부 무료",
  openGraph: {
    title: "✨ 점운 전체앱 14개 — 꿈해몽·궁합·MBTI·타로·다이어트",
    description: "꿈해몽·맘케어·직운·합격·궁합·MBTI·행운번호·펫운·타로·별자리·감정일기·다이어트·가계부·파트너 14개 앱 전부 무료",
    url: "https://jeomun.com/apps",
    siteName: "점운",
    locale: "ko_KR",
    type: "website",
    images: [{ url: IMG, width: 1200, height: 630, alt: "점운 전체앱 14개" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "✨ 점운 전체앱 14개 — 꿈해몽·궁합·MBTI·타로·다이어트",
    description: "점운 14개 앱 전부 무료로 이용하세요",
    images: [IMG],
  },
};

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
