import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "일주별 사주 | 점운 — 내 일주로 보는 타고난 운명",
  description: "일주별 사주를 확인해보세요. 60갑자 일주(日柱)로 보는 나의 타고난 성격·적성·운명. AI가 내 일주를 정밀 분석해드려요.",
  keywords: ["일주별 사주", "일주 사주", "일주 풀이", "60갑자 사주", "일주 운세", "사주 일주"],
  openGraph: { title: "일주별 사주 — 점운", description: "내 일주(日柱)로 보는 타고난 성격과 운명. AI 정밀 분석.", url: "https://jeomun.com/iljoo-saju" },
};

const faqs = [
  { q: "일주가 뭔가요?", a: "사주 8글자 중 태어난 날의 천간·지지를 일주(日柱)라고 해요. 일주는 나 자신을 나타내는 가장 중요한 기둥이에요." },
  { q: "일주만 알면 사주를 볼 수 있나요?", a: "일주는 성격·적성·대인관계를 파악하는 데 핵심이에요. 하지만 운세 흐름은 연·월·시주까지 함께 봐야 더 정확해요." },
  { q: "같은 일주면 같은 성격인가요?", a: "일주가 같아도 연주·월주·시주에 따라 달라져요. 일주는 큰 틀이고 나머지 기둥이 세부 성격을 조율해요." },
  { q: "60갑자가 뭔가요?", a: "천간(10개) × 지지(12개)의 조합으로 총 60가지 일주가 있어요. 60년을 주기로 반복되는 동양 달력 체계예요." },
];

export default function IljooSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fafaf9", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #e7e5e4, #fafaf9)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#57534e", margin: "0 0 10px" }}>📜 일주별 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>내 일주(日柱)로 보는<br />타고난 성격과 운명</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>60갑자 일주 분석<br />나는 어떤 사람인지 AI가 알려드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #78716c, #57534e)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(120,113,108,0.35)" }}>
          📜 내 일주 알아보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>일주에서 알 수 있는 것</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🎭", title: "타고난 성격", desc: "일주 천간·지지가 나타내는 본연의 성향과 기질" },
            { icon: "💼", title: "적성과 직업", desc: "내 일주에 맞는 직업군과 잘 맞는 일의 종류" },
            { icon: "👥", title: "대인관계 스타일", desc: "사람들과 어떻게 어울리는지, 어떤 관계가 편한지" },
            { icon: "💕", title: "연애·결혼 스타일", desc: "일주로 보는 내 이상형과 관계에서의 특징" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#57534e", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #78716c, #57534e)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 일주 지금 확인하기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 일주·성격 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#57534e", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>📜 시작하기</Link>
      </div>
    </main>
  );
}
