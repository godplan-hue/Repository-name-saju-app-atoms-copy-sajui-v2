import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "온라인 사주 | 점운 — 집에서 보는 AI 사주 분석",
  description: "온라인 사주를 집에서 편하게 받아보세요. 생년월일 입력만 하면 AI가 즉시 분석해드려요. 990원부터 시작.",
  keywords: ["온라인사주", "온라인 사주", "인터넷 사주", "집에서 사주", "모바일 사주", "사주 보기"],
  openGraph: { title: "온라인 사주 — 점운", description: "집에서 보는 AI 사주 분석. 즉시 결과 확인.", url: "https://jeomun.com/online-saju" },
  alternates: { canonical: "https://jeomun.com/online-saju" },
};
export default function OnlineSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #e2e8f0, #f8fafc)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#334155", margin: "0 0 10px" }}>💻 온라인 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>집에서 편하게<br />사주 보기</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>생년월일 입력만 하면 즉시 분석<br />점집 안 가도 돼요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #475569, #1e293b)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(71,85,105,0.35)" }}>💻 온라인 사주 보기 — ₩990~</Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 앱 설치 불필요</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "⚡", title: "즉시 분석", desc: "생년월일 입력 후 바로 결과 — 기다림 없음" }, { icon: "📱", title: "모바일 최적화", desc: "스마트폰으로 언제 어디서나 편하게" }, { icon: "🔒", title: "안전한 개인정보", desc: "생년월일만 필요 — 연락처 불필요" }, { icon: "💾", title: "보관함 저장", desc: "구매한 사주 결과 언제든 재열람" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #475569, #1e293b)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>지금 바로 사주 보기</p>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: "0 0 20px" }}>990원 · 즉시 결과 · 앱 불필요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#1e293b", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>💻 시작하기</Link>
      </div>
    </main>
  );
}
