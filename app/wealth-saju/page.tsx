import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "재물운 사주 | 점운 — AI가 알려주는 내 돈 기운",
  description: "재물운을 사주로 확인해보세요. 올해 돈이 들어오는지, 투자는 언제 해야 하는지 AI 사주가 분석해드려요. 990원부터.",
  keywords: ["재물운 사주", "사주 재물운", "돈 운세", "재물운 보기", "AI 재물운", "재물운 2026"],
  openGraph: { title: "재물운 사주 — 점운", description: "AI가 분석하는 내 재물운. 돈이 들어오는 시기 확인. 990원~", url: "https://jeomun.com/wealth-saju" },
};

const faqs = [
  { q: "재물운이 좋은 해를 알 수 있나요?", a: "네, 내 사주 재성(財星) 흐름과 세운을 보면 돈이 들어오기 좋은 해와 조심해야 할 해를 알 수 있어요." },
  { q: "투자 시기도 알 수 있나요?", a: "재물운 흐름에서 기운이 강한 시기를 참고할 수 있어요. 하지만 투자는 반드시 전문가 상담과 함께하세요." },
  { q: "재물운이 나쁜 해엔 어떻게 해야 하나요?", a: "큰 지출과 투자를 자제하고 종잣돈을 모으는 시기로 활용하세요. 나쁜 재물운을 미리 알면 대비할 수 있어요." },
  { q: "사업운도 볼 수 있나요?", a: "재물운 안에 사업·부업 흐름도 포함돼요. 창업·확장 타이밍을 사주로 참고해보세요." },
];

export default function WealthSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fefce8", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fef9c3, #fefce8)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#ca8a04", margin: "0 0 10px" }}>💰 재물운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>올해 돈이 들어올까?<br />재물운 사주로 확인</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>돈 들어오는 시기·투자 타이밍·재물 체질<br />AI가 내 재물 기운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #eab308, #ca8a04)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(234,179,8,0.35)" }}>
          💰 재물운 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 1분 완성 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>재물운에서 보는 것들</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "💵", title: "돈 들어오는 시기", desc: "올해·내년 재물이 들어오기 좋은 달과 시기" },
            { icon: "📈", title: "투자·사업 타이밍", desc: "확장해도 되는 시기 vs 보수적으로 가야 할 시기" },
            { icon: "🏦", title: "재물 체질 분석", desc: "나는 모으는 타입인지, 쓰는 타입인지 사주로 파악" },
            { icon: "⚠️", title: "재물 손실 조심", desc: "큰 지출이나 손해가 우려되는 시기 미리 파악" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#ca8a04", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #eab308, #ca8a04)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 재물운 지금 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 재물운 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#ca8a04", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>💰 시작하기</Link>
      </div>
    </main>
  );
}
