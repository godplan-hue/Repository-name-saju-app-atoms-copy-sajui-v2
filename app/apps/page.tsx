"use client";
import { useState, useEffect } from "react";

const UNLOCK_KEYS: Record<string, string> = {
  "/momcare":  "momcare_unlock_until",
  "/gamjung":  "gamjung_unlock_until",
  "/diet":     "diet_unlock_until",
  "/budget":   "budget_unlock_until",
};

function getUnlockStatus(key: string): { days: number; expired: boolean } {
  try {
    const val = localStorage.getItem(key);
    if (!val) return { days: 0, expired: false };
    const until = Number(val);
    if (until < Date.now()) return { days: 0, expired: true };
    return { days: Math.ceil((until - Date.now()) / (24 * 60 * 60 * 1000)), expired: false };
  } catch { return { days: 0, expired: false }; }
}

const TOP_APPS = [
  {
    href: "/haemong",
    img: "https://i.pinimg.com/1200x/ed/76/4d/ed764da4ef5dd4e2048939ac2e95dd6f.jpg",
    title: "🌙 꿈해몽",
    sub: "꿈의 의미를 오행으로",
    desc: "태몽 · 흉몽 · 길몽 전부 해석",
    badge: "무료/990원·24h",
    badgeBg: "#7c3aed",
    overlay: "linear-gradient(to top, rgba(30,10,70,0.88) 0%, rgba(60,20,120,0.45) 55%, rgba(0,0,0,0) 100%)",
    border: "rgba(167,139,250,0.35)",
  },
  {
    href: "/partner",
    img: "https://i.pinimg.com/736x/6f/69/94/6f699457d35927bd3ea33cb6f789dd6e.jpg",
    title: "🤝 파트너",
    sub: "내 브랜드로 판매",
    desc: "탈잉 · 크몽 · SNS 판매 OK",
    badge: "신청",
    badgeBg: "#a21caf",
    overlay: "linear-gradient(to top, rgba(80,10,100,0.88) 0%, rgba(162,28,175,0.45) 55%, rgba(0,0,0,0) 100%)",
    border: "rgba(240,171,252,0.35)",
  },
];

