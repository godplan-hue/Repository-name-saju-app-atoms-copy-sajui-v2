import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "나의 인연 운세 | 점운 — 배우자·이성 인연 AI 분석",
  description: "나의 인연 운세를 사주로 확인해보세요. 배우자 인연, 이성 기운, 결혼 시기를 AI가 분석해드려요.",
  keywords: ["인연운세", "나의인연", "배우자운", "이성인연사주", "결혼인연", "배우자 사주"],
  openGraph: { title: "나의 인연 운세 — 점운", description: "배우자·이성 인연 AI 분석.", url: "https://jeomun.com/love-destiny" },
};
export default function LoveDestinyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf2f8", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fce7f3, #fdf2f8)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#9d174d", margin: "0 0 10px" }}>💫 나의 인연 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>나의 배우자<br />어떤 사람일까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>배우자 유형·이성 인연·결혼 시기<br />AI가 사주로 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #ec4899, #9d174d)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>💫 인연 운세 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[
          { icon: "👤", title: "배우자 유형", desc: "내 사주에서 나타나는 배우자의 직업·성격·외모" },
          { icon: "📅", title: "결혼 시기", desc: "사주로 보는 결혼 기운이 강한 시기" },
          { icon: "💘", title: "이성 인연 기운", desc: "올해 이성 인연이 들어오는 기운 흐름" },
          { icon: "🔮", title: "전생 인연", desc: "전생에서부터 이어진 인연 — 운명의 사람" }
        ].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #ec4899, #9d174d)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>나의 인연 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#9d174d", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>💫 시작하기</Link>
      </div>
    </main>
  );
}
