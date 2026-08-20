import type { Metadata } from "next";
import Link from "next/link";

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "혈액형 운세 | 점운 — A·B·O·AB 혈액형 사주",
  description: `혈액형 운세를 확인해보세요. A형·B형·O형·AB형 혈액형별 ${CURRENT_YEAR}년 운세와 AI 사주 분석.`,
  keywords: ["혈액형 운세", "혈액형 사주", "A형 운세", "B형 운세", "O형 운세", "AB형 운세"],
  openGraph: { title: "혈액형 운세 — 점운", description: "A·B·O·AB 혈액형별 운세. AI 사주 정밀 분석.", url: "https://jeomun.com/blood-fortune" },
  alternates: { canonical: "https://jeomun.com/blood-fortune" },
};
export default function BloodFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff1f2", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ffe4e6, #fff1f2)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#be123c", margin: "0 0 10px" }}>🩸 혈액형 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>내 혈액형으로 보는<br />{CURRENT_YEAR}년 운세</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>A·B·O·AB형 혈액형별 운세<br />더 정확한 AI 사주 분석도 받아보세요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f43f5e, #be123c)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(244,63,94,0.35)" }}>🩸 혈액형 운세 보기 — 무료~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ type: "A형", desc: `꼼꼼하고 성실한 A형. ${CURRENT_YEAR}년 안정과 신중함이 키워드.`, color: "#ef4444" }, { type: "B형", desc: `자유롭고 창의적인 B형. ${CURRENT_YEAR}년 새로운 도전의 해.`, color: "#f97316" }, { type: "O형", desc: `리더십 강한 O형. ${CURRENT_YEAR}년 관계와 협력이 중요.`, color: "#eab308" }, { type: "AB형", desc: `독특하고 이중적인 AB형. ${CURRENT_YEAR}년 내면 성장의 해.`, color: "#8b5cf6" }].map(b => (
          <div key={b.type} style={{ background: "white", borderRadius: 14, padding: "18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${b.color}` }}>
            <p style={{ fontWeight: 900, fontSize: 16, color: b.color, margin: "0 0 6px" }}>{b.type}</p>
            <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{b.desc}</p>
          </div>
        ))}
        <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", marginTop: 16 }}>혈액형보다 개인 사주가 훨씬 정확해요 →</p>
      </div>
      <div style={{ background: "linear-gradient(135deg, #f43f5e, #be123c)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>더 정확한 내 사주로 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>혈액형보다 정밀한 AI 사주 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#be123c", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🩸 시작하기</Link>
      </div>
    </main>
  );
}
