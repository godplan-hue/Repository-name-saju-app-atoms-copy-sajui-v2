"use client";

const APPS = [
  {
    href: "/jigun",
    img: "https://i.pinimg.com/736x/58/f4/4d/58f44db77813cefefa3e5385f8c89113.jpg",
    title: "💼 직운",
    sub: "부업 TOP 3 무료",
    desc: "내 성향에 맞는 부업 추천\n오행 천직 + 수입 예상까지",
    badge: "무료",
    badgeBg: "#15803d",
  },
  {
    href: "/momcare",
    img: "https://i.pinimg.com/736x/51/ce/d7/51ced7bac1ca130cfed3fc2487981148.jpg",
    title: "👶 맘케어",
    sub: "AI 육아 무료",
    desc: "아기 일기 · 타임캡슐 · 아기말 기록\n사주로 아이 건강운 연결",
    badge: "무료",
    badgeBg: "#15803d",
  },
  {
    href: "/resume",
    img: "https://i.pinimg.com/vwebp/1200x/f1/76/f2/f176f28342fd9a3f935617633fed37f3.webp",
    title: "🎯 점운 합격",
    sub: "합격 분석 무료",
    desc: "사주로 보는 합격 가능성\n직무별 전략 + 면접 질문까지",
    badge: "무료",
    badgeBg: "#15803d",
  },
  {
    href: "/haemong",
    img: "https://i.pinimg.com/736x/b4/b0/5b/b4b05b2365cd1eb0f1426eacd8529c96.jpg",
    title: "🌙 꿈해몽",
    sub: "꿈 해석 무료",
    desc: "꿈의 의미를 오행으로 풀어드려요\n태몽 · 흉몽 · 길몽 전부 해석",
    badge: "무료",
    badgeBg: "#7c3aed",
  },
];

export default function AppsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #1a0533 100%)", padding: "24px 16px 48px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        {/* 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <a href="/main-v2" style={{ display: "inline-block", marginBottom: 16, fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>← 메인으로</a>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 6 }}>✨ 무료 14개 점운 전체앱</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>점운 계열 앱 전부 무료로 이용하세요</div>
        </div>

        {/* 앱 카드 목록 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {APPS.map(app => (
            <a
              key={app.href}
              href={app.href}
              style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: 14, textDecoration: "none", backdropFilter: "blur(8px)" }}
            >
              {/* 이미지 */}
              <div style={{ position: "relative", flexShrink: 0, width: 80, height: 80, borderRadius: 14, overflow: "hidden" }}>
                <img src={app.img} alt={app.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: 5, left: 5, background: app.badgeBg, color: "#fff", fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 20 }}>{app.badge}</span>
              </div>
              {/* 텍스트 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", marginBottom: 2 }}>{app.title}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>{app.sub}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{app.desc}</div>
              </div>
              {/* 화살표 */}
              <div style={{ flexShrink: 0, fontSize: 18, color: "rgba(255,255,255,0.4)" }}>›</div>
            </a>
          ))}
        </div>

        {/* 하단 안내 */}
        <div style={{ marginTop: 28, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.8 }}>
          더 많은 앱이 곧 추가됩니다 🔮<br />
          궁합 · MBTI · 행운번호 · 펫운 · 대운 등
        </div>
      </div>
    </div>
  );
}
