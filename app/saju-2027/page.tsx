import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "2027년 운세 | 점운 — 2027 정미년 AI 사주 분석",
  description: "2027년 운세를 AI 사주로 확인해보세요. 정미년(丁未年) 나의 재물·연애·직업·건강 운세 총정리.",
  keywords: ["2027년 운세", "2027 사주", "정미년 운세", "2027 신년운세", "2027년 사주", "2027 운세 보기"],
  openGraph: { title: "2027년 운세 — 점운", description: "2027 정미년 AI 사주 분석. 내년 운세 미리 확인.", url: "https://jeomun.com/saju-2027" },
};
export default function Saju2027Page() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf4ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fae8ff, #fdf4ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7e22ce", margin: "0 0 10px" }}>✨ 2027년 신년운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>2027년 정미년<br />내 운세는?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>2027년 재물·연애·직업·건강 운세<br />AI가 미리 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #a855f7, #7e22ce)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(168,85,247,0.35)" }}>✨ 2027년 운세 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 900, color: "#7e22ce", margin: "0 0 6px" }}>2027년 — 정미년(丁未年)</p>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>붉은 양의 해 · 변화와 도약의 기운</p>
        </div>
        {[{ icon: "💰", title: "2027년 재물운", desc: "돈이 들어오는 흐름과 투자 기운" }, { icon: "💕", title: "2027년 연애운", desc: "새로운 인연 기회와 관계 흐름" }, { icon: "💼", title: "2027년 직업운", desc: "커리어 변화·승진·이직 기운" }, { icon: "💚", title: "2027년 건강운", desc: "건강에 주의해야 할 시기와 방법" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #a855f7, #7e22ce)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>2027년 운세 미리 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#7e22ce", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>✨ 시작하기</Link>
      </div>
    </main>
  );
}
