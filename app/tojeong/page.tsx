import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "토정비결 | 점운 — AI로 보는 토정비결",
  description: "토정비결을 AI로 확인해보세요. 전통 토정비결의 지혜와 AI 사주 분석을 결합한 새로운 운세 서비스.",
  keywords: ["토정비결", "무료 토정비결", "2026 토정비결", "온라인 토정비결", "AI 토정비결"],
  openGraph: { title: "토정비결 — 점운", description: "AI로 보는 토정비결. 전통 운세의 지혜를 현대적으로.", url: "https://jeomun.com/tojeong" },
};
const faqs = [
  { q: "토정비결이 뭔가요?", a: "조선시대 토정 이지함 선생이 만든 전통 운세 체계예요. 생년월일로 한 해의 운을 12달로 풀어주는 방식이에요." },
  { q: "AI 사주와 토정비결의 차이는요?", a: "토정비결은 한 해 월별 운세에 집중하고, AI 사주는 재물·연애·직업 등 분야별로 더 세밀하게 분석해요. 둘 다 참고하면 좋아요." },
  { q: "언제 보는 게 좋나요?", a: "신년 초(1~2월)에 한 해 운세를 미리 파악하는 데 많이 활용해요." },
  { q: "무료로 볼 수 있나요?", a: "점운에서 무료 운세를 먼저 확인하고, 더 자세한 분석은 990원부터 받을 수 있어요." },
];
export default function TojeongPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fef9f0", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fde68a, #fef9f0)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", margin: "0 0 10px" }}>📜 토정비결</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>토정비결<br />AI로 새롭게</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>전통 토정비결의 지혜 + AI 정밀 분석<br />올 한 해 월별 운세를 확인해보세요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #d97706, #92400e)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(217,119,6,0.35)" }}>📜 토정비결 보기 — 무료~</Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", margin: "40px 0 20px" }}>자주 묻는 질문</h2>
        {faqs.map(f => (
          <div key={f.q} style={{ background: "white", borderRadius: 14, padding: "18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ fontWeight: 800, fontSize: 14, color: "#92400e", margin: "0 0 6px" }}>Q. {f.q}</p>
            <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #d97706, #92400e)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>지금 바로 확인하기</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#92400e", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>📜 시작하기</Link>
      </div>
    </main>
  );
}
