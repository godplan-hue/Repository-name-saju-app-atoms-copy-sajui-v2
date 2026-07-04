import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "사주 상담 | 점운 — AI 사주 1:1 분석",
  description: "사주 상담을 AI로 받아보세요. 궁금한 모든 것을 사주로 분석해드려요. 990원부터 시작.",
  keywords: ["사주상담", "사주 상담", "온라인 사주 상담", "사주 질문", "AI 사주 상담", "사주 풀이 상담"],
  openGraph: { title: "사주 상담 — 점운", description: "AI 사주 1:1 분석. 궁금한 모든 것 분석.", url: "https://jeomun.com/saju-counseling" },
};
export default function SajuCounselingPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf4ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #f3e8ff, #fdf4ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7e22ce", margin: "0 0 10px" }}>🔮 사주 상담</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>궁금한 것 모두<br />사주로 물어보기</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>연애·직장·재물·건강 뭐든 OK<br />AI가 사주로 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #a855f7, #7e22ce)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(168,85,247,0.35)" }}>🔮 사주 상담 받기 — ₩990~</Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>점집 20만원 → 990원으로</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[
          { icon: "💕", title: "연애 상담", desc: "지금 이 사람과 계속 만나도 될까?" },
          { icon: "💼", title: "직장 상담", desc: "이직해야 할까, 지금 직장에 더 있어야 할까?" },
          { icon: "💰", title: "재물 상담", desc: "투자해도 될까? 언제 돈이 들어올까?" },
          { icon: "🤔", title: "결정 도우미", desc: "중요한 결정 앞에서 — 사주로 방향 잡기" }
        ].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #a855f7, #7e22ce)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>지금 바로 사주 상담</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#7e22ce", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🔮 시작하기</Link>
      </div>
    </main>
  );
}
