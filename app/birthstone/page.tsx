import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "탄생석 운세 | 점운 — 생년월일 탄생석 AI 분석",
  description: "탄생석과 사주를 함께 확인해보세요. 내 탄생석의 의미와 행운 기운을 AI가 분석해드려요.",
  keywords: ["탄생석", "탄생석 운세", "탄생석 의미", "탄생석 사주", "생일 탄생석", "월별 탄생석"],
  openGraph: { title: "탄생석 운세 — 점운", description: "생년월일 탄생석 의미 + AI 사주 분석.", url: "https://jeomun.com/birthstone" },
  alternates: { canonical: "https://jeomun.com/birthstone" },
};
export default function BirthstonePage() {
  const stones = [
    { month: "1월", stone: "가넷", color: "#dc2626", meaning: "우정·진실·신뢰" },
    { month: "2월", stone: "자수정", color: "#7c3aed", meaning: "성실·평화·수호" },
    { month: "3월", stone: "아쿠아마린", color: "#0284c7", meaning: "용기·희망·건강" },
    { month: "4월", stone: "다이아몬드", color: "#64748b", meaning: "순결·불변·강인함" },
    { month: "5월", stone: "에메랄드", color: "#15803d", meaning: "행운·사랑·재생" },
    { month: "6월", stone: "진주", color: "#a3a3a3", meaning: "순결·건강·장수" },
    { month: "7월", stone: "루비", color: "#be123c", meaning: "열정·사랑·용기" },
    { month: "8월", stone: "페리도트", color: "#65a30d", meaning: "행복·번영·보호" },
    { month: "9월", stone: "사파이어", color: "#1d4ed8", meaning: "지혜·성실·신뢰" },
    { month: "10월", stone: "오팔", color: "#ea580c", meaning: "희망·순수·행운" },
    { month: "11월", stone: "토파즈", color: "#b45309", meaning: "우정·사랑·행운" },
    { month: "12월", stone: "터키석", color: "#0891b2", meaning: "성공·번영·건강" }
  ];
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #e2e8f0, #f8fafc)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#334155", margin: "0 0 10px" }}>💎 탄생석 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>내 탄생석의<br />숨겨진 의미</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>12개월 탄생석 의미 + AI 사주 분석<br />내 행운 기운을 확인해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #475569, #1e293b)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(71,85,105,0.35)" }}>💎 사주 + 탄생석 — 무료~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {stones.map(s => (
            <div key={s.month} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", borderTop: `3px solid ${s.color}` }}>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 2px", fontWeight: 700 }}>{s.month}</p>
              <p style={{ fontWeight: 900, fontSize: 13, color: s.color, margin: "0 0 4px" }}>{s.stone}</p>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{s.meaning}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #475569, #1e293b)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>탄생석 + AI 사주 함께 보기</p>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: "0 0 20px" }}>탄생석보다 정밀한 사주 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#1e293b", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>💎 시작하기</Link>
      </div>
    </main>
  );
}
