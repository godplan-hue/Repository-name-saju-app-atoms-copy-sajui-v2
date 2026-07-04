import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "창업운 사주 | 점운 — 창업 타이밍·성공 기운 AI 분석",
  description: "창업운을 사주로 확인해보세요. 창업 성공 기운, 사업 아이템, 창업 시기를 AI가 분석해드려요.",
  keywords: ["창업운", "창업 사주", "창업 타이밍", "창업운세", "스타트업 사주", "창업 성공 사주"],
  openGraph: { title: "창업운 사주 — 점운", description: "창업 타이밍·성공 기운 AI 분석.", url: "https://jeomun.com/startup-fortune" },
};
export default function StartupFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#166534", margin: "0 0 10px" }}>🚀 창업운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>창업으로<br />성공할 수 있을까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>창업 성공 기운·최적 타이밍·사업 적합성<br />AI가 창업운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #22c55e, #166534)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(34,197,94,0.35)" }}>🚀 창업운 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "💡", title: "창업 적합성", desc: "내 사주가 창업가형인지 직장인형인지" }, { icon: "📅", title: "창업 타이밍", desc: "사업 시작하기 가장 좋은 시기" }, { icon: "💰", title: "초기 자본 기운", desc: "투자받기 좋은 시기·자본 조달 기운" }, { icon: "⚠️", title: "주의사항", desc: "창업 시 특히 조심해야 할 시기·사람" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #22c55e, #166534)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>창업운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#166534", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🚀 시작하기</Link>
      </div>
    </main>
  );
}
