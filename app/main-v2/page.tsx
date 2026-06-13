"use client";

import { useState, useEffect } from "react";
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
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>
          다섯 신령한 동물이 AI로 운세를 분석해 드립니다
        </p>

        {/* 상단 5개 떠다니는 원형 동물 사진 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20, overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {COURSES.map(c => (
            <div key={c.id} onClick={() => handleCourse(c)} style={{ flexShrink: 0, textAlign: "center", cursor: "pointer" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%", overflow: "hidden",
                border: `3px solid ${c.border}`,
                boxShadow: `0 6px 20px ${c.accentColor}40`,
                margin: "0 auto 6px",
                animation: `animalFloat 2.6s ease-in-out infinite`,
                animationDelay: c.animDelay,
              }}>
                <AnimalImg urls={c.urls} emoji={c.emoji} bg={c.bg} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 900, color: c.accentColor }}>{c.emoji} {c.name}</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>{c.priceStr}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push(user ? "/main-v2/analysis" : "/main-v2/login")}
          style={{ display: "block", width: "100%", maxWidth: 300, margin: "0 auto 6px", padding: "14px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 28px rgba(236,72,153,0.35)" }}
        >
          🔮 무료 사주 시작
        </button>
        <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 24 }}>⏱ 30초 완료 · 무료</p>
      </section>

      {/* 하단 5개 카드 — 동일 크기/구조 */}
      <section style={{ padding: "0 14px 32px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#6b7280", textAlign: "center", margin: "0 0 12px" }}>신령한 다섯 동물 코스</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {COURSES.map(course => (
              <div
                key={course.id}
                onClick={() => handleCourse(course)}
                style={{
                  background: course.bg,
                  border: `2px solid ${course.border}`,
                  borderRadius: 20,
                  padding: "14px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  position: "relative",
                  boxShadow: `0 3px 16px ${course.accentColor}15`,
                  transition: "transform 0.13s, box-shadow 0.13s",
                  minHeight: 100,
                }}
                onTouchStart={e => (e.currentTarget.style.transform = "scale(0.97)")}
                onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 26px ${course.accentColor}28`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 3px 16px ${course.accentColor}15`; }}
              >
                {/* 태그 */}
                <div style={{ position: "absolute", top: 10, right: 12, background: course.tagBg, color: course.tagColor, fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 20, border: `1px solid ${course.border}` }}>
                  {course.tag}
                </div>

                {/* 왼쪽 원형 동물 사진 */}
                <div style={{
                  flexShrink: 0, width: 88, height: 88,
                  borderRadius: "50%", overflow: "hidden",
                  border: `3px solid ${course.border}`,
                  boxShadow: `0 4px 16px ${course.accentColor}30`,
                  animation: `animalFloat 2.8s ease-in-out infinite`,
                  animationDelay: course.animDelay,
                }}>
                  <AnimalImg
                    urls={course.urls}
                    emoji={course.emoji}
                    bg={course.bg}
                    alt={course.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* 텍스트 */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: course.accentColor, marginBottom: 3 }}>{course.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: 8 }}>{course.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: course.accentColor }}>{course.priceStr}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, background: course.accentColor, color: "white", padding: "4px 12px", borderRadius: 20 }}>
                      보러가기 →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 포인트 안내 */}
      <section style={{ padding: "0 14px 24px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "16px", border: "1.5px solid rgba(236,72,153,0.1)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", margin: "0 0 12px", textAlign: "center" }}>🪙 추르 & 냥 포인트 시스템</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { icon: "🦢", name: "맛보기", price: "₩990",   point: "1추르",        bg: "#f0fdf4", color: "#16a34a" },
                { icon: "🐯", name: "초보",   price: "₩2,970", point: "3추르+1냥",    bg: "#fefce8", color: "#b45309" },
                { icon: "🦚", name: "단골",   price: "₩4,950", point: "5추르+2냥",    bg: "#fdf2f8", color: "#be185d" },
                { icon: "🐲", name: "에작",   price: "₩9,990", point: "10추르 보너스", bg: "#f5f3ff", color: "#6d28d9" },
              ].map(p => (
                <div key={p.name} style={{ background: p.bg, borderRadius: 12, padding: "12px 8px", textAlign: "center", border: `1px solid ${p.color}22` }}>
                  <div style={{ fontSize: 22, marginBottom: 3 }}>{p.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: "#1a1a2e" }}>{p.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: p.color, margin: "2px 0" }}>{p.price}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>{p.point}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 후기 */}
      <section style={{ padding: "0 14px 36px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", margin: "0 0 12px", textAlign: "center" }}>실제 이용자 후기 ⭐</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { emoji: "🦢", name: "김혜진", stars: 5, title: "학 코스 무료인데 소름 돋았어요", body: "무료인데 이렇게 자세히 나올 줄 몰랐어요. 올해 재물운 흐름이 딱 맞았습니다.", bg: "#f0fdf4", color: "#16a34a" },
              { emoji: "🐯", name: "이재우", stars: 5, title: "호랑이 코스 진짜 도움됐어요",   body: "점수로 보여주니 한눈에 파악이 돼요. 성공운 분석이 특히 정확했어요.", bg: "#fefce8", color: "#b45309" },
              { emoji: "🐲", name: "박연지", stars: 5, title: "용 코스 가족 모두 추천해요",     body: "무제한으로 여러 카테고리 다 해봤는데, 가족들한테도 다 추천했어요!", bg: "#f5f3ff", color: "#6d28d9" },
            ].map((r, i) => (
              <div key={i} style={{ background: r.bg, borderRadius: 16, padding: "14px", border: `1.5px solid ${r.color}22` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 26 }}>{r.emoji}</span>
                  <span style={{ fontSize: 12, color: "#f59e0b" }}>{"★".repeat(r.stars)}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 900, color: r.color, marginBottom: 4 }}>{r.title}</div>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 4px", lineHeight: 1.6 }}>{r.body}</p>
                <div style={{ fontSize: 11, color: "#d1d5db", textAlign: "right" }}>* {r.name}</div>
              </div>
            ))}
          </div>
        </div>
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
        <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 5px" }}>© 2024 점운 · AI 동양 사주 분석</p>
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
