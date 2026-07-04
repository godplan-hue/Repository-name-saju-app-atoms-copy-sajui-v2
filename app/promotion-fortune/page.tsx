import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "승진운 사주 | 점운 — 승진·진급 기운 AI 분석",
  description: "승진운을 사주로 확인해보세요. 승진 타이밍, 상사와의 관계, 진급 기운을 AI가 분석해드려요.",
  keywords: ["승진운", "승진운 사주", "승진 기운", "진급 운세", "직장 승진", "승진 타이밍"],
  openGraph: { title: "승진운 사주 — 점운", description: "승진·진급 기운 AI 분석.", url: "https://jeomun.com/promotion-fortune" },
};
export default function PromotionFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fefce8", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fef9c3, #fefce8)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#a16207", margin: "0 0 10px" }}>🏆 승진운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>올해 승진할 수<br />있을까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>승진 타이밍·진급 기운·상사 관계<br />AI가 승진운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #eab308, #a16207)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(234,179,8,0.35)" }}>🏆 승진운 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "🎯", title: "승진 기운 흐름", desc: "올해 진급 기운이 강한지 약한지 분석" }, { icon: "👑", title: "윗사람과의 관계", desc: "상사·임원과의 관계 — 내 편인지 아닌지" }, { icon: "📅", title: "승진 타이밍", desc: "승진 시험·인사 발령 좋은 시기" }, { icon: "💪", title: "성과 내는 시기", desc: "능력이 가장 잘 발휘되는 시기" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #eab308, #a16207)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>승진운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#a16207", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🏆 시작하기</Link>
      </div>
    </main>
  );
}
