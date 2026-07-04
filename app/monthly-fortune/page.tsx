import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "월간 운세 | 점운 — 이번 달 내 운세 AI 분석",
  description: "월간 운세를 AI 사주로 확인해보세요. 이번 달 기운 흐름, 좋은 날, 조심할 시기를 분석해드려요.",
  keywords: ["월간운세", "이번달 운세", "월간 사주", "월별 운세", "한달 운세", "월운"],
  openGraph: { title: "월간 운세 — 점운", description: "이번 달 내 운세 AI 분석. 월별 기운 흐름 확인.", url: "https://jeomun.com/monthly-fortune" },
};
export default function MonthlyFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f5f3ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ede9fe, #f5f3ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#6d28d9", margin: "0 0 10px" }}>🗓️ 월간 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>이번 달<br />내 운세 흐름은?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>이번 달 재물·연애·직업 기운<br />AI가 월간 운세를 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(124,58,237,0.35)" }}>🗓️ 월간 운세 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "💰", title: "이번 달 재물운", desc: "돈이 들어오는지, 나가는지 이번 달 흐름" }, { icon: "💕", title: "이번 달 연애운", desc: "이번 달 인연 기운과 현재 연애 방향" }, { icon: "💼", title: "이번 달 직업운", desc: "직장·사업에서 이번 달 주목할 포인트" }, { icon: "💚", title: "이번 달 건강운", desc: "이번 달 건강에 특히 신경 써야 할 부분" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>이번 달 운세 확인하기</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#6d28d9", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🗓️ 시작하기</Link>
      </div>
    </main>
  );
}
