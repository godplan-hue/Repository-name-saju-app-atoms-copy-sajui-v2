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
  { kw: "돼지꿈",       rank: "🔥 1위", img: "https://i.pinimg.com/736x/74/ba/c0/74bac0a9d860073c073c661656f25416.jpg", sub: "꿈만 꿔도 재물이 들어온다", luck: "길몽" },
  { kw: "뱀꿈",         rank: "🔥 2위", img: "https://i.pinimg.com/736x/c2/b3/c9/c2b3c993f2a0fbf3bb0a0e2d72f0d241.jpg", sub: "큰 변화와 재물의 신호",   luck: "길몽" },
  { kw: "용꿈",         rank: "🔥 3위", img: "https://i.pinimg.com/1200x/f9/11/47/f91147ffa1ccd1c892e6d95f05d87391.jpg", sub: "최고의 길몽, 대박 운수",  luck: "길몽" },
  { kw: "이빨빠지는꿈", rank: "4위",    img: "https://i.pinimg.com/736x/f9/03/f9/f903f92a0594ede30a2f195b1d3d4605.jpg", sub: "건강·가족을 돌아볼 신호", luck: "흉몽" },
  { kw: "황금꿈",       rank: "5위",    img: "https://i.pinimg.com/736x/49/85/1a/49851abdf36f75ae18cb4dad32c25989.jpg", sub: "황금이 가득, 재물운 폭발", luck: "길몽" },
  { kw: "호랑이꿈",     rank: "6위",    img: "https://i.pinimg.com/736x/e4/99/f8/e499f89b6a79c6ea44ae2093f172225a.jpg", sub: "권위와 성공의 상징",      luck: "길몽" },
];

