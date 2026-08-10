import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "생년월일 운세 | 점운 — 생년월일로 보는 운세",
  description: "생년월일로 운세를 확인해보세요. 생년월일 입력만 하면 AI가 재물·연애·건강·직업운을 분석해드려요.",
  keywords: ["생년월일운세", "생년월일 운세", "생년월일 사주", "생일 운세", "생년월일로 보는 운세"],
  openGraph: { title: "생년월일 운세 — 점운", description: "생년월일로 보는 AI 운세 분석.", url: "https://jeomun.com/birthday-fortune" },
  alternates: { canonical: "https://jeomun.com/birthday-fortune" },
};
export default function BirthdayFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff7ed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fed7aa, #fff7ed)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#c2410c", margin: "0 0 10px" }}>🎂 생년월일 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>생년월일만 있으면<br />운세 바로 확인</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>생년월일 입력 → 즉시 AI 분석<br />재물·연애·건강·직업운 한번에</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f97316, #c2410c)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(249,115,22,0.35)" }}>🎂 생년월일 운세 — 무료~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center" }}>
          <p style={{ fontWeight: 900, fontSize: 15, margin: "0 0 8px" }}>입력 방법</p>
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, margin: 0 }}>
            생년월일 입력 (예: 1995년 3월 15일)<br />
            태어난 시간도 알면 더 정확해요
          </p>
        </div>
        {[
          { icon: "⚡", title: "즉시 분석", desc: "입력 즉시 AI가 사주 원국 계산 및 분석" },
          { icon: "💰", title: "재물운 분석", desc: "올해 돈이 들어오는 시기와 흐름" },
          { icon: "💕", title: "연애운 분석", desc: "인연 기운과 현재 관계 방향" },
          { icon: "💼", title: "직업운 분석", desc: "직장·사업 기운과 주의할 시기" }
        ].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #f97316, #c2410c)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>생년월일 운세 보기</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#c2410c", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🎂 시작하기</Link>
      </div>
    </main>
  );
}
