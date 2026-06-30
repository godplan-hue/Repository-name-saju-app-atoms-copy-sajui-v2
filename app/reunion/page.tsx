import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "재회 사주 | 점운 — AI로 보는 헤어진 연인과의 재회 가능성",
  description: "헤어진 연인과 다시 만날 수 있을까요? AI 사주로 재회 가능성과 최적 시기를 990원에 확인해보세요.",
  keywords: ["재회 사주", "재회 가능성", "헤어진 연인 재회", "재회 운세", "재회 시기", "연인 재회 사주"],
  openGraph: {
    title: "재회 사주 — 점운",
    description: "헤어진 연인과 재회할 수 있을지 AI 사주로 분석. 990원.",
    url: "https://jeomun.com/reunion",
  },
};

const faqs = [
  { q: "헤어진 사람과 재회할 수 있을까요?", a: "두 사람의 사주에서 합(合)이 다시 활성화되는 시기가 있어요. 그 시기를 알면 언제 연락해야 할지 알 수 있습니다." },
  { q: "재회 확률이 낮은 경우는요?", a: "충(沖)이 강하거나 인연이 끊어지는 흐름이라면 솔직하게 알려드려요. 새로운 인연을 만날 최적 시기도 함께 분석합니다." },
  { q: "재회 후 관계가 잘 유지될까요?", a: "단순 재회보다 중요한 건 관계 지속력이에요. 두 사람의 궁합 흐름을 보면 재결합 후 관계 안정성을 알 수 있어요." },
  { q: "상대방 사주를 몰라도 되나요?", a: "상대방 생년월일을 알면 더 정확하지만, 몰라도 내 사주만으로 현재 인연 기운을 분석해드릴 수 있어요." },
];

export default function ReunionPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf4ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #f3e8ff, #fdf4ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#9333ea", margin: "0 0 10px" }}>🌙 재회 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>
          그 사람과<br />다시 만날 수 있을까?
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>
          재회 가능성 · 최적 연락 시기 · 관계 지속력<br />AI 사주가 두 사람의 인연을 분석해드려요
        </p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #9333ea, #7c3aed)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(147,51,234,0.35)" }}>
          🌙 재회 사주 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>AI가 즉시 분석 · 1분 완성 · 무료 맛보기 제공</p>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>재회 사주로 알 수 있는 것</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🌙", title: "재회 가능성", desc: "두 사람의 인연이 아직 남아있는지, 흐름이 만남 쪽인지" },
            { icon: "📅", title: "최적 연락 시기", desc: "언제 연락하면 상대방 마음이 열리는지 시기 분석" },
            { icon: "💜", title: "관계 지속력", desc: "재결합 후 오래 갈 수 있는지 두 사람 궁합 흐름 분석" },
            { icon: "✨", title: "새 인연 시기", desc: "재회가 어렵다면 새 인연이 오는 시기도 함께 확인" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#9333ea", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, #9333ea, #ec4899)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>재회 가능성 지금 확인하기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 오늘의 운세 → 990원 연애운 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#9333ea", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          🌙 시작하기
        </Link>
      </div>
    </main>
  );
}
