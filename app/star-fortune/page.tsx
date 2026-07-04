import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "별자리 운세 | 점운 — 별자리 + AI 사주 분석",
  description: "별자리 운세와 AI 사주를 함께 확인해보세요. 양자리부터 물고기자리까지 2026년 별자리 운세.",
  keywords: ["별자리 운세", "별자리 사주", "12별자리 운세", "2026 별자리운세", "별자리 운세 보기"],
  openGraph: { title: "별자리 운세 — 점운", description: "별자리 운세 + AI 사주 분석. 더 정확한 개인 운세.", url: "https://jeomun.com/star-fortune" },
};
export default function StarFortunePage() {
  const stars = ["♈ 양자리", "♉ 황소자리", "♊ 쌍둥이자리", "♋ 게자리", "♌ 사자자리", "♍ 처녀자리", "♎ 천칭자리", "♏ 전갈자리", "♐ 사수자리", "♑ 염소자리", "♒ 물병자리", "♓ 물고기자리"];
  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#e2e8f0" }}>
      <div style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", margin: "0 0 10px" }}>⭐ 별자리 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 12px", lineHeight: 1.25 }}>별자리로 보는<br />2026년 운세</h1>
        <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 28px", lineHeight: 1.7 }}>12별자리 운세 확인<br />더 정확한 AI 사주 분석도 받아보세요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(99,102,241,0.4)" }}>⭐ 별자리 운세 보기 — 무료~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {stars.map(s => (<div key={s} style={{ background: "#1e293b", borderRadius: 12, padding: "14px", textAlign: "center", fontWeight: 700, fontSize: 13, color: "#e2e8f0" }}>{s}</div>))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>더 정확한 AI 사주로 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>별자리보다 정밀한 개인 맞춤 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#4f46e5", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>⭐ 시작하기</Link>
      </div>
    </main>
  );
}
