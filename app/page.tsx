"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const features = [
    { 
      title: "AI 정밀 분석", 
      icon: "⚡", 
      desc: (
        <>
          최신 AI 기술로 당신의<br/>
          사주팔자를 정확하게 읽어냅니다.<br/>
          <br/>
          오행과 십간십이지를 바탕으로<br/>
          숨겨진 운의 흐름을 찾아내세요.
        </>
      )
    },
    { 
      title: "운세 분석", 
      icon: "📈", 
      desc: (
        <>
          인생의 모든 영역을 한눈에파악하세요.<br/>
          총운·재물운·연애운·건강운·직업운 등<br/>
          운세를 완벽하게 분석합니다.<br/>
          <br/>
          올해 당신이 집중해야할것이<br/>
          무엇인지 알려줍니다.
        </>
      )
    },
    { 
      title: "궁합 분석", 
      icon: "💕", 
      desc: (
        <>
          상대방의 생년월일만으로 운명의 인연을 읽다.<br/>
          두 사람의 관계 패턴, 연애의 강점과 주의점,<br/>
          <br/>
          함께할 미래까지 구체적으로 봅니다.<br/>
          숫자가 아닌 가능성으로 만나는 당신의 궁합.
        </>
      )
    },
    { 
      title: "개인정보 보호", 
      icon: "🔒", 
      desc: (
        <>
          당신의 정보는 100% 안전합니다.<br/>
          입력하신 생년월일, 성명 등<br/>
          모든 정보는 분석 후 즉시 삭제됩니다.<br/>
          <br/>
          최신 암호화 기술로 보호되는<br/>
          완벽한 보안 시스템.
        </>
      )
    }
  ];

  const steps = [
    { num: "01", icon: "✏️", title: "정보 입력", desc: isMobile ? "이름, 성별, 생년월일을\n입력하세요" : "이름, 성별, 생년월일을 입력하세요" },
    { num: "02", icon: "🤖", title: "AI 분석", desc: isMobile ? "AI가 사주궁합을\n정밀하게 분석합니다" : "AI가 사주궁합을 정밀하게 분석합니다" },
    { num: "03", icon: "📄", title: "결과 확인", desc: "최고의 운세 분석 결과을 확인하세요" }
  ];

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10 }}>
        <header style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24 }}>✨</span>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#fbbf24", margin: 0 }}>점운</h1>
          </div>
          <a href="/free-analysis" style={{ padding: "8px 16px", background: "#fbbf24", color: "black", border: "none", borderRadius: 6, fontWeight: 900, cursor: "pointer", fontSize: 13, textDecoration: "none", display: "inline-block" }}>무료 사주 보기</a>
        </header>

        <section style={{ padding: "60px 20px 40px", textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "12px 24px", borderRadius: 999, background: "rgba(139,92,246,0.6)", border: "1px solid rgba(245,158,11,0.8)", color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>✨ 누적 분석 127,483건 돌파</div>
          <div style={{ width: 100, height: 100, margin: "0 auto 24px", borderRadius: "12px", backgroundImage: "url('/b17b07628f3f401ea692dbd75575ba0f.webp')", backgroundSize: "cover", backgroundPosition: "center", border: "2px solid rgba(245,158,11,0.5)", boxShadow: "0 0 50px rgba(245,158,11,0.3)", transform: "rotate(15deg)" }} />
          <h2 style={{ fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 900, lineHeight: 1.3, margin: "0 auto 12px", color: "#d8c7ff" }}>당신의 운명을<br />AI가 풀어드립니다</h2>
          <p style={{ color: "#f5f5f5", fontSize: "clamp(12px, 2vw, 14px)", fontWeight: 700, lineHeight: 1.6, marginBottom: 16 }}>생년월일만 입력하면 AI가 사주팔자를 정밀 분석하여<br />총운, 재물운, 연애운, 건강운, 직업운을 알려드립니다</p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ color: "#f59e0b", fontSize: 16 }}>★★★★★</span>
            <span style={{ color: "#f5f5f5", fontSize: 11, fontWeight: 700 }}>4.9/5.0 (2,847 리뷰)</span>
          </div>
          <div style={{ color: "#f5f5f5", fontSize: 11, fontWeight: 700, marginBottom: 16 }}>⏱ 30초면 완료 · 회원가입 불필요 · 100% 무료</div>
          <a href="/free-analysis" style={{ display: "inline-block", padding: "12px 32px", borderRadius: 10, fontSize: "clamp(12px, 2vw, 14px)", fontWeight: 900, background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", textDecoration: "none", boxShadow: "0 8px 30px rgba(251,191,36,0.4)", cursor: "pointer" }}>🔮 무료로 내 사주 보기</a>
        </section>

        <section style={{ padding: "40px 8px" }}>
          <h3 style={{ textAlign: "center", color: "#fbbf24", fontWeight: 900, fontSize: "clamp(16px, 2.5vw, 20px)", marginBottom: 24 }}>점운</h3>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {features.map((feature, i) => (
              <div key={i} style={{ background: "rgba(139,92,246,0.65)", border: "1px solid rgba(139,92,246,0.85)", borderRadius: 10, padding: "16px 12px", textAlign: "center", minHeight: "auto", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 20, marginBottom: 10 }}>{feature.icon}</div>
                <h4 style={{ color: "#fbbf24", fontWeight: 900, fontSize: 13, margin: "0 0 10px 0" }}>{feature.title}</h4>
                <p style={{ color: "#f5f5f5", fontSize: isMobile ? 10 : 11, fontWeight: 700, lineHeight: 1.7, margin: 0, flex: 1, width: "100%", boxSizing: "border-box" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "40px 8px" }}>
          <h3 style={{ textAlign: "center", color: "#fbbf24", fontWeight: 900, fontSize: "clamp(16px, 2.5vw, 20px)", marginBottom: 24 }}>3단계로 간단하게</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: 45, height: 45, borderRadius: "50%", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>{step.num}</div>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{step.icon}</div>
                <h4 style={{ color: "#fbbf24", fontWeight: 900, fontSize: 12, margin: "0 0 4px 0" }}>{step.title}</h4>
                <p style={{ color: "#f5f5f5", fontSize: 10, fontWeight: 700, margin: 0, lineHeight: isMobile ? 1.6 : 1.4, whiteSpace: "pre-line" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "40px 16px", borderRadius: 12, background: "rgba(0,0,0,0.6)" }}>
          <h3 style={{ textAlign: "center", color: "#fbbf24", fontWeight: 900, fontSize: "clamp(16px, 2.5vw, 20px)", marginBottom: 24 }}>실제 이용자 후기</h3>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
            <div style={{ background: "rgba(139,92,246,0.65)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10, padding: "12px", minHeight: isMobile ? "auto" : "220px", display: "flex", flexDirection: "column" }}>
              <div style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, lineHeight: 1.5, marginBottom: 12, width: "100%", boxSizing: "border-box" }}>
                처음엔 반신반의했는데 정말 놀랐어요
              </div>
              <div style={{ color: "#f5f5f5", fontSize: 10, fontWeight: 700, lineHeight: 1.6, flex: isMobile ? 0 : 1, width: "100%", boxSizing: "border-box", paddingRight: "6px" }}>
                ★ ★ ★ ★ ★<br/>
                사주 앱을 깐건 친구 추천 때문인데,<br/>
                AI가 사주를 잘 분석할 수 있을까?<br/>
                솔직히 걱정 했었거든요.<br/>
                <br/>
                그런데 제 성격, 기질,<br/>
                앞으로의 운의 흐름까지<br/>
                정확하게 맞춰서 놀랐습니다.
              </div>
              <p style={{ color: "#fbbf24", fontSize: 10, fontWeight: 900, margin: "8px 0 0 0" }}>* 김혜진</p>
            </div>

            <div style={{ background: "rgba(139,92,246,0.65)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10, padding: "12px", minHeight: isMobile ? "auto" : "220px", display: "flex", flexDirection: "column" }}>
              <div style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, lineHeight: 1.5, marginBottom: 12, width: "100%", boxSizing: "border-box" }}>
                인생 계획 세우는 데 진짜 도움됨
              </div>
              <div style={{ color: "#f5f5f5", fontSize: 10, fontWeight: 700, lineHeight: 1.6, flex: isMobile ? 0 : 1, width: "100%", boxSizing: "border-box", paddingRight: "6px" }}>
                ★ ★ ★ ★ ★<br/>
                여러 사주 앱을 써봤지만<br/>
                이렇게 상세하고 신뢰감 있는<br/>
                분석은 처음이에요.<br/>
                <br/>
                일반적인 운세 예측을 넘어서<br/>
                연애운, 재물운, 건강운까지<br/>
                섬세하게 풀어서 설명해주니까
              </div>
              <p style={{ color: "#fbbf24", fontSize: 10, fontWeight: 900, margin: "8px 0 0 0" }}>* 이재우</p>
            </div>

            <div style={{ background: "rgba(139,92,246,0.65)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10, padding: "12px", minHeight: isMobile ? "auto" : "220px", display: "flex", flexDirection: "column" }}>
              <div style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, lineHeight: 1.5, marginBottom: 12, width: "100%", boxSizing: "border-box" }}>
                친구들 모두에게 추천하고 싶을 정도
              </div>
              <div style={{ color: "#f5f5f5", fontSize: 10, fontWeight: 700, lineHeight: 1.6, flex: isMobile ? 0 : 1, width: "100%", boxSizing: "border-box", paddingRight: "6px" }}>
                ★ ★ ★ ★ ★<br/>
                AI 사주 분석이라고 해서 대충할 줄 알았는데,<br/>
                정말 깊이 있게 제 운세를 읽어주더라고요.<br/>
                <br/>
                앞으로 어떤 시기에 어떤 조심이 필요한지,<br/>
                어떤 기회가 올 수 있는지<br/>
                구체적으로 알려줘서
              </div>
              <p style={{ color: "#fbbf24", fontSize: 10, fontWeight: 900, margin: "8px 0 0 0" }}>* 박연지</p>
            </div>
          </div>
        </section>

        <section style={{ padding: "60px 16px", textAlign: "center" }}>
          <h3 style={{ color: "#fbbf24", fontWeight: 900, fontSize: "clamp(16px, 2.5vw, 24px)", marginBottom: 12 }}>지금 바로</h3>
          <p style={{ color: "#f5f5f5", fontSize: "clamp(12px, 2vw, 16px)", fontWeight: 700, marginBottom: 24 }}>내 운명을 확인하세요</p>
          <a href="/free-analysis" style={{ display: "inline-block", padding: "12px 40px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", borderRadius: 10, fontWeight: 900, fontSize: "clamp(12px, 2vw, 14px)", textDecoration: "none", boxShadow: "0 8px 30px rgba(251,191,36,0.4)", cursor: "pointer" }}>🔮 무료 사주 분석 시작</a>
        </section>

        <footer style={{ padding: "30px 16px", textAlign: "center", borderTop: "1px solid rgba(245,158,11,0.2)", marginTop: "60px", background: "rgba(0,0,0,0.2)" }}>
          <p style={{ color: "#999999", fontSize: 9, fontWeight: 600, margin: "0 0 12px 0" }}>© 2024 점운</p>
          <p style={{ color: "#999999", fontSize: 8, fontWeight: 600, margin: 0, lineHeight: 1.8 }}>
            <a href="/privacy" style={{ color: "#fbbf24", textDecoration: "none" }}>개인정보처리방침</a>
            {" | "}
            <a href="/terms" style={{ color: "#fbbf24", textDecoration: "none" }}>이용약관</a>
            {" | "}
            <a href="/support" style={{ color: "#fbbf24", textDecoration: "none" }}>고객지원</a>
          </p>
        </footer>
      </div>
    </main>
  );
}