"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

export default function MainV2() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    const savedUser = localStorage.getItem("v2_user_name");
    if (savedUser) setUser(savedUser);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const reviews = [
    { cat: "😺", name: "김혜진", stars: 5, title: "정말 정확해서 소름 돋았어요", body: "제 성격이랑 올해 흐름을 너무 정확하게 맞혔어요. AI 사주인데도 이렇게 디테일할 줄은 몰랐습니다." },
    { cat: "😻", name: "이재우", stars: 5, title: "재물운 점수가 딱 맞았어요", body: "점수로 보여주니까 한눈에 파악이 되고, 설명도 구체적이라 실제 계획 세우는 데 도움이 됐어요." },
    { cat: "🐱", name: "박연지", stars: 5, title: "친구들한테 다 공유했어요", body: "공유 기능도 있고, 카드 형식이 예뻐서 캡처해서 올렸더니 다들 해보고 싶다고 했어요!" },
  ];

  const features = [
    { icon: "🎴", title: "카드형 인터랙티브", desc: "재미있는 카드 선택 방식으로\n당신의 운세를 찾아드립니다" },
    { icon: "📊", title: "점수로 보는 운세", desc: "재물·연애·건강·성공 각 분야를\n0~100점으로 명확하게 확인" },
    { icon: "📂", title: "보관함 기능", desc: "분석 기록이 저장되어\n언제든 다시 확인할 수 있어요" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", overflowX: "hidden" }}>

      {/* 헤더 */}
      <header style={{ height: 56, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🐱</span>
          <span style={{ fontWeight: 900, fontSize: 17, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>점운 v2</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {user && <span style={{ fontSize: 13, color: "#8b5cf6", fontWeight: 700 }}>{user}님</span>}
          <button onClick={() => router.push("/main-v2/history")} style={{ padding: "6px 14px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>📂 보관함</button>
          <a href="/" style={{ padding: "6px 14px", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 20, fontWeight: 600, fontSize: 12, textDecoration: "none" }}>v1</a>
        </div>
      </header>

      {/* 히어로 */}
      <section style={{ background: BG, padding: isMobile ? "64px 20px 80px" : "100px 20px 120px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(236,72,153,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(139,92,246,0.06)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "6px 18px", background: G, borderRadius: 20, color: "white", fontSize: 12, fontWeight: 700, marginBottom: 24 }}>
            ✨ 사주아이 스타일 · AI 운세 분석
          </div>

          <div style={{ fontSize: isMobile ? 110 : 150, lineHeight: 1, marginBottom: 20, animation: "catFloat 3s ease-in-out infinite", display: "inline-block" }}>
            🐱
          </div>

          <h1 style={{ fontSize: isMobile ? 30 : 50, fontWeight: 900, color: "#1a1a2e", margin: "0 0 16px", lineHeight: 1.2 }}>
            고양이가 읽는<br />
            <span style={{ background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>나의 운명</span>
          </h1>

          <p style={{ fontSize: isMobile ? 15 : 18, color: "#6b7280", margin: "0 0 12px", lineHeight: 1.7, fontWeight: 500 }}>
            카드를 선택하면 AI가 당신의 운세를<br />
            <strong style={{ color: "#ec4899" }}>점수와 그래프</strong>로 보여드립니다
          </p>

          {/* 점수 미리보기 */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", margin: "24px 0 36px" }}>
            {[
              { label: "재물운", score: 82, color: "#f59e0b" },
              { label: "연애운", score: 76, color: "#ec4899" },
              { label: "건강운", score: 88, color: "#10b981" },
            ].map(item => (
              <div key={item.label} style={{ background: "white", borderRadius: 16, padding: "14px 20px", border: "1.5px solid rgba(236,72,153,0.15)", boxShadow: "0 4px 16px rgba(139,92,246,0.08)", minWidth: 90 }}>
                <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: item.color }}>{item.score}</div>
                <div style={{ height: 4, background: "#f3f4f6", borderRadius: 99, marginTop: 6 }}>
                  <div style={{ height: 4, width: `${item.score}%`, background: G, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <button
              onClick={() => router.push(user ? "/main-v2/analysis" : "/main-v2/login")}
              style={{ padding: "18px 52px", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: "0 8px 32px rgba(236,72,153,0.35)" }}
            >
              🔮 무료 운세 보기
            </button>
            <button
              onClick={() => router.push("/main-v2/payment")}
              style={{ padding: "14px 40px", background: "white", color: "#8b5cf6", border: "2px solid #8b5cf6", borderRadius: 50, fontWeight: 800, fontSize: 15, cursor: "pointer" }}
            >
              💎 포인트 충전 (₩990~)
            </button>
          </div>

          <p style={{ marginTop: 20, fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>
            ⏱ 30초 완료 &nbsp;·&nbsp; 회원가입 불필요 &nbsp;·&nbsp; 무료
          </p>
        </div>
      </section>

      {/* 특징 카드 */}
      <section style={{ padding: isMobile ? "52px 20px" : "80px 20px", background: "white" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: isMobile ? 22 : 30, fontWeight: 900, color: "#1a1a2e", margin: "0 0 48px" }}>
            사주아이 스타일로 새롭게 🐾
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: BG, borderRadius: 20, padding: "28px 24px", textAlign: "center", border: "1.5px solid rgba(236,72,153,0.12)" }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.7, whiteSpace: "pre-line" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 후기 */}
      <section style={{ padding: isMobile ? "52px 20px 64px" : "80px 20px 100px", background: BG }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: isMobile ? 22 : 30, fontWeight: 900, color: "#1a1a2e", margin: "0 0 48px" }}>
            실제 이용자 후기 ⭐
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 20 }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: "white", borderRadius: 20, padding: "24px 20px", border: "1.5px solid rgba(236,72,153,0.12)", boxShadow: "0 4px 20px rgba(139,92,246,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 34 }}>{r.cat}</span>
                  <span style={{ fontSize: 13, color: "#f59e0b" }}>{"★".repeat(r.stars)}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: "#ec4899", margin: "0 0 10px", lineHeight: 1.4 }}>{r.title}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.7 }}>{r.body}</p>
                <p style={{ fontSize: 12, color: "#d1d5db", margin: "12px 0 0", textAlign: "right", fontWeight: 700 }}>* {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <section style={{ padding: isMobile ? "60px 20px" : "100px 20px", background: "white", textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>😺</div>
        <h2 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 900, color: "#1a1a2e", margin: "0 0 14px" }}>지금 바로 확인하세요</h2>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 32px", fontWeight: 500 }}>카드 선택 하나로 당신의 운세가 펼쳐집니다 🐾</p>
        <button
          onClick={() => router.push(user ? "/main-v2/analysis" : "/main-v2/login")}
          style={{ padding: "18px 52px", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: "0 8px 32px rgba(236,72,153,0.35)" }}
        >
          🔮 무료 운세 분석
        </button>
      </section>

      {/* 푸터 */}
      <footer style={{ padding: "28px 20px", textAlign: "center", borderTop: "1px solid rgba(236,72,153,0.1)", background: "white" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 16 }}>🐱</span>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>점운 v2</span>
        </div>
        <p style={{ color: "#9ca3af", fontSize: 12, margin: "0 0 8px" }}>© 2024 점운 · 정신과 영혼의 만남</p>
        <div style={{ fontSize: 12 }}>
          <a href="/privacy" style={{ color: "#ec4899", textDecoration: "none", fontWeight: 600 }}>개인정보처리방침</a>
          <span style={{ color: "#d1d5db", margin: "0 8px" }}>|</span>
          <a href="/refund" style={{ color: "#ec4899", textDecoration: "none", fontWeight: 600 }}>환불정책</a>
        </div>
      </footer>

      <style jsx>{`
        @keyframes catFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
      `}</style>
    </main>
  );
}
