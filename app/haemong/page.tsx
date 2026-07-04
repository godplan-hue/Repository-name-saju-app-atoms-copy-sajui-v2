"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  POPULAR_DREAMS,
  DREAMS,
  searchKeywords,
} from "@/lib/haemong/data";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const DREAM_GRID = [
  { id: "animal",    label: "동물꿈",    sub: "뱀·돼지·호랑이",  img: "https://i.pinimg.com/736x/7e/3f/b7/7e3fb74ca3f9bd8cf3df7b8fcde0c4cb.jpg", accent: "#16a34a", price: "길몽대표", priceBg: "#15803d" },
  { id: "money",     label: "재물·돈꿈", sub: "돈·금·로또·복권",  img: "https://i.pinimg.com/736x/8c/d5/cb/8cd5cb716cc5ad25ada38aa88306c52d.jpg", accent: "#b45309", price: "황금길몽", priceBg: "#b45309" },
  { id: "person",    label: "사람꿈",    sub: "가족·연인·귀인",    img: "https://i.pinimg.com/1200x/f1/66/b5/f166b50a65fc824659d395a75037937b.jpg", accent: "#1d4ed8", price: "인연",     priceBg: "#2563eb" },
  { id: "body",      label: "신체꿈",    sub: "이빨·머리·피",      img: "https://i.pinimg.com/736x/cb/9c/bc/cb9cbc190726bace6f4575ff8648ab5d.jpg", accent: "#7c3aed", price: "건강신호",  priceBg: "#7c3aed" },
  { id: "nature",    label: "자연꿈",    sub: "물·불·비·하늘",     img: "https://i.pinimg.com/736x/a2/e3/2a/a2e32abeae3320baec01b62d54e44751.jpg", accent: "#0284c7", price: "자연운",   priceBg: "#0369a1" },
  { id: "situation", label: "상황꿈",    sub: "비행·결혼·시험",    img: "https://i.pinimg.com/1200x/4c/01/00/4c01008435276aec3d662fff9236c87b.jpg", accent: "#ea580c", price: "행동운",   priceBg: "#c2410c" },
  { id: "object",    label: "사물꿈",    sub: "집·차·음식",        img: "https://i.pinimg.com/1200x/b7/c3/ca/b7c3ca787665a1ec29ea1d2643ddc55a.jpg", accent: "#6d28d9", price: "일상운",   priceBg: "#5b21b6" },
  { id: "special",   label: "길몽 모음", sub: "용·봉황·황금",      img: "https://i.pinimg.com/736x/05/53/27/055327e74b7436d04c938d038ba0d900.jpg", accent: "#b45309", price: "⭐ 대길",  priceBg: "#ca8a04", priceColor: "#1a1a2e" },
  { id: "top",       label: "인기 꿈 TOP",sub: "뱀·돼지·똥꿈",    img: "https://i.pinimg.com/1200x/65/75/cc/6575cc48a123141887c0e0d53229e6a6.jpg", accent: "#be185d", price: "🔥 인기",  priceBg: "#be185d" },
];

