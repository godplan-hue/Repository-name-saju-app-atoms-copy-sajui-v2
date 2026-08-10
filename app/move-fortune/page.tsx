import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "이사운 사주 | 점운 — 이사 날짜·방향 AI 분석",
  description: "이사운을 사주로 확인해보세요. 이사하기 좋은 날, 이사 방향, 이사 후 운세 변화를 AI가 분석해드려요.",
  keywords: ["이사운", "이사 사주", "이사 날짜", "이사 방향", "이사 좋은 날", "이사 운세"],
  openGraph: { title: "이사운 사주 — 점운", description: "이사 날짜·방향 AI 분석.", url: "https://jeomun.com/move-fortune" },
  alternates: { canonical: "https://jeomun.com/move-fortune" },
};
export default function MoveFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0f9ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0369a1", margin: "0 0 10px" }}>📦 이사운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>이사 날짜<br />언제가 좋을까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>이사 날짜·방향·이사 후 기운<br />AI가 이사운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #0ea5e9, #0369a1)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(14,165,233,0.35)" }}>📦 이사운 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "📅", title: "이사 좋은 날", desc: "내 사주에 맞는 이사 길일 추천" }, { icon: "🧭", title: "이사 방향", desc: "올해 이사하기 좋은 방향 (동·서·남·북)" }, { icon: "🏠", title: "이사 후 기운", desc: "이사 후 재물·건강 운세가 어떻게 바뀌는지" }, { icon: "⚠️", title: "이삿날 금기", desc: "이사하면 안 되는 날짜·방향 주의사항" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #0ea5e9, #0369a1)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>이사운 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#0369a1", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>📦 시작하기</Link>
      </div>
    </main>
  );
}
