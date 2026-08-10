import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "자녀운 사주 | 점운 — 임신·출산·자녀 기운 AI 분석",
  description: "자녀운을 사주로 확인해보세요. 임신 기운, 출산 시기, 자녀와의 인연을 AI가 분석해드려요.",
  keywords: ["자녀운", "자녀운 사주", "임신 사주", "출산 기운", "아이 사주", "자녀 인연"],
  openGraph: { title: "자녀운 사주 — 점운", description: "임신·출산·자녀 기운 AI 분석.", url: "https://jeomun.com/child-fortune" },
  alternates: { canonical: "https://jeomun.com/child-fortune" },
};
export default function ChildFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff7ed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ffedd5, #fff7ed)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#c2410c", margin: "0 0 10px" }}>👶 자녀운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>우리 아이<br />언제 생길까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>임신 기운·출산 시기·자녀 인연<br />AI가 자녀운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f97316, #c2410c)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(249,115,22,0.35)" }}>👶 자녀운 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "🤱", title: "임신 기운", desc: "임신 가능성이 높은 시기·올해 자녀 기운" }, { icon: "🍼", title: "출산 인연", desc: "내 사주에 자녀 인연이 강한지 약한지" }, { icon: "👨‍👩‍👧", title: "자녀와의 관계", desc: "아이와 부모 사이 궁합·관계 흐름" }, { icon: "📚", title: "자녀 기질 분석", desc: "아이의 사주로 보는 기질·적성·특기" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #f97316, #c2410c)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>자녀운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#c2410c", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>👶 시작하기</Link>
      </div>
    </main>
  );
}
