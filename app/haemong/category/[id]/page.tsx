import { notFound } from "next/navigation";
import Link from "next/link";
import { DREAMS, DREAM_CATEGORIES, getByCategory } from "@/lib/haemong/data";
import type { Metadata } from "next";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return DREAM_CATEGORIES.map(c => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cat = DREAM_CATEGORIES.find(c => c.id === id);
  if (!cat) return { title: "꿈해몽 | 점운" };
  return {
    title: `${cat.label} 꿈 해몽 모음 | 점운`,
    description: `${cat.label} 관련 꿈 해몽 전체 목록. 꿈의 의미를 빠르게 확인하세요.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const cat = DREAM_CATEGORIES.find(c => c.id === id);
  if (!cat) notFound();

  const dreams = getByCategory(id);

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fdf2f8 0%,#ede9fe 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.12)", position: "sticky", top: 0, zIndex: 200 }}>
        <Link href="/haemong" style={{ color: "#8b5cf6", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>← 꿈해몽</Link>
        <span style={{ color: "#d1d5db", fontSize: 12 }}>›</span>
        <span style={{ fontSize: 14, color: "#6d28d9", fontWeight: 600 }}>{cat.label}</span>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 14px 80px" }}>

        {/* 카테고리 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 20, padding: "20px", background: cat.bg, borderRadius: 20, border: `1px solid ${cat.border}` }}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>{cat.emoji}</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: cat.accent, margin: "0 0 6px" }}>{cat.label} 꿈 해몽</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>총 {dreams.length}개의 꿈 해석</p>
        </div>

        {/* 꿈 목록 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {dreams.map(kw => {
            const d = DREAMS[kw];
            const luckColor = d.luck === "길몽" ? "#16a34a" : d.luck === "흉몽" ? "#dc2626" : "#7c3aed";
            const luckBg = d.luck === "길몽" ? "#f0fdf4" : d.luck === "흉몽" ? "#fef2f2" : "#f5f3ff";
            return (
              <Link
                key={kw}
                href={`/haemong/${encodeURIComponent(kw)}`}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, background: "#fff", border: "1px solid rgba(236,72,153,0.1)", textDecoration: "none", boxShadow: "0 2px 10px rgba(139,92,246,0.08)" }}
              >
                <span style={{ fontSize: 28 }}>{d.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#4c1d95", marginBottom: 3 }}>{kw}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{d.summary}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 12, background: luckBg, color: luckColor, whiteSpace: "nowrap" }}>{d.luck}</span>
              </Link>
            );
          })}
        </div>

        {/* 다른 카테고리 */}
        <div style={{ marginTop: 28 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#6d28d9", marginBottom: 12 }}>다른 카테고리 꿈 보기</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DREAM_CATEGORIES.filter(c => c.id !== id).map(c => (
              <Link key={c.id} href={`/haemong/category/${c.id}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, background: c.bg, border: `1px solid ${c.border}`, textDecoration: "none", color: c.accent, fontSize: 13, fontWeight: 700 }}>
                <span>{c.emoji}</span><span>{c.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 사주 CTA */}
        <Link href="/main-v2" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, padding: "16px 20px", borderRadius: 16, background: G, textDecoration: "none", boxShadow: "0 4px 20px rgba(236,72,153,0.3)" }}>
          <div>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 14, margin: "0 0 2px" }}>🐱 꿈 + 사주로 더 정확하게</p>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, margin: 0 }}>사주까지 연결하면 꿈의 의미가 더 선명해져요</p>
          </div>
          <span style={{ color: "#fff", fontSize: 20 }}>→</span>
        </Link>

      </div>
    </main>
  );
}
