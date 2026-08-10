import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "시험운 합격운 사주 | 점운 — 합격 기운 AI 분석",
  description: "시험운·합격운을 사주로 확인해보세요. 수능·공무원·자격증 시험에서 합격 기운이 오는 시기를 AI가 분석해드려요.",
  keywords: ["시험운", "합격운", "시험운 사주", "합격 사주", "수능운", "공무원 합격운"],
  openGraph: { title: "시험운 합격운 — 점운", description: "합격 기운이 오는 시기 AI 사주로 확인. 990원~", url: "https://jeomun.com/exam-fortune" },
  alternates: { canonical: "https://jeomun.com/exam-fortune" },
};
export default function ExamFortunePage() {
  const faqs = [
    { q: "시험운이 좋은 해가 있나요?", a: "관성(官星)이 강해지는 시기엔 시험·합격 기운이 올라요. AI 사주로 내 합격 피크 시기를 확인해보세요." },
    { q: "시험 보기 좋은 날도 알 수 있나요?", a: "택일 분석으로 중요한 시험일에 내 기운이 좋은 날을 고를 수 있어요." },
    { q: "시험운이 나쁜 해에는 어떻게 하나요?", a: "시험운이 약한 해엔 준비에 더 집중하고, 기운이 올라오는 시기에 맞춰 시험 계획을 세우면 좋아요." },
    { q: "수능·공무원·자격증 다 볼 수 있나요?", a: "시험 종류와 상관없이 내 합격 기운과 시기를 분석해드려요." },
  ];
  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #bbf7d0, #f0fdf4)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#15803d", margin: "0 0 10px" }}>📚 시험운 합격운</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>합격 기운이 오는 시기<br />사주로 확인해요</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>수능·공무원·자격증 합격운<br />AI가 내 시험 기운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #22c55e, #15803d)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(34,197,94,0.35)" }}>📚 합격운 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", margin: "40px 0 20px" }}>자주 묻는 질문</h2>
        {faqs.map(f => (<div key={f.q} style={{ background: "white", borderRadius: 14, padding: "18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}><p style={{ fontWeight: 800, fontSize: 14, color: "#15803d", margin: "0 0 6px" }}>Q. {f.q}</p><p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p></div>))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #22c55e, #15803d)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>합격운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#15803d", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>📚 시작하기</Link>
      </div>
    </main>
  );
}
