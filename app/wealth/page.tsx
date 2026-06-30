import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "재물운 사주 | 점운 — AI가 분석하는 올해 돈 운세",
  description: "올해 재물운이 좋은지 AI 사주로 확인해보세요. 돈이 들어오는 시기, 투자 타이밍, 재물 체질을 990원에 알 수 있어요.",
  keywords: ["재물운 사주", "돈 운세", "재물운 2026", "AI 재물운", "투자 사주", "재물 체질", "재테크 사주"],
  openGraph: {
    title: "재물운 사주 — 점운",
    description: "올해 돈 들어오는 시기와 재물 체질을 AI 사주로. 990원.",
    url: "https://jeomun.com/wealth",
  },
};

const faqs = [
  { q: "올해 돈이 들어올까요?", a: "사주에서 재성(財星)이 강해지는 해는 수입이 오르거나 예상치 못한 재물이 들어와요. 세운 흐름으로 언제 기회가 오는지 알 수 있어요." },
  { q: "투자해도 되는 시기인가요?", a: "식신·상관이 재성을 생(生)해주는 흐름이라면 투자 타이밍이에요. 반대로 비겁이 재성을 빼앗는 흐름이라면 보수적으로 가야 해요." },
  { q: "저는 돈 복이 없는 걸까요?", a: "재물 복이 없는 사주는 없어요. 다만 사람마다 돈 버는 방식이 달라요. 내 사주에 맞는 재물 체질을 알면 더 효율적으로 돈을 모을 수 있어요." },
  { q: "사업 재물운과 직장 재물운이 다른가요?", a: "맞아요. 직장형 재물과 사업형 재물은 사주에서 다르게 나타나요. 어떤 방식으로 버는 게 더 유리한지 알려드려요." },
];

export default function WealthPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fffbeb", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fef3c7, #fffbeb)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#b45309", margin: "0 0 10px" }}>💰 재물운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>
          올해 나에게<br />돈 운이 있을까?
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>
          재물 들어오는 시기 · 투자 타이밍 · 재물 체질<br />AI 사주가 내 재물 기운을 분석해드려요
        </p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f59e0b, #b45309)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(180,83,9,0.35)" }}>
          💰 재물운 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>AI가 즉시 분석 · 1분 완성 · 무료 맛보기 제공</p>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>재물운으로 알 수 있는 것</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "💰", title: "재물 최고 시기", desc: "올해 가장 돈이 들어오는 달·기간 정확히 짚기" },
            { icon: "📈", title: "투자 타이밍", desc: "부동산·주식·창업 투자 적합 시기와 주의 시기" },
            { icon: "🏦", title: "재물 체질 분석", desc: "직장·사업·투자 중 내게 맞는 돈 버는 방식" },
            { icon: "⚠️", title: "재물 손실 주의 시기", desc: "돈이 나가거나 사기당하기 쉬운 시기 미리 경고" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#b45309", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, #f59e0b, #10b981)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 재물운 지금 확인하기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 오늘의 운세 → 990원 재물운 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#b45309", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          💰 시작하기
        </Link>
      </div>
    </main>
  );
}
