import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "타로 운세 | 점운 — AI 타로 + 사주 분석",
  description: "타로 운세와 AI 사주를 함께 확인해보세요. 연애·재물·직업 타로 카드 운세를 무료로 받아보세요.",
  keywords: ["타로", "타로 운세", "무료 타로", "AI 타로", "타로 카드", "온라인 타로"],
  openGraph: { title: "타로 운세 — 점운", description: "AI 타로 + 사주 분석. 연애·재물·직업 운세 확인.", url: "https://jeomun.com/tarot" },
};
const faqs = [
  { q: "타로와 사주의 차이는요?", a: "타로는 카드 상징으로 현재 상황과 흐름을 보고, 사주는 생년월일로 타고난 운명과 운세 흐름을 봐요. 두 가지를 함께 보면 더 입체적으로 파악할 수 있어요." },
  { q: "타로는 무료인가요?", a: "점운에서 기본 운세는 무료로 제공해요. 더 자세한 분석은 990원부터 가능해요." },
  { q: "타로가 정확한가요?", a: "타로는 현재 에너지와 흐름을 반영해요. 절대적 예언이 아닌 참고 도구로 활용하면 좋아요." },
  { q: "연애 타로도 볼 수 있나요?", a: "네, 연애·재물·직업·건강 등 다양한 분야의 타로 운세를 확인할 수 있어요." },
];
export default function TarotPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#1e1b4b", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#f5f3ff" }}>
      <div style={{ background: "linear-gradient(135deg, #312e81, #1e1b4b)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc", margin: "0 0 10px" }}>🃏 타로 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#f5f3ff", margin: "0 0 12px", lineHeight: 1.25 }}>타로 카드가 말하는<br />지금 내 운세</h1>
        <p style={{ fontSize: 15, color: "#a5b4fc", margin: "0 0 28px", lineHeight: 1.7 }}>AI 타로 + 사주 분석 결합<br />연애·재물·직업 운세를 확인해보세요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #818cf8, #6366f1)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(129,140,248,0.4)" }}>🃏 타로 운세 보기 — 무료~</Link>
        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 10 }}>즉시 분석 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", margin: "40px 0 20px", color: "#f5f3ff" }}>자주 묻는 질문</h2>
        {faqs.map(f => (
          <div key={f.q} style={{ background: "#312e81", borderRadius: 14, padding: "18px", marginBottom: 12 }}>
            <p style={{ fontWeight: 800, fontSize: 14, color: "#a5b4fc", margin: "0 0 6px" }}>Q. {f.q}</p>
            <p style={{ fontSize: 13, color: "#c7d2fe", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #818cf8, #6366f1)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>타로 + 사주 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#6366f1", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🃏 시작하기</Link>
      </div>
    </main>
  );
}