export default function HaemongPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);

  function handleSearch() {
    if (!query.trim()) return;
    const found = searchKeywords(query.trim());
    setResults(found);
    setSearched(true);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  function goTo(keyword: string) {
    router.push(`/haemong/${encodeURIComponent(keyword)}`);
  }

  return (
    <main style={{ minHeight: "100vh", background: BG, backgroundImage: `url('https://i.pinimg.com/736x/f0/eb/3f/f0eb3f82c0f66f2eb9547df718242bd3.jpg')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", overflowX: "hidden" }}>

      {/* 헤더 */}
      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.12)", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20 }}>🌙</span>
          <span style={{ fontWeight: 900, fontSize: 16, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>꿈해몽</span>
        </div>
        <button
          onClick={() => router.push("/main-v2")}
          style={{ fontSize: 12, color: "#8b5cf6", fontWeight: 700, background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 20, padding: "5px 12px", cursor: "pointer" }}
        >
          🐱 사주 보기
        </button>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 14px 80px" }}>

        {/* 타이틀 */}
        <div style={{ textAlign: "center", marginBottom: 16, padding: "18px 0 8px" }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>🌙</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 4px" }}>꿈해몽</h1>
          <p style={{ fontSize: 13, color: "#9d4edd", margin: 0 }}>꿈이 전하는 오늘의 메시지</p>
        </div>

        {/* 검색창 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, background: "rgba(255,255,255,0.9)", borderRadius: 14, padding: "6px 6px 6px 14px", boxShadow: "0 2px 12px rgba(139,92,246,0.15)", border: "1px solid rgba(236,72,153,0.2)" }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="꿈 키워드 검색 (예: 뱀, 돼지, 이빨)"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#1a1a2e" }}
          />
          <button
            onClick={handleSearch}
            style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: G, color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 700 }}
          >
            검색
          </button>
        </div>

        {/* 검색 결과 */}
        {searched && (
          <div style={{ marginBottom: 20, background: "rgba(255,255,255,0.9)", borderRadius: 14, padding: "14px", boxShadow: "0 2px 12px rgba(139,92,246,0.1)" }}>
            {results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "12px 0", color: "#9ca3af", fontSize: 14 }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🔍</div>
                <p style={{ margin: 0 }}>검색 결과가 없어요. 다른 키워드로 찾아보세요.</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 10px" }}>"{query}" 검색 결과 {results.length}개</p>
                {results.map(kw => {
                  const d = DREAMS[kw];
                  return (
                    <button key={kw} onClick={() => goTo(kw)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 0", background: "none", border: "none", borderBottom: "1px solid #f3e8ff", cursor: "pointer", textAlign: "left" }}>
                      <span style={{ fontSize: 24 }}>{d.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#4c1d95" }}>{kw}</span>
                        <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 6 }}>{d.summary.slice(0, 20)}…</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: d.luck === "길몽" ? "#f0fdf4" : d.luck === "흉몽" ? "#fef2f2" : "#f5f3ff", color: d.luck === "길몽" ? "#16a34a" : d.luck === "흉몽" ? "#dc2626" : "#7c3aed" }}>{d.luck}</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* 카테고리 그리드 */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(139,92,246,0.2)" }} />
            <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", background: G, padding: "5px 14px", borderRadius: 20, whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(139,92,246,0.35)" }}>🌙 꿈 카테고리</span>
            <div style={{ flex: 1, height: 1, background: "rgba(139,92,246,0.2)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {DREAM_GRID.map(cat => (
              <div
                key={cat.id}
                onClick={() => cat.id === "top" ? undefined : undefined}
                style={{ aspectRatio: "1 / 1", borderRadius: 16, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: `0 3px 14px ${cat.accent}28` }}
              >
                <img src={cat.img} alt={cat.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0) 75%)" }} />
                <span style={{ position: "absolute", top: 5, left: 5, background: cat.priceBg, color: (cat as any).priceColor ?? "#fff", fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.3)", display: "inline-block", minWidth: 40, textAlign: "center" }}>{cat.price}</span>
                <div style={{ position: "absolute", bottom: 7, left: 0, right: 0, textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,1)", whiteSpace: "nowrap", overflow: "hidden" }}>{cat.label}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.75)", textShadow: "0 1px 4px rgba(0,0,0,0.9)", marginTop: 2 }}>{cat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 인기 꿈 리스트 */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(139,92,246,0.2)" }} />
            <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", background: "linear-gradient(135deg,#7c3aed,#4c1d95)", padding: "5px 14px", borderRadius: 20, whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(124,58,237,0.4)" }}>🔥 인기 꿈 해몽</span>
            <div style={{ flex: 1, height: 1, background: "rgba(139,92,246,0.2)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {POPULAR_DREAMS.slice(0, 9).map((kw, i) => {
              const d = DREAMS[kw];
              if (!d) return null;
              const IMGS: Record<string, string> = {
                "뱀꿈":         "https://i.pinimg.com/736x/7e/3f/b7/7e3fb74ca3f9bd8cf3df7b8fcde0c4cb.jpg",
                "돼지꿈":       "https://i.pinimg.com/1200x/a6/30/a7/a630a728391bc4784a814211184b42bb.jpg",
                "이빨빠지는꿈": "https://i.pinimg.com/736x/cb/9c/bc/cb9cbc190726bace6f4575ff8648ab5d.jpg",
                "돈꿈":         "https://i.pinimg.com/736x/8c/d5/cb/8cd5cb716cc5ad25ada38aa88306c52d.jpg",
                "죽은사람꿈":   "https://i.pinimg.com/736x/43/62/22/436222b26a1aeebae92aaa7eaa2f5ea3.jpg",
                "불꿈":         "https://i.pinimg.com/736x/66/b6/67/66b66708f6e337996b4fa81e95613c64.jpg",
                "물꿈":         "https://i.pinimg.com/736x/a2/e3/2a/a2e32abeae3320baec01b62d54e44751.jpg",
                "아기꿈":       "https://i.pinimg.com/1200x/65/75/cc/6575cc48a123141887c0e0d53229e6a6.jpg",
                "비행꿈":       "https://i.pinimg.com/736x/05/53/27/055327e74b7436d04c938d038ba0d900.jpg",
              };
              return (
                <div key={kw} onClick={() => goTo(kw)} style={{ aspectRatio: "1 / 1", borderRadius: 14, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: "0 3px 12px rgba(139,92,246,0.18)" }}>
                  <img src={IMGS[kw] || d.emoji} alt={kw} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0) 75%)" }} />
                  <span style={{ position: "absolute", top: 5, left: 5, background: "#6d28d9", color: "#fff", fontSize: 9, fontWeight: 900, padding: "2px 6px", borderRadius: 10 }}>#{i + 1}</span>
                  <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,1)" }}>{kw}</div>
                    <div style={{ fontSize: 9, color: d.luck === "길몽" ? "#6ee7b7" : d.luck === "흉몽" ? "#fca5a5" : "#c4b5fd", fontWeight: 700, marginTop: 1 }}>{d.luck}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 사주 연결 배너 */}
        <div
          onClick={() => router.push("/main-v2")}
          style={{ marginTop: 24, borderRadius: 16, overflow: "hidden", cursor: "pointer", position: "relative", boxShadow: "0 4px 20px rgba(236,72,153,0.25)" }}
        >
          <img src="https://i.pinimg.com/736x/2f/b6/d4/2fb6d40a9b80a685052a1174960ec782.jpg" alt="사주보기" style={{ width: "100%", height: 110, objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(236,72,153,0.72) 0%, rgba(139,92,246,0.65) 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
            <div>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 15, margin: "0 0 2px", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>🐱 꿈 + 사주로 더 정확하게</p>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, margin: 0 }}>내 사주까지 보면 꿈의 의미가 선명해요</p>
            </div>
            <span style={{ background: "#fff", color: "#be185d", fontWeight: 900, fontSize: 12, padding: "8px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>보기 →</span>
          </div>
        </div>

      </div>
    </main>
  );
}
