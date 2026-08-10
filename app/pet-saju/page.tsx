import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "반려동물 궁합 | 점운 — 나와 우리 강아지·고양이 궁합",
  description: "반려동물 궁합을 사주로 확인해보세요. 내 사주와 강아지·고양이의 띠 궁합, 애견 궁합을 AI가 분석해드려요.",
  keywords: ["반려동물 궁합", "애견 궁합", "강아지 궁합", "고양이 궁합", "동물 궁합", "펫 사주"],
  openGraph: { title: "반려동물 궁합 — 점운", description: "나와 반려동물의 사주 궁합. 강아지·고양이 띠 궁합 분석.", url: "https://jeomun.com/pet-saju" },
  alternates: { canonical: "https://jeomun.com/pet-saju" },
};

const faqs = [
  { q: "반려동물 궁합을 사주로 볼 수 있나요?", a: "반려동물의 띠와 내 사주의 합충 관계를 분석할 수 있어요. 어떤 띠의 동물이 내 기운과 잘 맞는지 확인해보세요." },
  { q: "강아지 생일을 알아야 하나요?", a: "태어난 연도(띠)만 알아도 기본 궁합 분석이 가능해요. 정확한 생년월일을 알면 더 세밀한 분석을 받을 수 있어요." },
  { q: "어떤 띠의 강아지가 나와 잘 맞나요?", a: "내 사주 일간과 합(合)이 되는 지지의 띠 동물이 잘 맞아요. 내 사주를 분석하면 맞는 띠를 알 수 있어요." },
  { q: "반려동물 입양 시기도 알 수 있나요?", a: "내 운세 흐름에서 반려동물과 인연이 좋은 시기를 참고할 수 있어요." },
];

export default function PetSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff7f0", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ffe0cc, #fff7f0)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#c2410c", margin: "0 0 10px" }}>🐶 반려동물 궁합</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>나와 우리 강아지·고양이<br />궁합이 맞을까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>반려동물 띠 궁합 분석<br />내 사주와 반려동물의 기운이 잘 맞는지 확인해요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f97316, #c2410c)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(249,115,22,0.35)" }}>
          🐶 반려동물 궁합 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>반려동물 궁합 분석</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🐕", title: "강아지 궁합", desc: "내 사주와 반려견의 띠 합충 관계 분석" },
            { icon: "🐈", title: "고양이 궁합", desc: "내 사주와 반려묘의 기운이 잘 맞는지 확인" },
            { icon: "❤️", title: "나와 잘 맞는 띠", desc: "내 사주 기운과 잘 어울리는 동물 띠 추천" },
            { icon: "🏠", title: "입양 시기", desc: "반려동물을 맞이하기 좋은 운세 시기 파악" },
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
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>반려동물 궁합 지금 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 반려동물 궁합 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#c2410c", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🐶 시작하기</Link>
      </div>
    </main>
  );
}