const DREAM_GRID = [
  { id: "animal",    label: "동물꿈",    sub: "뱀·돼지·호랑이",  img: "https://i.pinimg.com/1200x/d7/ca/d8/d7cad8ca5f1337f28d678deee886ff54.jpg", accent: "#16a34a", price: "길몽대표", priceBg: "#15803d" },
  { id: "money",     label: "재물·돈꿈", sub: "돈·금·로또·복권",  img: "https://i.pinimg.com/736x/36/06/84/3606843225d11707a97beb9b4fc7d9b6.jpg", accent: "#b45309", price: "황금길몽", priceBg: "#b45309" },
  { id: "person",    label: "사람꿈",    sub: "가족·연인·귀인",    img: "https://i.pinimg.com/736x/77/70/fe/7770fec176a72cccc7b20a36dfc37aa4.jpg", accent: "#1d4ed8", price: "인연",     priceBg: "#2563eb" },
  { id: "body",      label: "신체꿈",    sub: "이빨·머리·피",      img: "https://i.pinimg.com/1200x/58/f4/81/58f481cad518714eca8378fd8bd1e194.jpg", accent: "#7c3aed", price: "건강신호",  priceBg: "#7c3aed" },
  { id: "nature",    label: "자연꿈",    sub: "물·불·비·하늘",     img: "https://i.pinimg.com/1200x/34/9f/c7/349fc71f752ed210f1ee6f48b81cc623.jpg", accent: "#0284c7", price: "자연운",   priceBg: "#0369a1" },
  { id: "situation", label: "상황꿈",    sub: "비행·결혼·시험",    img: "https://i.pinimg.com/736x/fa/6f/32/fa6f32b28637da7da0a60cc23c13e197.jpg", accent: "#ea580c", price: "행동운",   priceBg: "#c2410c" },
  { id: "object",    label: "사물꿈",    sub: "집·차·음식",        img: "https://i.pinimg.com/736x/06/0f/0e/060f0e83df4f83e18073ce2e559b5d2a.jpg", accent: "#6d28d9", price: "일상운",   priceBg: "#5b21b6" },
  { id: "special",   label: "길몽 모음", sub: "용·봉황·황금",      img: "https://i.pinimg.com/1200x/20/5d/fb/205dfb716469895c4d06b6aea9e9e5d5.jpg", accent: "#b45309", price: "⭐ 대길",  priceBg: "#ca8a04", priceColor: "#1a1a2e" },
  { id: "top",       label: "인기 꿈 TOP",sub: "뱀·돼지·똥꿈",    img: "https://i.pinimg.com/736x/d5/cd/d9/d5cdd94c7d9e648e573553c8c856338f.jpg", accent: "#be185d", price: "🔥 인기",  priceBg: "#be185d" },
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

        {/* 크몽·탈잉 신뢰 문구 */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#f97316", fontWeight: 900, marginBottom: 14, letterSpacing: "0.02em", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
          🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
        </p>

        {/* 검색창 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, background: "rgba(255,255,255,0.9)", borderRadius: 14, padding: "6px 6px 6px 14px", boxShadow: "0 2px 12px rgba(139,92,246,0.15)", border: "1px solid rgba(236,72,153,0.2)" }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예) 뱀, 동물, 길몽, 재물, 결혼, 죽음"
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
            "돼지꿈":       "https://i.pinimg.com/736x/10/4d/a5/104da5e45959e39ec7bb6144b06b21e1.jpg",
            "뱀꿈":         "https://i.pinimg.com/736x/72/7b/9d/727b9d0869f4597a4bd67d417d9de9b4.jpg",
            "이빨빠지는꿈": "https://i.pinimg.com/736x/fe/78/dc/fe78dcb844cf5f8373b59f15b2bf54d8.jpg",
            "돈꿈":         "https://i.pinimg.com/736x/bb/a0/05/bba0053587cb49928fa2fdc7e54f68cc.jpg",
            "죽은사람꿈":   "https://i.pinimg.com/736x/b8/15/9a/b8159ae12fec635a9020bf70cdb408cf.jpg",
            "불꿈":         "https://i.pinimg.com/736x/3a/7c/fc/3a7cfc0c5dde753a16fcbbcc2b7c200c.jpg",
            "물꿈":         "https://i.pinimg.com/736x/25/06/6c/25066c1efd90eb2418c84abb98018d97.jpg",
            "아기꿈":       "https://i.pinimg.com/736x/53/ee/4a/53ee4accea0f199915cbac919a93c1e3.jpg",
            "비행꿈":       "https://i.pinimg.com/736x/fa/61/84/fa618485b4e2ad3b6c2ec439eeb406de.jpg",
            "결혼꿈":       "https://i.pinimg.com/vwebp/1200x/c6/b3/17/c6b31798b526bcffb34bc5b93b16015c.webp",
            "호랑이꿈":     "https://i.pinimg.com/736x/c0/36/e1/c036e1dfa1655878982bb04f7fb5fb37.jpg",
            "용꿈":         "https://i.pinimg.com/736x/46/d9/32/46d9328eb3d24ad3292558a0b96c8d35.jpg",
            "똥꿈":         "https://i.pinimg.com/1200x/56/ec/90/56ec90ba356b89216fdb4339591c58d6.jpg",
            "복권꿈":       "https://i.pinimg.com/736x/b7/88/bd/b788bd8874cdef070963d5897e7e1bad.jpg",
            "금꿈":         "https://i.pinimg.com/1200x/77/b0/31/77b0310e3a25b42f2790747e001bdc3a.jpg",
            "귀신꿈":       "https://i.pinimg.com/736x/61/26/b9/6126b93709a917ffd31e57abc58e5ca9.jpg",
            "쫓기는꿈":     "https://i.pinimg.com/1200x/4c/9f/b7/4c9fb72f9a06683d7d6ef50181bd3abd.jpg",
            "임신꿈":       "https://i.pinimg.com/1200x/89/b7/6b/89b76bf3bd66e09355e408f268757af4.jpg",
            "피꿈":         "https://i.pinimg.com/1200x/5b/5c/da/5b5cda1161387bf9c71159b12733eba9.jpg",
            "황금꿈":       "https://i.pinimg.com/736x/e4/d2/9c/e4d29c70a0ce3da926d9f86b478bbfbb.jpg",
            "고양이꿈":     "https://i.pinimg.com/736x/47/d5/9a/47d59a4ec29143803fc19a207c68d1f4.jpg",
            "전연인꿈":     "https://i.pinimg.com/1200x/26/c1/42/26c1429feb789b49c1d1fc43610f6449.jpg",
            "머리카락꿈":   "https://i.pinimg.com/736x/0f/54/8f/0f548f9cdf6177cb83fc63b90f6825c0.jpg",
            "싸우는꿈":     "https://i.pinimg.com/736x/fa/49/d4/fa49d46c12cf4ea5901f81c4661f8e05.jpg",
            "개꿈":         "https://i.pinimg.com/736x/da/a2/5a/daa25a0649bce85fbca93fd7d28aa19d.jpg",
            "물고기꿈":     "https://i.pinimg.com/736x/fe/4c/3d/fe4c3d29c185f3192594dabfb826043e.jpg",
            "소꿈":         "https://i.pinimg.com/736x/98/d3/32/98d3323c597af43e7016752e5ea6b522.jpg",
            "하늘꿈":       "https://i.pinimg.com/1200x/c2/9a/29/c29a293c24fed5fcfaa7a875c033d940.jpg",
            "집꿈":         "https://i.pinimg.com/736x/3a/8d/d4/3a8dd49545181ab2f33e283a7deea51a.jpg",
            "봉황꿈":       "https://i.pinimg.com/736x/0d/67/6f/0d676fc2cd2241d503f9e74ab9d3455b.jpg",
            "새꿈":         "https://i.pinimg.com/736x/54/b0/7c/54b07c17d425eb39ae06aa1c6e3a4604.jpg",
            "말꿈":         "https://i.pinimg.com/1200x/53/e0/bf/53e0bf368d285359a50dce2824be9347.jpg",
            "토끼꿈":       "https://i.pinimg.com/1200x/ae/25/71/ae257101a6411d211514c22ab29a375d.jpg",
            "곰꿈":         "https://i.pinimg.com/1200x/aa/d0/8f/aad08f8a95ea9a68ab12cd28d45c0b7a.jpg",
            "바다꿈":       "https://i.pinimg.com/736x/b0/a9/10/b0a9105f0e92401d726e2b4db30a79fc.jpg",
            "무지개꿈":     "https://i.pinimg.com/736x/4e/0e/16/4e0e16063e90f0bfe0d5efb412bd3bab.jpg",
            "산꿈":         "https://i.pinimg.com/1200x/47/33/53/473353b38c3ed2e27ae0b3afd3ebf939.jpg",
            "추락꿈":       "https://i.pinimg.com/1200x/77/c8/79/77c879c5aeaf0ee325db334d7cff858a.jpg",
            "시험꿈":       "https://i.pinimg.com/1200x/67/f8/e4/67f8e403e22a00ed6ecd00dc1e252073.jpg",
            "부모꿈":       "https://i.pinimg.com/736x/54/95/12/54951211ccfab5d2091b689b3fc83282.jpg",
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
          <img src="https://i.pinimg.com/1200x/ed/76/4d/ed764da4ef5dd4e2048939ac2e95dd6f.jpg" alt="사주보기" style={{ width: "100%", height: 110, objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(236,72,153,0.72) 0%, rgba(139,92,246,0.65) 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
            <div>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 15, margin: "0 0 2px", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>🐱 꿈 + 사주로 더 정확하게</p>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, margin: 0 }}>내 사주까지 보면 꿈의 의미가 선명해요</p>
            </div>
            <span style={{ background: "#fff", color: "#be185d", fontWeight: 900, fontSize: 12, padding: "8px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>보기 →</span>
          </div>
        </div>

        {/* 푸터 */}
        <footer style={{ padding: "32px 0 8px", textAlign: "center" }}>
          <div style={{ maxWidth: 360, margin: "0 auto", padding: "18px 16px", borderRadius: 20, background: "#fdf2f8", border: "1.5px solid #f9a8d4" }}>
            <p style={{ color: "#9d174d", fontSize: 11, fontWeight: 700, margin: "0 0 8px" }}>© 2026 점운 꿈해몽 · Powered by 점운</p>
            <div style={{ color: "#831843", fontSize: 10.5, fontWeight: 700, lineHeight: 1.8, marginBottom: 12, letterSpacing: "0.1px" }}>
              <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신</p>
              <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
              <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
              <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38,<br />7층 7017호(대치동)</p>
              <p style={{ margin: 0 }}>대표전화 010-2106-2689 · 유선 031-585-7255</p>
              <p style={{ margin: "2px 0 0", color: "#dc2626", fontWeight: 900 }}>※ 전화 문의는 받지 않습니다. 카카오톡으로 문의해 주세요.</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 10 }}>
              <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "6px 16px", background: "#FEE500", color: "#1a1a1a", borderRadius: 20, textDecoration: "none", fontWeight: 800, fontSize: 11 }}>💬 카카오톡 문의</a>
              <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ display: "inline-block", padding: "6px 16px", border: "1.5px solid #f472b6", borderRadius: 20, color: "#be185d", textDecoration: "none", fontWeight: 800, fontSize: 11 }}>📧 이메일 문의</a>
            </div>
            <div style={{ fontSize: 11 }}>
              <a href="/terms" style={{ color: "#9d174d", textDecoration: "none", fontWeight: 600 }}>이용약관</a>
              <span style={{ color: "#f9a8d4", margin: "0 8px" }}>|</span>
              <a href="/privacy" style={{ color: "#9d174d", textDecoration: "none", fontWeight: 600 }}>개인정보처리방침</a>
              <span style={{ color: "#f9a8d4", margin: "0 8px" }}>|</span>
              <a href="/refund" style={{ color: "#9d174d", textDecoration: "none", fontWeight: 600 }}>환불정책</a>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
