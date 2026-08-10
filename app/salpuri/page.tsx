import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "살풀이 액운 | 점운 — 내 사주 액운 AI 분석",
  description: "살풀이와 액운을 사주로 확인해보세요. 삼재·조심해야 할 시기·액운 예방법을 AI가 분석해드려요.",
  keywords: ["살풀이", "액운", "삼재", "액운 방지", "살풀이 사주", "삼재 풀기"],
  openGraph: { title: "살풀이 액운 — 점운", description: "내 사주 액운·삼재 AI 분석.", url: "https://jeomun.com/salpuri" },
  alternates: { canonical: "https://jeomun.com/salpuri" },
};
export default function SalpuriPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #bbf7d0, #f0fdf4)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#166534", margin: "0 0 10px" }}>🌿 살풀이 · 액운 방지</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>올해 조심해야 할<br />액운이 있을까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>삼재·살·액운 조심 시기<br />미리 알고 예방하세요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #22c55e, #166534)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(34,197,94,0.35)" }}>🌿 액운 확인 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[
          { icon: "🔴", title: "삼재(三災) 확인", desc: "올해 내 삼재 해당 여부 — 들삼재·눌삼재·날삼재" },
          { icon: "⚠️", title: "액운 조심 시기", desc: "사주에서 특히 조심해야 할 달·시기" },
          { icon: "🛡️", title: "예방 방법", desc: "액운을 미리 알고 대비하는 방법" },
          { icon: "✨", title: "좋은 기운 끌어오기", desc: "액운 대신 좋은 기운을 불러오는 시기" }
        ].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #22c55e, #166534)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>액운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#166534", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🌿 시작하기</Link>
      </div>
    </main>
  );
}
