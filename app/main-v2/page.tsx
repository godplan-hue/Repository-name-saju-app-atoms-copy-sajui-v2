"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

/*
  이미지 URL — Unsplash에서 동물명으로 직접 검색된 확실한 사진들
  source.unsplash.com/featured 방식: 키워드로 항상 해당 동물 사진을 반환
*/
const COURSES = [
  {
    id: "free",
    name: "학",
    emoji: "🦢",
    tag: "일부무료",
    tagColor: "#16a34a",
    tagBg: "#f0fdf4",
    priceStr: "무료",
    desc: "오늘의 무료 사주",
    bg: "linear-gradient(145deg, #f0fdf4, #dcfce7)",
    border: "#86efac",
    accentColor: "#16a34a",
    // 두루미(학) — Pexels red-crowned-crane
    urls: [
      "https://images.pexels.com/photos/36606279/pexels-photo-36606279.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/36606276/pexels-photo-36606276.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/36606281/pexels-photo-36606281.jpeg?auto=compress&cs=tinysrgb&w=300",
    ],
    animDelay: "0s",
    packageName: null,
    pages: 0,
  },
  {
    id: "taste",
    name: "호랑이",
    emoji: "🐯",
    tag: "1추르",
    tagColor: "#b45309",
    tagBg: "#fefce8",
    priceStr: "₩990",
    desc: "재물·성공운 심층 분석",
    bg: "linear-gradient(145deg, #fefce8, #fef9c3)",
    border: "#fde047",
    accentColor: "#b45309",
    // 호랑이 — Pexels tiger
    urls: [
      "https://images.pexels.com/photos/27834738/pexels-photo-27834738.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/27834731/pexels-photo-27834731.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=300&auto=format&fit=crop&q=80",
    ],
    animDelay: "0.5s",
    packageName: "기본 분석",
    pages: 30,
  },
  {
    id: "popular",
    name: "봉황",
    emoji: "🦚",
    tag: "🔥 인기",
    tagColor: "#be185d",
    tagBg: "#fdf2f8",
    priceStr: "₩4,950",
    desc: "연애·건강·성공 전분야",
    bg: "linear-gradient(145deg, #fdf2f8, #fce7f3)",
    border: "#f9a8d4",
    accentColor: "#be185d",
    // 공작새(봉황) — Pexels peacock
    urls: [
      "https://images.pexels.com/photos/36606292/pexels-photo-36606292.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/4618412/pexels-photo-4618412.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=300&auto=format&fit=crop&q=80",
    ],
    animDelay: "1s",
    packageName: "베이직",
    pages: 75,
  },
  {
    id: "vip",
    name: "용",
    emoji: "🐲",
    tag: "👑 최고",
    tagColor: "#6d28d9",
    tagBg: "#f5f3ff",
    priceStr: "₩9,990",
    desc: "무제한 전체 운세",
    bg: "linear-gradient(145deg, #f5f3ff, #ede9fe)",
    border: "#c4b5fd",
    accentColor: "#6d28d9",
    // 용(드래곤 조각상) — Pexels dragon
    urls: [
      "https://images.pexels.com/photos/37535284/pexels-photo-37535284.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/7700740/pexels-photo-7700740.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/17063841/pexels-photo-17063841.jpeg?auto=compress&cs=tinysrgb&w=300",
    ],
    animDelay: "1.5s",
    packageName: "프리미엄",
    pages: 100,
  },
  {
    id: "couple",
    name: "거북",
    emoji: "🐢",
    tag: "💑 커플",
    tagColor: "#0e7490",
    tagBg: "#ecfeff",
    priceStr: "₩9,900",
    desc: "커플 궁합·인연 분석",
    bg: "linear-gradient(145deg, #ecfeff, #cffafe)",
    border: "#67e8f9",
    accentColor: "#0e7490",
    // 바다거북 — Pexels sea turtle
    urls: [
      "https://images.pexels.com/photos/36132584/pexels-photo-36132584.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/4767913/pexels-photo-4767913.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/20443161/pexels-photo-20443161.jpeg?auto=compress&cs=tinysrgb&w=300",
    ],
    animDelay: "2s",
    packageName: "VIP",
    pages: 100,
  },
];

