import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "관상 보기 | 점운 — 얼굴로 보는 운명 AI 분석",
  description: "관상으로 운명을 확인해보세요. 이마·눈·코·입·턱으로 재물운·연애운·직업운을 AI가 분석해드려요.",
  keywords: ["관상", "관상 보기", "관상 운세", "관상 보는법", "얼굴 관상", "관상학"],
  openGraph: { title: "관상 보기 — 점운", description: "얼굴로 보는 운명 분석. 관상으로 재물·연애운 확인.", url: "https://jeomun.com/physiognomy" },
};
export default function PhysiognomyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf4e3", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fed7aa, #fdf4e3)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#c2410c", margin: "0 0 10px" }}>👁️ 관상 보기</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>내 얼굴에<br />어떤 운명이 있을까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>이마·눈·코·입·턱으로 보는 운명<br />관상으로 재물·연애·건강운 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #ea580c, #c2410c)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(234,88,12,0.35)" }}>👁️ 관상 + 사주 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[
          { icon: "💰", title: "이마 — 재물운", desc: "넓고 둥근 이마는 재물이 들어오는 형상" },
          { icon: "💕", title: "눈 — 연애운", desc: "눈빛이 선명하고 맑을수록 인연 기운이 강함" },
          { icon: "👃", title: "코 — 자존심·재물", desc: "코가 반듯하고 풍성하면 재물과 자존심 강함" },
          { icon: "😊", title: "입·턱 — 말년운", desc: "입이 크고 두꺼우면 말년이 풍요롭고 복이 있음" }
        ].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
        <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", marginTop: 8 }}>관상은 참고용 · 사주가 더 정확해요 →</p>
      </div>
      <div style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>관상 + AI 사주 함께 보기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>관상보다 정밀한 사주 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#c2410c", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>👁️ 시작하기</Link>
      </div>
    </main>
  );
}
