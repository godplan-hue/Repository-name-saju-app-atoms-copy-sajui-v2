import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "부동산운 사주 | 점운 — 집 매매·이사 기운 AI 분석",
  description: "부동산운을 사주로 확인해보세요. 집 매매 타이밍, 이사 시기, 부동산 투자 기운을 AI가 분석해드려요.",
  keywords: ["부동산운", "부동산 사주", "집 매매 사주", "이사 사주", "부동산 투자 운세", "집 사는 타이밍"],
  openGraph: { title: "부동산운 사주 — 점운", description: "집 매매·이사 기운 AI 분석.", url: "https://jeomun.com/realestate-fortune" },
  alternates: { canonical: "https://jeomun.com/realestate-fortune" },
};
export default function RealEstateFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#166534", margin: "0 0 10px" }}>🏠 부동산운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>집 사도 될까?<br />이사 시기는?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>매매 타이밍·이사 시기·투자 기운<br />AI가 부동산운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #16a34a, #166534)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(22,163,74,0.35)" }}>🏠 부동산운 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "🏡", title: "매매 타이밍", desc: "집 사기 좋은 시기 vs 기다려야 할 시기" }, { icon: "📦", title: "이사 시기", desc: "이사하기 좋은 날·달·방향 분석" }, { icon: "💹", title: "부동산 투자 기운", desc: "갭투자·청약·전세 기운이 강한 시기" }, { icon: "🔑", title: "계약·잔금 타이밍", desc: "계약서 쓰기 좋은 날 확인" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #16a34a, #166534)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>부동산운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#166534", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🏠 시작하기</Link>
      </div>
    </main>
  );
}
