import { notFound } from "next/navigation";
import Link from "next/link";
import { DREAMS, POPULAR_DREAMS, getAllKeywords } from "@/lib/haemong/data";
import type { Metadata } from "next";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

type Props = { params: Promise<{ keyword: string }> };

export async function generateStaticParams() {
  return getAllKeywords().map(k => ({ keyword: encodeURIComponent(k) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { keyword } = await params;
  const kw = decodeURIComponent(keyword);
  const d = DREAMS[kw];
  if (!d) return { title: "꿈해몽 | 점운" };
  return {
    title: `${kw} 해몽 — ${d.summary} | 점운`,
    description: `${kw} 꿈의 의미: ${d.summary}. ${d.basicMeaning.slice(0, 80)}`,
  };
}

export default async function KeywordPage({ params }: Props) {
  const { keyword } = await params;
  const kw = decodeURIComponent(keyword);
  const d = DREAMS[kw];
  if (!d) notFound();

  const luckStyle =
    d.luck === "길몽" ? { bg: "#f0fdf4", text: "#16a34a", border: "#86efac" } :
    d.luck === "흉몽" ? { bg: "#fef2f2", text: "#dc2626", border: "#fca5a5" } :
    { bg: "#f5f3ff", text: "#7c3aed", border: "#c4b5fd" };

  const related = d.related.filter(r => DREAMS[r]);
  const others = POPULAR_DREAMS.filter(p => p !== kw && DREAMS[p]).slice(0, 6);

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fdf2f8 0%,#ede9fe 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>

      {/* 헤더 */}
      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.12)", position: "sticky", top: 0, zIndex: 200 }}>
        <Link href="/haemong" style={{ color: "#8b5cf6", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>← 꿈해몽</Link>
        <span style={{ color: "#d1d5db", fontSize: 12 }}>›</span>
        <span style={{ fontSize: 14, color: "#6d28d9", fontWeight: 600 }}>{kw}</span>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 14px 80px" }}>

        {/* 히어로 카드 */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "28px 20px", marginBottom: 14, boxShadow: "0 4px 20px rgba(139,92,246,0.15)", border: "1px solid rgba(236,72,153,0.1)", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 10 }}>{d.emoji}</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 10px" }}>{kw}</h1>
          <span style={{ display: "inline-block", padding: "5px 16px", borderRadius: 20, background: luckStyle.bg, border: `1px solid ${luckStyle.border}`, color: luckStyle.text, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
            {d.luck === "길몽" ? "✨ " : d.luck === "흉몽" ? "⚠️ " : ""}
            {d.luck}
          </span>
          <p style={{ color: "#6d28d9", fontSize: 15, margin: 0, lineHeight: 1.6, fontWeight: 600 }}>{d.summary}</p>
        </div>

        {/* 태그 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {d.tags.map(tag => (
            <span key={tag} style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", color: "#6d28d9", fontSize: 12 }}>#{tag}</span>
          ))}
        </div>

        {/* 기본 해석 */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px", marginBottom: 14, boxShadow: "0 2px 12px rgba(139,92,246,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>📖</span>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#4c1d95" }}>기본 해석</span>
          </div>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: 0 }}>{d.basicMeaning}</p>
        </div>

        {/* 상황별 해석 */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px", marginBottom: 14, boxShadow: "0 2px 12px rgba(139,92,246,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>🔍</span>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#4c1d95" }}>상황별 해석</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {d.situations.map((s, i) => (
              <div key={i} style={{ background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", borderRadius: 12, padding: "14px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed", marginBottom: 6 }}>💭 {s.case}</div>
                <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{s.meaning}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 운세별 관점 */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px", marginBottom: 14, boxShadow: "0 2px 12px rgba(139,92,246,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>⭐</span>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#4c1d95" }}>운세별 관점</span>
            <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: "#fef3c7", color: "#b45309" }}>1개 무료</span>
          </div>

          {/* 첫 번째 무료 공개 */}
          {d.fortuneAngles[0] && (
            <div style={{ background: "#fafafa", borderRadius: 12, padding: "14px", border: "1px solid #f3e8ff", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#be185d", marginBottom: 6 }}>{d.fortuneAngles[0].emoji} {d.fortuneAngles[0].type}</div>
              <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{d.fortuneAngles[0].content}</div>
            </div>
          )}

          {/* 나머지 잠금 */}
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}>
              {d.fortuneAngles.slice(1).map((f, i) => (
                <div key={i} style={{ background: "#fafafa", borderRadius: 12, padding: "14px", border: "1px solid #f3e8ff", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#be185d", marginBottom: 6 }}>{f.emoji} {f.type}</div>
                  <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{f.content}</div>
                </div>
              ))}
              {/* 사주 관점 미리보기 (항상 블러) */}
              <div style={{ background: "#fdf2f8", borderRadius: 12, padding: "14px", border: "1px solid #fce7f3" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#be185d", marginBottom: 6 }}>🌟 사주와 결합한 종합 해석</div>
                <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>이 꿈이 올해 운세와 만나면... 재물·연애·건강 전 분야에 걸쳐...</div>
              </div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.92) 40%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "20px 16px" }}>
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>🔐</div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#4c1d95", margin: "0 0 4px" }}>운세별 전체 해석 보기</p>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>재물운·연애운·건강운·직업운 전체</p>
              </div>
              <Link href="/main-v2" style={{ background: G, color: "#fff", fontSize: 14, fontWeight: 900, padding: "12px 28px", borderRadius: 24, textDecoration: "none", boxShadow: "0 4px 16px rgba(236,72,153,0.45)", display: "inline-block" }}>
                🐱 990원으로 전체 보기
              </Link>
            </div>
          </div>
        </div>

        {/* 오늘의 조언 */}
        <div style={{ background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", borderRadius: 16, padding: "18px", marginBottom: 14, border: "1px solid rgba(236,72,153,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>🌟</span>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#4c1d95" }}>오늘의 조언</span>
          </div>
          <p style={{ color: "#6d28d9", fontSize: 14, lineHeight: 1.8, margin: 0, fontWeight: 500 }}>{d.todayAdvice}</p>
        </div>

        {/* 사주 연결 CTA */}
        <div onClick={() => {}} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 14, boxShadow: "0 4px 20px rgba(236,72,153,0.2)", border: "1px solid rgba(236,72,153,0.15)" }}>
          <div style={{ background: G, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>🐱</span>
            <div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 14, margin: 0 }}>꿈 + 사주로 더 정확하게</p>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, margin: "2px 0 0" }}>내 사주와 연결하면 꿈의 의미가 더 선명해져요</p>
            </div>
          </div>
          <div style={{ padding: "14px 18px", display: "flex", gap: 10 }}>
            <Link href="/main-v2" style={{ flex: 1, display: "block", textAlign: "center", padding: "11px 0", borderRadius: 10, background: G, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              내 사주 보기 →
            </Link>
            <Link href="/main-v2" style={{ flex: 1, display: "block", textAlign: "center", padding: "11px 0", borderRadius: 10, background: "#f5f3ff", color: "#7c3aed", fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid #ddd6fe" }}>
              취업·자소서 →
            </Link>
          </div>
        </div>

        {/* 관련 꿈 */}
        {related.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#4c1d95", marginBottom: 10 }}>🔗 관련 꿈</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {related.map(r => (
                <Link key={r} href={`/haemong/${encodeURIComponent(r)}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, background: "#fff", border: "1px solid rgba(139,92,246,0.2)", textDecoration: "none", color: "#6d28d9", fontSize: 13, fontWeight: 600 }}>
                  <span>{DREAMS[r].emoji}</span><span>{r}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 다른 인기 꿈 */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#4c1d95", marginBottom: 10 }}>🌙 다른 인기 꿈</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {others.map(okw => {
              const od = DREAMS[okw];
              return (
                <Link key={okw} href={`/haemong/${encodeURIComponent(okw)}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "#fff", border: "1px solid rgba(236,72,153,0.1)", textDecoration: "none", boxShadow: "0 1px 6px rgba(139,92,246,0.08)" }}>
                  <span style={{ fontSize: 22 }}>{od.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#4c1d95" }}>{okw}</span>
                    <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8 }}>{od.summary.slice(0, 16)}…</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: od.luck === "길몽" ? "#f0fdf4" : od.luck === "흉몽" ? "#fef2f2" : "#f5f3ff", color: od.luck === "길몽" ? "#16a34a" : od.luck === "흉몽" ? "#dc2626" : "#7c3aed" }}>{od.luck}</span>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
