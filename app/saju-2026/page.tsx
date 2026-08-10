import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2026 사주 | 점운 — 2026년 내 사주 완전 분석",
  description: "2026년 사주를 AI로 분석해보세요. 2026 병오년(丙午年) 내 운세 흐름을 재물·연애·건강·직업별로 상세히 확인하세요.",
  keywords: ["2026 사주", "2026년 사주", "병오년 사주", "2026 운세", "2026 신년사주", "2026 사주 분석"],
  openGraph: { title: "2026 사주 — 점운", description: "2026 병오년 내 사주 완전 분석. AI가 재물·연애·건강·직업 전체 분석.", url: "https://jeomun.com/saju-2026" },
  alternates: { canonical: "https://jeomun.com/saju-2026" },
};

const faqs = [
  { q: "2026년은 무슨 해인가요?", a: "2026년은 병오년(丙午年)이에요. 천간은 병화(丙火), 지지는 오화(午火)로 화(火) 기운이 매우 강한 해예요. 열정·활력·변화의 기운이 강해요." },
  { q: "2026년에 특히 조심해야 할 사람은?", a: "사주에 수(水) 기운이 많은 분은 화(火)와 충돌할 수 있어요. 개인 사주에 따라 다르니 내 사주를 정밀 분석해보세요." },
  { q: "2026년에 좋은 기운을 받는 사람은?", a: "목(木)·화(火) 일간인 분들은 2026 병오년 기운과 잘 맞아요. 하지만 전체 사주를 봐야 정확히 알 수 있어요." },
  { q: "올해 사주와 내년 사주가 다른가요?", a: "네, 세운(歲運)이 매년 바뀌어요. 2025년과 2026년은 다른 기운이에요. 내 사주 원국과 새해 기운이 어떻게 만나는지 분석해보세요." },
];

export default function Saju2026Page() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff7ed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ffedd5, #fff7ed)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#c2410c", margin: "0 0 10px" }}>🔥 2026 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>2026 병오년<br />내 사주 완전 분석</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>화(火)의 해 2026년<br />내 사주와 어떻게 맞을지 AI가 분석해요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f97316, #c2410c)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(249,115,22,0.35)" }}>
          🔥 2026 사주 분석 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 개인 맞춤 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>2026년 분석 내용</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🔥", title: "병오년 기운 분석", desc: "2026 병오년의 화(火) 기운이 내 사주에 미치는 영향" },
            { icon: "💰", title: "2026 재물·직업운", desc: "올해 돈과 커리어에 기회가 오는지, 조심해야 할지" },
            { icon: "💕", title: "2026 연애·결혼운", desc: "올해 인연 흐름과 결혼 타이밍 분석" },
            { icon: "💚", title: "2026 건강·체력운", desc: "올해 건강에 특히 신경 써야 할 부분과 시기" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#c2410c", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #f97316, #c2410c)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>2026 내 사주 지금 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 2026 사주 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#c2410c", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🔥 시작하기</Link>
      </div>
    </main>
  );
}
