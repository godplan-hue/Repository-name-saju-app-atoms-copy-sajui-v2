"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function PartnerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const savedEmail = localStorage.getItem("partnerLoginEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/partner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("📡 API 응답 상태:", response.status);

      const data = await response.json();

      console.log("📦 API 응답 데이터:", data);

      if (!response.ok) {
        setError(data.error || "로그인 실패");
        setLoading(false);
        return;
      }

      localStorage.setItem("partnerId", data.partnerId);
      localStorage.setItem("partnerName", data.partnerName);
      localStorage.setItem("partnerTier", data.partnerTier);
      localStorage.setItem("partnerBusinessName", data.businessName);
      localStorage.setItem("partnerLoginEmail", email);

      router.push(data.feeExpired ? "/partner/renew" : "/partner/create-analysis");
    } catch (err) {
      console.error("❌ 로그인 오류:", err);
      setError("로그인 중 오류가 발생했습니다");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>파트너 로그인 - 점운</title>
        <meta name="description" content="파트너 로그인" />
      </Head>

      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundImage: "url('https://i.pinimg.com/736x/76/b4/8c/76b48c004b1917181a0f3dc9505088c9.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.65)", zIndex: 1, pointerEvents: "none" }} />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            background: "white",
            padding: isMobile ? "30px 20px" : "50px",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 900,
              textAlign: "center",
              marginBottom: "10px",
              marginTop: 0,
              color: "#333",
            }}
          >
            🔮 점운 파트너
          </h1>

          <p
            style={{
              fontSize: "14px",
              textAlign: "center",
              color: "#666",
              marginBottom: "30px",
              marginTop: "5px",
            }}
          >
            파트너 로그인
          </p>

          {error && (
            <div
              style={{
                background: "#fee",
                color: "#c33",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  color: "#333",
                }}
              >
                📧 이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  transition: "border 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  color: "#333",
                }}
              >
                🔐 비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  transition: "border 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "14px",
                background: loading ? "#ccc" : "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: 900,
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "10px",
                transition: "opacity 0.3s",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "로그인 중..." : "🔓 로그인"}
            </button>
          </form>

          <p
            style={{
              fontSize: "13px",
              textAlign: "center",
              color: "#999",
              marginTop: "20px",
              marginBottom: 0,
            }}
          >
            아직 계정이 없으신가요? <a href="/partner/apply" style={{ color: "#667eea", fontWeight: 700 }}>파트너 가입하기</a>
          </p>
        </div>
      </main>
    </>
  );
}