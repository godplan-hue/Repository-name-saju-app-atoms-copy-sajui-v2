import { notFound } from "next/navigation";
import Link from "next/link";
import { DREAMS, POPULAR_DREAMS, getAllKeywords } from "@/lib/haemong/data";
import type { Metadata } from "next";
import ShareActions from "@/app/haemong/_components/ShareActions";
import FortuneAnglesSection from "@/app/haemong/_components/FortuneAnglesSection";
import SituationsSection from "@/app/haemong/_components/SituationsSection";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

type Props = { params: Promise<{ keyword: string }> };

export async function generateStaticParams() {
  return getAllKeywords().map(k => ({ keyword: k }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { keyword } = await params;
  const kw = decodeURIComponent(keyword);
  const d = DREAMS[kw];
  if (!d) return { title: "꿈해몽 | 점운" };
  const luckEmoji = d.luck === "길몽" ? "✨" : d.luck === "흉몽" ? "⚠️" : "🔮";
  return {
    title: `${kw} 해몽 — ${d.summary} | 점운`,
    description: `${luckEmoji} ${d.luck} | ${d.summary.slice(0, 28)}`,
    openGraph: {
      title: `${luckEmoji} ${kw} 해몽 — 점운 무료 꿈해몽`,
      description: `${luckEmoji} ${d.luck} | ${d.summary.slice(0, 28)}`,
      images: [
        {
          url: "https://i.pinimg.com/1200x/31/e5/d0/31e5d07256c46586a7a89977f720b96f.jpg",
          width: 1200,
          height: 630,
          alt: `${kw} 해몽`,
        },
      ],
      type: "website",
    },
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
      <div style={{ position: "sticky", top: 0, zIndex: 200 }}>
        <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.12)" }}>
          <Link href="/haemong" style={{ color: "#8b5cf6", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>← 꿈해몽</Link>
          <span style={{ color: "#d1d5db", fontSize: 12 }}>›</span>
          <span style={{ fontSize: 14, color: "#6d28d9", fontWeight: 600 }}>{kw}</span>
        </header>
        <ShareActions keyword={kw} />
      </div>

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

        <SituationsSection situations={d.situations} />

        <FortuneAnglesSection fortuneAngles={d.fortuneAngles} keyword={kw} emoji={d.emoji} luck={d.luck} />

        {/* 오늘의 조언 */}
        <div style={{ background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", borderRadius: 16, padding: "18px", marginBottom: 14, border: "1px solid rgba(236,72,153,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>🌟</span>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#4c1d95" }}>오늘의 조언</span>
          </div>
          <p style={{ color: "#6d28d9", fontSize: 14, lineHeight: 1.8, margin: 0, fontWeight: 500 }}>{d.todayAdvice}</p>
        </div>

        {/* 사주 결제 → 꿈해몽 하루 무료 CTA */}
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 14, boxShadow: "0 4px 20px rgba(236,72,153,0.2)", border: "1px solid rgba(236,72,153,0.15)" }}>
          <div style={{ background: G, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>🐱</span>
            <div>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 14, margin: 0 }}>사주 결제하면 꿈해몽+점냥이+Q&amp;A 3종 24시간 무료!</p>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, margin: "2px 0 0" }}>990원 결제 후 이 페이지로 돌아오면 전체 해석이 24시간 열려요</p>
            </div>
          </div>
          <div style={{ padding: "14px 18px" }}>
            <Link href="/main-v2" style={{ display: "block", textAlign: "center", padding: "13px 0", borderRadius: 12, background: G, color: "#fff", fontSize: 15, fontWeight: 900, textDecoration: "none", boxShadow: "0 4px 14px rgba(236,72,153,0.4)" }}>
              🐱 990원으로 사주 보기 → 꿈해몽 무료
            </Link>
            <p style={{ color: "#9ca3af", fontSize: 11, textAlign: "center", margin: "8px 0 0" }}>결제 후 뒤로가기로 돌아오면 잠긴 해석이 전부 열려요</p>
          </div>
        </div>

        {/* 꿈해몽 이용권 버튼 */}
        <a href="/haemong/pay" style={{ display: "block", borderRadius: 16, overflow: "hidden", marginBottom: 14, boxShadow: "0 2px 14px rgba(245,158,11,0.2)", border: "2px solid #f59e0b", textDecoration: "none" }}>
          <div style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>🌙 꿈해몽 이용권</span>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 11 }}>990원 24시간</span>
          </div>
          <div style={{ background: "#fffbeb", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 11, color: "#92400e", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>꿈해몽 단독 ₩990 · 24시간 이용</p>
            <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 900, color: "#fff", background: "linear-gradient(135deg,#f59e0b,#ef4444)", padding: "5px 14px", borderRadius: 20, marginLeft: 8 }}>이용권 보기 →</span>
          </div>
        </a>

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
