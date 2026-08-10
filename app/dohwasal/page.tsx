import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "도화살 사주 | 점운 — 내 사주에 도화살 있나?",
  description: "도화살 사주를 확인해보세요. 도화살이 있으면 매력이 넘치고 이성에게 인기가 많아요. AI가 분석해드려요.",
  keywords: ["도화살", "도화살 사주", "도화살 뜻", "도화살 있는 사람", "사주 도화살", "도화살 연애"],
  openGraph: { title: "도화살 사주 — 점운", description: "내 사주에 도화살 있나? AI가 신살 분석.", url: "https://jeomun.com/dohwasal" },
  alternates: { canonical: "https://jeomun.com/dohwasal" },
};
export default function DohwasalPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff1f2", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ffe4e6, #fff1f2)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#be123c", margin: "0 0 10px" }}>🌸 도화살 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>내 사주에<br />도화살 있어?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>도화살 — 매력·인기·이성 운의 핵심<br />AI가 신살을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f43f5e, #be123c)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(244,63,94,0.35)" }}>🌸 도화살 확인 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ fontWeight: 900, fontSize: 15, color: "#be123c", margin: "0 0 8px" }}>도화살(桃花殺)이란?</p>
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>복숭아꽃처럼 매력이 넘쳐서 이성의 시선을 끄는 기운. 연예인·방송인에게 많고, 있으면 인기가 많아요. 부정적인 신살이 아니라 매력 지수예요.</p>
        </div>
        {[{ icon: "💋", title: "도화살 유무", desc: "내 사주 원국에 도화살이 있는지 확인" }, { icon: "✨", title: "도화살 강도", desc: "도화살이 1개인지 여러 개인지 — 강도 분석" }, { icon: "💝", title: "연애운과 연결", desc: "도화살이 연애·결혼에 미치는 영향" }, { icon: "🎯", title: "다른 신살 분석", desc: "역마살·화개살·괴강살 등 내 신살 총정리" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #f43f5e, #be123c)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>도화살 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#be123c", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🌸 시작하기</Link>
      </div>
    </main>
  );
}
