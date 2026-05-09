"use client";

export default function Home() {
  const packages = [
    { name: "기본 분석", price: "9,900원", items: 2, desc: "2개 운세", color: "#f97316", titleColor: "#8b5cf6", includes: ["☀️ 오늘 운세", "🌙 이번달 운세"] },
    { name: "베이직", price: "19,900원", items: 3, desc: "3개 운세", color: "#eab308", titleColor: "#a78bfa", includes: ["☀️ 오늘 운세", "🌙 이번달 운세", "🎋 올해 운세"] },
    { name: "프리미엄", price: "24,900원", items: 5, desc: "5개 운세", color: "#b45309", titleColor: "#f59e0b", badge: "인기", includes: ["☀️ 오늘 운세", "🌙 이번달 운세", "🎋 올해 운세", "💎 재물운", "💕 연애운"] },
    { name: "커플팩 ⭐", price: "29,900원", items: 8, desc: "8개 운세", color: "#be185d", titleColor: "#ec4899", includes: ["☀️ 오늘 운세", "🌙 이번달 운세", "🎋 올해 운세", "✨ 전체 사주분석", "💎 재물운", "💕 연애운", "🌿 건강운", "👫 궁합분석"] }
  ];

  const fortunes = [
    { icon: "☀️", name: "오늘 운세" },
    { icon: "🌙", name: "이번달 운세" },
    { icon: "🎋", name: "올해 운세" },
    { icon: "✨", name: "전체 사주분석" },
    { icon: "💎", name: "재물운 분석" },
    { icon: "💕", name: "연애운 분석" },
    { icon: "🌿", name: "건강운 분석" },
    { icon: "👫", name: "궁합 분석" }
  ];

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0a 0%, #1a0820 50%, #0f0a2e 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 10, 20, 0.7)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10 }}>
        <header style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(245,158,11,0.2)", background: "rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24 }}>✨</span>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#fbbf24", margin: 0, letterSpacing: "0.1em" }}>점운</h1>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="/analyze" style={{ color: "#ffffff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>사주분석</a>
            <a href="/saju-info" style={{ color: "#ffffff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>사주정보</a>
          </div>
        </header>

        <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "8px 20px", borderRadius: 999, background: "rgba(139,92,246,0.3)", border: "1px solid rgba(245,158,11,0.6)", color: "#ffffff", fontSize: 14, fontWeight: 700, marginBottom: 24 }}>✨ 누적 분석 127,483건 돌파</div>
          <div style={{ width: 140, height: 140, margin: "0 auto 32px", borderRadius: "12px", backgroundImage: "url('/b17b07628f3f401ea692dbd75575ba0f.webp')", backgroundSize: "cover", backgroundPosition: "center", border: "2px solid rgba(245,158,11,0.5)", boxShadow: "0 0 50px rgba(245,158,11,0.3), 0 0 100px rgba(139,92,246,0.2), 0 8px 32px rgba(0,0,0,0.5)", transform: "rotate(15deg)" }} />
          <h2 style={{ fontSize: "clamp(28px, 6vw, 56px)", fontWeight: 900, lineHeight: 1.3, margin: "0 auto 16px", color: "#fbbf24", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>당신의 운명을<br />AI가 풀어드립니다</h2>
          <p style={{ color: "#ffffff", fontSize: "clamp(14px, 2.5vw, 18px)", fontWeight: 700, lineHeight: 1.8, marginBottom: 20, textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>생년월일만 입력하면 AI가 사주팔자를 정밀 분석하여<br />총운, 재물운, 연애운, 건강운, 직업운을 알려드립니다</p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ color: "#f59e0b", fontSize: 18 }}>★★★★★</span>
            <span style={{ color: "#ffffff", fontSize: 14, fontWeight: 700 }}>4.9/5.0 (2,847 리뷰)</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
            {["⏱ 30초 완성", "🚫 회원가입 필요 없음", "100% 무료"].map((text, i) => (<span key={i} style={{ background: "rgba(139,92,246,0.3)", border: "1px solid rgba(245,158,11,0.5)", borderRadius: 999, padding: "6px 12px", color: "#ffffff", fontSize: 12, fontWeight: 700 }}>{text}</span>))}
          </div>
          <a href="/free-analysis" style={{ display: "inline-block", padding: "16px 48px", borderRadius: 12, fontSize: "clamp(15px, 2.5vw, 18px)", fontWeight: 900, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "black", textDecoration: "none", boxShadow: "0 8px 40px rgba(245,158,11,0.5)", letterSpacing: "0.05em", cursor: "pointer" }}>🔮 무료 사주 보기</a>
          <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 800, marginTop: 12, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>9,900원부터 시작 · 즉시 PDF 다운로드 · 50~200페이지</p>
        </section>

        <section style={{ padding: "40px 24px", maxWidth: 800, margin: "0 auto" }}>
          <h3 style={{ textAlign: "center", color: "#ffffff", fontWeight: 900, fontSize: "clamp(18px, 3vw, 24px)", marginBottom: 28 }}>단 3단계로 완성</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[{ step: "1", icon: "✏️", title: "정보 입력", desc: "이름·성별·생년월일" }, { step: "2", icon: "🤖", title: "AI 분석", desc: "AI가 사주 정밀 분석" }, { step: "3", icon: "📄", title: "결과 확인", desc: "즉시 PDF 다운로드" }].map((item, i) => (<div key={i} style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 12, padding: "18px 12px", textAlign: "center" }}><div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "black", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>{item.step}</div><div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div><p style={{ color: "#fbbf24", fontWeight: 900, fontSize: 13, marginBottom: 4 }}>{item.title}</p><p style={{ color: "#ffffff", fontSize: 13, margin: 0, fontWeight: 800 }}>{item.desc}</p></div>))}
          </div>
        </section>

        <section style={{ padding: "40px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <h3 style={{ textAlign: "center", color: "#ffffff", fontWeight: 900, fontSize: "clamp(18px, 3vw, 28px)", marginBottom: 40 }}>💫 패키지 선택</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {packages.map((pkg, i) => (
              <div key={i} style={{ background: `rgba(${pkg.color === "#b45309" ? "180,67,9" : pkg.color === "#be185d" ? "190,24,93" : pkg.color === "#eab308" ? "234,179,8" : "249,115,22"}, 0.15)`, border: "none", borderRadius: 16, padding: "28px 20px", position: "relative", display: "flex", flexDirection: "column" }}>
                {pkg.badge && (
                  <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#fbbf24", color: "black", fontSize: 11, padding: "4px 12px", borderRadius: 999, fontWeight: 900 }}>
                    {pkg.badge}
                  </span>
                )}
                <h4 style={{ color: pkg.titleColor, fontWeight: 900, fontSize: 20, margin: "0 0 8px 0" }}>
                  {pkg.name}
                </h4>
                <p style={{ color: pkg.titleColor, fontSize: 14, fontWeight: 800, margin: "0 0 16px 0" }}>
                  {pkg.items}개 운세
                </p>
                <p style={{ color: pkg.color, fontWeight: 900, fontSize: 28, margin: "0 0 20px 0" }}>
                  {pkg.price}
                </p>
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "12px", marginBottom: 16, flexGrow: 1 }}>
                  <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 800, margin: "0 0 8px 0" }}>
                    📊 포함 항목
                  </p>
                  {pkg.includes.map((item, idx) => (
                    <p key={idx} style={{ color: "#ffffff", fontSize: 11, fontWeight: 700, margin: "4px 0" }}>
                      {item}
                    </p>
                  ))}
                </div>
                <a href={`/payment?package=${pkg.name}&price=${pkg.price}&items=${pkg.items}`} style={{ display: "block", background: `linear-gradient(135deg, ${pkg.color}, ${pkg.titleColor})`, color: "white", padding: "12px", borderRadius: 10, fontSize: 13, fontWeight: 900, textDecoration: "none", textAlign: "center", boxShadow: `0 6px 20px ${pkg.color}40`, cursor: "pointer", border: "none" }}>
                  🔮 사주 분석 시작
                </a>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
          <h4 style={{ color: "#a78bfa", fontWeight: 900, fontSize: "clamp(16px, 2.5vw, 20px)", marginBottom: 20, textAlign: "center" }}>🌟 분석 운세 종류</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {fortunes.slice(0, 4).map((item, i) => (
              <div key={i} style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <p style={{ color: "#ffffff", fontSize: 12, fontWeight: 800, margin: 0 }}>{item.name}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {fortunes.slice(4, 8).map((item, i) => (
              <div key={i + 4} style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <p style={{ color: "#ffffff", fontSize: 12, fontWeight: 800, margin: 0 }}>{item.name}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}