const GRID_APPS = [
  { href: "/jigun",      emoji: "💼", label: "직운",     sub: "AI 진로 · 부업 추천",   desc: "오행 천직 + 부업 TOP3",       badge: "무료/990원·24h", color: "#0d9488", bg: "linear-gradient(145deg,#ccfbf1,#99f6e4)", img: "https://i.pinimg.com/736x/bc/7c/f6/bc7cf6c186ee2e763c4bd7230098eba3.jpg" },
  { href: "/resume",     emoji: "🎯", label: "합격",     sub: "합격운 · 자소서 분석",  desc: "직무별 합격 전략 + 면접 질문", badge: "무료/990원·24h", color: "#b45309", bg: "linear-gradient(145deg,#fef3c7,#fde68a)", img: "https://i.pinimg.com/736x/7c/b2/22/7cb22262844ff11bc8c1800a309f0b99.jpg" },
  { href: "/gunghap",   emoji: "💑", label: "궁합",     sub: "두 사람의 오행 궁합",   desc: "연애 패턴 · 갈등 · 조언",     badge: "990원·24h", color: "#e11d48", bg: "linear-gradient(145deg,#ffe4e6,#fecdd3)", img: "https://i.pinimg.com/736x/bb/20/f3/bb20f354e8a443be9f6a4b71d0022f07.jpg" },
  { href: "/mbti",      emoji: "🧠", label: "MBTI",     sub: "오행 기질 분석",         desc: "16가지 유형 심층 분석",        badge: "990원·24h", color: "#4338ca", bg: "linear-gradient(145deg,#e0e7ff,#c7d2fe)", img: "https://i.pinimg.com/1200x/aa/7a/e3/aa7ae3b66dc315f01fedf552b101f033.jpg" },
  { href: "/lotto",     emoji: "🍀", label: "행운번호",  sub: "오행 행운번호 6개",     desc: "생년월일 기반 행운 번호",      badge: "무료",           color: "#ca8a04", bg: "linear-gradient(145deg,#fefce8,#fef08a)", img: "https://i.pinimg.com/736x/bc/72/81/bc7281694d741c357b826a29c17023b3.jpg" },
  { href: "/petun",     emoji: "🐾", label: "펫운",     sub: "반려동물 운세 · 궁합",  desc: "음식 안전도 · 오늘 뽑기",     badge: "990원·24h", color: "#ea580c", bg: "linear-gradient(145deg,#fff7ed,#fed7aa)", img: "https://i.pinimg.com/1200x/0f/8e/e2/0f8ee29760fa339bfdf211369cf2d100.jpg" },
  { href: "/tarot",     emoji: "🃏", label: "타로",     sub: "AI 타로카드 해석",       desc: "연애 · 직업 · 재물 상담",     badge: "990원·24h", color: "#7e22ce", bg: "linear-gradient(145deg,#f3e8ff,#d8b4fe)", img: "https://i.pinimg.com/1200x/0c/27/99/0c27999149b93230b696dce0918a4e8e.jpg" },
  { href: "/zodiac",    emoji: "⭐", label: "별자리",   sub: "12별자리 오늘 운세",     desc: "궁합 · 월별 · 오행 분석",     badge: "990원·24h", color: "#1d4ed8", bg: "linear-gradient(145deg,#eff6ff,#93c5fd)", img: "https://i.pinimg.com/736x/3a/36/30/3a3630aa53fc14c5076ab4851d783b6e.jpg" },
  { href: "/battle",     emoji: "❤️", label: "이상형월드컵", sub: "연애 유형 8라운드 배틀", desc: "열정형·헌신형·자유형·독립형", badge: "무료", color: "#e11d48", bg: "linear-gradient(145deg,#fff1f2,#fecdd3)", img: "https://i.pinimg.com/736x/7b/cf/7b/7bcf7bf9459e39cffd2c0a5a8c1c5116.jpg" },
  { href: "/movie",      emoji: "🎬", label: "인생이영화라면", sub: "오늘 내 인생 장르는?", desc: "로코·힐링·직장코미디·역경", badge: "무료", color: "#d97706", bg: "linear-gradient(145deg,#fffbeb,#fde68a)", img: "https://i.pinimg.com/736x/cb/f7/c0/cbf7c0e65c741cbee2e01ecbffaf253d.jpg" },
  { href: "/style",      emoji: "✨", label: "추구미",    sub: "나의 패션 코어 분석",   desc: "Y2K·로맨틱·다크·미니멀코어", badge: "무료", color: "#7c3aed", bg: "linear-gradient(145deg,#faf5ff,#e9d5ff)", img: "https://i.pinimg.com/736x/da/6a/48/da6a48af4d3be92f107702f2685e6f33.jpg" },
  { href: "/work",       emoji: "💪", label: "직장버티기", sub: "오늘 직장 생존 점수",  desc: "상사 유형 + 하루 퀴즈",     badge: "무료", color: "#2563eb", bg: "linear-gradient(145deg,#eff6ff,#bfdbfe)", img: "https://i.pinimg.com/736x/bd/43/e1/bd43e122915d6dac47fa3eb8bbd0e490.jpg" },
  { href: "/gamjung",   emoji: "📔", label: "감정일기",  sub: "감정 기록 · 치유 일기", desc: "오행 감정 흐름 분석",         badge: "1,980원·30일",  color: "#be185d", bg: "linear-gradient(145deg,#fdf2f8,#fbcfe8)", img: "https://i.pinimg.com/736x/7e/ad/71/7ead71fd8ff5c3d3d57abab4b5b01347.jpg" },
  { href: "/diet",      emoji: "🥗", label: "다이어트",  sub: "오행 체질 식단 추천",   desc: "칼로리 계산 + 맞춤 음식",    badge: "1,980원·30일",  color: "#65a30d", bg: "linear-gradient(145deg,#f7fee7,#d9f99d)", img: "https://i.pinimg.com/1200x/f1/11/77/f11177335015269c22af426b13f423bc.jpg" },
  { href: "/budget",    emoji: "💰", label: "가계부",    sub: "일기식 재물 기록",       desc: "지출 · 수입 · 재물운 연결",  badge: "1,980원·30일",  color: "#0369a1", bg: "linear-gradient(145deg,#e0f2fe,#bae6fd)", img: "https://i.pinimg.com/736x/73/84/95/738495640e6c2d69d0632c59be89818f.jpg" },
  { href: "/momcare",   emoji: "👶", label: "육아일기",  sub: "AI 육아 · 아기 기록",   desc: "일기 · 타임캡슐 · 아기말",   badge: "1,980원·30일",  color: "#be185d", bg: "linear-gradient(145deg,#fce7f3,#fbcfe8)", img: "https://i.pinimg.com/736x/19/f1/9c/19f19c6326262bd03985e28c1c45226c.jpg" },
  { href: "/gwangyeoradar", emoji: "📡", label: "연락기록통계", sub: "연락 패턴 27개 지표 분석", desc: "놓친 신호 · 관계 온도 · 회복가능성", badge: "990원·24h", color: "#9333ea", bg: "linear-gradient(145deg,#f3e8ff,#e9d5ff)", img: "https://images.unsplash.com/photo-1591347887817-173e3d5c4891?w=800&q=80" },
  { href: "/sonjeolgak", emoji: "✂️", label: "손절각",   sub: "그 관계, 끊을까 이어갈까",  desc: "7가지 관계별 손절각 지수",       badge: "무료/990원",     color: "#db2777", bg: "linear-gradient(145deg,#fdf2f8,#fbcfe8)", img: "https://i.pinimg.com/736x/a2/e3/2a/a2e32abeae3320baec01b62d54e44751.jpg" },
];

