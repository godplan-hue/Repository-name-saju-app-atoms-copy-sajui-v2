import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "택일 사주 | 점운 — 중요한 날 좋은 날 고르기",
  description: "택일(擇日)로 중요한 날을 골라보세요. 결혼·이사·개업·수술 등 중요한 일을 하기 좋은 날을 AI가 사주로 분석해드려요.",
  keywords: ["택일", "택일 사주", "결혼 택일", "이사 택일", "개업 택일", "좋은 날 고르기"],
  openGraph: { title: "택일 사주 — 점운", description: "결혼·이사·개업에 좋은 날 고르기. AI 사주 택일 분석.", url: "https://jeomun.com/taegil" },
  alternates: { canonical: "https://jeomun.com/taegil" },
};

const faqs = [
  { q: "택일이 뭔가요?", a: "택일(擇日)은 중요한 일을 하기 좋은 날을 고르는 것이에요. 내 사주와 날의 기운이 맞는 날을 선택하면 더 좋은 결과를 기대할 수 있어요." },
  { q: "결혼 날짜를 잡을 때 꼭 택일을 해야 하나요?", a: "필수는 아니지만, 사주와 잘 맞는 날을 선택하면 출발이 순조로울 수 있어요. 특히 두 사람의 사주를 함께 보면 더 좋아요." },
  { q: "어떤 날이 좋은 날인가요?", a: "내 일간(日干)과 합(合)이 되거나 기운을 보완해주는 날이 좋아요. 대체로 길신(吉神)이 강한 날을 선택해요." },
  { q: "이사 택일도 볼 수 있나요?", a: "네, 이사·개업·계약·수술 등 다양한 중요한 날의 택일 분석이 가능해요." },
];

export default function TaegilPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #bbf7d0, #f0fdf4)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#15803d", margin: "0 0 10px" }}>📅 택일</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>결혼·이사·개업<br />좋은 날 골라드려요</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>중요한 날, 내 사주와 맞는 날로<br />AI 택일 분석을 받아보세요</p>
        <Link href="/main-v2/taegil" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #22c55e, #15803d)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(34,197,94,0.35)" }}>
          📅 택일 분석 받기 — ₩2,900~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 맞춤 날짜 · 무료 맛보기</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>택일이 필요한 순간</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "💒", title: "결혼 택일", desc: "두 사람 사주에 맞는 결혼 날짜 선택" },
            { icon: "🏠", title: "이사 택일", desc: "새 집으로 이사하기 좋은 날 고르기" },
            { icon: "🏪", title: "개업 택일", desc: "사업·가게 오픈하기 좋은 날 분석" },
            { icon: "✍️", title: "계약·수술 택일", desc: "중요한 계약·수술에 좋은 날 확인" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#15803d", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #22c55e, #15803d)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>좋은 날 지금 골라보기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 2,900원 택일 분석</p>
        <Link href="/main-v2/taegil" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#15803d", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>📅 시작하기</Link>
      </div>
    </main>
  );
}