// 이미지 로드 실패 시 다음 URL 시도, 모두 실패 시 이모지 표시
function AnimalImg({
  urls, emoji, bg, alt, style,
}: {
  urls: string[]; emoji: string; bg: string; alt: string; style?: React.CSSProperties;
}) {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed || idx >= urls.length) {
    return (
      <div style={{ width: "100%", height: "100%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
        {emoji}
      </div>
    );
  }
  return (
    <img
      key={idx}
      src={urls[idx]}
      alt={alt}
      style={style}
      loading="lazy"
      onError={() => {
        if (idx + 1 < urls.length) setIdx(idx + 1);
        else setFailed(true);
      }}
    />
  );
}

const BANNERS = [
  {
    img: "https://i.pinimg.com/736x/43/62/22/436222b26a1aeebae92aaa7eaa2f5ea3.jpg",
    badge: "🐱 점운",
    badgeBg: G,
    lines: ["점운에 오신 걸 환영합니다", "특별이벤트", "사주 990원"],
    lineSizes: [17, 20, 24],
    lineColors: ["#fff700", "#ffffff", "#ff3b3b"],
    overlay: "linear-gradient(135deg, rgba(236,72,153,0.55) 0%, rgba(139,92,246,0.55) 100%)",
    fit: "contain" as const,
  },
  {
    img: "https://i.pinimg.com/736x/2f/b6/d4/2fb6d40a9b80a685052a1174960ec782.jpg",
    badge: "✨ 무료",
    badgeBg: "#16a34a",
    lines: ["무료인데 이렇게 상세할수가?", "인생을 바꿀 인생 역전 포인트까지", "지금 무료로 시작하기"],
    lineSizes: [15, 16, 20],
    lineColors: ["#ffffff", "#fff700", "#7df9c2"],
    overlay: "linear-gradient(135deg, rgba(22,163,74,0.52) 0%, rgba(16,185,129,0.45) 100%)",
    fit: "contain" as const,
  },
  {
    img: "https://i.pinimg.com/736x/2d/a5/2b/2da52b98d2ad341ad3b3f33d35dfd98f.jpg",
    badge: "💰 재물운",
    badgeBg: "#b45309",
    lines: ["돈 들어올 때", "노젓는 비법", "돈복 터지는 시기 확인하기"],
    lineSizes: [18, 12, 16],
    lineColors: ["#f9a8d4", "#fff700", "#7df9c2"],
    overlay: "linear-gradient(135deg, rgba(180,83,9,0.4) 0%, rgba(245,158,11,0.35) 100%)",
    fit: "contain" as const,
  },
  {
    img: "https://i.pinimg.com/736x/8b/bc/25/8bbc258261ea953d149de68672016367.jpg",
    badge: "💕 연애운",
    badgeBg: "#ec4899",
    lines: ["사랑이 찾아오는 시기", "연애운 심층 분석", "내 인연의 흐름을 확인해보세요"],
    lineSizes: [20, 16, 15],
    overlay: "linear-gradient(135deg, rgba(236,72,153,0.55) 0%, rgba(239,68,68,0.45) 100%)",
    fit: "contain" as const,
  },
];

const FORTUNE_CATEGORIES = [
  { id: "yearly", title: "올해 운세", emoji: "🎍", bg: "linear-gradient(145deg, #fce7f3, #fbcfe8)", accent: "#db2777" },
  { id: "monthly", title: "월별 운세", emoji: "📆", img: "https://i.pinimg.com/736x/26/b0/8e/26b08e17fba8ae7d44a34a2633dc05b4.jpg", bg: "linear-gradient(145deg, #ede9fe, #ddd6fe)", accent: "#6d28d9" },
  { id: "wealth", title: "재물운", emoji: "💰", bg: "linear-gradient(145deg, #fef3c7, #fde68a)", accent: "#b45309" },
  { id: "love", title: "연애운", emoji: "💕", bg: "linear-gradient(145deg, #fdf2f8, #fbcfe8)", accent: "#be185d" },
  { id: "health", title: "건강운", emoji: "🍀", bg: "linear-gradient(145deg, #dcfce7, #bbf7d0)", accent: "#16a34a" },
  { id: "compatibility", title: "궁합분석", emoji: "💑", bg: "linear-gradient(145deg, #dbeafe, #bfdbfe)", accent: "#1d4ed8" },
  { id: "naming", title: "이름분석", emoji: "✍️", bg: "linear-gradient(145deg, #ecfeff, #cffafe)", accent: "#0e7490" },
  { id: "full", title: "전체 사주분석", emoji: "🔮", img: "https://i.pinimg.com/736x/83/02/5e/83025ec3d960580b277cc7ce00f8c0c8.jpg", bg: "linear-gradient(145deg, #fce7f3, #f9a8d4)", accent: "#9d174d" },
];

function FortuneGrid({ onPick }: { onPick: (id: string) => void }) {
  return (
    <section style={{ padding: "0 14px 28px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", margin: "0 0 12px", textAlign: "center" }}>운세 선택</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {FORTUNE_CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={() => onPick(cat.id)}
              style={{
                aspectRatio: "1 / 1",
                background: (cat as any).img ? undefined : cat.bg, borderRadius: 16, cursor: "pointer",
                position: "relative", overflow: "hidden",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                boxShadow: `0 3px 14px ${cat.accent}1f`,
              }}
            >
              {(cat as any).img ? (
                <>
                  <img src={(cat as any).img} alt={cat.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)" }} />
                  <div style={{ position: "relative", fontSize: 10, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.2, padding: "0 2px", marginTop: "auto", marginBottom: 6, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>{cat.title}</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{cat.emoji}</div>
                  <div style={{ fontSize: 10, fontWeight: 900, color: cat.accent, textAlign: "center", lineHeight: 1.2, padding: "0 2px" }}>{cat.title}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BannerSlider({ onStart }: { onStart: () => void }) {
  const [cur, setCur] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startXRef = useRef<number | null>(null);

  const resetTimer = (next: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCur(c => (c + 1) % BANNERS.length), 5000);
    setCur(next);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setCur(c => (c + 1) % BANNERS.length), 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const b = BANNERS[cur];

  const lineColors = ["#fff700", "#ffffff", "#ffd6f0"];

  return (
    <div style={{ padding: "16px 14px 0", maxWidth: 480, margin: "0 auto" }}>
      <div
        style={{ height: 320, borderRadius: 20, position: "relative", overflow: "hidden", cursor: "pointer", boxShadow: "0 6px 28px rgba(139,92,246,0.18)", background: "#f9f0ff" }}
        onClick={onStart}
        onTouchStart={e => { startXRef.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (startXRef.current === null) return;
          const dx = e.changedTouches[0].clientX - startXRef.current;
          if (Math.abs(dx) > 40) resetTimer(dx < 0 ? (cur + 1) % BANNERS.length : (cur - 1 + BANNERS.length) % BANNERS.length);
          startXRef.current = null;
        }}
      >
        <img src={b.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "opacity 0.4s" }} />
        {/* 하단 텍스트 그라데이션 */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "38%", background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)", pointerEvents: "none" }} />
        {/* 수동 다음 화살표 — 자동 회전은 그대로 유지, 클릭하면 즉시 다음으로 + 타이머 리셋 */}
        <button
          onClick={e => { e.stopPropagation(); resetTimer((cur + 1) % BANNERS.length); }}
          aria-label="다음 배너"
          style={{ position: "absolute", top: "50%", right: 10, transform: "translateY(-50%)", zIndex: 3, width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.35)", color: "white", fontSize: 18, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          ›
        </button>
        {/* 배지 */}
        <span style={{ position: "absolute", top: 14, left: 16, display: "inline-block", background: b.badgeBg, color: "white", fontSize: 11, fontWeight: 900, padding: "4px 12px", borderRadius: 20, zIndex: 2 }}>{b.badge}</span>
        {/* 텍스트 + 인디케이터 — 이미지 하단 안쪽 */}
        <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, zIndex: 2 }}>
          {b.lines.map((line, i) => (
            <p key={i} style={{ fontSize: (b as any).lineSizes?.[i] ?? (i === 0 ? 17 : 12), fontWeight: i === 0 ? 900 : 700, color: (b as any).lineColors?.[i] ?? lineColors[i] ?? "white", margin: "0 0 2px", lineHeight: 1.35, textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}>{line}</p>
          ))}
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {BANNERS.map((_, i) => (
              <div key={i} onClick={e => { e.stopPropagation(); resetTimer(i); }}
                style={{ width: cur === i ? 22 : 7, height: 7, borderRadius: 99, background: cur === i ? "white" : "rgba(255,255,255,0.45)", transition: "all 0.3s ease", cursor: "pointer" }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 32 }} />
    </div>
  );
}

export default function MainV2() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("v2_user_name");
    if (saved) setUser(saved);
  }, []);

  const handleCourse = (c: typeof COURSES[0]) => {
    if (c.id === "free") {
      router.push(user ? "/main-v2/analysis" : "/main-v2/login");
    } else {
      sessionStorage.setItem("selectedPackage", c.packageName ?? "");
      router.push(`/payment-complete?package=${encodeURIComponent(c.packageName ?? "")}&pages=${c.pages}`);
    }
  };

  if (!mounted) return null;

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", overflowX: "hidden" }}>

      {/* 헤더 */}
      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.12)", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20 }}>🐱</span>
          <span style={{ fontWeight: 900, fontSize: 16, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>점운</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {user
            ? <span style={{ fontSize: 12, color: "#8b5cf6", fontWeight: 700 }}>{user}님 👋</span>
            : <button onClick={() => router.push("/main-v2/login")} style={{ padding: "6px 14px", background: G, color: "white", border: "none", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>로그인</button>
          }
          <button onClick={() => router.push("/main-v2/history")} style={{ padding: "6px 12px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.25)", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>📂</button>
        </div>
      </header>

      {/* 슬라이드 배너 */}
      <BannerSlider onStart={() => router.push(user ? "/main-v2/analysis" : "/main-v2/login")} />

      {/* 운세 선택 — 8개 박스 그리드 */}
      <FortuneGrid onPick={id => { sessionStorage.setItem("selectedFortune", id); router.push("/main-v2/payment"); }} />

      {/* 히어로 */}
      <section style={{ padding: "24px 16px 0", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "rgba(236,72,153,0.1)", borderRadius: 20, marginBottom: 12 }}>
          <span style={{ fontSize: 12 }}>🌸</span>
          <span style={{ fontSize: 12, color: "#ec4899", fontWeight: 700 }}>오늘의 무료사주</span>
        </div>
        {/* 마법사 고양이 이미지 */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: 8 }}>
          <img
            src="/saju-cat.png"
            alt="사주 마법사 고양이"
            style={{
              width: 220, height: 220, objectFit: "cover", objectPosition: "center top",
              borderRadius: 32,
              boxShadow: "0 12px 40px rgba(139,92,246,0.3)",
              animation: "catFloat 3s ease-in-out infinite",
            }}
          />
          <div style={{
            position: "absolute", bottom: -8, right: -8,
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            color: "white", fontSize: 10, fontWeight: 900,
            padding: "4px 10px", borderRadius: 20,
            boxShadow: "0 3px 12px rgba(139,92,246,0.4)",
          }}>✨ AI 사주 점운</div>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px", lineHeight: 1.3 }}>
          고양이가 읽는{" "}
          <span style={{ background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>나의 운명</span>
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 4px" }}>
          고양이가 읽는 나의 운명
        </p>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>
          AI로 운세를 분석해 드립니다
        </p>
      </section>

      {/* 하단 CTA */}
      <section style={{ padding: "28px 16px 48px", textAlign: "center", background: "rgba(255,255,255,0.5)", borderTop: "1px solid rgba(236,72,153,0.1)" }}>
        <div style={{ fontSize: 56, marginBottom: 10, display: "inline-block", animation: "animalFloat 3s ease-in-out infinite" }}>😺</div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>지금 운명을 확인하세요</h2>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 18px" }}>다섯 신령한 동물이 당신의 길을 안내합니다 🐾</p>
        <button onClick={() => router.push(user ? "/main-v2/analysis" : "/main-v2/login")}
          style={{ display: "block", width: "100%", maxWidth: 300, margin: "0 auto", padding: "14px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 28px rgba(236,72,153,0.35)" }}>
          🔮 무료 학 코스 시작
        </button>
      </section>

      {/* 푸터 */}
      <footer style={{ padding: "18px 16px", textAlign: "center", borderTop: "1px solid rgba(236,72,153,0.1)", background: "white" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 5 }}>
          <span>🐱</span>
          <span style={{ fontSize: 13, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>점운</span>
        </div>
        <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 5px" }}>© 2026 점운 · AI 동양 사주 분석</p>
        <div style={{ fontSize: 11 }}>
          <a href="/privacy" style={{ color: "#ec4899", textDecoration: "none", fontWeight: 600 }}>개인정보처리방침</a>
          <span style={{ color: "#e5e7eb", margin: "0 8px" }}>|</span>
          <a href="/refund" style={{ color: "#ec4899", textDecoration: "none", fontWeight: 600 }}>환불정책</a>
        </div>
      </footer>

      <style jsx>{`
        @keyframes animalFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-9px); }
        }
        @keyframes catFloat {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-10px) rotate(1deg); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}
