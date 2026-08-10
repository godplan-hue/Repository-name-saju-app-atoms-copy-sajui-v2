import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "정통사주 | 점운 — AI 정통 사주풀이",
  description: "정통사주를 AI로 확인해보세요. 사주 원국 분석부터 오행·십성까지 정통 방식으로 풀이해드려요.",
  keywords: ["정통사주", "정통 사주풀이", "사주 원국", "정통 사주 보기", "전통 사주", "사주 풀이"],
  openGraph: { title: "정통사주 — 점운", description: "AI 정통 사주풀이. 오행·십성 분석.", url: "https://jeomun.com/jeongtong-saju" },
  alternates: { canonical: "https://jeomun.com/jeongtong-saju" },
};
export default function JeongtongSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf4e3", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fde68a, #fdf4e3)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", margin: "0 0 10px" }}>📜 정통사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>정통 방식으로<br />사주 제대로 보기</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>사주 원국·오행·십성·신살까지<br />전통 사주 방식으로 AI가 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #d97706, #92400e)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(217,119,6,0.35)" }}>📜 정통사주 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[
          { icon: "🔵", title: "사주 원국(原局)", desc: "연·월·일·시 4개 기둥 — 타고난 운명의 설계도" },
          { icon: "⚡", title: "오행(五行) 분석", desc: "목·화·토·금·수 균형으로 보는 성격과 운명" },
          { icon: "⭐", title: "십성(十星) 분석", desc: "비겁·식신·재성·관성·인성으로 보는 직업·연애·재물" },
          { icon: "⚔️", title: "신살(神殺)", desc: "도화살·역마살·화개살 등 내 사주의 특수 기운" }
        ].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #d97706, #92400e)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>정통사주 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#92400e", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>📜 시작하기</Link>
      </div>
    </main>
  );
}
