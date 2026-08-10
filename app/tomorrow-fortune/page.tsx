import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "내일의 운세 | 점운 — 내일 운세 AI 분석",
  description: "내일의 운세를 AI 사주로 미리 확인해보세요. 내일 재물·연애·건강 기운을 분석해드려요.",
  keywords: ["내일운세", "내일의운세", "내일 운세 보기", "내일 사주", "명일 운세", "내일 기운"],
  openGraph: { title: "내일의 운세 — 점운", description: "내일 운세 AI 분석. 미리 준비하세요.", url: "https://jeomun.com/tomorrow-fortune" },
  alternates: { canonical: "https://jeomun.com/tomorrow-fortune" },
};
export default function TomorrowFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0f9ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #bae6fd, #f0f9ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0369a1", margin: "0 0 10px" }}>🌅 내일의 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>내일은 어떤 날<br />이 될까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>내일 재물·연애·건강·직장 기운<br />AI가 미리 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #0ea5e9, #0369a1)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(14,165,233,0.35)" }}>🌅 내일 운세 보기 — 무료~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[
          { icon: "💰", title: "내일 재물운", desc: "내일 돈이 들어올지, 나갈지 미리 확인" },
          { icon: "💕", title: "내일 연애운", desc: "내일 좋아하는 사람과의 기운" },
          { icon: "💚", title: "내일 건강운", desc: "내일 특히 조심할 건강 포인트" },
          { icon: "💼", title: "내일 직장운", desc: "내일 직장에서의 기운 — 좋은 소식 오나?" }
        ].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #0ea5e9, #0369a1)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>내일 운세 미리 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#0369a1", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🌅 시작하기</Link>
      </div>
    </main>
  );
}
