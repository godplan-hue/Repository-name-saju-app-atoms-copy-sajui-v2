import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "이직운 사주 | 점운 — 이직 타이밍 AI 분석",
  description: "이직운을 사주로 확인해보세요. 이직 타이밍, 새 직장 기운, 이직 후 성공 가능성을 AI가 분석해드려요.",
  keywords: ["이직운", "이직 사주", "이직 타이밍", "이직운세", "직장 이직", "이직 시기"],
  openGraph: { title: "이직운 사주 — 점운", description: "이직 타이밍 AI 분석. 지금 이직해도 될까?", url: "https://jeomun.com/career-change" },
};
export default function CareerChangePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0f9ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0369a1", margin: "0 0 10px" }}>🚀 이직운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>지금 이직해도<br />괜찮을까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>이직 타이밍·새 직장 기운·성공 가능성<br />AI가 이직운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #0ea5e9, #0369a1)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(14,165,233,0.35)" }}>🚀 이직운 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "⏰", title: "이직 타이밍", desc: "지금 당장 vs 기다렸다가 — 언제가 좋은지" }, { icon: "🏢", title: "새 직장 기운", desc: "이직 후 새 환경에서의 적응력·성공 기운" }, { icon: "💰", title: "연봉 협상 기운", desc: "연봉 올리기 좋은 시기 분석" }, { icon: "🤔", title: "지금 직장 vs 이직", desc: "지금 직장을 더 다닐지 vs 나올지 판단" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #0ea5e9, #0369a1)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>이직운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#0369a1", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🚀 시작하기</Link>
      </div>
    </main>
  );
}
