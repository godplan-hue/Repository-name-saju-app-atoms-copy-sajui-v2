"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

const PLATFORMS = [
  { emoji: "📸", name: "인스타그램" },
  { emoji: "📝", name: "네이버 블로그" },
  { emoji: "▶️", name: "유튜브" },
  { emoji: "🎵", name: "틱톡" },
  { emoji: "🐦", name: "X(트위터)" },
  { emoji: "🧵", name: "스레드" },
];

export default function ShareCouponPage() {
  const router = useRouter();
  const [postUrl, setPostUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit() {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 정확히 입력해주세요."); return; }
    if (!postUrl.trim()) { setError("게시글 URL을 입력해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/share-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, postUrl: postUrl.trim() }),
      });
      const data = await res.json();
      if (data.code) {
        setCode(data.code);
      } else {
        setError(data.error || "발급에 실패했어요. 다시 시도해주세요.");
      }
    } catch {
      setError("오류가 발생했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fdf2f8 0%,#ede9fe 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", padding: "0 0 60px" }}>

      {/* 헤더 */}
      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.12)" }}>
        <Link href="/main-v2" style={{ color: "#8b5cf6", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>← 점운</Link>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>

        {/* 히어로 */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📸</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 10px", lineHeight: 1.3 }}>
            SNS에 올리면<br />990원 사주 전체 무료!
          </h1>
          <p style={{ fontSize: 14, color: "#6d28d9", lineHeight: 1.7, margin: 0 }}>
            점운을 SNS에 공유해주시면<br />
            <strong>100% 무료 쿠폰</strong>을 드려요
          </p>
        </div>

        {/* 지원 플랫폼 */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", marginBottom: 20, boxShadow: "0 2px 12px rgba(139,92,246,0.08)" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", margin: "0 0 12px" }}>✅ 지원 플랫폼</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PLATFORMS.map(p => (
              <span key={p.name} style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)", fontSize: 13, color: "#6d28d9", fontWeight: 600 }}>
                {p.emoji} {p.name}
              </span>
            ))}
          </div>
        </div>

        {/* 진행 방법 */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", marginBottom: 20, boxShadow: "0 2px 12px rgba(139,92,246,0.08)" }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: "#4c1d95", margin: "0 0 14px" }}>📋 이렇게 하면 돼요</p>
          {[
            { step: "1", text: "SNS에 점운 소개 게시글 올리기 (인스타·블로그·유튜브 등)" },
            { step: "2", text: "아래에 게시글 URL + 전화번호 입력" },
            { step: "3", text: "무료 쿠폰 코드 받기 → 결제 화면에서 입력" },
          ].map(item => (
            <div key={item.step} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: G, color: "#fff", fontSize: 12, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {item.step}
              </div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>

        {!code ? (
          /* 입력 폼 */
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 20px", boxShadow: "0 4px 20px rgba(139,92,246,0.12)" }}>
            <p style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", margin: "0 0 20px", textAlign: "center" }}>🎁 무료 쿠폰 받기</p>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6d28d9", marginBottom: 6 }}>게시글 URL</label>
              <input
                type="url"
                value={postUrl}
                onChange={e => setPostUrl(e.target.value)}
                placeholder="https://instagram.com/p/... 또는 블로그 URL"
                style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6d28d9", marginBottom: 6 }}>전화번호</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "0 0 12px", fontWeight: 600 }}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: G, color: "#fff", fontSize: 16, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 4px 18px rgba(236,72,153,0.4)" }}
            >
              {loading ? "⏳ 확인 중..." : "🎁 무료 쿠폰 받기"}
            </button>
            <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: "10px 0 0", lineHeight: 1.5 }}>
              공개 게시글만 인증 가능 · 1인 1회 발급
            </p>
          </div>
        ) : (
          /* 코드 발급 완료 */
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 20px", boxShadow: "0 4px 20px rgba(139,92,246,0.12)", textAlign: "center" }}>
            <p style={{ fontSize: 22, fontWeight: 900, color: "#16a34a", margin: "0 0 6px" }}>✅ 쿠폰 발급 완료!</p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>공유해주셔서 감사해요 🙏</p>

            <div style={{ background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", border: "2px dashed #ec4899", borderRadius: 16, padding: "20px", marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 6px" }}>100% 무료 쿠폰 코드</p>
              <p style={{ fontSize: 30, fontWeight: 900, color: "#be185d", margin: "0 0 6px", letterSpacing: 3 }}>{code}</p>
              <p style={{ fontSize: 12, color: "#7c3aed", fontWeight: 700, margin: 0 }}>결제 페이지 → 쿠폰 코드 입력</p>
            </div>

            <button
              onClick={copyCode}
              style={{ width: "100%", padding: "13px", borderRadius: 12, border: "2px solid #ec4899", background: copied ? "#fdf2f8" : "#fff", color: "#be185d", fontSize: 14, fontWeight: 800, cursor: "pointer", marginBottom: 10 }}
            >
              {copied ? "✅ 복사됐어요!" : "📋 코드 복사하기"}
            </button>

            <button
              onClick={() => router.push("/main-v2")}
              style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: G, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 16px rgba(236,72,153,0.4)" }}
            >
              🐱 사주 보러 가기
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
