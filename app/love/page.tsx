import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "연애운 사주 | 점운 — AI가 알려주는 나의 연애 기운",
  description: "AI 사주로 올해 연애운을 확인해보세요. 솔로인지 만남이 오는지, 현재 연인과의 궁합까지 990원에 알 수 있어요.",
  keywords: ["연애운 사주", "AI 연애운", "2026 연애운", "무료 연애 사주", "사주 연애운", "연애 운세"],
  openGraph: {
    title: "연애운 사주 — 점운",
    description: "AI가 분석하는 내 연애 기운. 990원으로 시작해요.",
    url: "https://jeomun.com/love",
  },
};

const faqs = [
  { q: "솔로인 제가 올해 만남이 생길까요?", a: "사주에서 재성(財星)·도화살·역마살이 활성화되는 해에는 이성 인연이 움직입니다. AI 사주로 올해 내 인연 기운을 확인해보세요." },
  { q: "연인과 헤어졌는데 재회 가능성은요?", a: "상대방과의 합(合)·충(沖) 관계와 대운·세운 흐름을 보면 재회 시기를 짚을 수 있어요. 재물운 + 연애운 패키지로 확인해보세요." },
  { q: "연애운이 나쁘다면 어떻게 해야 하나요?", a: "운이 나쁜 시기엔 자기 자신을 가꾸는 게 답이에요. 언제 기운이 다시 올라오는지 흐름을 알고 준비하는 것만으로도 달라집니다." },
  { q: "궁합도 볼 수 있나요?", a: "상대방 생년월일을 함께 입력하면 궁합 분석도 가능해요. 베이직 이상 패키지에서 확인할 수 있습니다." },
];

export default function LovePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff5f8", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      {/* 히어로 */}
      <div style={{ background: "linear-gradient(135deg, #fce7f3, #fdf2f8)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#ec4899", margin: "0 0 10px", letterSpacing: 0.5 }}>💕 연애운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>
          올해 나에게<br />연애 인연이 올까?
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>
          솔로 탈출 · 현재 연애 진단 · 재회 가능성<br />AI 사주가 내 연애 기운을 분석해드려요
        </p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #ec4899, #db2777)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
          💕 연애운 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>AI가 즉시 분석 · 1분 완성 · 무료 맛보기 제공</p>
      </div>

      {/* 특징 */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24, color: "#1f2937" }}>점운 연애운이 특별한 이유</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🔮", title: "AI 사주 엔진", desc: "만세력 기반 정밀 계산 + 수천 개 콘텐츠 DB로 개인 맞춤 분석" },
            { icon: "💕", title: "연애운 심층 분석", desc: "솔로 인연 흐름 · 현재 연인 궁합 · 연애 체질 · 최고 시기" },
            { icon: "⚡", title: "즉시 결과", desc: "생년월일 입력만으로 1분 안에 결과 확인" },
            { icon: "💰", title: "990원부터", desc: "연애운만 따로 990원에 볼 수 있어요. 패키지로 더 저렴하게!" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#ec4899", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 CTA */}
      <div style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>지금 내 연애운 확인하기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 오늘의 운세 → 990원 연애운 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#ec4899", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          💕 시작하기
        </Link>
      </div>
    </main>
  );
}
