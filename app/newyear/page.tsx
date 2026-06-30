import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2027 신년운세 사주 | 점운 — AI 신년 사주 분석",
  description: "2027년 내 운세가 어떨지 AI 사주로 미리 확인해보세요. 재물운·연애운·건강운·직업운 흐름을 월별로 990원에 알 수 있어요.",
  keywords: ["신년운세", "2027 운세", "신년 사주", "올해 운세", "2027 사주", "신년운세 무료", "AI 신년운세"],
  openGraph: {
    title: "2027 신년운세 사주 — 점운",
    description: "2027년 한 해 운세 흐름을 AI 사주로. 990원.",
    url: "https://jeomun.com/newyear",
  },
};

const faqs = [
  { q: "2027년이 제 인생에서 중요한 해인가요?", a: "대운(大運)과 세운(歲運)이 겹치는 해는 인생에서 큰 변화가 생겨요. 2027년이 나에게 어떤 해인지 사주로 미리 확인해보세요." },
  { q: "신년운세에서 어떤 걸 볼 수 있나요?", a: "재물운·연애운·건강운·직업운 전체 흐름과 월별 좋은 날·주의할 달을 분석해드려요." },
  { q: "매년 사주를 봐야 하나요?", a: "대운은 10년마다 바뀌지만 세운(歲運)은 매년 바뀌어요. 매년 신년운세를 보면 그 해 흐름을 정확히 파악해 대비할 수 있어요." },
  { q: "작년 운이 너무 안 좋았어요, 올해는요?", a: "나쁜 대운이 지나고 좋은 세운이 오는 해엔 반전이 일어날 수 있어요. 흐름이 언제 바뀌는지 AI 사주로 확인해보세요." },
];

export default function NewYearPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #e0e7ff, #eef2ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#4f46e5", margin: "0 0 10px" }}>🎆 2027 신년운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>
          2027년 내 운세<br />미리 확인해볼까요?
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>
          재물·연애·건강·직업 전체 흐름 + 월별 분석<br />AI 사주가 한 해를 미리 설계해드려요
        </p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(99,102,241,0.35)" }}>
          🎆 신년운세 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>AI가 즉시 분석 · 1분 완성 · 무료 맛보기 제공</p>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>신년운세로 알 수 있는 것</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🎆", title: "한 해 전체 흐름", desc: "2027년 내 운의 전반적인 흐름과 키워드" },
            { icon: "📅", title: "월별 운세 분석", desc: "1~12월 중 좋은 달·주의할 달·기회의 달 상세 분석" },
            { icon: "🔮", title: "4대 운세 총합", desc: "재물·연애·건강·직업운 종합 점수와 상세 해설" },
            { icon: "⚡", title: "인생 전환점", desc: "2027년이 나에게 어떤 의미인지 대운 맥락에서 분석" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#4f46e5", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>2027년 내 운세 미리 보기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 오늘의 운세 → 990원 올해운세 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#4f46e5", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          🎆 시작하기
        </Link>
      </div>
    </main>
  );
}
