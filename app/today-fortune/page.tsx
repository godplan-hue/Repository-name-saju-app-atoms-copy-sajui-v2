import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "오늘의 운세 | 점운 — AI 사주로 보는 오늘 운세",
  description: "오늘의 운세를 AI 사주로 확인해보세요. 생년월일 입력만으로 오늘 내 운기 흐름을 무료로 받아볼 수 있어요.",
  keywords: ["오늘의 운세", "오늘 운세", "무료 오늘의 운세", "일일 운세", "오늘 사주", "오늘 운세 무료"],
  openGraph: { title: "오늘의 운세 — 점운", description: "AI 사주로 보는 오늘 운세. 무료로 즉시 확인.", url: "https://jeomun.com/today-fortune" },
};

const faqs = [
  { q: "오늘의 운세는 매일 달라지나요?", a: "네, 날마다 달라져요. 내 사주 원국과 그날의 일진(日辰)이 만나는 기운을 분석하기 때문에 매일 다른 결과가 나와요." },
  { q: "오늘의 운세만 무료인가요?", a: "오늘의 운세는 완전 무료예요. 재물·연애·직업 등 더 자세한 분석은 990원부터 유료로 제공해요." },
  { q: "몇 시에 보는 게 좋나요?", a: "아침에 확인하는 게 가장 좋아요. 오늘 조심할 시간대와 좋은 시간대를 미리 알고 하루를 준비할 수 있어요." },
  { q: "매일 와서 봐야 하나요?", a: "매일 보면 좋아요. 오늘 유독 기운이 강하거나 약한 날을 미리 알면 중요한 결정을 언제 할지 참고할 수 있어요." },
];

export default function TodayFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fffbeb", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fef3c7, #fffbeb)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#d97706", margin: "0 0 10px" }}>☀️ 오늘의 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>오늘 내 운세<br />AI 사주로 확인해요</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>생년월일만 입력하면 끝<br />오늘 내 기운 흐름을 무료로 받아보세요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(245,158,11,0.35)" }}>
          ☀️ 오늘의 운세 보기 — 무료
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>완전 무료 · 즉시 확인 · 회원가입 불필요</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>오늘의 운세에서 알 수 있는 것</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🌅", title: "오늘 전체 운기", desc: "오늘 하루 내 기운이 강한지 약한지 전체적인 흐름" },
            { icon: "⏰", title: "좋은 시간대", desc: "오늘 중 가장 기운이 좋은 시간대와 조심할 시간대" },
            { icon: "🎯", title: "오늘의 키워드", desc: "오늘 집중해야 할 것, 피해야 할 것 한눈에 확인" },
            { icon: "💡", title: "오늘의 조언", desc: "내 사주에 맞는 오늘 하루 맞춤 조언" },
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
              <p style={{ fontWeight: 800, fontSize: 14, color: "#d97706", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>오늘의 운세 무료로 확인</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 운세 → 990원 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#d97706", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>☀️ 무료로 시작하기</Link>
      </div>
    </main>
  );
}
