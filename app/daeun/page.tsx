import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "대운 사주 | 점운 — 10년 단위 내 인생 큰 흐름",
  description: "대운(大運)으로 내 인생의 10년 큰 흐름을 확인해보세요. 언제 기회가 오고, 언제 조심해야 하는지 AI가 분석해드려요.",
  keywords: ["대운 사주", "대운 보기", "사주 대운", "10년 운세", "대운 분석", "인생 흐름 사주"],
  openGraph: { title: "대운 사주 — 점운", description: "10년 단위 인생 큰 흐름. AI가 대운을 분석해드려요.", url: "https://jeomun.com/daeun" },
  alternates: { canonical: "https://jeomun.com/daeun" },
};

const faqs = [
  { q: "대운이 뭔가요?", a: "대운(大運)은 10년 단위로 바뀌는 큰 운의 흐름이에요. 태어난 생년월일에 따라 각자 대운이 시작되는 나이와 내용이 달라요." },
  { q: "대운이 나쁜 시기에는 어떻게 해야 하나요?", a: "나쁜 대운이라도 미리 알면 대비할 수 있어요. 무리한 투자나 큰 결정을 피하고, 실력을 쌓는 시기로 활용하면 돼요." },
  { q: "대운은 몇 살부터 시작하나요?", a: "사람마다 달라요. 보통 3~8세 사이에 첫 대운이 시작돼요. 내 사주를 계산해야 정확한 시작 나이를 알 수 있어요." },
  { q: "대운과 세운의 차이는?", a: "대운은 10년 큰 흐름, 세운은 1년 단위 흐름이에요. 대운이 좋아도 세운이 나쁜 해는 힘들 수 있고, 반대도 마찬가지예요." },
];

export default function DaeunPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #dbeafe, #f0f4ff)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", margin: "0 0 10px" }}>🌊 대운 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>내 인생 10년 흐름<br />대운으로 미리 보기</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>언제 기회가 오고 언제 조심해야 하는지<br />AI가 10년 단위로 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(59,130,246,0.35)" }}>
          🌊 대운 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 10년 단위 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>대운에서 보는 것들</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "📈", title: "인생 상승기", desc: "내 인생에서 기운이 강해지고 기회가 많은 대운 시기" },
            { icon: "🛡️", title: "조심해야 할 시기", desc: "큰 결정을 피하고 준비에 집중해야 할 대운 시기" },
            { icon: "💼", title: "커리어 전환 시기", desc: "직업·사업 변화가 유리한 대운과 불리한 대운" },
            { icon: "💕", title: "결혼·인연 시기", desc: "인연이 오고 결혼하기 좋은 대운 파악" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#1d4ed8", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 대운 지금 확인하기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 대운 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#1d4ed8", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🌊 시작하기</Link>
      </div>
    </main>
  );
}
