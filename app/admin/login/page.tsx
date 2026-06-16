"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "로그인 실패");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminId", data.adminId);
      localStorage.setItem("adminName", data.adminName);
      
      router.push("/admin");
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>어드민 로그인 - 점운</title>
      </Head>

      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "50px",
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
            👑 점운 어드민
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
            관리자 로그인
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
                placeholder="admin@example.com"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
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
                }}
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
              }}
            >
              {loading ? "로그인 중..." : "👑 로그인"}
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
            테스트 계정: admin@test.com / 1234
          </p>
        </div>
      </main>
    </>
  );
}