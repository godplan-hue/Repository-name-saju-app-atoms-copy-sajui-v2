import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "총운 사주 | 점운 — AI가 분석하는 내 전체 운세",
  description: "총운(總運)으로 내 전체 운세 흐름을 확인해보세요. 재물·연애·건강·직업을 통합해 내 운의 전체 그림을 AI가 그려드려요.",
  keywords: ["총운 사주", "총운 보기", "전체 운세", "사주 총운", "종합 운세", "AI 총운"],
  openGraph: { title: "총운 사주 — 점운", description: "내 전체 운세를 통합 분석. 재물·연애·건강·직업 총운.", url: "https://jeomun.com/total-saju" },
  alternates: { canonical: "https://jeomun.com/total-saju" },
};

const faqs = [
  { q: "총운이 뭔가요?", a: "총운(總運)은 재물·연애·건강·직업 등 모든 분야를 통합해서 보는 전체 운세예요. 내 인생 전반적인 기운 흐름을 한눈에 볼 수 있어요." },
  { q: "총운만 보면 되나요?", a: "총운으로 전체 흐름을 파악하고, 궁금한 분야는 세부 운세로 더 자세히 볼 수 있어요. 총운은 큰 그림이에요." },
  { q: "총운이 좋으면 다 잘 되나요?", a: "총운이 좋아도 세부 분야별로 차이가 있을 수 있어요. 예를 들어 총운은 좋지만 연애운만 약한 경우도 있어요." },
  { q: "올해 총운을 알 수 있나요?", a: "네, 2026년 세운과 내 사주 원국의 조합으로 올해 전체 운기 흐름을 분석해드려요." },
];

export default function TotalSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#faf5ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #f3e8ff, #faf5ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7e22ce", margin: "0 0 10px" }}>🌟 총운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>내 전체 운세<br />한눈에 보기</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>재물·연애·건강·직업 통합 분석<br />AI가 내 운의 전체 그림을 그려드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #9333ea, #7e22ce)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(147,51,234,0.35)" }}>
          🌟 총운 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 전체 통합 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>총운 분석 내용</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🌟", title: "전체 운기 흐름", desc: "올해 내 전반적인 기운이 상승세인지 하강세인지" },
            { icon: "⚖️", title: "분야별 균형", desc: "재물·연애·건강·직업 중 어느 분야가 강하고 약한지" },
            { icon: "📅", title: "좋은 달·나쁜 달", desc: "올해 기운이 가장 좋은 달과 조심해야 할 달" },
            { icon: "💡", title: "총운 기반 조언", desc: "전체 운세 흐름에서 뽑은 올해 핵심 전략" },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 28 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 20 }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map(f => (
            <div key={f.q} style={{ background: "white", borderRadius: 14, padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontWeight: 800, fontSize: 14, color: "#7e22ce", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #9333ea, #7e22ce)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 총운 지금 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 총운 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#7e22ce", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🌟 시작하기</Link>
      </div>
    </main>
  );
}
