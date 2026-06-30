import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "결혼운 사주 | 점운 — 결혼 시기와 배우자 인연",
  description: "AI 사주로 내 결혼 시기와 배우자 인연을 알아보세요. 언제 결혼하면 좋은지, 어떤 사람이 잘 맞는지 990원에 확인해보세요.",
  keywords: ["결혼운 사주", "결혼 시기 사주", "배우자운", "2026 결혼운", "결혼 사주", "배우자 인연"],
  openGraph: {
    title: "결혼운 사주 — 점운",
    description: "AI가 분석하는 내 결혼 시기와 배우자 인연. 990원으로 시작해요.",
    url: "https://jeomun.com/marriage",
  },
};

const faqs = [
  { q: "저는 언제 결혼할 수 있을까요?", a: "사주에서 관성(官星)과 배우자궁이 활성화되는 시기에 결혼 인연이 옵니다. 대운·세운 흐름과 함께 보면 결혼 최적 시기를 파악할 수 있어요." },
  { q: "어떤 사람이 저와 잘 맞나요?", a: "사주 원국에서 내 일주(日柱)와 합이 잘 맞는 띠·오행을 가진 사람이 인연이에요. 배우자운 분석에서 자세히 알려드려요." },
  { q: "늦은 나이에도 결혼할 수 있을까요?", a: "사주는 나이를 가리지 않아요. 인연이 오는 시기가 사람마다 다를 뿐, 흐름을 알고 준비하는 것이 중요합니다." },
  { q: "궁합 분석도 가능한가요?", a: "상대방 생년월일이 있다면 두 사람의 사주 궁합 분석도 함께 제공해드려요. 베이직 이상 패키지에서 확인 가능합니다." },
];

export default function MarriagePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff8f0", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fef3c7, #fffbeb)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#d97706", margin: "0 0 10px" }}>💍 결혼운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>
          나는 언제<br />결혼할 수 있을까?
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>
          결혼 최적 시기 · 배우자 인연 유형 · 궁합<br />AI 사주가 내 결혼 기운을 분석해드려요
        </p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(245,158,11,0.35)" }}>
          💍 결혼운 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>AI가 즉시 분석 · 1분 완성 · 무료 맛보기 제공</p>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>결혼운 분석으로 알 수 있는 것</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "💍", title: "결혼 최적 시기", desc: "언제 인연이 오고, 언제 결혼하면 좋은지 대운·세운으로 분석" },
            { icon: "👫", title: "배우자 인연 유형", desc: "나와 궁합이 잘 맞는 상대의 오행·성격·직업 유형" },
            { icon: "🔮", title: "결혼 궁합", desc: "상대방 생년월일로 두 사람의 사주 궁합 점수 확인" },
            { icon: "📅", title: "결혼 후 삶", desc: "결혼 후 재물운·가정운·자녀운 흐름 미리 보기" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#d97706", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, #f59e0b, #ec4899)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 결혼 시기 지금 확인하기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 오늘의 운세 → 990원 결혼운 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#d97706", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          💍 시작하기
        </Link>
      </div>
    </main>
  );
}
