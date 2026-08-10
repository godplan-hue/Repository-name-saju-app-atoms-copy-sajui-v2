import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "짝궁합 | 점운 — 간단 궁합 AI 분석",
  description: "짝궁합을 AI로 확인해보세요. 좋아하는 사람과 우리 궁합이 맞는지 간단하게 확인해드려요.",
  keywords: ["짝궁합", "간단궁합", "궁합 보기", "사주 궁합", "커플 궁합", "연인 궁합"],
  openGraph: { title: "짝궁합 — 점운", description: "우리 궁합 간단 AI 분석. 맞는지 확인해보세요.", url: "https://jeomun.com/simple-couple" },
  alternates: { canonical: "https://jeomun.com/simple-couple" },
};
export default function SimpleCuplePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf2f8", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fce7f3, #fdf2f8)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#9d174d", margin: "0 0 10px" }}>💞 짝궁합</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>우리 궁합<br />맞을까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>두 사람의 생년월일로 바로 확인<br />AI가 궁합을 간단하게 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #ec4899, #9d174d)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>💞 짝궁합 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[
          { icon: "🎯", title: "궁합 점수", desc: "두 사람 사주 기운의 조화 — 수치로 확인" },
          { icon: "💕", title: "연애 궁합", desc: "만나면 어떤 감정 흐름이 생기는지" },
          { icon: "💍", title: "결혼 궁합", desc: "오래 함께해도 좋은 사이인지" },
          { icon: "⚠️", title: "조심할 부분", desc: "두 사람 사이에 특히 주의할 포인트" }
        ].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #ec4899, #9d174d)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>짝궁합 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#9d174d", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>💞 시작하기</Link>
      </div>
    </main>
  );
}