export default function AppsPage() {
  const [unlocks, setUnlocks] = useState<Record<string, number>>({});

  // 특정 앱의 로컬 잠금해제 값을 초기화 (예: /apps?reset=tarot,petun)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const reset = params.get("reset");
      if (reset) {
        reset.split(",").forEach((raw) => {
          const k = raw.trim();
          if (!k) return;
          localStorage.removeItem(`${k}_unlock_until`);
          localStorage.removeItem(`${k}_unlock_phone`);
        });
        const url = new URL(window.location.href);
        url.searchParams.delete("reset");
        window.history.replaceState({}, "", url.toString());
      }
    } catch {}
  }, []);

  useEffect(() => {
    const daysMap: Record<string, number> = {};
    Object.entries(UNLOCK_KEYS).forEach(([href, key]) => {
      const s = getUnlockStatus(key);
      daysMap[href] = s.days;
    });
    setUnlocks(daysMap);
  }, []);

  // 이용 중인 앱 목록 (남은 날짜 있는 것)
  const activeApps = Object.entries(unlocks).filter(([, d]) => d > 0);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0f0520 0%, #1e1040 50%, #0a0818 100%)", padding: "20px 14px 48px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>



        {/* 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <a href="/main-v2" style={{ display: "inline-block", marginBottom: 12, fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>← 메인으로</a>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 4 }}>✨ 점운 전체앱</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>무료앱 다수 · 일기류 4개앱 30일권</div>
        </div>

        {/* 풀패스 배너 */}
        {activeApps.length > 0 ? (
          <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 14, border: "2px solid #4ade80", boxShadow: "0 2px 14px rgba(74,222,128,0.25)" }}>
            <div style={{ background: "linear-gradient(135deg,#14532d,#16a34a)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 14 }}>✅ 풀패스 이용 중</span>
            </div>
            <div style={{ background: "#f0fdf4", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 12, color: "#14532d", margin: 0, lineHeight: 1.6 }}>일기류 4개 앱 이용 가능 · 만료 후 자동 잠금</p>
              <span onClick={()=>{ window.location.href="/pass"; }} style={{ fontSize: 12, fontWeight: 900, color: "#fff", background: "#16a34a", padding: "5px 14px", borderRadius: 20, whiteSpace: "nowrap", cursor: "pointer" }}>연장하기 →</span>
            </div>
          </div>
        ) : (
          <div
            onClick={() => { window.location.href = "/pass"; }}
            style={{ borderRadius: 16, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 14px rgba(239,68,68,0.35)", border: "2px solid #ef4444", marginBottom: 14 }}
          >
            <div style={{ background: "linear-gradient(135deg,#7f1d1d,#dc2626)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 14 }}>🔥 4개앱 30일 풀패스</span>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>₩5,900</span>
            </div>
            <div style={{ background: "#fff5f5", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 12, color: "#7f1d1d", margin: 0, lineHeight: 1.6 }}>감정일기·다이어트·가계부·육아일기<br />일기류 4개 앱 30일 이용</p>
              <span style={{ fontSize: 12, fontWeight: 900, color: "#fff", background: "#dc2626", padding: "5px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>바로 가기 →</span>
            </div>
          </div>
        )}

        {/* 상단 2단 큰 카드 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          {TOP_APPS.map(app => {
            const d = unlocks[app.href] || 0;
            const badgeText = d > 0 ? `D-${d}` : app.badge;
            const badgeColor = d > 0 ? "#16a34a" : app.badgeBg;
            return (
              <a
                key={app.href}
                href={app.href}
                onClick={undefined}
                style={{ position: "relative", height: 180, borderRadius: 20, overflow: "hidden", border: d > 0 ? "2px solid #4ade80" : `1.5px solid ${app.border}`, textDecoration: "none", display: "block" }}
              >
                <img src={app.img} alt={app.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: app.overlay }} />
                <span style={{ position: "absolute", top: 10, right: 10, background: badgeColor, color: "#fff", fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 20 }}>{badgeText}</span>
                <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 2 }}>{app.title}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", marginBottom: 1 }}>{app.sub}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>{app.desc}</div>
                </div>
              </a>
            );
          })}
        </div>

        {/* 하단 2×6 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {GRID_APPS.map(app => {
            const d = unlocks[app.href] || 0;
            const badgeText = d > 0 ? `D-${d}` : app.badge;
            const badgeBg = d > 0 ? "#16a34a" : ("color" in app ? app.color : "rgba(0,0,0,0.55)");
            return (
              <a
                key={app.href}
                href={app.href}
                onClick={undefined}
                style={{ position: "relative", borderRadius: 20, overflow: "hidden", textDecoration: "none", aspectRatio: "1/1", display: "block", outline: d > 0 ? "2px solid #4ade80" : "none" }}
              >
                {app.img ? (
                  <>
                    <img src={app.img} alt={app.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)" }} />
                    <span style={{ position: "absolute", top: 10, right: 10, background: badgeBg, color: "#fff", fontSize: 9, fontWeight: 900, padding: "2px 8px", borderRadius: 12 }}>{badgeText}</span>
                    <div style={{ position: "absolute", bottom: 12, left: 6, right: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 24, marginBottom: 3 }}>{app.emoji}</div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginBottom: 2 }}>{app.label}</div>
                      {"sub" in app && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.75)", marginBottom: 1 }}>{(app as {sub:string}).sub}</div>}
                      {"desc" in app && <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>{(app as {desc:string}).desc}</div>}
                    </div>
                  </>
                ) : (
                  <div style={{ width: "100%", height: "100%", background: app.bg, border: `1px solid ${app.color}22`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px" }}>
                    <span style={{ position: "absolute", top: 10, right: 10, background: badgeBg, color: "#fff", fontSize: 9, fontWeight: 900, padding: "2px 8px", borderRadius: 12 }}>{badgeText}</span>
                    <span style={{ fontSize: 38 }}>{app.emoji}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: app.color, textAlign: "center" }}>{app.label}</span>
                    {"sub" in app && <span style={{ fontSize: 9, color: app.color, opacity: 0.7, textAlign: "center", lineHeight: 1.3 }}>{(app as {sub:string}).sub}</span>}
                  </div>
                )}
              </a>
            );
          })}
        </div>

      </div>
    </div>
  );
}
