import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "행운의 번호 | 점운 — 내 사주 행운 번호 분석",
  description: "내 사주로 행운의 번호를 확인해보세요. 재물 기운이 강한 날 행운번호를 AI가 분석해드려요.",
  keywords: ["행운의번호", "행운번호", "사주 행운번호", "로또 행운번호", "행운 숫자", "사주 번호"],
  openGraph: { title: "행운의 번호 — 점운", description: "내 사주 행운 번호 AI 분석.", url: "https://jeomun.com/lucky-number" },
};
export default function LuckyNumberPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fefce8", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fef9c3, #fefce8)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#a16207", margin: "0 0 10px" }}>🍀 행운의 번호</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>내 사주에 숨어있는<br />행운의 번호</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>오행·사주로 분석한 행운 숫자<br />AI가 내 행운번호를 알려드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #eab308, #a16207)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(234,179,8,0.35)" }}>🍀 행운번호 확인 — ₩990~</Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>* 참고용 · 과도한 기대 금물</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[
          { icon: "🔢", title: "사주 행운 번호", desc: "내 오행 균형으로 도출한 행운 숫자" },
          { icon: "📅", title: "행운의 날", desc: "재물 기운이 강한 날짜 — 계약·결정에 좋은 날" },
          { icon: "🎨", title: "행운의 색", desc: "내 사주에 맞는 행운의 색깔" },
          { icon: "🧭", title: "행운의 방향", desc: "올해 재물이 들어오는 방향" }
        ].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #eab308, #a16207)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>행운번호 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#a16207", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🍀 시작하기</Link>
      </div>
    </main>
  );
}
