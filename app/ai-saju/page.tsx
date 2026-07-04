import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI 사주 | 점운 — 인공지능이 분석하는 내 사주",
  description: "AI가 분석하는 정밀 사주. 만세력 기반 계산 + AI 콘텐츠 엔진으로 개인 맞춤 사주 분석을 제공해요. 990원부터 시작.",
  keywords: ["AI 사주", "인공지능 사주", "AI 운세", "AI 사주 분석", "챗GPT 사주", "AI 무료 사주"],
  openGraph: {
    title: "AI 사주 — 점운",
    description: "인공지능이 분석하는 내 사주. 만세력 + AI 엔진으로 정밀 분석.",
    url: "https://jeomun.com/ai-saju",
  },
};

const faqs = [
  { q: "AI 사주가 기존 사주와 다른 점은요?", a: "기존 사주는 역술가 개인의 해석에 의존해요. 점운은 만세력 정밀 계산 + 수천 개 콘텐츠 DB를 AI가 조합해서 일관되고 객관적인 분석을 제공해요." },
  { q: "AI가 사주를 정확하게 볼 수 있나요?", a: "전통 사주의 규칙(십성·신살·대운·세운)을 AI 엔진으로 구현했어요. 사람마다 다른 사주 원국을 정밀하게 계산해서 맞춤 분석을 제공해요." },
  { q: "ChatGPT랑은 달라요?", a: "ChatGPT는 일반 대화형 AI예요. 점운은 사주 전용 엔진으로 만세력 계산부터 신살 분석까지 사주에 특화되어 있어요." },
  { q: "어떤 운세를 볼 수 있나요?", a: "재물운·연애운·직업운·건강운·배우자운·올해운세·대운까지 전체 사주 분석이 가능해요." },
];

export default function AiSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f5f3ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      {/* 히어로 */}
      <div style={{ background: "linear-gradient(135deg, #ede9fe, #f5f3ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed", margin: "0 0 10px", letterSpacing: 0.5 }}>🤖 AI 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>
          인공지능이 분석하는<br />내 사주
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>
          만세력 정밀 계산 + AI 콘텐츠 엔진<br />개인 맞춤 사주 분석을 즉시 받아보세요
        </p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(124,58,237,0.35)" }}>
          🤖 AI 사주 분석 시작
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 1분 완성 · 무료 맛보기</p>
      </div>

      {/* 특징 */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24, color: "#1f2937" }}>점운 AI 사주의 특별함</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "📡", title: "만세력 정밀 계산", desc: "연·월·일·시주 8글자를 수학적으로 정확하게 계산해요" },
            { icon: "🧠", title: "AI 콘텐츠 엔진", desc: "수천 개의 사주 콘텐츠 DB에서 내 사주에 맞는 내용을 조합해요" },
            { icon: "⚡", title: "즉시 결과 제공", desc: "기다림 없이 1분 안에 전체 분석 결과를 확인할 수 있어요" },
            { icon: "🔒", title: "개인 맞춤 분석", desc: "같은 날 태어나도 시간이 다르면 다른 결과, 진짜 내 사주예요" },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 28 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px", color: "#1f2937" }}>{f.title}</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "#1f2937" }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map(f => (
            <div key={f.q} style={{ background: "white", borderRadius: 14, padding: "18px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontWeight: 800, fontSize: 14, color: "#7c3aed", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 CTA */}
      <div style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>AI 사주 지금 바로 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 오늘의 운세 → 990원 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#7c3aed", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          🤖 시작하기
        </Link>
      </div>
    </main>
  );
}
