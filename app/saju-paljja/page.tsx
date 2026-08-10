import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "사주팔자 | 점운 — 내 사주팔자 AI로 완전 분석",
  description: "사주팔자를 AI로 분석해보세요. 8글자 사주팔자가 말하는 내 타고난 운명과 운세 흐름을 확인하세요.",
  keywords: ["사주팔자", "사주 팔자", "팔자 보기", "내 팔자", "사주팔자 분석", "무료 사주팔자"],
  openGraph: { title: "사주팔자 — 점운", description: "내 사주팔자 8글자 완전 분석. AI가 풀어드려요.", url: "https://jeomun.com/saju-paljja" },
  alternates: { canonical: "https://jeomun.com/saju-paljja" },
};
const faqs = [
  { q: "사주팔자가 뭔가요?", a: "태어난 연·월·일·시의 네 기둥(四柱)에서 나온 여덟 글자(八字)를 사주팔자라고 해요. 이 8글자가 내 운명의 틀이에요." },
  { q: "팔자를 고칠 수 있나요?", a: "타고난 사주를 바꿀 순 없지만, 흐름을 알고 대비하면 운을 최대한 활용할 수 있어요. 팔자를 아는 것이 곧 개운(開運)의 시작이에요." },
  { q: "팔자가 나쁘면 어떻게 하나요?", a: "나쁜 팔자도 미리 알면 준비할 수 있어요. 좋은 시기를 극대화하고 나쁜 시기를 최소화하는 지혜가 사주를 보는 이유예요." },
  { q: "사주팔자가 같은 사람도 있나요?", a: "같은 날·시에 태어나도 환경이 달라 다르게 발현돼요. 하지만 기본 기운 구조는 비슷해요." },
];
export default function SajuPaljjaPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf4ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #f3e8ff, #fdf4ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#7e22ce", margin: "0 0 10px" }}>🔮 사주팔자</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>내 사주팔자<br />8글자의 비밀</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>연·월·일·시 8글자로 보는 내 운명<br />AI가 사주팔자를 쉽게 풀어드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #9333ea, #7e22ce)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(147,51,234,0.35)" }}>🔮 사주팔자 보기 — ₩990~</Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", margin: "40px 0 20px" }}>자주 묻는 질문</h2>
        {faqs.map(f => (
          <div key={f.q} style={{ background: "white", borderRadius: 14, padding: "18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ fontWeight: 800, fontSize: 14, color: "#7e22ce", margin: "0 0 6px" }}>Q. {f.q}</p>
            <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #9333ea, #7e22ce)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>내 사주팔자 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#7e22ce", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🔮 시작하기</Link>
      </div>
    </main>
  );
}
