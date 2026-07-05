"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

export default function ShareCouponPage() {
  const router = useRouter();
  const [postUrl, setPostUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [choice, setChoice] = useState<"A" | "B">("A");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ codeA?: string; codeB?: string; choice?: string } | null>(null);
  const [error, setError] = useState("");
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  async function handleSubmit() {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 정확히 입력해주세요."); return; }
    if (!postUrl.trim()) { setError("게시글 URL을 입력해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/share-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, postUrl: postUrl.trim(), choice }),
      });
      const data = await res.json();
      if (data.codeA || data.code) {
        setResult(data);
      } else {
        setError(data.error || "발급에 실패했어요. 다시 시도해주세요.");
      }
    } catch {
      setError("오류가 발생했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function copy(code: string, which: "A" | "B") {
    try { await navigator.clipboard.writeText(code); } catch {}
    if (which === "A") { setCopiedA(true); setTimeout(() => setCopiedA(false), 2000); }
    else { setCopiedB(true); setTimeout(() => setCopiedB(false), 2000); }
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fdf2f8 0%,#ede9fe 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", padding: "0 0 60px" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.12)" }}>
        <Link href="/main-v2" style={{ color: "#8b5cf6", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>← 점운</Link>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>

        {/* 히어로 */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>📸</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px", lineHeight: 1.3 }}>
            SNS에 올리면 사주 무료!
          </h1>
          <p style={{ fontSize: 13, color: "#6d28d9", lineHeight: 1.7, margin: 0 }}>
            인스타·블로그·유튜브에 점운 소개 글 올리고<br />원하는 쿠폰 골라가세요
          </p>
        </div>

        {!result ? (
          <>
            {/* 쿠폰 선택 */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#4c1d95", margin: "0 0 12px" }}>🎁 받을 쿠폰 선택</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                {/* 옵션 A */}
                <div
                  onClick={() => setChoice("A")}
                  style={{ borderRadius: 16, border: `2px solid ${choice === "A" ? "#ec4899" : "#e5e7eb"}`, background: choice === "A" ? "#fdf2f8" : "#fff", padding: "16px", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${choice === "A" ? "#ec4899" : "#d1d5db"}`, background: choice === "A" ? "#ec4899" : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {choice === "A" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 900, color: "#be185d", margin: "0 0 3px" }}>990원 무료쿠폰 2장</p>
                      <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>
                        1장은 내가 쓰고, 1장은 친구에게 선물 🎁<br />
                        <span style={{ color: "#ec4899", fontWeight: 700 }}>친구도 무료로 사주 볼 수 있어요</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 옵션 B */}
                <div
                  onClick={() => setChoice("B")}
                  style={{ borderRadius: 16, border: `2px solid ${choice === "B" ? "#7c3aed" : "#e5e7eb"}`, background: choice === "B" ? "#f5f3ff" : "#fff", padding: "16px", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${choice === "B" ? "#7c3aed" : "#d1d5db"}`, background: choice === "B" ? "#7c3aed" : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {choice === "B" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 900, color: "#6d28d9", margin: "0 0 3px" }}>3,900원 무료쿠폰 1장</p>
                      <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>
                        패키지 구매(3,900원)에 사용 가능<br />
                        <span style={{ color: "#7c3aed", fontWeight: 700 }}>4개 운세 한 번에 무료</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 입력 폼 */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "20px", boxShadow: "0 4px 20px rgba(139,92,246,0.1)" }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6d28d9", marginBottom: 6 }}>
                  올린 게시글 URL
                </label>
                <input
                  type="url"
                  value={postUrl}
                  onChange={e => setPostUrl(e.target.value)}
                  placeholder="https://instagram.com/p/... 또는 블로그 URL"
                  style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
                <p style={{ fontSize: 11, color: "#9ca3af", margin: "5px 0 0" }}>인스타그램 · 네이버 블로그 · 유튜브 · 틱톡 가능</p>
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
                style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: G, color: "#fff", fontSize: 15, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 4px 18px rgba(236,72,153,0.4)" }}
              >
                {loading ? "⏳ 확인 중..." : "🎁 쿠폰 받기"}
              </button>
              <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: "10px 0 0" }}>공개 게시글만 인증 가능 · 1인 1회</p>
            </div>
          </>
        ) : (
          /* 발급 완료 */
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 20px", boxShadow: "0 4px 20px rgba(139,92,246,0.12)", textAlign: "center" }}>
            <p style={{ fontSize: 22, fontWeight: 900, color: "#16a34a", margin: "0 0 4px" }}>✅ 발급 완료!</p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 22px" }}>공유해주셔서 감사해요 🙏</p>

            {result.choice === "A" && result.codeB ? (
              /* A: 2장 */
              <>
                <div style={{ background: "#fdf2f8", border: "2px dashed #ec4899", borderRadius: 14, padding: "16px", marginBottom: 12 }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>내 쿠폰 (990원 무료)</p>
                  <p style={{ fontSize: 26, fontWeight: 900, color: "#be185d", margin: "0 0 6px", letterSpacing: 3 }}>{result.codeA}</p>
                  <button onClick={() => copy(result.codeA!, "A")} style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 10, border: "1.5px solid #ec4899", background: copiedA ? "#fdf2f8" : "#fff", color: "#be185d", cursor: "pointer" }}>
                    {copiedA ? "✅ 복사됨" : "📋 복사"}
                  </button>
                </div>

                <div style={{ background: "#f5f3ff", border: "2px dashed #8b5cf6", borderRadius: 14, padding: "16px", marginBottom: 18 }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 2px" }}>친구 선물 쿠폰 🎁</p>
                  <p style={{ fontSize: 12, color: "#7c3aed", fontWeight: 700, margin: "0 0 4px" }}>친구한테 이 코드 카카오로 보내세요!</p>
                  <p style={{ fontSize: 26, fontWeight: 900, color: "#6d28d9", margin: "0 0 6px", letterSpacing: 3 }}>{result.codeB}</p>
                  <button onClick={() => copy(result.codeB!, "B")} style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 10, border: "1.5px solid #8b5cf6", background: copiedB ? "#f5f3ff" : "#fff", color: "#6d28d9", cursor: "pointer" }}>
                    {copiedB ? "✅ 복사됨" : "📋 복사"}
                  </button>
                </div>
              </>
            ) : (
              /* B: 1장 (3900원) */
              <div style={{ background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", border: "2px dashed #ec4899", borderRadius: 16, padding: "20px", marginBottom: 18 }}>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 6px" }}>3,900원 무료쿠폰</p>
                <p style={{ fontSize: 30, fontWeight: 900, color: "#be185d", margin: "0 0 6px", letterSpacing: 3 }}>{result.codeA}</p>
                <button onClick={() => copy(result.codeA!, "A")} style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 10, border: "1.5px solid #ec4899", background: copiedA ? "#fdf2f8" : "#fff", color: "#be185d", cursor: "pointer" }}>
                  {copiedA ? "✅ 복사됨" : "📋 코드 복사"}
                </button>
              </div>
            )}

            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 16px", lineHeight: 1.6 }}>결제 화면에서 쿠폰 코드 입력하면 무료로 시작돼요</p>

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
