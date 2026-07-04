import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "만세력 | 점운 — AI 만세력으로 내 사주 계산",
  description: "만세력으로 내 사주를 계산해보세요. 생년월일시를 입력하면 연·월·일·시주 8글자를 AI가 정밀하게 계산해드려요.",
  keywords: ["만세력", "사주 만세력", "만세력 계산", "만세력 보기", "온라인 만세력", "무료 만세력"],
  openGraph: { title: "만세력 — 점운", description: "AI 만세력으로 내 사주 8글자 정밀 계산. 무료.", url: "https://jeomun.com/mansei" },
};

const faqs = [
  { q: "만세력이 뭔가요?", a: "음양력을 기반으로 태어난 연·월·일·시를 60갑자로 변환하는 달력 체계예요. 사주 계산의 기본 도구예요." },
  { q: "만세력은 무료인가요?", a: "네, 점운에서 만세력 기반 사주 원국 계산은 무료로 제공해요. 생년월일시를 입력하면 바로 확인할 수 있어요." },
  { q: "출생 시간을 모르면요?", a: "시간을 모르면 시주(時柱) 없이 6글자로 분석해요. 시간을 알면 더 정확한 8글자 분석이 가능해요." },
  { q: "만세력과 사주는 같은 건가요?", a: "만세력은 사주를 계산하기 위한 도구예요. 만세력으로 8글자를 뽑은 후, 그 글자를 해석하는 게 사주 분석이에요." },
];

export default function ManseiPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f5f3ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ddd6fe, #f5f3ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#6d28d9", margin: "0 0 10px" }}>📊 만세력</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>AI 만세력으로<br />내 사주 계산하기</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>생년월일시 입력만으로<br />연·월·일·시주 8글자를 정밀하게 계산해요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(124,58,237,0.35)" }}>
          📊 만세력 계산하기 — 무료
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>완전 무료 · 즉시 계산 · 정밀 분석</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>만세력으로 계산하는 것들</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🏮", title: "연주(年柱)", desc: "태어난 해의 천간·지지 — 조상·부모 기운" },
            { icon: "🌙", title: "월주(月柱)", desc: "태어난 달의 천간·지지 — 형제·환경 기운" },
            { icon: "☀️", title: "일주(日柱)", desc: "태어난 날의 천간·지지 — 나 자신의 기운" },
            { icon: "⏰", title: "시주(時柱)", desc: "태어난 시간의 천간·지지 — 자녀·말년 기운" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#6d28d9", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>만세력 + 사주 분석 함께 받기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 만세력 계산 → 990원 사주 풀이</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#6d28d9", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>📊 시작하기</Link>
      </div>
    </main>
  );
}
