import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "전체 사주 | 점운 — 모든 운세 한번에 완전 분석",
  description: "전체 사주를 한번에 받아보세요. 재물·연애·건강·직업·배우자·자녀운까지 모든 운세를 AI가 완전 분석해드려요.",
  keywords: ["전체 사주", "사주 전체 분석", "완전 사주", "모든 운세", "VIP 사주", "사주 풀패키지"],
  openGraph: { title: "전체 사주 — 점운", description: "모든 운세 한번에. 재물·연애·건강·직업 완전 분석.", url: "https://jeomun.com/full-saju" },
  alternates: { canonical: "https://jeomun.com/full-saju" },
};

const faqs = [
  { q: "전체 사주에는 뭐가 포함되나요?", a: "재물운·연애운·건강운·직업운·배우자운·부모운·자녀운·올해운세·30일 로드맵·대운까지 모든 분석이 포함돼요." },
  { q: "얼마인가요?", a: "VIP 패키지 9,900원으로 전체 사주를 받을 수 있어요. 개별 구매보다 훨씬 저렴해요." },
  { q: "전체 사주는 시간이 오래 걸리나요?", a: "아니에요, AI 엔진으로 즉시 분석해드려요. 생년월일시 입력 후 1분 안에 모든 결과를 확인할 수 있어요." },
  { q: "한 번만 볼 수 있나요?", a: "구매 후 보관함에 저장돼서 언제든지 다시 볼 수 있어요." },
];

export default function FullSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff1f2", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #ffe4e6, #fff1f2)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#be123c", margin: "0 0 10px" }}>👑 전체 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>전체 사주<br />한번에 완전 분석</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>재물·연애·건강·직업·배우자·자녀까지<br />모든 운세를 AI가 완전 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f43f5e, #be123c)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(244,63,94,0.35)" }}>
          👑 전체 사주 받기 — ₩9,900
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 보관함 저장 · 모든 운세 포함</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 20 }}>전체 사주에 포함된 것들</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {["💰 재물운", "💕 연애운", "💚 건강운", "💼 직업운", "💍 배우자운", "👨‍👩‍👧 자녀운", "👪 부모·형제운", "📅 올해운세", "📆 월별 운세", "🗓️ 30일 로드맵"].map(item => (
            <div key={item} style={{ background: "white", borderRadius: 12, padding: "12px 14px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", fontWeight: 700, fontSize: 13 }}>{item}</div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 20 }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map(f => (
            <div key={f.q} style={{ background: "white", borderRadius: 14, padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontWeight: 800, fontSize: 14, color: "#be123c", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #f43f5e, #be123c)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>전체 사주 지금 받기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 9,900원 전체 완전 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#be123c", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>👑 시작하기</Link>
      </div>
    </main>
  );
}
