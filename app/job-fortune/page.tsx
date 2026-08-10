import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "취업운 사주 | 점운 — AI가 알려주는 취업 시기",
  description: "취업운을 사주로 확인해보세요. 취업이 잘 되는 시기, 면접 운, 합격 기운을 AI가 분석해드려요.",
  keywords: ["취업운", "취업 사주", "취업운 사주", "취업 시기", "면접운", "합격운 사주"],
  openGraph: { title: "취업운 사주 — 점운", description: "취업이 잘 되는 시기 AI 사주로 확인. 990원~", url: "https://jeomun.com/job-fortune" },
  alternates: { canonical: "https://jeomun.com/job-fortune" },
};
export default function JobFortunePage() {
  const faqs = [
    { q: "취업이 안 되는데 사주 문제인가요?", a: "사주에서 관성(官星)이 약하거나 충(沖)을 받는 시기엔 취업이 어려울 수 있어요. 하지만 준비와 노력으로 극복할 수 있어요." },
    { q: "취업하기 좋은 시기가 있나요?", a: "관성이 강해지는 대운·세운 시기엔 취업 기운이 올라요. AI 사주로 내 취업 피크 시기를 확인해보세요." },
    { q: "면접 보기 좋은 날도 알 수 있나요?", a: "택일 분석으로 면접·계약 등 중요한 날에 좋은 날짜를 고를 수 있어요." },
    { q: "공무원·대기업 취업운도 볼 수 있나요?", a: "직업 성향과 관성 분야를 보면 어떤 직종이 내 사주와 맞는지도 파악할 수 있어요." },
  ];
  return (
    <main style={{ minHeight: "100vh", background: "#f0f9ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #bae6fd, #f0f9ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0369a1", margin: "0 0 10px" }}>💼 취업운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>취업이 잘 되는 시기<br />사주로 미리 알기</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>면접운·합격 기운·취업 타이밍<br />AI가 내 취업 기운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #0ea5e9, #0369a1)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(14,165,233,0.35)" }}>💼 취업운 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", margin: "40px 0 20px" }}>자주 묻는 질문</h2>
        {faqs.map(f => (
          <div key={f.q} style={{ background: "white", borderRadius: 14, padding: "18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ fontWeight: 800, fontSize: 14, color: "#0369a1", margin: "0 0 6px" }}>Q. {f.q}</p>
            <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #0ea5e9, #0369a1)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>취업운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#0369a1", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>💼 시작하기</Link>
      </div>
    </main>
  );
}
