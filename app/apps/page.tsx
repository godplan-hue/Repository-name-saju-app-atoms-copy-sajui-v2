"use client";

const TOP_APPS = [
  {
    href: "/haemong",
    img: "https://i.pinimg.com/736x/b4/b0/5b/b4b05b2365cd1eb0f1426eacd8529c96.jpg",
    title: "🌙 꿈해몽",
    sub: "꿈의 의미를 오행으로",
    desc: "태몽 · 흉몽 · 길몽 전부 해석",
    badge: "무료",
    badgeBg: "#7c3aed",
    overlay: "linear-gradient(to top, rgba(30,10,70,0.88) 0%, rgba(60,20,120,0.45) 55%, rgba(0,0,0,0) 100%)",
    border: "rgba(167,139,250,0.35)",
  },
  {
    href: "/momcare",
    img: "https://i.pinimg.com/vwebp/1200x/50/73/a5/5073a503cb18b1cd3459fba8e402c389.webp",
    title: "👶 맘케어",
    sub: "AI 육아 · 아기 기록",
    desc: "일기 · 타임캡슐 · 아기말",
    badge: "무료",
    badgeBg: "#be185d",
    overlay: "linear-gradient(to top, rgba(131,24,67,0.88) 0%, rgba(190,24,93,0.35) 55%, rgba(0,0,0,0) 100%)",
    border: "rgba(251,113,133,0.35)",
  },
];

const GRID_APPS = [
  { href: "/main-v2",           emoji: "🔮", label: "사주",   badge: "무료",  color: "#7c3aed", bg: "linear-gradient(145deg,#ede9fe,#c4b5fd)" },
  { href: "/jigun",             emoji: "💼", label: "직운",   badge: "무료",  color: "#0d9488", bg: "linear-gradient(145deg,#ccfbf1,#99f6e4)" },
  { href: "/resume",            emoji: "🎯", label: "합격",   badge: "무료",  color: "#b45309", bg: "linear-gradient(145deg,#fef3c7,#fde68a)" },
  { href: "/gunghap",           emoji: "💑", label: "궁합",   badge: "무료",  color: "#e11d48", bg: "linear-gradient(145deg,#ffe4e6,#fecdd3)" },
  { href: "/mbti",              emoji: "🧠", label: "MBTI",   badge: "무료",  color: "#4338ca", bg: "linear-gradient(145deg,#e0e7ff,#c7d2fe)" },
  { href: "/lotto",             emoji: "🍀", label: "행운번호", badge: "무료", color: "#ca8a04", bg: "linear-gradient(145deg,#fefce8,#fef08a)" },
  { href: "/petun",             emoji: "🐾", label: "펫운",   badge: "무료",  color: "#ea580c", bg: "linear-gradient(145deg,#fff7ed,#fed7aa)" },
  { href: "/main-v2/daewoon",   emoji: "⭐", label: "대운",   badge: "유료",  color: "#1e40af", bg: "linear-gradient(145deg,#dbeafe,#bfdbfe)" },
  { href: "/main-v2/taegil",    emoji: "📅", label: "택일",   badge: "유료",  color: "#047857", bg: "linear-gradient(145deg,#d1fae5,#a7f3d0)" },
  { href: "/main-v2/qa-list",   emoji: "💬", label: "Q&A",    badge: "무료",  color: "#475569", bg: "linear-gradient(145deg,#f1f5f9,#e2e8f0)" },
  { href: "/diet",              emoji: "🥗", label: "다이어트", badge: "무료", color: "#65a30d", bg: "linear-gradient(145deg,#f7fee7,#d9f99d)" },
  { href: "/partner",           emoji: "🤝", label: "파트너", badge: "신청",  color: "#a21caf", bg: "linear-gradient(145deg,#fdf4ff,#f0abfc)" },
];

export default function AppsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0f0520 0%, #1e1040 50%, #0a0818 100%)", padding: "20px 14px 48px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <a href="/main-v2" style={{ display: "inline-block", marginBottom: 12, fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>← 메인으로</a>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 4 }}>✨ 점운 전체앱</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>14개 앱 전부 무료로 이용하세요</div>
        </div>

        {/* 상단 2단 큰 카드 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          {TOP_APPS.map(app => (
            <a
              key={app.href}
              href={app.href}
              style={{ position: "relative", height: 180, borderRadius: 20, overflow: "hidden", border: `1.5px solid ${app.border}`, textDecoration: "none", display: "block" }}
            >
              <img src={app.img} alt={app.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: app.overlay }} />
              <span style={{ position: "absolute", top: 10, left: 10, background: app.badgeBg, color: "#fff", fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 20 }}>{app.badge}</span>
              <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 2 }}>{app.title}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", marginBottom: 1 }}>{app.sub}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>{app.desc}</div>
              </div>
            </a>
          ))}
        </div>

        {/* 하단 4×3 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {GRID_APPS.map(app => (
            <a
              key={app.href}
              href={app.href}
              style={{ borderRadius: 16, overflow: "hidden", textDecoration: "none", background: app.bg, border: `1px solid ${app.color}22`, aspectRatio: "1/1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, position: "relative" }}
            >
              <span style={{ position: "absolute", top: 5, right: 5, background: app.color, color: "#fff", fontSize: 7, fontWeight: 900, padding: "1.5px 5px", borderRadius: 10 }}>{app.badge}</span>
              <span style={{ fontSize: 26 }}>{app.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: app.color }}>{app.label}</span>
            </a>
          ))}
        </div>

        {/* 하단 안내 */}
        <div style={{ marginTop: 24, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.8 }}>
          AI상담 · 감정일기 · 가계부 등 곧 추가됩니다 🔮
        </div>
      </div>
    </div>
  );
}
