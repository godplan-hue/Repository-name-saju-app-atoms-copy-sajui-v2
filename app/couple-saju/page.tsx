import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "궁합 사주 | 점운 — AI가 분석하는 두 사람의 궁합",
  description: "궁합 사주를 AI로 확인해보세요. 연인·배우자 후보와의 사주 궁합, 합충(合沖) 분석까지. 990원부터 시작.",
  keywords: ["궁합 사주", "사주 궁합", "궁합 보기", "연인 궁합", "결혼 궁합", "AI 궁합"],
  openGraph: { title: "궁합 사주 — 점운", description: "AI가 분석하는 두 사람의 사주 궁합. 990원부터.", url: "https://jeomun.com/couple-saju" },
  alternates: { canonical: "https://jeomun.com/couple-saju" },
};

const faqs = [
  { q: "궁합은 어떻게 보나요?", a: "두 사람의 생년월일·시간을 입력하면 사주 원국의 합(合)·충(沖)·형(刑) 관계를 분석해요. 서로의 기운이 어떻게 작용하는지 알 수 있어요." },
  { q: "결혼 전에 꼭 봐야 하나요?", a: "강제는 아니지만, 두 사람의 기운 흐름을 미리 알면 서로 이해하고 맞춰가는 데 도움이 돼요." },
  { q: "상대방 시간을 모르면요?", a: "시간 없이 생년월일만으로도 기본 궁합 분석이 가능해요. 시간을 알면 더 정밀해져요." },
  { q: "궁합이 나쁘면 헤어져야 하나요?", a: "아니에요. 궁합은 참고 자료예요. 나쁜 궁합도 서로 이해하고 노력하면 충분히 극복할 수 있어요." },
];

export default function CoupleSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff1f2", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ffe4e6, #fff1f2)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#e11d48", margin: "0 0 10px" }}>💑 궁합 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>우리 둘<br />궁합이 맞을까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>연인·배우자 후보와의 사주 궁합<br />AI가 합충 관계를 정밀 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #e11d48, #be123c)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(225,29,72,0.35)" }}>
          💑 궁합 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 1분 완성 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>궁합에서 보는 것들</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🔗", title: "합충 분석", desc: "두 사주가 서로 끌어당기는지(合) 부딪히는지(沖) 확인" },
            { icon: "💕", title: "연애 궁합", desc: "설레임·갈등·대화 스타일 맞는지 분석" },
            { icon: "💒", title: "결혼 궁합", desc: "장기적으로 함께할 때 두 사람의 기운 흐름" },
            { icon: "⚖️", title: "성격 궁합", desc: "일주(日柱)로 보는 두 사람의 성격 조화도" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#e11d48", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #e11d48, #be123c)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>지금 궁합 확인하기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 궁합 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#e11d48", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>💑 시작하기</Link>
      </div>
    </main>
  );
}
