"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

export default function V2Login() {
  const router = useRouter();
  const [name, setName] = useState("");

  const loginWithName = () => {
    if (!name.trim()) { alert("이름을 입력해주세요"); return; }
    localStorage.setItem("v2_user_name", name.trim());
    router.push("/main-v2/profile");
  };

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* 헤더 */}
      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🐱 점운</span>
        </button>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px 48px" }}>
        <div style={{ width: "100%", maxWidth: 360 }}>

          {/* 타이틀 */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 76, lineHeight: 1, marginBottom: 12, display: "inline-block", animation: "catFloat 3s ease-in-out infinite" }}>🐱</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px" }}>간편 시작</h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>로그인 없이도 바로 운세 확인</p>
          </div>

          {/* 카드 */}
          <div style={{ background: "white", borderRadius: 24, padding: "24px 20px", boxShadow: "0 8px 40px rgba(236,72,153,0.09)", border: "1.5px solid rgba(236,72,153,0.1)" }}>

            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>이름을 알려주세요</label>
              <input
                autoFocus
                type="text" value={name} onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && loginWithName()}
                placeholder="홍길동"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid rgba(236,72,153,0.3)", fontSize: 15, boxSizing: "border-box", outline: "none", fontFamily: "inherit", color: "#1a1a2e", background: "white" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#ec4899")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(236,72,153,0.3)")}
              />
              <button onClick={loginWithName}
                style={{ width: "100%", marginTop: 14, padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.3)" }}>
                시작하기 →
              </button>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 18, lineHeight: 1.7 }}>
            🔒 개인정보는 분석 즉시 암호화 보호됩니다<br />
            시작 시 <span style={{ color: "#ec4899", fontWeight: 700 }}>이용약관 및 개인정보처리방침</span>에 동의합니다
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes catFloat { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
      `}</style>
    </main>
  );
}
