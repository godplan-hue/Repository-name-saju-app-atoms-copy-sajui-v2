import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "직장운 사주 | 점운 — 직장생활·승진·이직 AI 분석",
  description: "직장운을 사주로 확인해보세요. 직장생활 기운, 상사와의 관계, 이직 타이밍을 AI가 분석해드려요.",
  keywords: ["직장운", "직장운 사주", "직장 기운", "직장생활 운세", "회사운", "취업운세"],
  openGraph: { title: "직장운 사주 — 점운", description: "직장생활·승진·이직 AI 분석.", url: "https://jeomun.com/work-fortune" },
  alternates: { canonical: "https://jeomun.com/work-fortune" },
};
export default function WorkFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#eff6ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #dbeafe, #eff6ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", margin: "0 0 10px" }}>💼 직장운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>직장생활<br />지금 어떻게 흘러가나?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>직장 기운·상사 관계·이직 타이밍<br />AI가 직장운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(59,130,246,0.35)" }}>💼 직장운 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "🏢", title: "직장 기운 흐름", desc: "현재 직장에서 내 위치와 기운의 흐름" }, { icon: "👔", title: "상사·동료 관계", desc: "직장 내 인간관계 — 조심할 사람, 의지할 사람" }, { icon: "📊", title: "성과·평가 시기", desc: "성과가 잘 인정받는 시기 vs 조심할 시기" }, { icon: "🚪", title: "이직 타이밍", desc: "지금 이직해도 될지, 기다려야 할지" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>직장운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#1d4ed8", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>💼 시작하기</Link>
      </div>
    </main>
  );
}
