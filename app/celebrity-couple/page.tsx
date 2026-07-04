import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "연예인 궁합 | 점운 — 좋아하는 연예인과 궁합",
  description: "좋아하는 연예인과의 궁합을 확인해보세요. 연예인 생년월일로 나와의 사주 궁합을 분석해드려요.",
  keywords: ["연예인궁합", "연예인 궁합", "아이돌 궁합", "스타 궁합", "연예인 사주 궁합"],
  openGraph: { title: "연예인 궁합 — 점운", description: "좋아하는 연예인과 나의 궁합 AI 분석.", url: "https://jeomun.com/celebrity-couple" },
};
export default function CelebrityCouplePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf4ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #f3e8ff, #fdf4ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7e22ce", margin: "0 0 10px" }}>⭐ 연예인 궁합</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>좋아하는 연예인과<br />나의 궁합은?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>연예인 생년월일로 사주 궁합 확인<br />AI가 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #a855f7, #7e22ce)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(168,85,247,0.35)" }}>⭐ 연예인 궁합 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center" }}>
          <p style={{ fontWeight: 900, fontSize: 15, margin: "0 0 8px" }}>사용 방법</p>
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, margin: 0 }}>
            내 생년월일 입력<br />
            + 연예인 생년월일 입력 (인터넷 검색)<br />
            → 두 사람 사주 궁합 즉시 분석
          </p>
        </div>
        {[
          { icon: "💕", title: "연애 궁합", desc: "실제 연인이 됐을 때 어떤 모습일지" },
          { icon: "🎭", title: "성격 궁합", desc: "두 사람의 성격이 잘 맞는지" },
          { icon: "💍", title: "결혼 궁합", desc: "오래 함께했을 때의 관계 흐름" },
          { icon: "🌟", title: "전생 인연", desc: "두 사람이 전생에 어떤 관계였는지" }
        ].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #a855f7, #7e22ce)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>연예인 궁합 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#7e22ce", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>⭐ 시작하기</Link>
      </div>
    </main>
  );
}
