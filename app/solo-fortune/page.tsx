import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "솔로 운세 | 점운 — 싱글 탈출 기운 AI 분석",
  description: "솔로 운세를 사주로 확인해보세요. 언제 연인이 생기는지, 이성 인연 시기를 AI가 분석해드려요.",
  keywords: ["솔로 운세", "솔로 탈출 사주", "이성 인연 사주", "연인 생기는 시기", "싱글 운세", "연애운"],
  openGraph: { title: "솔로 운세 — 점운", description: "싱글 탈출 기운 AI 분석. 언제 연인이 생기나?", url: "https://jeomun.com/solo-fortune" },
  alternates: { canonical: "https://jeomun.com/solo-fortune" },
};
export default function SoloFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fdf2f8", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fce7f3, #fdf2f8)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#9d174d", margin: "0 0 10px" }}>💝 솔로 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>언제쯤<br />연인이 생길까?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>이성 인연 시기·솔로 탈출 기운<br />AI가 연애운을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #ec4899, #9d174d)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>💝 솔로 운세 보기 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {[{ icon: "💘", title: "이성 인연 시기", desc: "올해·내년 중 인연이 들어오는 시기" }, { icon: "📍", title: "인연 만나는 장소", desc: "어디서 인연을 만날 가능성이 높은지" }, { icon: "💋", title: "내 매력 포인트", desc: "이성에게 어필되는 내 사주의 매력" }, { icon: "🎯", title: "인연의 조건", desc: "나와 잘 맞는 이성의 특징·유형" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #ec4899, #9d174d)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>솔로 탈출 기운 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#9d174d", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>💝 시작하기</Link>
      </div>
    </main>
  );
}
