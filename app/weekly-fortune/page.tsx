import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "주간 운세 | 점운 — 이번 주 내 운세 AI 분석",
  description: "주간 운세를 AI 사주로 확인해보세요. 이번 주 좋은 날, 조심할 날, 집중해야 할 것을 알려드려요.",
  keywords: ["주간운세", "이번주 운세", "주간 사주", "주간 운세 보기", "이번 주 운세", "7일 운세"],
  openGraph: { title: "주간 운세 — 점운", description: "이번 주 내 운세 AI 분석. 좋은 날·조심할 날 확인.", url: "https://jeomun.com/weekly-fortune" },
};
export default function WeeklyFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fffbeb", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fef3c7, #fffbeb)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#b45309", margin: "0 0 10px" }}>📅 주간 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>이번 주<br />내 운세는?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>이번 주 좋은 날·조심할 날<br />AI가 주간 운세를 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f59e0b, #b45309)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(245,158,11,0.35)" }}>📅 주간 운세 보기 — 무료~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"].map((day, i) => (
          <div key={day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", borderRadius: 12, padding: "14px 18px", marginBottom: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ fontWeight: 800, fontSize: 14, margin: 0 }}>{day}</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>생년월일 입력 후 확인</p>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #f59e0b, #b45309)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>이번 주 운세 확인하기</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#b45309", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>📅 시작하기</Link>
      </div>
    </main>
  );
}
