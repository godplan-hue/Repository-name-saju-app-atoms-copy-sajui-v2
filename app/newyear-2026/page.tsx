import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "신년운세 2026 | 점운 — 2026년 내 한 해 운세",
  description: "2026년 신년운세를 AI 사주로 확인해보세요. 올해 재물·연애·건강·직업 흐름을 월별로 상세히 분석해드려요.",
  keywords: ["신년운세 2026", "2026 운세", "2026 사주", "올해의 운세", "병오년 운세", "2026 신년운세"],
  openGraph: { title: "신년운세 2026 — 점운", description: "2026년 한 해 운세를 AI가 월별로 분석. 990원부터.", url: "https://jeomun.com/newyear-2026" },
};

const faqs = [
  { q: "신년운세는 언제부터 적용되나요?", a: "사주에서 한 해는 양력 1월 1일이 아닌 입춘(2월 4일경)부터 시작해요. 점운은 이 기준으로 정확하게 계산해요." },
  { q: "2026년 운세가 나쁘면 어떻게 하나요?", a: "나쁜 운세도 미리 알면 대비할 수 있어요. 언제 조심해야 하는지 알고 준비하는 것만으로도 큰 차이가 생겨요." },
  { q: "월별로 볼 수 있나요?", a: "네, 연간 운세와 함께 월별 흐름도 확인할 수 있어요. 어느 달이 기회의 달인지, 조심해야 할 달인지 알 수 있어요." },
  { q: "작년 운세와 어떻게 다른가요?", a: "매년 세운(歲運)이 바뀌어요. 2026년 병오년(丙午年)의 기운이 내 사주와 어떻게 작용하는지 개인별로 다르게 분석해드려요." },
];

export default function Newyear2026Page() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0f9ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0284c7", margin: "0 0 10px" }}>🎊 신년운세 2026</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>2026년<br />내 한 해 운세는?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>재물·연애·건강·직업 올해 흐름<br />월별 상세 분석까지 AI가 알려줘요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #0ea5e9, #0284c7)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(14,165,233,0.35)" }}>
          🎊 2026 운세 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 월별 상세 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>2026 신년운세에서 보는 것</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "📅", title: "연간 흐름", desc: "2026년 한 해 전체 운기 — 상반기·하반기 기운 차이" },
            { icon: "📆", title: "월별 운세", desc: "1월~12월 각 달의 운기와 중요한 시기 포인트" },
            { icon: "💰", title: "재물·직업운", desc: "올해 돈과 커리어 흐름 — 기회의 달, 조심할 달" },
            { icon: "💕", title: "연애·결혼운", desc: "올해 인연 흐름과 현재 연애의 방향" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#0284c7", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>2026 신년운세 지금 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 연간·월별 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#0284c7", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🎊 시작하기</Link>
      </div>
    </main>
  );
}
