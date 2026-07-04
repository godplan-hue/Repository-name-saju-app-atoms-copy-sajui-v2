import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "무료 사주 | 점운 — 오늘의 운세 무료로 받기",
  description: "무료 사주 분석을 받아보세요. 생년월일만 입력하면 오늘의 운세를 무료로 확인할 수 있어요. AI 기반 정밀 사주 분석, 점운에서 무료로 시작하세요.",
  keywords: ["무료 사주", "사주 무료", "무료 운세", "공짜 사주", "무료 AI 사주", "오늘의 운세 무료"],
  openGraph: {
    title: "무료 사주 — 점운",
    description: "생년월일만 입력하면 오늘의 운세 무료로 확인 가능. AI 사주 점운.",
    url: "https://jeomun.com/free-saju",
  },
};

const faqs = [
  { q: "진짜 무료예요?", a: "네, 오늘의 운세는 완전 무료예요. 생년월일만 입력하면 돼요. 더 자세한 분석은 990원부터 유료 상품으로 확인 가능해요." },
  { q: "무료인데 내용이 부실하지 않나요?", a: "오늘의 운세는 실제 만세력 계산 기반으로 분석해요. 단순한 점괘가 아니라 내 사주 원국에서 뽑아낸 오늘 기운을 알려줘요." },
  { q: "회원가입 없이도 되나요?", a: "회원가입 없이 생년월일·시간·이름만 입력하면 바로 결과를 확인할 수 있어요." },
  { q: "무료 사주 후 유료 상품은 어떻게 구매하나요?", a: "무료 결과 화면에서 원하는 운세를 선택하면 간편하게 990원부터 추가 구매할 수 있어요." },
];

export default function FreeSajuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      {/* 히어로 */}
      <div style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", margin: "0 0 10px", letterSpacing: 0.5 }}>🎁 무료 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>
          사주 무료로<br />지금 바로 확인해요
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>
          생년월일만 입력하면 끝<br />오늘의 운세를 AI가 무료로 분석해드려요
        </p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(34,197,94,0.35)" }}>
          🎁 무료 사주 보기
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>회원가입 불필요 · 1분 완성 · 완전 무료</p>
      </div>

      {/* 무료로 받는 것 */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 24, color: "#1f2937" }}>무료로 이걸 다 받아요</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "🔮", title: "사주 원국 분석", desc: "연·월·일·시주 8글자로 내 타고난 기운 파악" },
            { icon: "☀️", title: "오늘의 운세", desc: "오늘 내 운기 흐름 — 좋은 시간대·조심할 것 포함" },
            { icon: "💫", title: "기본 성격 분석", desc: "내 일주(日柱)에서 보는 타고난 성향과 강점" },
            { icon: "📊", title: "운세 미리보기", desc: "재물·연애·건강·성공운 요약 미리보기 제공" },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 28 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px", color: "#1f2937" }}>{f.title}</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "#1f2937" }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map(f => (
            <div key={f.q} style={{ background: "white", borderRadius: 14, padding: "18px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontWeight: 800, fontSize: 14, color: "#16a34a", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 CTA */}
      <div style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>지금 무료로 시작하기</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>무료 오늘의 운세 → 990원 심층 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#16a34a", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          🎁 무료로 시작하기
        </Link>
      </div>
    </main>
  );
}
