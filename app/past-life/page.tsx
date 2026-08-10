import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "전생 사주 | 점운 — 전생운·전생 직업 AI 분석",
  description: "전생 사주를 확인해보세요. 전생에 어떤 사람이었는지, 전생에서 이어진 운명을 AI가 분석해드려요.",
  keywords: ["전생사주", "전생 운세", "전생운", "전생 직업", "전생 확인", "나의 전생"],
  openGraph: { title: "전생 사주 — 점운", description: "전생운·전생 직업 AI 분석.", url: "https://jeomun.com/past-life" },
  alternates: { canonical: "https://jeomun.com/past-life" },
};
export default function PastLifePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#1e1b4b", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#e2e8f0" }}>
      <div style={{ background: "linear-gradient(135deg, #312e81, #1e1b4b)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc", margin: "0 0 10px" }}>🌌 전생 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 12px", lineHeight: 1.25 }}>전생에 나는<br />어떤 사람이었을까?</h1>
        <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 28px", lineHeight: 1.7 }}>전생 직업·전생 신분·이어진 인연<br />AI가 전생운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #818cf8, #4f46e5)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(129,140,248,0.4)" }}>🌌 전생 사주 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "👑", title: "전생 신분", desc: "귀족·평민·스님·무사 등 전생의 신분" }, { icon: "⚔️", title: "전생 직업", desc: "전생에서 무슨 일을 했는지" }, { icon: "💞", title: "전생 인연", desc: "현생에서 만난 사람 중 전생 인연이 있는 사람" }, { icon: "🔮", title: "전생이 현재에 미치는 영향", desc: "전생 업(業)이 이번 생 운명에 어떻게 이어졌는지" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "#1e293b", borderRadius: 14, padding: "16px 18px", marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px", color: "#e2e8f0" }}>{f.title}</p><p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #818cf8, #4f46e5)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>전생 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#4f46e5", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🌌 시작하기</Link>
      </div>
    </main>
  );
}
