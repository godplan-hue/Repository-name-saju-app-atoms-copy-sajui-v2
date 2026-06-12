"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

export default function V2Login() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"sns" | "name">("sns");

  const handleSNS = (provider: string) => {
    const guestName = provider === "kakao" ? "카카오 사용자" : "Google 사용자";
    localStorage.setItem("v2_user_name", guestName);
    localStorage.setItem("v2_provider", provider);
    router.push("/main-v2/profile");
  };

  const handleNameStart = () => {
    if (!name.trim()) { alert("이름을 입력해주세요"); return; }
    localStorage.setItem("v2_user_name", name.trim());
    localStorage.setItem("v2_provider", "name");
    router.push("/main-v2/profile");
  };

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* 헤더 */}
      <header style={{ height: 56, padding: "0 20px", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)" }}>
        <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22 }}>🐱</button>
        <span style={{ fontWeight: 900, fontSize: 16, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginLeft: 8 }}>점운 v2</span>
      </header>

      {/* 메인 카드 */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          {/* 로고 */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 80, marginBottom: 12, animation: "catBounce 2s ease-in-out infinite", display: "inline-block" }}>😺</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>간편하게 시작하기</h1>
            <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>SNS 계정이나 이름으로 바로 시작하세요</p>
          </div>

          {/* 카드 */}
          <div style={{ background: "white", borderRadius: 24, padding: "32px 24px", boxShadow: "0 8px 40px rgba(236,72,153,0.1)", border: "1.5px solid rgba(236,72,153,0.12)" }}>

            {mode === "sns" ? (
              <>
                {/* 카카오 */}
                <button
                  onClick={() => handleSNS("kakao")}
                  style={{ width: "100%", padding: "16px 0", background: "#fee500", color: "#1a1a1a", border: "none", borderRadius: 14, fontWeight: 900, fontSize: 16, cursor: "pointer", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 20 }}>💛</span> 카카오로 시작하기
                </button>

                {/* 구글 */}
                <button
                  onClick={() => handleSNS("google")}
                  style={{ width: "100%", padding: "16px 0", background: "white", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 14, fontWeight: 800, fontSize: 16, cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 20 }}>🌐</span> Google로 시작하기
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
                  <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>또는</span>
                  <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
                </div>

                <button
                  onClick={() => setMode("name")}
                  style={{ width: "100%", padding: "14px 0", background: "white", color: "#8b5cf6", border: "1.5px solid #8b5cf6", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer" }}
                >
                  이름으로 시작하기
                </button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 8 }}>이름을 입력해주세요</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleNameStart()}
                    placeholder="홍길동"
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid rgba(236,72,153,0.3)", fontSize: 16, boxSizing: "border-box", outline: "none", fontFamily: "inherit" }}
                  />
                </div>
                <button onClick={handleNameStart} style={{ width: "100%", padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 14, fontWeight: 900, fontSize: 16, cursor: "pointer", marginBottom: 12 }}>
                  시작하기 →
                </button>
                <button onClick={() => setMode("sns")} style={{ width: "100%", padding: "13px 0", background: "white", color: "#6b7280", border: "1.5px solid #e5e7eb", borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  ← SNS로 시작
                </button>
              </>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 20, fontWeight: 500, lineHeight: 1.7 }}>
            🔒 입력 정보는 암호화되어 안전하게 보호됩니다<br />
            서비스 이용 시 <a href="/privacy" style={{ color: "#ec4899", textDecoration: "none" }}>개인정보처리방침</a>에 동의하게 됩니다
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes catBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </main>
  );
}
