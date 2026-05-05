'use client';

export default function Home() {
  return (
    <main style={{minHeight: "100vh", background: "linear-gradient(180deg, #0a0618 0%, #0f0a2e 50%, #0a0618 100%)", color: "white", fontFamily: "sans-serif"}}>
      <header style={{borderBottom: "1px solid rgba(139,92,246,0.3)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h1 style={{fontSize: 24, fontWeight: 900, marginBottom: 0, color: "#fbbf24"}}>⭐ 점운</h1>
        <div style={{display: "flex", gap: 20}}>
          <button onClick={() => window.location.href = '/analyze'} style={{color: "#a78bfa", fontSize: 15, fontWeight: 600, background: "none", border: "none", cursor: "pointer"}}>사주분석</button>
          <button onClick={() => window.location.href = '/saju-info'} style={{color: "#a78bfa", fontSize: 15, fontWeight: 600, background: "none", border: "none", cursor: "pointer"}}>사주정보</button>
        </div>
      </header>
      <section style={{padding: "60px 24px", textAlign: "center", borderBottom: "1px solid rgba(139,92,246,0.2)"}}>
        <h2 style={{fontSize: 36, fontWeight: 900, marginBottom: 8, marginTop: 0, color: "#fbbf24"}}>당신의 운명을 분석합니다</h2>
        <p style={{color: "#94a3b8", fontSize: 16, marginBottom: 0}}>정확한 사주 원국 분석</p>
      </section>
      <section style={{padding: "80px 24px"}}>
        <div style={{maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60}}>
          <div>
            <h3 style={{fontSize: 32, fontWeight: 900, marginBottom: 24, marginTop: 0, color: "white"}}>당신의 인생을<br/>완벽하게 읽어드립니다</h3>
            <p style={{color: "#94a3b8", fontSize: 15, lineHeight: 1.8, marginBottom: 32}}>50페이지부터 300페이지까지 완벽한 사주 분석</p>
            <button onClick={() => window.location.href = '/analyze'} style={{padding: "16px 44px", borderRadius: 12, fontSize: 16, fontWeight: 800, background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "black", border: "none", cursor: "pointer"}}>✨ 지금 바로 분석하기</button>
            <p style={{color: "#64748b", fontSize: 14, marginTop: 16}}>9,900원부터 시작</p>
          </div>
          <div>
            <h4 style={{color: "#fbbf24", fontWeight: 800, fontSize: 18, marginBottom: 20, marginTop: 0}}>📦 패키지 선택</h4>
            <div style={{background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "16px", marginBottom: 12}}>
              <p style={{fontSize: 16, fontWeight: 800, color: "white", marginBottom: 2, marginTop: 0}}>⭐ 베이직</p>
              <p style={{color: "#94a3b8", fontSize: 13, marginTop: 0, marginBottom: 8}}>현실 사주 분석 (50P)</p>
              <p style={{fontSize: 16, fontWeight: 900, color: "#fbbf24", marginTop: 0, marginBottom: 0}}>9,900원</p>
            </div>
            <div style={{background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "16px", marginBottom: 12}}>
              <p style={{fontSize: 16, fontWeight: 800, color: "white", marginBottom: 2, marginTop: 0}}>🔮 프리미엄</p>
              <p style={{color: "#94a3b8", fontSize: 13, marginTop: 0, marginBottom: 8}}>상세 사주 분석 (150P)</p>
              <p style={{fontSize: 16, fontWeight: 900, color: "#fbbf24", marginTop: 0, marginBottom: 0}}>19,900원</p>
            </div>
            <div style={{background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "16px"}}>
              <p style={{fontSize: 16, fontWeight: 800, color: "#f472b6", marginBottom: 2, marginTop: 0}}>👑 플로스</p>
              <p style={{color: "#94a3b8", fontSize: 13, marginTop: 0, marginBottom: 8}}>완벽 사주 분석 (210P)</p>
              <p style={{fontSize: 16, fontWeight: 900, color: "#fbbf24", marginTop: 0, marginBottom: 0}}>29,900원</p>
            </div>
          </div>
        </div>
      </section>
      <footer style={{borderTop: "1px solid rgba(139,92,246,0.2)", padding: "24px", textAlign: "center", color: "#64748b", fontSize: 12}}>
        <p style={{marginBottom: 12}}>© 2026 점운</p>
        <div style={{display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap"}}>
          <a href="/terms" style={{color: "#a78bfa", textDecoration: "none", cursor: "pointer"}}>이용약관</a>
          <span>|</span>
          <a href="/privacy" style={{color: "#a78bfa", textDecoration: "none", cursor: "pointer"}}>개인정보처리방침</a>
          <span>|</span>
          <a href="/agreement" style={{color: "#a78bfa", textDecoration: "none", cursor: "pointer"}}>통합회원약관</a>
        </div>
      </footer>
    </main>
  );
}