import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "사업운 사주 | 점운 — 창업·사업 기운 AI 분석",
  description: "사업운을 사주로 확인해보세요. 창업 타이밍, 사업 확장 시기, 동업 궁합을 AI가 분석해드려요.",
  keywords: ["사업운", "사업운 사주", "창업 사주", "사업 기운", "동업 사주", "자영업 운세"],
  openGraph: { title: "사업운 사주 — 점운", description: "창업·사업 기운 AI 분석. 사업하기 좋은 시기 확인.", url: "https://jeomun.com/business-fortune" },
};
export default function BusinessFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #bbf7d0, #f0fdf4)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#15803d", margin: "0 0 10px" }}>🏪 사업운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>창업·사업<br />지금 해도 될까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>창업 타이밍·사업 확장·동업 궁합<br />AI가 내 사업 기운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #22c55e, #15803d)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(34,197,94,0.35)" }}>🏪 사업운 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "🚀", title: "창업 타이밍", desc: "내 사주에서 사업 시작하기 좋은 시기" }, { icon: "📈", title: "사업 확장 시기", desc: "투자·확장해도 되는 시기 vs 조심할 시기" }, { icon: "🤝", title: "동업 궁합", desc: "동업자와의 사주 궁합 — 함께해도 될지" }, { icon: "💼", title: "사업 체질 분석", desc: "내 사주가 사업가 체질인지 직장인 체질인지" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #22c55e, #15803d)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>사업운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#15803d", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🏪 시작하기</Link>
      </div>
    </main>
  );
}
