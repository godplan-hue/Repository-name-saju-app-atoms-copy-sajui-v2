import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "로또운 사주 | 점운 — 횡재수·로또 기운 AI 분석",
  description: "로또운·횡재수를 사주로 확인해보세요. 갑자기 큰돈이 들어오는 기운이 있는 시기를 AI가 분석해드려요.",
  keywords: ["로또운", "로또 사주", "횡재수", "횡재운", "로또 기운", "돈 들어오는 사주"],
  openGraph: { title: "로또운 사주 — 점운", description: "횡재수·로또 기운 AI 사주 분석. 언제 운이 터지는지 확인.", url: "https://jeomun.com/lotto-fortune" },
  alternates: { canonical: "https://jeomun.com/lotto-fortune" },
};
export default function LottoFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fefce8", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fef9c3, #fefce8)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#a16207", margin: "0 0 10px" }}>🍀 로또운</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>횡재수·로또 기운<br />내 사주에 있을까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>갑자기 큰돈이 들어오는 시기<br />AI가 횡재 기운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #eab308, #a16207)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(234,179,8,0.35)" }}>🍀 로또운 확인 — ₩990~</Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "💸", title: "횡재수 기운", desc: "예상치 못한 큰돈이 들어오는 사주 기운" }, { icon: "🎰", title: "로또 구매 타이밍", desc: "재물 기운이 가장 강한 날·시기 파악" }, { icon: "📈", title: "갑작스러운 수입", desc: "부업·투자·선물 등 갑작스런 수입 흐름" }, { icon: "⚠️", title: "주의사항", desc: "로또는 참고용 · 과도한 기대는 금물" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #eab308, #a16207)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>횡재 기운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#a16207", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🍀 시작하기</Link>
      </div>
    </main>
  );
}
