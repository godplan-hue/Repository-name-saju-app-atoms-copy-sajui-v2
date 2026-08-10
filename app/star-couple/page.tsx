import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "별자리 궁합 | 점운 — 별자리로 보는 커플 궁합",
  description: "별자리 궁합을 AI로 확인해보세요. 12별자리 조합으로 연애·결혼 궁합을 분석해드려요.",
  keywords: ["별자리궁합", "별자리 궁합", "12별자리 궁합", "별자리 커플", "별자리 연애궁합"],
  openGraph: { title: "별자리 궁합 — 점운", description: "별자리로 보는 커플 궁합 AI 분석.", url: "https://jeomun.com/star-couple" },
  alternates: { canonical: "https://jeomun.com/star-couple" },
};
export default function StarCouplePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#e2e8f0" }}>
      <div style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc", margin: "0 0 10px" }}>✨ 별자리 궁합</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 12px", lineHeight: 1.25 }}>우리 별자리<br />궁합은 몇 점?</h1>
        <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 28px", lineHeight: 1.7 }}>두 별자리 조합의 연애·결혼 궁합<br />AI가 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #818cf8, #4f46e5)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(129,140,248,0.4)" }}>✨ 별자리 궁합 보기 — 무료~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[["♈양자리","♉황소자리","♊쌍둥이자리","♋게자리"],["♌사자자리","♍처녀자리","♎천칭자리","♏전갈자리"],["♐사수자리","♑염소자리","♒물병자리","♓물고기자리"]].map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
            {row.map(s => <div key={s} style={{ background: "#1e293b", borderRadius: 10, padding: "10px 4px", textAlign: "center", fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>{s}</div>)}
          </div>
        ))}
        <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", marginTop: 12 }}>별자리보다 사주 궁합이 더 정확해요 →</p>
      </div>
      <div style={{ background: "linear-gradient(135deg, #818cf8, #4f46e5)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>사주 궁합으로 더 정확하게</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>별자리보다 훨씬 정밀한 궁합 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#4f46e5", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>✨ 시작하기</Link>
      </div>
    </main>
  );
}
