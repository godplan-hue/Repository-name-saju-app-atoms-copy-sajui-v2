import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이직운 · 직업운 사주 | 점운 — AI 직업 사주 분석",
  description: "이직 타이밍이 맞는지, 사업을 시작해도 되는지 AI 사주로 알아보세요. 직업운 · 사업운 · 승진운을 990원에 확인할 수 있어요.",
  keywords: ["이직 사주", "직업운 사주", "사업운 사주", "취업 사주", "이직 시기", "직장운", "승진운"],
  openGraph: {
    title: "이직운 직업운 사주 — 점운",
    description: "이직 타이밍 · 사업 시작 · 승진운을 AI 사주로. 990원.",
    url: "https://jeomun.com/career",
  },
};

const faqs = [
  { q: "지금 이직해도 될까요?", a: "사주에서 관성(官星)과 재성(財星)이 동시에 움직이는 해는 이직 성공률이 높아요. 내 세운 흐름을 먼저 확인해보세요." },
  { q: "사업을 시작하려는데 잘 될까요?", a: "사주에서 식신·상관이 강하고 재성이 받쳐주는 구조라면 사업 체질이에요. 사업 시작 최적 시기도 분석해드립니다." },
  { q: "직장 내 인간관계가 힘들어요", a: "사주에서 관성과 비겁의 충돌이 심한 시기엔 직장 스트레스가 커집니다. 언제 이 시기가 지나는지 알면 버틸 수 있어요." },
  { q: "어떤 직업이 저에게 맞나요?", a: "사주 오행의 강약에 따라 잘 맞는 직종이 달라져요. 목 · 화 · 토 · 금 · 수 중 어떤 기운이 강한지에 따라 적성 직종을 알 수 있어요." },
];

export default function CareerPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #d1fae5, #ecfdf5)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#059669", margin: "0 0 10px" }}>💼 이직·직업운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>
          지금 이직해도<br />괜찮을까?
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>
          이직 타이밍 · 사업 시작 · 승진 시기<br />AI 사주가 내 직업 기운을 분석해드려요
        </p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(16,185,129,0.35)" }}>
          💼 직업운 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>AI가 즉시 분석 · 1분 완성 · 무료 맛보기 제공</p>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>직업운으로 알 수 있는 것</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🎯", title: "이직 최적 시기", desc: "언제 옮기면 성공률이 높은지 대운·세운 흐름으로 분석" },
            { icon: "🏢", title: "사업 체질 분석", desc: "직장형인지 사업형인지, 어떤 업종이 잘 맞는지" },
            { icon: "🚀", title: "승진·성과 시기", desc: "올해 내 커리어에서 가장 큰 기회가 언제 오는지" },
            { icon: "💰", title: "재물+직업 연계", desc: "이직 후 수입이 오르는지, 사업 수익 시기는 언제인지" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#059669", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, #10b981, #8b5cf6)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 이직 타이밍 지금 확인하기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 오늘의 운세 → 990원 직업운 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#059669", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          💼 시작하기
        </Link>
      </div>
    </main>
  );
}
