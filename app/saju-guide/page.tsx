import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "사주 풀이 | 점운 — 내 사주 AI가 쉽게 풀어드려요",
  description: "사주 풀이를 쉽게 받아보세요. 어려운 한자 용어 없이 AI가 내 사주를 쉽고 정확하게 풀어드려요. 990원부터.",
  keywords: ["사주 풀이", "사주 해석", "사주 보기", "내 사주", "사주 분석", "사주 설명"],
  openGraph: { title: "사주 풀이 — 점운", description: "어렵지 않게, AI가 내 사주를 쉽게 풀어드려요. 990원부터.", url: "https://jeomun.com/saju-guide" },
  alternates: { canonical: "https://jeomun.com/saju-guide" },
};

const faqs = [
  { q: "사주가 어렵게 느껴지는데 설명을 잘 해주나요?", a: "네, 점운은 어려운 한자 용어 없이 누구나 이해할 수 있는 쉬운 말로 사주를 풀어드려요. 처음 사주를 접하는 분도 OK예요." },
  { q: "사주 원국이 뭔가요?", a: "태어난 연·월·일·시의 8글자로 이루어진 내 사주 기본 구조예요. 이 8글자가 평생 운명의 틀을 만들어요." },
  { q: "사주가 정해진 운명이라면 바꿀 수 없나요?", a: "사주는 타고난 기운의 흐름이에요. 미리 알면 좋은 기운을 극대화하고, 나쁜 기운을 최소화할 수 있어요." },
  { q: "얼마나 정확한가요?", a: "만세력 정밀 계산 + 수천 개 콘텐츠 DB 기반이에요. 사람마다 다른 사주를 개인화해서 분석해요." },
];

export default function SajuGuidePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #e2e8f0, #f8fafc)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#475569", margin: "0 0 10px" }}>🔮 사주 풀이</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>내 사주<br />AI가 쉽게 풀어드려요</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>어려운 한자 용어 없이<br />누구나 이해할 수 있게 설명해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #64748b, #475569)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(100,116,139,0.35)" }}>
          🔮 사주 풀이 받기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 쉬운 설명 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>사주 풀이에서 알 수 있는 것</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "📋", title: "사주 원국 설명", desc: "8글자 사주가 무엇을 의미하는지 쉬운 말로 설명" },
            { icon: "🌟", title: "타고난 강점·약점", desc: "내 사주의 강한 기운과 보완해야 할 부분" },
            { icon: "🗓️", title: "인생 흐름", desc: "대운으로 보는 10년 단위 인생 큰 흐름" },
            { icon: "💡", title: "맞춤 조언", desc: "내 사주에 맞는 인생 전략과 살아가는 방향" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#475569", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #64748b, #475569)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 사주 지금 풀어보기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 상세 사주 풀이</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#475569", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🔮 시작하기</Link>
      </div>
    </main>
  );
}
