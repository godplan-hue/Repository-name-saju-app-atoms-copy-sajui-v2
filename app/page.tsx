"use client";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0618 0%, #0f0a2e 50%, #0a0618 100%)", color: "white", fontFamily: "sans-serif" }}>
      <style>{`@keyframes blink { 0%, 49%, 100% { opacity: 1; } 50%, 99% { opacity: 0.3; } } .blink-text { animation: blink 2s infinite; }`}</style>
      <header style={{ borderBottom: "1px solid rgba(139,92,246,0.3)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 0, color: "#fbbf24" }}>⭐ 점운</h1>
        <div style={{ display: "flex", gap: 20 }}>
          <button onClick={() => window.location.href = '/analyze'} style={{ color: "#a78bfa", fontSize: 15, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}>사주분석</button>
          <button onClick={() => window.location.href = '/saju-info'} style={{ color: "#a78bfa", fontSize: 15, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}>사주정보</button>
        </div>
      </header>
      <section style={{ padding: "12px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <h2 style={{ fontSize: 88, fontWeight: 900, marginBottom: 8, marginTop: 0, color: "#fbbf24" }}>당신의 운명을 AI가 분석합니다</h2>
          <p style={{ color: "#94a3b8", fontSize: 24, fontWeight: 700, marginBottom: 0, marginTop: 0 }}>🔮 정확한 사주 원국 분석 · 음양오행 · 천간지지 · 십성 완벽 분석</p>
        </div>
      </section>
      <section style={{ padding: "40px 24px", background: "linear-gradient(180deg, #0a0618 0%, #0f0a2e 50%, #0a0618 100%)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          <div>
            <div style={{ display: "inline-block", padding: "8px 20px", borderRadius: 999, background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.5)", color: "#c4b5fd", fontSize: 14, marginBottom: 16 }}>🔮 최고 수준의 사주 분석</div>
            <h2 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.3, marginBottom: 16, marginTop: 0, color: "white" }}>당신의 인생을<br/>완벽하게 읽어드립니다</h2>
            <p style={{ color: "#cbd5e1", fontSize: 18, fontWeight: 700, lineHeight: 1.8, marginBottom: 24 }}>50페이지 기본분석부터 200페이지 완벽분석까지<br/>당신의 성격, 재물운, 연애운, 건강운, 직업 추천, 올해 운세까지 모두 포함!</p>
            <button onClick={() => window.location.href = '/analyze'} style={{ padding: "16px 40px", borderRadius: 12, fontSize: 17, fontWeight: 900, cursor: "pointer", background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "black", border: "none", boxShadow: "0 8px 30px rgba(245,158,11,0.5)" }}>✨ 지금 바로 분석하기</button>
            <p style={{ color: "#64748b", fontSize: 14, fontWeight: 600, marginTop: 12 }}>9,900원부터 시작 · 즉시 PDF 다운로드 · 50~200페이지</p>
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10, color: "white", marginTop: 0 }}>왜 점운인가?</h3>
              <p style={{ color: "#cbd5e1", marginBottom: 16, fontSize: 18, fontWeight: 700 }}>업계 최고의 가격과 품질을 모두 갖춘 사주 분석</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(79,70,229,0.1))", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 12, padding: "10px" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>
                  <h4 style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, marginBottom: 2, marginTop: 0 }}>50~200페이지 완벽분석</h4>
                  <p style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 600, lineHeight: 1.5, marginTop: 0 }}>기본분석(50P)부터 VVIP 커플팩(200P)까지. 당신에게 맞는 수준의 상세한 사주 분석</p>
                </div>
                <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(79,70,229,0.1))", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 12, padding: "10px" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>💎</div>
                  <h4 style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, marginBottom: 2, marginTop: 0 }}>합리적인 가격</h4>
                  <p style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 600, lineHeight: 1.5, marginTop: 0 }}>9,900원~29,900원의 합리적 가격. 전문 사주 분석을 저렴하게 받으세요</p>
                </div>
                <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(79,70,229,0.1))", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 12, padding: "10px" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
                  <h4 style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, marginBottom: 2, marginTop: 0 }}>즉시 다운로드</h4>
                  <p style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 600, lineHeight: 1.5, marginTop: 0 }}>결제 후 5분 이내 PDF 완성. 당신만의 사주 분석 보고서를 언제든 다시 볼 수 있어요</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 32 }}>
              <h4 style={{ color: "#fbbf24", fontWeight: 900, fontSize: 22, marginBottom: 14, marginTop: 0 }}>📦 패키지 선택</h4>
              <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(49,46,129,0.1))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div><p style={{ fontSize: 17, fontWeight: 900, color: "#94a3b8", marginBottom: 2, marginTop: 0 }}>✨ 기본분석</p><p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 700, marginTop: 0, marginBottom: 0 }}>50페이지</p></div>
                <p style={{ fontSize: 19, fontWeight: 900, color: "#fbbf24", marginTop: 0, marginBottom: 0 }}>9,900원</p>
              </div>
              <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(49,46,129,0.1))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div><p style={{ fontSize: 17, fontWeight: 900, color: "#a78bfa", marginBottom: 2, marginTop: 0 }}>⭐ 베이직</p><p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 700, marginTop: 0, marginBottom: 0 }}>100페이지</p></div>
                <p style={{ fontSize: 19, fontWeight: 900, color: "#fbbf24", marginTop: 0, marginBottom: 0 }}>19,900원</p>
              </div>
              <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(49,46,129,0.1))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, position: "relative" }}>
                <span style={{ position: "absolute", top: -10, left: 14, background: "#f59e0b", color: "black", fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>🔥 인기</span>
                <div><p style={{ fontSize: 17, fontWeight: 900, color: "#fbbf24", marginBottom: 2, marginTop: 0 }}>🔮 프리미엄</p><p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 700, marginTop: 0, marginBottom: 0 }}>150페이지</p></div>
                <p style={{ fontSize: 19, fontWeight: 900, color: "#fbbf24", marginTop: 0, marginBottom: 0 }}>24,900원</p>
              </div>
              <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(49,46,129,0.1))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => window.location.href = '/analyze'}>
                <div><p style={{ fontSize: 17, fontWeight: 900, color: "#f472b6", marginBottom: 2, marginTop: 0 }}>💎 VVIP 커플팩</p><p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 700, marginTop: 0, marginBottom: 0 }}>(+ 궁합 포함)</p><p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 700, marginTop: 4, marginBottom: 0 }}>200페이지</p></div>
                <p style={{ fontSize: 19, fontWeight: 900, color: "#fbbf24", marginTop: 0, marginBottom: 0 }}>29,900원</p>
              </div>
            </div>
            <div>
              <h4 style={{ color: "#a78bfa", fontWeight: 900, fontSize: 22, marginBottom: 12, marginTop: 0 }}>🔮 운세 종류</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 26, marginBottom: 4 }}>📅</div><p style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 0, marginTop: 0 }}>오늘의 운세</p></div>
                <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 26, marginBottom: 4 }}>📆</div><p style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 0, marginTop: 0 }}>이번달 운세</p></div>
                <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 26, marginBottom: 4 }}>📊</div><p style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 0, marginTop: 0 }}>올해 운세</p></div>
                <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 26, marginBottom: 4 }}>🔮</div><p style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 0, marginTop: 0 }}>전체 사주분석</p></div>
                <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 26, marginBottom: 4 }}>💰</div><p style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 0, marginTop: 0 }}>재물운 분석</p></div>
                <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 26, marginBottom: 4 }}>❤️</div><p style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 0, marginTop: 0 }}>연애운 분석</p></div>
                <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 26, marginBottom: 4 }}>💪</div><p style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 0, marginTop: 0 }}>건강운 분석</p></div>
                <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 26, marginBottom: 4 }}>👥</div><p style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 0, marginTop: 0 }}>궁합 분석</p></div>
              </div>
              <button onClick={() => window.location.href = '/analyze'} style={{ width: "100%", padding: "14px 20px", borderRadius: 12, fontSize: 17, fontWeight: 900, cursor: "pointer", background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "black", border: "none", boxShadow: "0 8px 30px rgba(245,158,11,0.5)", marginTop: 20 }}>🔮 지금 바로 분석하기</button>
            </div>
          </div>
        </div>
      </section>
      <footer style={{ borderTop: "1px solid rgba(139,92,246,0.2)", padding: "20px", textAlign: "center", color: "#64748b", fontSize: 13 }}>
        <p style={{ marginBottom: 3 }}>⭐ 점운 - AI 사주 분석 서비스</p>
        <p style={{ marginTop: 0 }}>© 2026 점운. All rights reserved.</p>
      </footer>
    </main>
  );
}