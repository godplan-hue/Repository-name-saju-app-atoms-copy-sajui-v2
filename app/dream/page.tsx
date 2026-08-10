import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "꿈해몽 | 점운 — AI가 풀어주는 꿈의 의미",
  description: "꿈해몽을 AI로 확인해보세요. 간밤에 꾼 꿈이 무슨 의미인지 AI가 쉽고 정확하게 풀어드려요.",
  keywords: ["꿈해몽", "꿈 해몽", "꿈 풀이", "AI 꿈해몽", "무료 꿈해몽", "꿈 의미"],
  openGraph: { title: "꿈해몽 — 점운", description: "AI가 풀어주는 꿈의 의미. 간밤의 꿈이 뭘 말하는지 확인.", url: "https://jeomun.com/dream" },
  alternates: { canonical: "https://jeomun.com/dream" },
};

const faqs = [
  { q: "꿈해몽이 실제로 맞나요?", a: "꿈은 무의식과 잠재의식을 반영해요. 꿈해몽은 오랜 동양 전통에서 내려오는 상징 해석이에요. 참고 자료로 활용하면 좋아요." },
  { q: "어떤 꿈을 해몽해주나요?", a: "돼지꿈·뱀꿈·죽음꿈·하늘꿈·물꿈·이빨 빠지는 꿈 등 다양한 꿈의 상징과 의미를 분석해드려요." },
  { q: "태몽도 봐주나요?", a: "네, 태몽도 분석해드려요. 임신·출산과 관련된 꿈의 의미를 확인해보세요." },
  { q: "꿈해몽은 무료인가요?", a: "기본 꿈해몽 확인은 무료로 제공해요. 더 자세한 사주 연계 분석은 유료로 제공해요." },
];

export default function DreamPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf4ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #f3e8ff, #fdf4ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#9333ea", margin: "0 0 10px" }}>🌙 꿈해몽</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>간밤의 꿈<br />무슨 의미일까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>돼지꿈·뱀꿈·태몽·이빨꿈<br />AI가 꿈의 의미를 쉽게 풀어드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #a855f7, #9333ea)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(168,85,247,0.35)" }}>
          🌙 꿈해몽 보기 — 무료
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 무료 · 쉬운 설명</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>자주 찾는 꿈</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {["🐷 돼지꿈", "🐍 뱀꿈", "😬 이빨 빠지는 꿈", "💀 죽는 꿈", "🌊 물꿈", "☁️ 하늘 나는 꿈", "🤰 태몽", "🔥 불꿈"].map(d => (
            <div key={d} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center", fontWeight: 700, fontSize: 14 }}>{d}</div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 20 }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map(f => (
            <div key={f.q} style={{ background: "white", borderRadius: 14, padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontWeight: 800, fontSize: 14, color: "#9333ea", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #a855f7, #9333ea)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>꿈해몽 지금 확인하기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>꿈해몽 무료 + 사주 연계 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#9333ea", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🌙 시작하기</Link>
      </div>
    </main>
  );
}
