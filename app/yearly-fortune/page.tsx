import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "연도별 운세 | 점운 — 연도별로 보는 내 운세 흐름",
  description: "연도별 운세를 확인해보세요. 2024·2025·2026·2027년 내 운세 흐름을 AI가 연도별로 분석해드려요.",
  keywords: ["연도별 운세", "연도별 사주", "년도별 운세", "매년 운세", "연간 운세", "연도 사주"],
  openGraph: { title: "연도별 운세 — 점운", description: "연도별 내 운세 흐름. 과거·현재·미래 연도별 분석.", url: "https://jeomun.com/yearly-fortune" },
};

const faqs = [
  { q: "연도별 운세는 매년 달라지나요?", a: "네, 세운(歲運)이 매년 바뀌어서 내 사주와 만나는 기운도 달라져요. 어떤 해는 기회의 해, 어떤 해는 조심해야 할 해예요." },
  { q: "몇 년 앞까지 볼 수 있나요?", a: "대운 흐름 안에서 세운을 분석하므로 여러 해를 미리 파악할 수 있어요. 중기적인 인생 계획을 세우는 데 도움이 돼요." },
  { q: "작년 운세가 맞았는지 확인할 수 있나요?", a: "과거 연도 운세도 분석 가능해요. 내 사주와 과거 세운의 흐름을 되돌아보면 패턴을 파악할 수 있어요." },
  { q: "올해와 내년 중 어느 해가 더 좋을까요?", a: "내 사주에 따라 달라요. 개인별로 운이 좋은 해와 조심해야 할 해가 달라요." },
];

export default function YearlyFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0f9ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0369a1", margin: "0 0 10px" }}>📆 연도별 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>연도별로 보는<br />내 운세 흐름</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>2024 · 2025 · 2026 · 2027<br />연도마다 달라지는 내 운의 흐름을 파악해요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #0ea5e9, #0369a1)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(14,165,233,0.35)" }}>
          📆 연도별 운세 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 다년도 분석 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 20 }}>연도별 운세에서 보는 것</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "📈", title: "상승/하강 연도", desc: "인생에서 기운이 오르는 해와 내려가는 해 파악" },
            { icon: "🎯", title: "기회의 해", desc: "투자·이직·결혼·창업하기 좋은 연도 확인" },
            { icon: "🛡️", title: "조심해야 할 해", desc: "큰 결정을 미루고 준비에 집중해야 할 연도" },
            { icon: "🔮", title: "미래 연도 예측", desc: "앞으로 몇 년간의 운세 흐름 미리 파악" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#0369a1", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #0ea5e9, #0369a1)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>연도별 운세 지금 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 연도별 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#0369a1", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>📆 시작하기</Link>
      </div>
    </main>
  );
}
