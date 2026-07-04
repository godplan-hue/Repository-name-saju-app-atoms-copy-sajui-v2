import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "연애운 사주 | 점운 — AI가 분석하는 내 연애 기운",
  description: "연애운을 사주로 확인해보세요. 솔로 탈출 시기, 현재 연애 진단, 이상형 분석까지 AI가 내 연애 기운을 분석해드려요.",
  keywords: ["연애운 사주", "연애 사주", "사주 연애운", "솔로 탈출 사주", "연애운 보기", "연애 운세"],
  openGraph: { title: "연애운 사주 — 점운", description: "AI가 분석하는 내 연애 기운. 솔로 탈출 시기부터 궁합까지.", url: "https://jeomun.com/love-saju" },
};

const faqs = [
  { q: "솔로인데 올해 만남이 생길까요?", a: "사주에서 인성·재성·도화살이 활성화되는 해에 인연이 움직여요. AI 사주로 올해 내 인연 기운을 확인해보세요." },
  { q: "현재 연인과 잘 될 수 있을까요?", a: "두 사람의 사주 궁합과 현재 세운 흐름을 보면 연애의 방향성을 파악할 수 있어요." },
  { q: "이별 후 재회 가능성은요?", a: "상대와의 합충 관계와 내 연애운 흐름을 보면 재회 가능성과 시기를 짚을 수 있어요." },
  { q: "결혼은 언제쯤 될까요?", a: "배우자운과 결혼 시기는 대운·세운에서 확인할 수 있어요. 베이직 이상 패키지에서 자세히 볼 수 있어요." },
];

export default function LoveSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff5f8", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fce7f3, #fff5f8)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#db2777", margin: "0 0 10px" }}>💕 연애운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>내 연애운<br />AI 사주로 확인해요</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>솔로 탈출 시기 · 현재 연애 진단 · 이상형<br />AI가 내 연애 기운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #ec4899, #db2777)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
          💕 연애운 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 1분 완성 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>연애운에서 보는 것들</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🌸", title: "인연 오는 시기", desc: "올해 이성 인연이 움직이는 달과 시기" },
            { icon: "💑", title: "현재 연애 진단", desc: "현재 연애가 깊어질지, 변화가 올지 흐름 분석" },
            { icon: "💍", title: "결혼 타이밍", desc: "결혼하기 좋은 시기와 배우자 인연 기운" },
            { icon: "💔", title: "이별·재회 분석", desc: "이별 위기 시기와 재회 가능성 파악" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#db2777", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #ec4899, #db2777)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 연애운 지금 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 연애운 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#db2777", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>💕 시작하기</Link>
      </div>
    </main>
  );
}
