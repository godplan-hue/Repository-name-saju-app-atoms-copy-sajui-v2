import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "건강운 사주 | 점운 — AI가 알려주는 내 건강 기운",
  description: "건강운을 사주로 확인해보세요. 내 몸에 취약한 부분, 조심해야 할 시기를 AI 사주로 미리 알 수 있어요.",
  keywords: ["건강운 사주", "건강 운세", "사주 건강운", "몸 사주", "건강 사주 풀이", "AI 건강운"],
  openGraph: { title: "건강운 사주 — 점운", description: "AI 사주로 보는 내 건강 기운. 취약한 부분과 조심할 시기 확인.", url: "https://jeomun.com/health-saju" },
  alternates: { canonical: "https://jeomun.com/health-saju" },
};

const faqs = [
  { q: "사주로 건강을 볼 수 있나요?", a: "사주 오행(五行)에서 각 장기와 신체 부위의 기운을 볼 수 있어요. 어떤 오행이 약한지 보면 주의해야 할 부분을 알 수 있어요." },
  { q: "어떤 부분을 분석해주나요?", a: "오행 균형에 따른 취약 장기, 조심해야 할 계절·시기, 건강 관리 조언을 제공해요." },
  { q: "아프면 사주를 봐야 하나요?", a: "사주는 참고 자료예요. 아프면 병원을 먼저 가세요. 사주는 경향성과 취약점을 미리 파악하는 용도로 활용해요." },
  { q: "건강운이 나쁜 해가 있나요?", a: "네, 대운·세운에 따라 건강에 조심해야 할 시기가 있어요. 미리 알면 생활습관을 개선하거나 검진을 받는 계기가 돼요." },
];

export default function HealthSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0fdfa", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ccfbf1, #f0fdfa)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0d9488", margin: "0 0 10px" }}>💚 건강운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>내 몸에 취약한 부분<br />사주로 미리 알아요</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>오행으로 보는 건강 기운<br />조심해야 할 시기와 부위를 알려드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #14b8a6, #0d9488)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(20,184,166,0.35)" }}>
          💚 건강운 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 1분 완성 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>건강운에서 보는 것들</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🫀", title: "오행별 취약 장기", desc: "목·화·토·금·수 오행 균형으로 약한 신체 부위 파악" },
            { icon: "📅", title: "조심해야 할 시기", desc: "건강에 특히 주의가 필요한 달·계절·대운 시기" },
            { icon: "🌿", title: "건강 관리 조언", desc: "내 사주 체질에 맞는 생활습관·음식·운동 방향" },
            { icon: "⚡", title: "체력·에너지 흐름", desc: "올해 체력 기운이 강한지 약한지 전체 흐름 확인" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#0d9488", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #14b8a6, #0d9488)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 건강운 지금 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 건강운 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#0d9488", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>💚 시작하기</Link>
      </div>
    </main>
  );
}
