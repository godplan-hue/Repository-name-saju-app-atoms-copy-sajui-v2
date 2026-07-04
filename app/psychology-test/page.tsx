import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "사주 심리테스트 | 점운 — 내 성격 AI 심리 분석",
  description: "사주로 보는 심리테스트. 내 진짜 성격·숨겨진 욕구·스트레스 방식을 AI가 분석해드려요.",
  keywords: ["사주 심리테스트", "심리풀이", "성격 사주", "MBTI 사주", "심리 분석 사주", "사주 성격"],
  openGraph: { title: "사주 심리테스트 — 점운", description: "사주로 보는 내 진짜 성격 분석.", url: "https://jeomun.com/psychology-test" },
};
export default function PsychologyTestPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f5f3ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ddd6fe, #f5f3ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#5b21b6", margin: "0 0 10px" }}>🧠 사주 심리분석</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>내 진짜 성격<br />사주로 알아보기</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>MBTI보다 정확한 사주 심리 분석<br />숨겨진 내 모습을 AI가 밝혀드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(124,58,237,0.35)" }}>🧠 심리분석 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[
          { icon: "🎭", title: "겉성격 vs 속성격", desc: "남들에게 보이는 나 vs 혼자 있을 때의 나" },
          { icon: "💢", title: "스트레스 방식", desc: "힘들 때 어떻게 반응하는지 — 사주로 분석" },
          { icon: "💝", title: "연애 심리", desc: "좋아하는 사람 앞에서의 내 행동 패턴" },
          { icon: "🎯", title: "동기·욕구", desc: "내가 진짜 원하는 것 — 사주 오행으로 분석" }
        ].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>내 심리 지금 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#5b21b6", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🧠 시작하기</Link>
      </div>
    </main>
  );
}
