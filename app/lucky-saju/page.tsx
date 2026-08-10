import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "행운 사주 | 점운 — AI로 찾는 내 행운의 날·색·방향",
  description: "행운 사주로 내 행운의 날, 색깔, 방향, 숫자를 확인해보세요. AI가 내 사주에서 행운 요소를 뽑아 알려드려요.",
  keywords: ["행운 사주", "사주 행운", "행운의 날", "행운색", "사주 행운색", "행운 방향"],
  openGraph: { title: "행운 사주 — 점운", description: "내 사주에서 찾는 행운의 날·색·방향·숫자. AI 분석.", url: "https://jeomun.com/lucky-saju" },
  alternates: { canonical: "https://jeomun.com/lucky-saju" },
};

const faqs = [
  { q: "사주로 행운을 알 수 있나요?", a: "네, 내 사주 오행 구조에서 부족한 기운을 보완해주는 색·방향·숫자가 있어요. 이를 활용하면 운을 더 좋게 만들 수 있어요." },
  { q: "행운색은 어떻게 활용하나요?", a: "옷·소품·인테리어에 활용하면 좋아요. 중요한 날 행운색 옷을 입거나, 지갑을 행운색으로 바꾸는 것도 방법이에요." },
  { q: "행운의 날은 매년 같은가요?", a: "아니에요, 대운·세운에 따라 매년 달라져요. 내 기운이 가장 강한 날짜와 시간이 해마다 변해요." },
  { q: "효과가 있나요?", a: "사주 오행 균형에서 나온 근거 있는 분석이에요. 믿고 활용하면 심리적으로도 긍정적인 효과가 있어요." },
];

export default function LuckySajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdfce4", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fef9c3, #fdfce4)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#a16207", margin: "0 0 10px" }}>🍀 행운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>내 행운의 날·색·방향<br />사주에서 찾아요</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>오행 분석으로 찾는 나만의 행운 요소<br />AI가 내 사주에서 뽑아드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #eab308, #a16207)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(234,179,8,0.35)" }}>
          🍀 행운 사주 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>나만의 행운 요소</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🎨", title: "행운색", desc: "내 오행에서 부족한 기운을 보완해주는 색깔" },
            { icon: "🧭", title: "행운 방향", desc: "내게 좋은 기운이 오는 방향 — 책상·침대 배치에 활용" },
            { icon: "🔢", title: "행운 숫자", desc: "내 사주와 맞는 숫자 — 비밀번호·날짜 선택에 참고" },
            { icon: "📅", title: "행운의 날", desc: "올해 내 기운이 가장 강한 날과 중요한 일 하기 좋은 날" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#a16207", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #eab308, #a16207)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 행운 요소 지금 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 행운 사주 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#a16207", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🍀 시작하기</Link>
      </div>
    </main>
  );
}
