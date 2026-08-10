import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "혈액형 궁합 | 점운 — A·B·O·AB 혈액형 커플 궁합",
  description: "혈액형 궁합을 AI로 확인해보세요. A·B·O·AB형 조합의 연애·결혼 궁합을 분석해드려요.",
  keywords: ["혈액형궁합", "혈액형 궁합", "AB형궁합", "A형B형궁합", "혈액형 커플", "혈액형 연애"],
  openGraph: { title: "혈액형 궁합 — 점운", description: "혈액형 커플 궁합 AI 분석.", url: "https://jeomun.com/blood-couple" },
  alternates: { canonical: "https://jeomun.com/blood-couple" },
};
export default function BloodCouplePage() {
  const combos = [["A♥A", "#ef4444"], ["A♥B", "#f97316"], ["A♥O", "#eab308"], ["A♥AB", "#8b5cf6"], ["B♥B", "#f97316"], ["B♥O", "#22c55e"], ["B♥AB", "#3b82f6"], ["O♥O", "#eab308"], ["O♥AB", "#ec4899"], ["AB♥AB", "#8b5cf6"]];
  return (
    <main style={{ minHeight: "100vh", background: "#fff1f2", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ffe4e6, #fff1f2)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#be123c", margin: "0 0 10px" }}>🩸 혈액형 궁합</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>우리 혈액형<br />궁합은 맞을까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>A·B·O·AB형 조합의 연애·성격 궁합<br />AI가 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f43f5e, #be123c)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(244,63,94,0.35)" }}>🩸 혈액형 궁합 — 무료~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {combos.map(([c, col]) => <div key={c} style={{ background: "white", borderRadius: 10, padding: "10px 4px", textAlign: "center", fontSize: 12, fontWeight: 800, color: col as string, boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>{c}</div>)}
        </div>
        <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center" }}>혈액형보다 사주 궁합이 훨씬 정확해요 →</p>
      </div>
      <div style={{ background: "linear-gradient(135deg, #f43f5e, #be123c)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>사주 궁합으로 더 정확하게</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>혈액형보다 정밀한 사주 궁합 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#be123c", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🩸 시작하기</Link>
      </div>
    </main>
  );
}
