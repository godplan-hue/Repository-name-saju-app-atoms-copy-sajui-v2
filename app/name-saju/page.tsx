import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이름 사주 | 점운 — 이름과 사주로 보는 내 운명",
  description: "이름과 사주를 함께 분석해보세요. 이름의 한자 오행과 사주 오행의 조화를 AI가 분석해드려요.",
  keywords: ["이름 사주", "사주 이름", "이름 분석 사주", "이름 운세", "이름 오행", "작명 사주"],
  openGraph: { title: "이름 사주 — 점운", description: "이름과 사주 오행의 조화. AI가 내 이름 기운을 분석.", url: "https://jeomun.com/name-saju" },
};

const faqs = [
  { q: "이름이 운명에 영향을 주나요?", a: "이름의 한자 획수와 오행이 사주 기운과 맞으면 운을 보완해줄 수 있어요. 이름 오행이 사주의 부족한 기운을 채워주면 좋아요." },
  { q: "이름을 바꾸면 운이 좋아지나요?", a: "이름은 자주 불릴수록 기운이 쌓여요. 사주와 맞는 이름이 장기적으로 운에 좋은 영향을 줄 수 있어요." },
  { q: "아이 작명에도 활용할 수 있나요?", a: "네, 태어난 사주 원국에 맞는 이름의 방향을 제안해드릴 수 있어요. 최종 작명은 전문 작명가와 함께하세요." },
  { q: "한글 이름도 분석되나요?", a: "한자 이름과 한글 이름 모두 분석 가능해요. 이름의 음(音) 오행도 함께 분석해드려요." },
];

export default function NameSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", margin: "0 0 10px" }}>✍️ 이름 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>내 이름과 사주<br />궁합이 맞을까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>이름 오행과 사주 오행의 조화<br />AI가 내 이름 기운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(34,197,94,0.35)" }}>
          ✍️ 이름 사주 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>이름 사주 분석 내용</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🔤", title: "이름 오행 분석", desc: "이름 한자·한글의 오행(목화토금수) 분석" },
            { icon: "⚖️", title: "사주와의 조화", desc: "내 사주 오행과 이름 오행이 잘 맞는지 확인" },
            { icon: "✨", title: "이름 보완 방향", desc: "사주의 부족한 기운을 이름으로 보완하는 방법" },
            { icon: "👶", title: "아이 작명 방향", desc: "태어난 사주에 맞는 이름의 오행 방향 제안" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#16a34a", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>이름 사주 지금 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 이름·사주 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#16a34a", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>✍️ 시작하기</Link>
      </div>
    </main>
  );
}
