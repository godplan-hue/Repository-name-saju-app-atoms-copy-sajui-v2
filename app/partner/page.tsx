"use client";

import { useState, useEffect } from "react";

export default function PartnerLanding() {
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
      desc: "최신 AI 기술로\n고객의 사주팔자를\n정확하게 분석한 결과지를\n그대로 전달할 수 있습니다.\n오행과 십간십이지를 바탕으로\n숨겨진 운의 흐름까지 짚어드립니다."
    },
    {
      title: "운세 분석",
      icon: "📈",
      desc: "총운·재물운·연애운·건강운·직업운 등을\n패키지로 구성해\n고객에게 그대로 판매하세요.\n패키지 구성과 가격은\n사장님이 자유롭게 정합니다."
    },
    {
      title: "궁합 분석",
      icon: "💕",
      desc: "두 사람의 생년월일만으로\n궁합 분석까지 제공하는\nVIP 커플팩도 준비돼 있습니다.\n더 높은 단가의 상품으로\n판매하실 수 있습니다."
    },
    {
      title: "내 상호명으로",
      icon: "🏷️",
      desc: "결과지에 '점운'이 아니라\n등록하신 상호명이\n자동으로 표시됩니다.\n한 번만 등록하면\n그 다음부터 만드는 모든 결과지에\n자동으로 적용됩니다."
    }
  ];

  const stepsPC = [
    { num: "01", icon: "✏️", title: "파트너 가입", desc: "이름, 상호명, 이메일만 입력하면 끝" },
    { num: "02", icon: "🤖", title: "고객정보 입력", desc: "고객 이름과 생년월일만 입력" },
    { num: "03", icon: "📄", title: "결과지 전달", desc: "내 상호명으로 된 결과지를 바로 전달" }
  ];

  const stepsMobile = [
    { num: "01", icon: "✏️", title: "파트너 가입", desc: "이름, 상호명,\n이메일만\n입력하면 끝" },
    { num: "02", icon: "🤖", title: "고객정보 입력", desc: "고객 이름과\n생년월일만\n입력" },
    { num: "03", icon: "📄", title: "결과지 전달", desc: "내 상호명으로\n된 결과지를\n바로 전달" }
  ];

  const currentSteps = isMobile ? stepsMobile : stepsPC;

  const reviews = [
    {
      title: "처음엔 반신반의했는데 정말 놀랐어요",
      rating: "★ ★ ★ ★ ★",
      content: "사주 앱을 깐건\n친구 추천 때문인데,\nAI가 사주를\n잘 분석할 수 있을까?\n솔직히 걱정 했었거든요.\n\n그런데 제 성격, 기질,\n앞으로의 운의 흐름까지\n정확하게 맞춰서 놀랐습니다.\n\n특히 올해 제 재물운과\n직장 운에 대한 조언이\n정말 도움 됐어요.\n\n지금 이 앱 없이는\n못 살 정도로 애용 중입니다.",
      name: "*김혜진"
    },
    {
      title: "인생 계획 세우는 데 진짜 도움됨",
      rating: "★ ★ ★ ★ ★",
      content: "여러 사주 앱을 써봤지만\n이렇게 상세하고 신뢰감 있는\n분석은 처음이에요.\n\n일반적인 운세 예측을 넘어서\n연애운, 재물운, 건강운까지\n섬세하게 풀어서 설명해주니까\n단순히 재미로만 보는 게 아니라\n실제 인생 계획을 세우는 데\n큰 도움이 됩니다.\n\n이제 중요한 결정을 할 때마다\n이 앱을 참고해요.",
      name: "* 이재우"
    },
    {
      title: "친구들 모두에게 추천하고 싶을 정도",
      rating: "★ ★ ★ ★ ★",
      content: "AI 사주 분석이라고 해서\n대충할 줄 알았는데,\n정말 깊이 있게\n제 운세를 읽어주더라고요.\n\n앞으로 어떤 시기에\n어떤 조심이 필요한지,\n어떤 기회가 올 수 있는지\n구체적으로 알려줘서\n미래에 대한 불안감도 줄어들었어요.\n\n가족, 친구들에게도\n많이 추천하고 있습니다.\n정말 만족합니다!",
      name: "* 박연지"
    }
  ];

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10 }}>
        <header style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24 }}>✨</span>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#fbbf24", margin: 0 }}>점운 파트너</h1>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <a href="/partner-policy" style={{ padding: "8px 16px", background: "#fbbf24", color: "black", border: "none", borderRadius: 6, fontWeight: 900, cursor: "pointer", fontSize: 13, textDecoration: "none", display: "inline-block" }}>파트너정책</a>
            <a href="/partner/login" style={{ padding: "8px 16px", background: "#fbbf24", color: "black", border: "none", borderRadius: 6, fontWeight: 900, cursor: "pointer", fontSize: 13, textDecoration: "none", display: "inline-block" }}>로그인</a>
          </div>
        </header>

        <section style={{ padding: "50px 20px 30px", textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "12px 24px", borderRadius: 999, background: "rgba(139,92,246,0.6)", border: "1px solid rgba(245,158,11,0.8)", color: "#f5f5f5", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>✨ 누적 분석 127,483건 돌파한 AI 사주 엔진</div>
          <div style={{ width: 100, height: 100, margin: "0 auto 20px", borderRadius: "12px", backgroundImage: "url('/b17b07628f3f401ea692dbd75575ba0f.webp')", backgroundSize: "cover", backgroundPosition: "center", border: "2px solid rgba(245,158,11,0.5)", boxShadow: "0 0 50px rgba(245,158,11,0.3)", transform: "rotate(15deg)" }} />
          <h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, lineHeight: 1.3, margin: "0 auto 12px", color: "#d8c7ff" }}>당신의 사주 사업,<br />AI로 더 크게</h2>
          <p style={{ color: "#f5f5f5", fontSize: "clamp(13px, 2.5vw, 15px)", fontWeight: 700, lineHeight: 1.6, marginBottom: 14 }}>고객 이름과 생년월일만 입력하면 AI가 정밀한 사주 분석 결과지를 만들어드립니다<br />사장님 상호명으로 그대로 전달하세요</p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ color: "#f59e0b", fontSize: 16 }}>★★★★★</span>
            <span style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700 }}>4.9/5.0 (2,847 리뷰)</span>
          </div>
          <div style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>⏱ 가입 즉시 이용 가능 · 무료 등급으로 바로 시작 가능</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <a href="/partner/apply" style={{ display: "inline-block", padding: "12px 32px", borderRadius: 10, fontSize: "clamp(13px, 2vw, 14px)", fontWeight: 900, background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", textDecoration: "none", boxShadow: "0 8px 30px rgba(251,191,36,0.4)", cursor: "pointer" }}>🤝 파트너 시작하기</a>
            <a href="/partner-policy" style={{ display: "inline-block", padding: "12px 32px", borderRadius: 10, fontSize: "clamp(13px, 2vw, 14px)", fontWeight: 900, background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", textDecoration: "none", boxShadow: "0 8px 30px rgba(255,20,147,0.4)", cursor: "pointer" }}>📋 등급/정책 보기</a>
          </div>
        </section>

        <section style={{ padding: "30px 8px" }}>
          <h3 style={{ textAlign: "center", color: "#fbbf24", fontWeight: 900, fontSize: "clamp(16px, 2.5vw, 20px)", marginBottom: 18 }}>점운 파트너</h3>
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

        <section style={{ padding: "30px 12px", borderRadius: 12, background: "rgba(0,0,0,0.6)", maxWidth: isMobile ? "100%" : "900px", margin: "0 auto" }}>
          <h3 style={{ textAlign: "center", color: "#fbbf24", fontWeight: 900, fontSize: "clamp(16px, 2.5vw, 20px)", marginBottom: 18 }}>실제 이용자 후기</h3>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
            {reviews.map((review, i) => (
              <div key={i} style={{ background: "rgba(139,92,246,0.65)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10, padding: "12px", minHeight: isMobile ? "auto" : "320px", display: "flex", flexDirection: "column" }}>
                <div style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, lineHeight: 1.5, marginBottom: 10, whiteSpace: "pre-line" }}>{review.title}</div>
                <div style={{ color: "#ff9500", fontSize: "clamp(10px, 2vw, 11px)", fontWeight: 700, lineHeight: 1.8, marginBottom: 8 }}>{review.rating}</div>
                <div style={{ color: "#f5f5f5", fontSize: "clamp(10px, 1.8vw, 11px)", fontWeight: 600, lineHeight: 1.8, flex: isMobile ? 0 : 1, whiteSpace: "pre-line" }}>{review.content}</div>
                <p style={{ color: "#fbbf24", fontSize: 10, fontWeight: 900, margin: "10px 0 0 0" }}>{review.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "40px 16px", textAlign: "center" }}>
          <h3 style={{ color: "#fbbf24", fontWeight: 900, fontSize: "clamp(16px, 2.5vw, 24px)", marginBottom: 10 }}>지금 바로</h3>
          <p style={{ color: "#f5f5f5", fontSize: "clamp(12px, 2vw, 15px)", fontWeight: 700, marginBottom: 18 }}>사주 사업, AI 도구와 함께 시작하세요</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <a href="/partner/apply" style={{ display: "inline-block", padding: "12px 40px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", borderRadius: 10, fontWeight: 900, fontSize: "clamp(12px, 2vw, 14px)", textDecoration: "none", boxShadow: "0 8px 30px rgba(251,191,36,0.4)", cursor: "pointer" }}>🤝 파트너 시작하기</a>
            <a href="/partner-policy" style={{ display: "inline-block", padding: "12px 40px", background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", borderRadius: 10, fontWeight: 900, fontSize: "clamp(12px, 2vw, 14px)", textDecoration: "none", boxShadow: "0 8px 30px rgba(255,20,147,0.4)", cursor: "pointer" }}>📋 등급/정책 보기</a>
          </div>
        </section>

        <footer style={{ padding: "30px 16px", textAlign: "center", borderTop: "1px solid rgba(245,158,11,0.2)", background: "rgba(0,0,0,0.2)" }}>
          <p style={{ color: "#999999", fontSize: 14, fontWeight: 600, margin: "0 0 12px 0" }}>© 2026 점운</p>
          <div style={{ color: "#999999", fontSize: 12, fontWeight: 600, lineHeight: 1.8, marginBottom: 10 }}>
            <p style={{ margin: "0 0 8px 0" }}>📧 이메일: junga6783@gmail.com</p>
            <p style={{ margin: "0 0 12px 0" }}>응답기간: 7일 이내</p>
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
