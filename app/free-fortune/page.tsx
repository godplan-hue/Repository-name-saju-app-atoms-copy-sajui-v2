import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "무료 운세 | 점운 — 완전 무료 AI 운세",
  description: "무료 운세를 지금 바로 받아보세요. 생년월일 입력만으로 오늘의 운세를 무료로 확인할 수 있어요.",
  keywords: ["무료운세", "무료 운세", "운세 무료", "공짜 운세", "무료 사주 운세", "오늘 무료 운세"],
  openGraph: { title: "무료 운세 — 점운", description: "완전 무료 AI 운세. 생년월일만 입력하면 끝.", url: "https://jeomun.com/free-fortune" },
  alternates: { canonical: "https://jeomun.com/free-fortune" },
};
export default function FreeFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #bbf7d0, #f0fdf4)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#15803d", margin: "0 0 10px" }}>🎁 무료 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>무료 운세<br />지금 바로 받아요</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>회원가입 없이 · 생년월일만 입력<br />오늘의 운세를 무료로 확인해요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #22c55e, #15803d)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(34,197,94,0.35)" }}>🎁 무료 운세 보기</Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>완전 무료 · 즉시 확인 · 1분 완성</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "🔮", title: "오늘의 운세", desc: "오늘 내 기운 흐름 무료 확인" }, { icon: "⭐", title: "사주 원국", desc: "내 사주 8글자 무료 계산" }, { icon: "📊", title: "운세 미리보기", desc: "재물·연애·건강 요약 무료 제공" }, { icon: "🎯", title: "오늘의 조언", desc: "내 사주 맞춤 오늘 조언" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #22c55e, #15803d)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>무료로 지금 시작하기</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#15803d", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🎁 무료 시작</Link>
      </div>
    </main>
  );
}
