"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  POPULAR_DREAMS,
  DREAMS,
  searchKeywords,
} from "@/lib/haemong/data";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const BANNER = [
  { kw: "돼지꿈",       rank: "🔥 1위", img: "https://i.pinimg.com/vwebp/1200x/f1/a0/eb/f1a0ebaeecf261fe57ea04df84dbee0c.webp", sub: "꿈만 꿔도 재물이 들어온다", luck: "길몽" },
  { kw: "뱀꿈",         rank: "🔥 2위", img: "https://i.pinimg.com/736x/41/8b/46/418b469c10eea1b164ba228df4c3de8e.jpg", sub: "큰 변화와 재물의 신호",   luck: "길몽" },
  { kw: "용꿈",         rank: "🔥 3위", img: "https://i.pinimg.com/1200x/f9/11/47/f91147ffa1ccd1c892e6d95f05d87391.jpg", sub: "최고의 길몽, 대박 운수",  luck: "길몽" },
  { kw: "이빨빠지는꿈", rank: "4위",    img: "https://i.pinimg.com/736x/99/d1/bd/99d1bdb4c2f94311275b57cf41c634cd.jpg", sub: "건강·가족을 돌아볼 신호", luck: "흉몽" },
  { kw: "황금꿈",       rank: "5위",    img: "https://i.pinimg.com/736x/49/85/1a/49851abdf36f75ae18cb4dad32c25989.jpg", sub: "황금이 가득, 재물운 폭발", luck: "길몽" },
  { kw: "호랑이꿈",     rank: "6위",    img: "https://i.pinimg.com/736x/e4/99/f8/e499f89b6a79c6ea44ae2093f172225a.jpg", sub: "권위와 성공의 상징",      luck: "길몽" },
];

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
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % BANNER.length), 3200);
    return () => clearInterval(t);
  }, []);

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
    <main style={{ minHeight: "100vh", background: BG, backgroundImage: `url('https://i.pinimg.com/1200x/31/e5/d0/31e5d07256c46586a7a89977f720b96f.jpg')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", overflowX: "hidden" }}>

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

      {/* 슬라이딩 배너 */}
      <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden" }}>
        {BANNER.map((item, i) => (
          <div
            key={item.kw}
            onClick={() => goTo(item.kw)}
            style={{
              position: "absolute", inset: 0, cursor: "pointer",
              opacity: i === slide ? 1 : 0,
              transition: "opacity 0.7s ease",
              zIndex: i === slide ? 1 : 0,
            }}
          >
            <img src={item.img} alt={item.kw} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)" }} />
            <div style={{ position: "absolute", top: 14, left: 14 }}>
              <span style={{ background: i < 3 ? "#dc2626" : "rgba(0,0,0,0.6)", color: "#fff", fontSize: 11, fontWeight: 900, padding: "4px 10px", borderRadius: 20 }}>{item.rank}</span>
            </div>
            <div style={{ position: "absolute", bottom: 32, left: 0, right: 0, textAlign: "center", padding: "0 20px" }}>
              <div style={{ fontSize: item.kw.length > 6 ? 17 : item.kw.length > 4 ? 20 : 22, fontWeight: 900, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.8)", marginBottom: 4 }}>{item.kw}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 10 }}>{item.sub}</div>
              <span style={{ background: item.luck === "길몽" ? "#16a34a" : item.luck === "흉몽" ? "#dc2626" : "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20 }}>
                {item.luck === "길몽" ? "✨ " : item.luck === "흉몽" ? "⚠️ " : ""}{item.luck} · 해몽 보기 →
              </span>
            </div>
          </div>
        ))}
        {/* 도트 인디케이터 */}
        <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6, zIndex: 10 }}>
          {BANNER.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setSlide(i); }}
              style={{ width: i === slide ? 20 : 7, height: 7, borderRadius: 4, border: "none", background: i === slide ? "#fff" : "rgba(255,255,255,0.45)", cursor: "pointer", transition: "all 0.3s", padding: 0 }}
            />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 14px 80px" }}>

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
                onClick={() => cat.id === "top"
                  ? document.getElementById("popular-top20")?.scrollIntoView({ behavior: "smooth" })
                  : router.push(`/haemong/category/${cat.id}`)
                }
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
        {(() => {
          const IMGS: Record<string, string> = {
            "돼지꿈":       "https://i.pinimg.com/736x/fd/3d/5f/fd3d5f2ae8463d807e0fbc64c0c4fa23.jpg",
            "뱀꿈":         "https://i.pinimg.com/736x/41/8b/46/418b469c10eea1b164ba228df4c3de8e.jpg",
            "이빨빠지는꿈": "https://source.unsplash.com/400x400/?rabbit,white,cozy,soft",
            "돈꿈":         "https://source.unsplash.com/400x400/?rabbit,coins,treasure",
            "죽은사람꿈":   "https://source.unsplash.com/400x400/?rabbit,moon,night,dark",
            "불꿈":         "https://source.unsplash.com/400x400/?rabbit,fire,orange,warm",
            "물꿈":         "https://source.unsplash.com/400x400/?rabbit,water,rain,blue",
            "아기꿈":       "https://source.unsplash.com/400x400/?rabbit,baby,newborn,pink",
            "비행꿈":       "https://source.unsplash.com/400x400/?rabbit,sky,clouds,dream",
            "결혼꿈":       "https://source.unsplash.com/400x400/?rabbit,wedding,flowers,romance",
            "호랑이꿈":     "https://source.unsplash.com/400x400/?rabbit,wild,brave,jungle",
            "용꿈":         "https://source.unsplash.com/400x400/?rabbit,fantasy,magical,dragon",
            "똥꿈":         "https://source.unsplash.com/400x400/?rabbit,garden,earth,green",
            "복권꿈":       "https://source.unsplash.com/400x400/?rabbit,lucky,sparkle,star",
            "금꿈":         "https://source.unsplash.com/400x400/?rabbit,golden,shining,luxury",
            "귀신꿈":       "https://source.unsplash.com/400x400/?rabbit,ghost,dark,spooky",
            "쫓기는꿈":     "https://source.unsplash.com/400x400/?rabbit,running,speed,escape",
            "임신꿈":       "https://source.unsplash.com/400x400/?rabbit,family,cute,tender",
            "피꿈":         "https://source.unsplash.com/400x400/?rabbit,red,rose,dramatic",
            "황금꿈":       "https://source.unsplash.com/400x400/?rabbit,gold,treasure,rich",
            "고양이꿈":     "https://source.unsplash.com/400x400/?rabbit,cat,friends,pets",
            "전연인꿈":     "https://source.unsplash.com/400x400/?rabbit,love,couple,romantic",
            "머리카락꿈":   "https://source.unsplash.com/400x400/?rabbit,hair,beauty,grace",
            "싸우는꿈":     "https://source.unsplash.com/400x400/?rabbit,fight,strong,warrior",
            "개꿈":         "https://source.unsplash.com/400x400/?rabbit,dog,play,friends",
            "물고기꿈":     "https://source.unsplash.com/400x400/?rabbit,fish,ocean,aqua",
            "소꿈":         "https://source.unsplash.com/400x400/?rabbit,farm,field,country",
            "하늘꿈":       "https://source.unsplash.com/400x400/?rabbit,sky,heaven,clouds",
            "집꿈":         "https://source.unsplash.com/400x400/?rabbit,house,home,cozy",
            "봉황꿈":       "https://source.unsplash.com/400x400/?rabbit,phoenix,colorful,magic",
            "새꿈":         "https://source.unsplash.com/400x400/?rabbit,bird,wings,feather",
            "말꿈":         "https://source.unsplash.com/400x400/?rabbit,horse,field,wild",
            "토끼꿈":       "https://source.unsplash.com/400x400/?rabbit,bunny,fluffy,cute",
            "곰꿈":         "https://source.unsplash.com/400x400/?rabbit,bear,forest,cozy",
            "바다꿈":       "https://source.unsplash.com/400x400/?rabbit,sea,beach,waves",
            "무지개꿈":     "https://source.unsplash.com/400x400/?rabbit,rainbow,colorful,hope",
            "산꿈":         "https://source.unsplash.com/400x400/?rabbit,mountain,peak,nature",
            "추락꿈":       "https://source.unsplash.com/400x400/?rabbit,falling,air,gravity",
            "시험꿈":       "https://source.unsplash.com/400x400/?rabbit,study,book,school",
            "부모꿈":       "https://source.unsplash.com/400x400/?rabbit,family,parent,warm",
          };

          function DreamCard({ kw, rank }: { kw: string; rank: number }) {
            const d = DREAMS[kw];
            if (!d) return null;
            const badge = rank === 1 ? "🔥 1위" : rank <= 3 ? `🔥 ${rank}위` : `${rank}위`;
            const badgeBg = rank === 1 ? "#dc2626" : rank <= 3 ? "#7c3aed" : "rgba(0,0,0,0.55)";
            return (
              <div onClick={() => goTo(kw)} style={{ aspectRatio: "1 / 1", borderRadius: 12, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: "0 2px 8px rgba(139,92,246,0.18)" }}>
                <img src={IMGS[kw]} alt={kw} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 75%)" }} />
                <span style={{ position: "absolute", top: 4, left: 4, background: badgeBg, color: "#fff", fontSize: 8, fontWeight: 900, padding: "2px 5px", borderRadius: 8, whiteSpace: "nowrap" }}>{badge}</span>
                <div style={{ position: "absolute", bottom: 5, left: 0, right: 0, textAlign: "center" }}>
                  <div style={{ fontSize: kw.length > 6 ? 8 : 10, fontWeight: 900, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,1)", lineHeight: 1.3 }}>{kw}</div>
                  <div style={{ fontSize: 8, color: d.luck === "길몽" ? "#6ee7b7" : d.luck === "흉몽" ? "#fca5a5" : "#c4b5fd", fontWeight: 700, marginTop: 1 }}>{d.luck}</div>
                </div>
              </div>
            );
          }

          const top20 = POPULAR_DREAMS.slice(0, 20);
          const next20 = POPULAR_DREAMS.slice(20, 40);

          return (
            <>
              {/* 1~20위 */}
              <div id="popular-top20" style={{ marginTop: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(139,92,246,0.2)" }} />
                  <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", background: "linear-gradient(135deg,#dc2626,#7c3aed)", padding: "5px 14px", borderRadius: 20, whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(220,38,38,0.4)" }}>🔥 인기 꿈 TOP 20</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(139,92,246,0.2)" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7 }}>
                  {top20.map((kw, i) => <DreamCard key={kw} kw={kw} rank={i + 1} />)}
                </div>
              </div>

              {/* 21~40위 */}
              <div style={{ marginTop: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(139,92,246,0.2)" }} />
                  <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", background: "linear-gradient(135deg,#7c3aed,#4c1d95)", padding: "5px 14px", borderRadius: 20, whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(124,58,237,0.4)" }}>🌙 꿈 해몽 더보기</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(139,92,246,0.2)" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7 }}>
                  {next20.map((kw, i) => <DreamCard key={kw} kw={kw} rank={i + 21} />)}
                </div>
              </div>
            </>
          );
        })()}

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
