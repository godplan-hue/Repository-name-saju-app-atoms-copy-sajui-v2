import { notFound } from "next/navigation";
import Link from "next/link";
import { DREAMS, POPULAR_DREAMS, getAllKeywords } from "@/lib/haemong/data";
import type { Metadata } from "next";

type Props = { params: Promise<{ keyword: string }> };

export async function generateStaticParams() {
  return getAllKeywords().map(k => ({ keyword: encodeURIComponent(k) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { keyword } = await params;
  const kw = decodeURIComponent(keyword);
  const dream = DREAMS[kw];
  if (!dream) return { title: "꿈해몽 | 점운" };
  return {
    title: `${kw} 해몽 — ${dream.summary} | 점운`,
    description: `${kw} 꿈의 의미: ${dream.summary}. ${dream.interpretation.slice(0, 80)}`,
  };
}

export default async function KeywordPage({ params }: Props) {
  const { keyword } = await params;
  const kw = decodeURIComponent(keyword);
  const dream = DREAMS[kw];
  if (!dream) notFound();

  const luckColor =
    dream.luck === "길몽" ? { bg: "#064e3b", text: "#6ee7b7", border: "#059669" } :
    dream.luck === "흉몽" ? { bg: "#450a0a", text: "#fca5a5", border: "#b91c1c" } :
    { bg: "#1e1e3a", text: "#a5b4fc", border: "#4338ca" };

  const related = dream.related.filter(r => DREAMS[r]);
  const others = POPULAR_DREAMS.filter(p => p !== kw && DREAMS[p]).slice(0, 6);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#e8e0f0", fontFamily: "'Apple SD Gothic Neo', sans-serif" }}>

      {/* 상단 헤더 */}
      <div style={{ background: "#0a0a1a", borderBottom: "1px solid #2a1a4a", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/haemong" style={{ color: "#8a7aaa", textDecoration: "none", fontSize: 14 }}>← 꿈해몽</Link>
        <span style={{ color: "#3a2a5a", fontSize: 12 }}>›</span>
        <span style={{ color: "#c4a8e8", fontSize: 14 }}>{kw}</span>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 80px" }}>

        {/* 메인 카드 */}
        <div style={{
          background: "linear-gradient(145deg,#12082a,#1a0e38)",
          border: "1px solid #3a2060", borderRadius: 20,
          padding: "28px 20px", marginBottom: 20, textAlign: "center",
        }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{dream.emoji}</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#d4b8f5", margin: "0 0 8px" }}>{kw}</h1>
          <div style={{
            display: "inline-block", padding: "5px 14px", borderRadius: 20,
            background: luckColor.bg, border: `1px solid ${luckColor.border}`,
            color: luckColor.text, fontSize: 13, fontWeight: 700, marginBottom: 14,
          }}>
            {dream.luck}
          </div>
          <p style={{ color: "#b8a8d8", fontSize: 15, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
            {dream.summary}
          </p>
        </div>

        {/* 태그 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {dream.tags.map(tag => (
            <span key={tag} style={{
              padding: "5px 12px", borderRadius: 20,
              background: "#1a1030", border: "1px solid #3a2060",
              color: "#a88ce0", fontSize: 12,
            }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* 해몽 해석 */}
        <div style={{
          background: "#0f0820", border: "1px solid #2a1a4a",
          borderRadius: 16, padding: "20px 18px", marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#c4a8e8", margin: "0 0 14px" }}>📖 꿈 해석</h2>
          {dream.interpretation.split("\n\n").map((para, i) => (
            <p key={i} style={{ color: "#c8b8e0", fontSize: 14, lineHeight: 1.8, margin: i === 0 ? 0 : "12px 0 0" }}>
              {para}
            </p>
          ))}
        </div>

        {/* 관련 꿈 */}
        {related.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#c4a8e8", margin: "0 0 12px" }}>🔗 관련 꿈</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {related.map(r => {
                const d = DREAMS[r];
                return (
                  <Link
                    key={r}
                    href={`/haemong/${encodeURIComponent(r)}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 14px", borderRadius: 12,
                      background: "#1a1030", border: "1px solid #3a2060",
                      textDecoration: "none", color: "#d4b8f5", fontSize: 14,
                    }}
                  >
                    <span>{d.emoji}</span>
                    <span>{r}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 사주 연결 CTA */}
        <div style={{
          padding: "22px 18px", borderRadius: 16,
          background: "linear-gradient(135deg,#2d1b69,#1e1a3a)",
          border: "1px solid #5b21b6", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>🐱</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#c4a8e8", fontWeight: 700, fontSize: 14, margin: "0 0 3px" }}>
                오늘 꿈이 내 사주와 맞닿아 있을 수 있어요
              </p>
              <p style={{ color: "#7a6a9a", fontSize: 12, margin: 0 }}>
                내 사주로 오늘 운세까지 확인해보세요
              </p>
            </div>
          </div>
          <Link
            href="/main-v2"
            style={{
              display: "block", marginTop: 14, padding: "11px 0", textAlign: "center",
              borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
              color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none",
            }}
          >
            내 사주 확인하기 →
          </Link>
        </div>

        {/* 인기 꿈 목록 */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#c4a8e8", margin: "0 0 12px" }}>🌙 다른 인기 꿈</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {others.map(okw => {
              const d = DREAMS[okw];
              return (
                <Link
                  key={okw}
                  href={`/haemong/${encodeURIComponent(okw)}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderRadius: 12,
                    background: "#110c22", border: "1px solid #2a1a4a",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{d.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: "#d4b8f5", fontWeight: 600, fontSize: 14 }}>{okw}</span>
                    <span style={{ color: "#6a5a8a", fontSize: 12, marginLeft: 8 }}>{d.summary.slice(0, 16)}…</span>
                  </div>
                  <span style={{
                    padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                    background: d.luck === "길몽" ? "#064e3b" : d.luck === "흉몽" ? "#450a0a" : "#1e1e3a",
                    color: d.luck === "길몽" ? "#6ee7b7" : d.luck === "흉몽" ? "#fca5a5" : "#a5b4fc",
                  }}>{d.luck}</span>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
