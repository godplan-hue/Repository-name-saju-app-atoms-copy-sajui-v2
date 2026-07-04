import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "띠별 운세 | 점운 — 내 띠로 보는 2026년 운세",
  description: "띠별 운세를 확인해보세요. 쥐·소·호랑이·토끼·용·뱀·말·양·원숭이·닭·개·돼지 띠별 2026년 운세를 AI로 분석해드려요.",
  keywords: ["띠별 운세", "띠 운세", "2026 띠별운세", "띠 사주", "12띠 운세", "띠별 사주"],
  openGraph: { title: "띠별 운세 — 점운", description: "내 띠로 보는 2026년 운세. AI 사주 정밀 분석.", url: "https://jeomun.com/zodiac-fortune" },
};

const zodiacList = [
  { animal: "🐭 쥐띠", year: "1948·1960·1972·1984·1996·2008·2020" },
  { animal: "🐮 소띠", year: "1949·1961·1973·1985·1997·2009·2021" },
  { animal: "🐯 호랑이띠", year: "1950·1962·1974·1986·1998·2010·2022" },
  { animal: "🐰 토끼띠", year: "1951·1963·1975·1987·1999·2011·2023" },
  { animal: "🐲 용띠", year: "1952·1964·1976·1988·2000·2012·2024" },
  { animal: "🐍 뱀띠", year: "1953·1965·1977·1989·2001·2013·2025" },
];

const faqs = [
  { q: "띠별 운세와 사주 운세는 달라요?", a: "띠별 운세는 태어난 해의 띠만 보는 거라 같은 띠면 같은 결과예요. 사주 운세는 생년월일시 전체를 보므로 훨씬 개인화돼요. 점운은 개인 맞춤 사주 분석을 제공해요." },
  { q: "2026년에 좋은 띠가 있나요?", a: "2026년 병오년(丙午年)은 화(火) 기운이 강해요. 화와 잘 맞는 띠는 유리하고, 충(沖) 관계인 띠는 조심해야 해요. 정확한 건 내 사주 전체를 봐야 알 수 있어요." },
  { q: "띠만 알고 사주를 봐도 되나요?", a: "띠만으로는 기본 참고만 가능해요. 생년월일시를 입력하면 훨씬 정확한 개인 맞춤 분석을 받을 수 있어요." },
  { q: "어떤 띠끼리 잘 맞나요?", a: "삼합(三合) 관계인 띠끼리 잘 맞아요. 예: 쥐·용·원숭이 / 소·뱀·닭 / 호랑이·말·개 / 토끼·양·돼지" },
];

export default function ZodiacFortunePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff7ed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fed7aa, #fff7ed)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#ea580c", margin: "0 0 10px" }}>🐯 띠별 운세</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.25 }}>내 띠로 보는<br />2026년 운세</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>12띠별 운세 확인 + 개인 맞춤 사주 분석<br />AI가 더 정밀하게 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(249,115,22,0.35)" }}>
          🐯 내 띠 운세 보기 — ₩990~
        </Link>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>즉시 분석 · 무료 맛보기 · 개인 맞춤</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 20 }}>내 띠는?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {zodiacList.map(z => (
            <div key={z.animal} style={{ background: "white", borderRadius: 12, padding: "12px 14px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{z.animal}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{z.year}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginBottom: 20 }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map(f => (
            <div key={f.q} style={{ background: "white", borderRadius: 14, padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontWeight: 800, fontSize: 14, color: "#ea580c", margin: "0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>내 맞춤 사주로 더 정확하게</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 20px" }}>띠별보다 정확한 개인 맞춤 사주 분석</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#ea580c", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🐯 시작하기</Link>
      </div>
    </main>
  );
}
