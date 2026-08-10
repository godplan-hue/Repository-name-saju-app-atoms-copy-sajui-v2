import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "990원 사주 | 점운 — AI 사주 단돈 990원",
  description: "990원으로 AI 사주 분석을 받아보세요. 재물운·연애운·직업운·건강운까지 내 사주 전체를 990원부터 확인할 수 있어요.",
  keywords: ["990원 사주", "저렴한 사주", "사주 990원", "990원 운세", "AI 사주 저렴", "싼 사주"],
  openGraph: {
    title: "990원 사주 — 점운",
    description: "AI 사주 단돈 990원. 재물운·연애운·직업운 전부 다 볼 수 있어요.",
    url: "https://jeomun.com/saju-990",
  },
  alternates: { canonical: "https://jeomun.com/saju-990" },
};

const faqs = [
  { q: "990원에 어디까지 볼 수 있나요?", a: "990원 기본분석으로 사주 원국 + 오늘의 운세 + 재물·연애·건강·성공운 핵심 요약을 받을 수 있어요. 더 자세한 내용은 베이직·프리미엄 패키지로 확인하세요." },
  { q: "다른 사주앱보다 왜 싼 건가요?", a: "점운은 AI 엔진 기반이라 상담사 인건비가 없어요. 비용을 절감해 사용자에게 더 저렴하게 제공할 수 있어요." },
  { q: "990원짜리가 정확한가요?", a: "만세력 기반 정밀 계산 + 수천 개 콘텐츠 DB로 만든 분석이에요. 가격이 싸다고 내용이 부실하지 않아요." },
  { q: "결제는 어떻게 하나요?", a: "카드·카카오페이·토스페이 등 간편결제 가능해요. 생년월일 입력 후 바로 결제하면 즉시 결과를 볼 수 있어요." },
];

export default function Saju990Page() {
  return (
    <main style={{ minHeight: "100vh", background: "#fefce8", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      {/* 히어로 */}
      <div style={{ background: "linear-gradient(135deg, #fef9c3, #fefce8)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#ca8a04", margin: "0 0 10px", letterSpacing: 0.5 }}>💰 990원 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>
          AI 사주 분석<br />단돈 990원
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>
          재물운 · 연애운 · 직업운 · 건강운<br />내 사주의 모든 것을 990원부터 확인해요
        </p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #eab308, #ca8a04)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(234,179,8,0.35)" }}>
          🔮 990원 사주 시작하기
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>AI가 즉시 분석 · 1분 완성 · 무료 맛보기 제공</p>
      </div>

      {/* 가격표 */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24, color: "#1f2937" }}>가격이 이게 맞아?</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "기본 분석", price: "990원", desc: "사주 원국 + 재물·연애·건강·성공운 핵심 요약", highlight: true },
            { name: "베이직 패키지", price: "3,900원", desc: "기본 분석 + 직업운·배우자운·올해운세 포함" },
            { name: "프리미엄 패키지", price: "6,900원", desc: "전체 운세 + 부모·형제·자녀운·30일 로드맵" },
            { name: "VIP 패키지", price: "9,900원", desc: "모든 운세 + 대운 흐름까지 완전 분석" },
          ].map(p => (
            <div key={p.name} style={{ background: p.highlight ? "linear-gradient(135deg, #fef9c3, #fefce8)" : "white", borderRadius: 14, padding: "16px 18px", boxShadow: p.highlight ? "0 4px 16px rgba(234,179,8,0.2)" : "0 2px 8px rgba(0,0,0,0.06)", border: p.highlight ? "2px solid #eab308" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px", color: "#1f2937" }}>{p.name} {p.highlight && "⭐"}</p>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{p.desc}</p>
              </div>
              <p style={{ fontWeight: 900, fontSize: 18, color: p.highlight ? "#ca8a04" : "#1f2937", margin: 0, whiteSpace: "nowrap" }}>{p.price}</p>
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#ca8a04", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 CTA */}
      <div style={{ background: "linear-gradient(135deg, #eab308, #ca8a04)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>지금 990원으로 시작하기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 오늘의 운세 먼저 → 990원 기본분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#ca8a04", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          🔮 시작하기
        </Link>
      </div>
    </main>
  );
}
