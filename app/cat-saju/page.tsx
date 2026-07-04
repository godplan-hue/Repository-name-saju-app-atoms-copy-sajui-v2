import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "고양이 사주 | 점운 — 귀여운 고양이가 알려주는 내 사주",
  description: "고양이 사주 점운. 귀엽고 친근하게 알려주는 AI 사주 분석. 딱딱한 점집 말투 NO, 쉽고 재미있게 내 운세를 확인해보세요.",
  keywords: ["고양이 사주", "귀여운 사주", "재미있는 사주", "고양이 운세", "사주 고양이", "점운"],
  openGraph: {
    title: "고양이 사주 — 점운",
    description: "귀여운 고양이가 알려주는 AI 사주. 쉽고 재미있게 내 운세 확인.",
    url: "https://jeomun.com/cat-saju",
  },
};

const faqs = [
  { q: "고양이 사주가 뭔가요?", a: "점운은 고양이 캐릭터와 함께하는 AI 사주 앱이에요. 딱딱한 점집 말투 대신 귀엽고 친근하게 내 사주를 설명해줘요." },
  { q: "재미로만 보는 건가요?", a: "아니에요! 내용은 전통 사주 기반이에요. 만세력 정밀 계산으로 진지하게 분석하고, 표현만 쉽고 친근하게 해줘요." },
  { q: "어린이도 볼 수 있나요?", a: "초등학생부터 어르신까지 누구나 이해하기 쉬운 언어로 설명해요. 처음 사주를 접하는 분께도 딱 맞아요." },
  { q: "다른 사주앱과 뭐가 달라요?", a: "점운은 AI 엔진 기반이라 즉시 분석되고, 990원이라는 합리적인 가격에 전체 운세를 볼 수 있어요. 고양이 캐릭터와 함께해서 더 재미있어요!" },
];

export default function CatSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf4ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      {/* 히어로 */}
      <div style={{ background: "linear-gradient(135deg, #fae8ff, #fdf4ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#a855f7", margin: "0 0 10px", letterSpacing: 0.5 }}>🐱 고양이 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>
          고양이가 알려주는<br />내 사주 이야기
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>
          딱딱한 점집 말투는 NO<br />귀엽고 쉽게 알려주는 AI 사주예요
        </p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #a855f7, #9333ea)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(168,85,247,0.35)" }}>
          🐱 고양이 사주 보기
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>무료 맛보기 · 990원부터 · 즉시 결과</p>
      </div>

      {/* 특징 */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24, color: "#1f2937" }}>점운이 다른 이유</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🐱", title: "고양이 캐릭터", desc: "귀여운 고양이와 함께 사주를 보면 훨씬 재미있어요" },
            { icon: "💬", title: "쉬운 말로 설명", desc: "어려운 사주 용어 없이 누구나 이해할 수 있게 풀어서 알려줘요" },
            { icon: "🔮", title: "진지한 내용", desc: "귀엽지만 내용은 진짜예요. 만세력 기반 정밀 AI 분석이에요" },
            { icon: "💰", title: "부담 없는 가격", desc: "무료 오늘의 운세부터 990원 심층 분석까지 부담 없어요" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#a855f7", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 CTA */}
      <div style={{ background: "linear-gradient(135deg, #a855f7, #9333ea)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>지금 고양이 사주 보기 🐱</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 오늘의 운세 → 990원 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#9333ea", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          🐱 시작하기
        </Link>
      </div>
    </main>
  );
}
