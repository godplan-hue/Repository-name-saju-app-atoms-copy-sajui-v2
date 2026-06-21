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
      desc: "최신 AI 기술로\n당신의 사주팔자를\n정확하게 읽어냅니다.\n오행과 십간십이지를 바탕으로\n숨겨진 운의 흐름을 찾아내세요."
    },
    { 
      title: "운세 분석", 
      icon: "📈", 
      desc: "인생의 모든 영역을 한눈에파악하세요.\n총운·재물운·연애운·건강운·직업운 등\n운세를 완벽하게 분석합니다.\n올해 당신이 집중해야할것이\n무엇인지 알려줍니다."
    },
    { 
      title: "궁합 분석", 
      icon: "💕", 
      desc: "상대방의 생년월일만으로\n운명의 인연을 읽다.\n두 사람의 관계 패턴, 연애의 강점과 주의점,\n함께할 미래까지 구체적으로 봅니다.\n숫자가 아닌 가능성으로 만나는 당신의 궁합."
    },
    { 
      title: "개인정보 보호", 
      icon: "🔒", 
      desc: "당신의 정보는 100% 안전합니다.\n입력하신 생년월일, 성명 등\n모든 정보는 분석 후 즉시 삭제됩니다.\n최신 암호화 기술로 보호되는\n완벽한 보안 시스템."
    }
  ];

  const stepsPC = [
    { num: "01", icon: "✏️", title: "정보 입력", desc: "이름, 성별, 생년월일을 입력하세요" },
    { num: "02", icon: "🤖", title: "AI 분석", desc: "AI가 사주를 정밀하게 분석합니다" },
    { num: "03", icon: "📄", title: "결과 확인", desc: "최고의 운세 분석 결과을 확인하세요" }
  ];

  const stepsMobile = [
    { num: "01", icon: "✏️", title: "정보 입력", desc: "이름, 성별,\n생년월일을\n입력하세요" },
    { num: "02", icon: "🤖", title: "AI 분석", desc: "AI가 사주를\n정밀하게\n분석합니다" },
    { num: "03", icon: "📄", title: "결과 확인", desc: "최고의 운세\n분석 결과을\n확인하세요" }
  ];

  const currentSteps = isMobile ? stepsMobile : stepsPC;

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://i.pinimg.com/736x/98/b7/e2/98b7e210408f2cce6cc1c9c244402210.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10 }}>
        <header style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24 }}>✨</span>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#fbbf24", margin: 0 }}>점운</h1>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <a href="/free-analysis" style={{ padding: "8px 16px", background: "#fbbf24", color: "black", border: "none", borderRadius: 6, fontWeight: 900, cursor: "pointer", fontSize: 13, textDecoration: "none", display: "inline-block" }}>무료사주</a>
            <a href="/saju-info" style={{ padding: "8px 16px", background: "#fbbf24", color: "black", border: "none", borderRadius: 6, fontWeight: 900, cursor: "pointer", fontSize: 13, textDecoration: "none", display: "inline-block" }}>사주정보</a>
          </div>
        </header>

        <section style={{ padding: "50px 20px 30px", textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "12px 24px", borderRadius: 999, background: "rgba(139,92,246,0.6)", border: "1px solid rgba(245,158,11,0.8)", color: "#f5f5f5", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>★★★★★ AI가 정밀하게 읽어내는 사주 분석 엔진</div>
          <div style={{ width: 100, height: 100, margin: "0 auto 20px", borderRadius: "12px", backgroundImage: "url('/b17b07628f3f401ea692dbd75575ba0f.webp')", backgroundSize: "cover", backgroundPosition: "center", border: "2px solid rgba(245,158,11,0.5)", boxShadow: "0 0 50px rgba(245,158,11,0.3)", transform: "rotate(15deg)" }} />
          <h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, lineHeight: 1.3, margin: "0 auto 12px", color: "#d8c7ff" }}>당신의 운명을<br />AI가 풀어드립니다</h2>
          <p style={{ color: "#f5f5f5", fontSize: "clamp(13px, 2.5vw, 15px)", fontWeight: 700, lineHeight: 1.6, marginBottom: 14 }}>생년월일만 입력하면 AI가 사주팔자를 정밀 분석하여<br />총운, 재물운, 연애운, 건강운, 직업운을 알려드립니다</p>
          <div style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>⏱ 3초면 완료 · 회원가입 불필요 · 100% 무료</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <a href="/free-analysis" style={{ display: "inline-block", padding: "12px 32px", borderRadius: 10, fontSize: "clamp(13px, 2vw, 14px)", fontWeight: 900, background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", textDecoration: "none", boxShadow: "0 8px 30px rgba(251,191,36,0.4)", cursor: "pointer" }}>🔮 무료 사주</a>
            <a href="/payment" style={{ display: "inline-block", padding: "12px 32px", borderRadius: 10, fontSize: "clamp(13px, 2vw, 14px)", fontWeight: 900, background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", textDecoration: "none", boxShadow: "0 8px 30px rgba(255,20,147,0.4)", cursor: "pointer" }}>💎 유료 사주 분석</a>
          </div>
        </section>

        <section style={{ padding: "30px 8px" }}>
          <h3 style={{ textAlign: "center", color: "#fbbf24", fontWeight: 900, fontSize: "clamp(16px, 2.5vw, 20px)", marginBottom: 18 }}>점운</h3>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 12, maxWidth: isMobile ? "100%" : "900px", margin: "0 auto" }}>
            {features.map((feature, i) => (
              <div key={i} style={{ background: "rgba(139,92,246,0.65)", border: "1px solid rgba(139,92,246,0.85)", borderRadius: 10, padding: "14px", textAlign: "center", display: "flex", flexDirection: "column", minHeight: "220px" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{feature.icon}</div>
                <h4 style={{ color: "#fbbf24", fontWeight: 900, fontSize: 13, margin: "0 0 8px 0" }}>{feature.title}</h4>
                <p style={{ color: "#f5f5f5", fontSize: "clamp(11px, 2.2vw, 13px)", fontWeight: 600, lineHeight: 1.7, margin: 0, flex: 1, whiteSpace: "pre-line" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "30px 8px" }}>
          <h3 style={{ textAlign: "center", color: "#fbbf24", fontWeight: 900, fontSize: "clamp(16px, 2.5vw, 20px)", marginBottom: 18 }}>3단계로 간단하게</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, maxWidth: isMobile ? "100%" : "900px", margin: "0 auto" }}>
            {currentSteps.map((step, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: 45, height: 45, borderRadius: "50%", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>{step.num}</div>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{step.icon}</div>
                <h4 style={{ color: "#fbbf24", fontWeight: 900, fontSize: 12, margin: "0 0 4px 0" }}>{step.title}</h4>
                <p style={{ color: "#f5f5f5", fontSize: "clamp(10px, 2vw, 11px)", fontWeight: 700, margin: 0, lineHeight: 1.6, whiteSpace: "pre-line" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "40px 16px", textAlign: "center" }}>
          <h3 style={{ color: "#fbbf24", fontWeight: 900, fontSize: "clamp(16px, 2.5vw, 24px)", marginBottom: 10 }}>지금 바로</h3>
          <p style={{ color: "#f5f5f5", fontSize: "clamp(12px, 2vw, 15px)", fontWeight: 700, marginBottom: 18 }}>내 운명을 확인하세요</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <a href="/free-analysis" style={{ display: "inline-block", padding: "12px 40px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", borderRadius: 10, fontWeight: 900, fontSize: "clamp(12px, 2vw, 14px)", textDecoration: "none", boxShadow: "0 8px 30px rgba(251,191,36,0.4)", cursor: "pointer" }}>🔮 무료 사주</a>
            <a href="/payment" style={{ display: "inline-block", padding: "12px 40px", background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", borderRadius: 10, fontWeight: 900, fontSize: "clamp(12px, 2vw, 14px)", textDecoration: "none", boxShadow: "0 8px 30px rgba(255,20,147,0.4)", cursor: "pointer" }}>💎 유료 사주 분석</a>
          </div>
        </section>

        <footer style={{ padding: "30px 16px", textAlign: "center", borderTop: "1px solid rgba(245,158,11,0.2)", background: "rgba(0,0,0,0.2)" }}>
          <p style={{ color: "#999999", fontSize: 14, fontWeight: 600, margin: "0 0 12px 0" }}>© 2026 점운</p>
          <div style={{ color: "#d4c896", fontSize: 12, fontWeight: 700, lineHeight: 1.9, marginBottom: 14, letterSpacing: "0.1px" }}>
            <p style={{ margin: "0 0 2px 0" }}>대표 장문정 · 상호 기획의신</p>
            <p style={{ margin: "0 0 2px 0" }}>사업자등록번호 773-60-00359</p>
            <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
          </div>
          <div style={{ color: "#e9d5a8", fontSize: 12, fontWeight: 700, lineHeight: 1.8, marginBottom: 14 }}>
            <p style={{ margin: "0 0 2px 0" }}>📧 junga6783@gmail.com · 📞 010-4714-2689</p>
            <p style={{ margin: "0 0 8px 0", fontSize: 11, color: "#c9b896" }}>전화 상담은 제공하지 않습니다. 문의하기를 이용해주세요.</p>
            <a href="mailto:junga6783@gmail.com?subject=점운 문의" style={{ display: "inline-block", padding: "6px 18px", border: "1.5px solid #fbbf24", borderRadius: 20, color: "#fbbf24", textDecoration: "none", fontWeight: 800, fontSize: 12 }}>문의하기</a>
          </div>
          <p style={{ color: "#999999", fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
            <a href="/privacy" style={{ color: "#fbbf24", textDecoration: "none" }}>개인정보처리방침</a>
            {" | "}
            <a href="/refund" style={{ color: "#fbbf24", textDecoration: "none" }}>환불정책</a>
            {" | "}
            <a href="/partner-policy" style={{ color: "#fbbf24", textDecoration: "none" }}>파트너정책</a>
          </p>
        </footer>
      </div>
    </main>
  );
}