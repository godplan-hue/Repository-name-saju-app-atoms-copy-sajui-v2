"use client";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0618 0%, #0f0a2e 50%, #0a0618 100%)", color: "white", fontFamily: "sans-serif" }}>
      <header style={{ borderBottom: "1px solid rgba(139,92,246,0.3)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 0, color: "#fbbf24" }}>⭐ 점운</h1>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="/analyze" style={{ color: "#a78bfa", fontSize: 15, fontWeight: 600, textDecoration: "none", cursor: "pointer" }}>사주분석</a>
          <a href="/saju-info" style={{ color: "#a78bfa", fontSize: 15, fontWeight: 600, textDecoration: "none", cursor: "pointer" }}>사주정보</a>
        </div>
      </header>
      <section style={{ padding: "12px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(20px, 5vw, 88px)", fontWeight: 900, marginBottom: 8, marginTop: 0, color: "#fbbf24", lineHeight: 1.3 }}>당신의 운명을 AI가 분석합니다</h2>
        <p style={{ color: "#94a3b8", fontSize: "clamp(12px, 3vw, 24px)", fontWeight: 700, marginBottom: 0, marginTop: 0 }}>🔮 정확한 사주 원국 분석 · 음양오행 · 천간지지 · 십성 완벽 분석</p>
      </section>
      <section style={{ padding: "clamp(12px, 5vw, 40px) clamp(12px, 3vw, 24px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(20px, 5vw, 40px)" }}>
          <div>
            <div style={{ display: "inline-block", padding: "8px 20px", borderRadius: 999, background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.5)", color: "#c4b5fd", fontSize: 14, marginBottom: 16 }}>🔮 최고 수준의 사주 분석</div>
            <h2 style={{ fontSize: "clamp(18px, 5vw, 40px)", fontWeight: 900, lineHeight: 1.3, marginBottom: 16, marginTop: 0, color: "white" }}>당신의 인생을<br/>완벽하게 읽어드립니다</h2>
            <p style={{ color: "#cbd5e1", fontSize: "clamp(12px, 3vw, 18px)", fontWeight: 700, lineHeight: 1.8, marginBottom: 24 }}>50페이지 기본분석부터 200페이지 완벽분석까지<br/>당신의 성격, 재물운, 연애운, 건강운, 직업 추천, 올해 운세까지 모두 포함!</p>
            <a href="/analyze" style={{ display: "inline-block", padding: "16px 40px", borderRadius: 12, fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 900, background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "black", border: "none", textDecoration: "none", cursor: "pointer", boxShadow: "0 8px 30px rgba(245,158,11,0.5)" }}>✨ 지금 바로 분석하기</a>
            <p style={{ color: "#64748b", fontSize: "clamp(10px, 2vw, 14px)", fontWeight: 600, marginTop: 12 }}>9,900원부터 시작 · 즉시 PDF 다운로드 · 50~200페이지</p>
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontSize: "clamp(18px, 4vw, 28px)", fontWeight: 900, marginBottom: 10, color: "white", marginTop: 0 }}>왜 점운인가?</h3>
              <p style={{ color: "#cbd5e1", marginBottom: 16, fontSize: "clamp(12px, 2vw, 18px)", fontWeight: 700 }}>업계 최고의 가격과 품질을 모두 갖춘 사주 분석</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(79,70,229,0.1))", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 12, padding: "10px" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>
                  <h4 style={{ color: "#fbbf24", fontSize: "clamp(11px, 2vw, 14px)", fontWeight: 900, marginBottom: 2, marginTop: 0 }}>50~200페이지 완벽분석</h4>
                  <p style={{ color: "#cbd5e1", fontSize: "clamp(9px, 1.5vw, 12px)", fontWeight: 600, marginTop: 0, lineHeight: 1.4 }}>기본분석(50P)부터 VVIP 커플팩(200P)까지</p>
                </div>
                <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(79,70,229,0.1))", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 12, padding: "10px" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>💎</div>
                  <h4 style={{ color: "#fbbf24", fontSize: "clamp(11px, 2vw, 14px)", fontWeight: 900, marginBottom: 2, marginTop: 0 }}>합리적인 가격</h4>
                  <p style={{ color: "#cbd5e1", fontSize: "clamp(9px, 1.5vw, 12px)", fontWeight: 600, marginTop: 0, lineHeight: 1.4 }}>9,900원~29,900원</p>
                </div>
                <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(79,70,229,0.1))", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 12, padding: "10px" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
                  <h4 style={{ color: "#fbbf24", fontSize: "clamp(11px, 2vw, 14px)", fontWeight: 900, marginBottom: 2, marginTop: 0 }}>즉시 다운로드</h4>
                  <p style={{ color: "#cbd5e1", fontSize: "clamp(9px, 1.5vw, 12px)", fontWeight: 600, marginTop: 0, lineHeight: 1.4 }}>결제 후 5분 이내 PDF 완성</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ color: "#fbbf24", fontWeight: 900, fontSize: "clamp(16px, 3vw, 22px)", marginBottom: 14, marginTop: 0 }}>📦 패키지 선택</h4>
            <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(49,46,129,0.1))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "12px", display: "flex", flexDirection: "column", gap: "8px", marginBottom: 10 }}>
              <div><p style={{ fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 900, color: "#94a3b8", marginBottom: 4, marginTop: 0 }}>✨ 기본분석</p><p style={{ color: "#94a3b8", fontSize: "clamp(9px, 1.5vw, 13px)", marginTop: 0, marginBottom: 0 }}>50페이지</p></div>
              <p style={{ fontSize: "clamp(12px, 2vw, 19px)", fontWeight: 900, color: "#fbbf24", marginTop: 0, marginBottom: 0 }}>9,900원</p>
            </div>
            <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(49,46,129,0.1))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "12px", display: "flex", flexDirection: "column", gap: "8px", marginBottom: 10 }}>
              <div><p style={{ fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 900, color: "#a78bfa", marginBottom: 4, marginTop: 0 }}>⭐ 베이직</p><p style={{ color: "#94a3b8", fontSize: "clamp(9px, 1.5vw, 13px)", marginTop: 0, marginBottom: 0 }}>100페이지</p></div>
              <p style={{ fontSize: "clamp(12px, 2vw, 19px)", fontWeight: 900, color: "#fbbf24", marginTop: 0, marginBottom: 0 }}>19,900원</p>
            </div>
            <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(49,46,129,0.1))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "12px", display: "flex", flexDirection: "column", gap: "8px", marginBottom: 10, position: "relative" }}>
              <span style={{ position: "absolute", top: -10, left: 14, background: "#f59e0b", color: "black", fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>🔥 인기</span>
              <div><p style={{ fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 900, color: "#fbbf24", marginBottom: 4, marginTop: 0 }}>🔮 프리미엄</p><p style={{ color: "#94a3b8", fontSize: "clamp(9px, 1.5vw, 13px)", marginTop: 0, marginBottom: 0 }}>150페이지</p></div>
              <p style={{ fontSize: "clamp(12px, 2vw, 19px)", fontWeight: 900, color: "#fbbf24", marginTop: 0, marginBottom: 0 }}>24,900원</p>
            </div>
            <a href="/analyze" style={{ display: "block", background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(49,46,129,0.1))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "12px", textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px", cursor: "pointer", marginBottom: 20 }}>
              <div><p style={{ fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 900, color: "#f472b6", marginBottom: 4, marginTop: 0 }}>💎 VVIP 커플팩</p><p style={{ color: "#94a3b8", fontSize: "clamp(9px, 1.5vw, 13px)", marginTop: 0, marginBottom: 4 }}>(+ 궁합 포함)</p><p style={{ color: "#94a3b8", fontSize: "clamp(9px, 1.5vw, 13px)", marginTop: 0, marginBottom: 0 }}>200페이지</p></div>
              <p style={{ fontSize: "clamp(12px, 2vw, 19px)", fontWeight: 900, color: "#fbbf24", marginTop: 4, marginBottom: 0 }}>29,900원</p>
            </a>
            <h4 style={{ color: "#a78bfa", fontWeight: 900, fontSize: "clamp(16px, 3vw, 22px)", marginBottom: 12, marginTop: 0 }}>🔮 운세 종류</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 24, marginBottom: 4 }}>📅</div><p style={{ color: "white", fontSize: "clamp(9px, 1.5vw, 14px)", fontWeight: 700, marginBottom: 0, marginTop: 0 }}>오늘의 운세</p></div>
              <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 24, marginBottom: 4 }}>📆</div><p style={{ color: "white", fontSize: "clamp(9px, 1.5vw, 14px)", fontWeight: 700, marginBottom: 0, marginTop: 0 }}>이번달 운세</p></div>
              <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 24, marginBottom: 4 }}>📊</div><p style={{ color: "white", fontSize: "clamp(9px, 1.5vw, 14px)", fontWeight: 700, marginBottom: 0, marginTop: 0 }}>올해 운세</p></div>
              <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 24, marginBottom: 4 }}>🔮</div><p style={{ color: "white", fontSize: "clamp(9px, 1.5vw, 14px)", fontWeight: 700, marginBottom: 0, marginTop: 0 }}>전체 사주분석</p></div>
              <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 24, marginBottom: 4 }}>💰</div><p style={{ color: "white", fontSize: "clamp(9px, 1.5vw, 14px)", fontWeight: 700, marginBottom: 0, marginTop: 0 }}>재물운 분석</p></div>
              <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 24, marginBottom: 4 }}>❤️</div><p style={{ color: "white", fontSize: "clamp(9px, 1.5vw, 14px)", fontWeight: 700, marginBottom: 0, marginTop: 0 }}>연애운 분석</p></div>
              <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 24, marginBottom: 4 }}>💪</div><p style={{ color: "white", fontSize: "clamp(9px, 1.5vw, 14px)", fontWeight: 700, marginBottom: 0, marginTop: 0 }}>건강운 분석</p></div>
              <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 24, marginBottom: 4 }}>👥</div><p style={{ color: "white", fontSize: "clamp(9px, 1.5vw, 14px)", fontWeight: 700, marginBottom: 0, marginTop: 0 }}>궁합 분석</p></div>
            </div>
            <a href="/analyze" style={{ display: "block", background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "black", padding: "14px 20px", borderRadius: 12, fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 900, textDecoration: "none", textAlign: "center", boxShadow: "0 8px 30px rgba(245,158,11,0.5)" }}>🔮 지금 바로 분석하기</a>
          </div>
        </div>
      </section>
    </main>
  );
}