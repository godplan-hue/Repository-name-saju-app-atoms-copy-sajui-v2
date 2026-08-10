import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "태어난 계절 운세 | 점운 — 봄·여름·가을·겨울 사주",
  description: "태어난 계절로 운세를 확인해보세요. 봄·여름·가을·겨울 태생의 성격·운명을 AI가 분석해드려요.",
  keywords: ["태어난계절운세", "계절운세", "봄생 운세", "여름생 운세", "계절 사주", "태어난 계절 사주"],
  openGraph: { title: "태어난 계절 운세 — 점운", description: "태어난 계절로 보는 운명 AI 분석.", url: "https://jeomun.com/season-fortune" },
  alternates: { canonical: "https://jeomun.com/season-fortune" },
};
export default function SeasonFortunePage() {
  const seasons = [
    { icon: "🌸", name: "봄(3~5월)", desc: "시작·성장의 기운. 목(木) 기운이 강해 창의적이고 진취적.", color: "#22c55e" },
    { icon: "☀️", name: "여름(6~8월)", desc: "열정·에너지의 기운. 화(火) 기운이 강해 활동적이고 사교적.", color: "#ef4444" },
    { icon: "🍂", name: "가을(9~11월)", desc: "결실·수확의 기운. 금(金) 기운이 강해 꼼꼼하고 결단력 있음.", color: "#f97316" },
    { icon: "❄️", name: "겨울(12~2월)", desc: "저장·지혜의 기운. 수(水) 기운이 강해 깊이 생각하고 지혜로움.", color: "#3b82f6" }
  ];
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #e2e8f0, #f8fafc)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#334155", margin: "0 0 10px" }}>🌿 태어난 계절 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>태어난 계절이<br />운명을 바꾼다</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>봄·여름·가을·겨울 태생의 운명<br />AI가 계절 사주로 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #475569, #1e293b)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(71,85,105,0.35)" }}>🌿 계절 운세 보기 — 무료~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {seasons.map(s => (
          <div key={s.name} style={{ background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${s.color}` }}>
            <p style={{ fontWeight: 900, fontSize: 15, margin: "0 0 6px" }}>{s.icon} {s.name}</p>
            <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
        <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", marginTop: 8 }}>계절보다 생년월일 정확한 사주 분석이 훨씬 정밀해요 →</p>
      </div>
      <div style={{ background: "linear-gradient(135deg, #475569, #1e293b)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>내 사주 정밀 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#1e293b", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🌿 시작하기</Link>
      </div>
    </main>
  );
}
