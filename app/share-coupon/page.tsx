"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

export default function ShareCouponPage() {
  const router = useRouter();
  const [postUrl, setPostUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ codes?: string[] } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const SNS_DOMAINS = ["instagram.com", "youtube.com", "youtu.be", "tiktok.com", "blog.naver.com", "naver.com", "twitter.com", "x.com", "facebook.com", "threads.net", "story.kakao.com"];
  function isValidSnsUrl(url: string) {
    try { const u = new URL(url.startsWith("http") ? url : "https://" + url); return SNS_DOMAINS.some(d => u.hostname.includes(d)); } catch { return false; }
  }

  async function handleSubmit() {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 정확히 입력해주세요."); return; }
    if (!postUrl.trim()) { setError("게시글 URL을 입력해주세요."); return; }
    if (!isValidSnsUrl(postUrl.trim())) { setError("인스타그램·블로그·유튜브·틱톡 게시글 URL만 가능해요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/share-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, postUrl: postUrl.trim() }),
      });
      const data = await res.json();
      if (data.codes?.length) {
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

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }

  async function copyAll() {
    if (!result?.codes) return;
    const text = result.codes.join("\n");
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied("ALL");
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fdf2f8 0%,#ede9fe 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", padding: "0 0 60px" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.12)" }}>
        <Link href="/main-v2" style={{ color: "#8b5cf6", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>← 점운</Link>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>

        {/* 히어로 */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>📸</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px", lineHeight: 1.3 }}>
            SNS에 올리면 사주 무료 5장!
          </h1>
          <p style={{ fontSize: 13, color: "#6d28d9", lineHeight: 1.7, margin: 0 }}>
            점운 소개·추천 글을 SNS에 올리면<br />
            <strong>990원 쿠폰 5장</strong>을 드려요 🎁<br />
            <span style={{ fontSize: 12, color: "#ec4899", fontWeight: 700 }}>+ 꿈해몽 24시간 무료 이용권 포함!</span>
          </p>
        </div>

        {/* 혜택 안내 */}
        <div style={{ background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#be185d", margin: "0 0 2px" }}>5장</p>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>받는 쿠폰 수</p>
            </div>
            <div style={{ width: 1, height: 36, background: "#e5e7eb" }} />
            <div style={{ textAlign: "center", flex: 1 }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#7c3aed", margin: "0 0 2px" }}>990원</p>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>쿠폰 1장 가치</p>
            </div>
            <div style={{ width: 1, height: 36, background: "#e5e7eb" }} />
            <div style={{ textAlign: "center", flex: 1 }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#16a34a", margin: "0 0 2px" }}>1회</p>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>전화번호당</p>
            </div>
          </div>
        </div>

        {!result ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px", boxShadow: "0 4px 20px rgba(139,92,246,0.1)" }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#4c1d95", margin: "0 0 4px" }}>📝 SNS 게시글 URL + 전화번호 입력</p>
            <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>500자 이상 · 사진 2장 이상 · 점운 소개·추천 내용</p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6d28d9", marginBottom: 6 }}>올린 게시글 URL</label>
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
              {loading ? "⏳ 확인 중..." : "🎁 쿠폰 5장 받기"}
            </button>
            <p style={{ fontSize: 11, color: "#dc2626", textAlign: "center", margin: "10px 0 0", fontWeight: 700, lineHeight: 1.7 }}>
              ⚠️ 공개 게시글만 인증 가능 · 1인 1회<br />
              비방·악성 내용 포함 시 쿠폰 즉시 무효 +<br />해당 번호 영구 이용 제한<br />
              <span style={{ color: "#9ca3af", fontWeight: 400 }}>코드 분실 시 jeomun.com/my-coupon 에서 번호로 재조회</span>
            </p>
          </div>
        ) : (
          /* 발급 완료 */
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 20px", boxShadow: "0 4px 20px rgba(139,92,246,0.12)" }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: "#16a34a", margin: "0 0 4px", textAlign: "center" }}>✅ 발급 완료!</p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px", textAlign: "center" }}>공유해주셔서 감사해요 🙏</p>

            <p style={{ fontSize: 13, fontWeight: 800, color: "#4c1d95", margin: "0 0 12px" }}>
              990원 무료 사주 쿠폰 {result.codes?.length}장 — 결제 시 1장씩 입력
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {result.codes?.map((code, i) => (
                <div key={code} style={{ background: i === 0 ? "#fdf2f8" : "#f5f3ff", border: `1.5px dashed ${i === 0 ? "#ec4899" : "#8b5cf6"}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 10, color: "#9ca3af", margin: "0 0 2px" }}>{i === 0 ? "내 쿠폰" : `선물 쿠폰 ${i}`}</p>
                    <p style={{ fontSize: 20, fontWeight: 900, color: i === 0 ? "#be185d" : "#6d28d9", margin: 0, letterSpacing: 2 }}>{code}</p>
                  </div>
                  <button
                    onClick={() => copy(code)}
                    style={{ padding: "6px 12px", borderRadius: 10, border: `1.5px solid ${i === 0 ? "#ec4899" : "#8b5cf6"}`, background: copied === code ? "#fdf2f8" : "#fff", color: i === 0 ? "#be185d" : "#6d28d9", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                  >
                    {copied === code ? "✅" : "복사"}
                  </button>
                </div>
              ))}
            </div>

            {/* 전체 복사 */}
            <button
              onClick={copyAll}
              style={{ width: "100%", padding: "11px", borderRadius: 12, border: "1.5px solid #c4b5fd", background: copied === "ALL" ? "#ede9fe" : "#fafafa", color: "#6d28d9", fontSize: 13, fontWeight: 800, cursor: "pointer", marginBottom: 12 }}
            >
              {copied === "ALL" ? "✅ 전체 복사됨" : "📋 코드 5개 전체 복사 (카카오로 보내기용)"}
            </button>

            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 14px", textAlign: "center", lineHeight: 1.6 }}>
              선물 쿠폰은 친구·가족에게 카카오로 보내세요 🎁<br />
              결제 화면 → 쿠폰 코드 입력 → 무료로 시작
            </p>
            <button
              onClick={() => router.push("/main-v2")}
              style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: G, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 16px rgba(236,72,153,0.4)" }}
            >
              🐱 사주 보러 가기
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
