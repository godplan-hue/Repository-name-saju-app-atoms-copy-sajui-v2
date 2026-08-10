import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "사주 계산기 | 점운 — 생년월일로 사주팔자 계산",
  description: "사주 계산기로 내 사주팔자를 확인해보세요. 생년월일시 입력만 하면 사주 원국을 즉시 계산해드려요.",
  keywords: ["사주계산기", "사주 계산기", "사주팔자 계산", "만세력 계산기", "생년월일 사주", "사주 원국 계산"],
  openGraph: { title: "사주 계산기 — 점운", description: "생년월일로 사주팔자 즉시 계산.", url: "https://jeomun.com/saju-calc" },
  alternates: { canonical: "https://jeomun.com/saju-calc" },
};
export default function SajuCalcPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f5f3ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ede9fe, #f5f3ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#5b21b6", margin: "0 0 10px" }}>🔢 사주 계산기</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>내 사주팔자<br />바로 계산해보기</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>생년월일시 입력 → 사주 원국 즉시 계산<br />연주·월주·일주·시주까지 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(124,58,237,0.35)" }}>🔢 사주 계산 — 무료~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ fontWeight: 900, fontSize: 15, margin: "0 0 10px" }}>사주팔자란?</p>
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>태어난 연·월·일·시 4개 기둥, 각 기둥에 천간·지지 2글자씩 총 8글자(팔자). 이 8글자가 평생 운명의 지도가 돼요.</p>
        </div>
        {[{ icon: "📅", title: "연주(年柱)", desc: "태어난 해 — 타고난 운명·조상 기운" }, { icon: "🌙", title: "월주(月柱)", desc: "태어난 달 — 형제·부모 기운" }, { icon: "☀️", title: "일주(日柱)", desc: "태어난 날 — 나 자신·배우자 기운" }, { icon: "⏰", title: "시주(時柱)", desc: "태어난 시 — 자녀·말년 기운" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 사주 계산하기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>오늘의 운세는 무료</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#5b21b6", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🔢 시작하기</Link>
      </div>
    </main>
  );
}
