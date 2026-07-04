import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "임신운 사주 | 점운 — 임신·출산 기운 AI 분석",
  description: "임신운을 사주로 확인해보세요. 임신이 잘 되는 시기, 태몽 해석, 출산 기운을 AI가 분석해드려요.",
  keywords: ["임신운", "임신 사주", "임신운 사주", "출산운", "태몽", "임신 시기 사주"],
  openGraph: { title: "임신운 사주 — 점운", description: "임신·출산 기운 AI 사주 분석. 시기와 태몽 확인.", url: "https://jeomun.com/pregnancy-fortune" },
};
export default function PregnancyFortunePage() {
  const faqs = [
    { q: "임신이 잘 되는 시기가 있나요?", a: "사주에서 식상(食傷)이 활성화되는 시기엔 임신·출산 기운이 강해요. AI 사주로 내 임신 기운의 흐름을 확인해보세요." },
    { q: "태몽 해석도 되나요?", a: "꿈해몽 기능으로 태몽을 해석할 수 있어요. 어떤 동물이나 상징이 나왔는지에 따라 분석해드려요." },
    { q: "임신이 안 되는 이유를 사주에서 알 수 있나요?", a: "사주는 참고 자료예요. 의학적 원인과 함께 사주 흐름도 살펴보면 도움이 될 수 있어요." },
    { q: "아이 성별도 알 수 있나요?", a: "사주로 아이 성별을 정확히 예측하긴 어렵지만, 태어날 아이의 기운 방향을 참고로 볼 수 있어요." },
  ];
  return (
    <main style={{ minHeight: "100vh", background: "#fff0f6", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ffd6e7, #fff0f6)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#9d174d", margin: "0 0 10px" }}>🤰 임신운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>임신이 잘 되는 시기<br />사주로 확인해요</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>임신 기운·출산 시기·태몽 해석<br />AI가 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #ec4899, #9d174d)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>🤰 임신운 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", margin: "40px 0 20px" }}>자주 묻는 질문</h2>
        {faqs.map(f => (<div key={f.q} style={{ background: "white", borderRadius: 14, padding: "18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}><p style={{ fontWeight: 800, fontSize: 14, color: "#9d174d", margin: "0 0 6px" }}>Q. {f.q}</p><p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p></div>))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #ec4899, #9d174d)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>임신운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#9d174d", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🤰 시작하기</Link>
      </div>
    </main>
  );
}
