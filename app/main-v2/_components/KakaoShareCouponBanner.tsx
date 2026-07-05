"use client";
import { useState } from "react";

export default function KakaoShareCouponBanner() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function getCode() {
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 10) { setError("전화번호를 입력해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/kakao-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: clean }),
      });
      const data = await res.json();
      if (data.code) {
        setCode(data.code);
      } else {
        setError(data.error || "발급에 실패했어요.");
      }
    } catch {
      setError("오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    try { await navigator.clipboard.writeText(code); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareKakao() {
    const text = "🐱 점운 AI 사주풀이 해봤는데 진짜 잘 맞아! 990원이라 부담없어 → jeomun.com";
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "점운 사주", text, url: "https://jeomun.com" }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text + "\nhttps://jeomun.com").catch(() => {});
      alert("링크를 복사했어요! 카카오톡에 붙여넣기 해주세요 😊");
    }
  }

  return (
    <div style={{ margin: "12px 0", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 14px rgba(249,168,37,0.2)", border: "1.5px solid #fde68a" }}>
      {!open ? (
        <div
          onClick={() => setOpen(true)}
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>💬</span>
            <div>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 13, margin: "0 0 2px" }}>카카오로 공유하면 990원 쿠폰!</p>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, margin: 0 }}>전화번호만 남기면 바로 발급해드려요</p>
            </div>
          </div>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 900, whiteSpace: "nowrap" }}>받기 →</span>
        </div>
      ) : (
        <div style={{ background: "#fff", padding: "20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#d97706", margin: 0 }}>💬 카카오 공유 → 990원 무료쿠폰</p>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#9ca3af", fontSize: 18, cursor: "pointer", padding: 0 }}>×</button>
          </div>

          {!code ? (
            <>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 12px", lineHeight: 1.6 }}>
                전화번호 남기고 → 코드 받고 → 카카오로 공유하면 끝!<br />
                <strong>990원 사주 1개 무료</strong>로 결제 가능해요
              </p>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #fde68a", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 8 }}
              />
              {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "0 0 8px" }}>{error}</p>}
              <button
                onClick={getCode}
                disabled={loading}
                style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#fff", fontWeight: 900, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "⏳ 발급 중..." : "쿠폰 받기 →"}
              </button>
              <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: "8px 0 0" }}>1인 1회 발급 · 코드 분실 시 같은 번호로 다시 입력하면 확인 가능해요</p>
            </>
          ) : (
            <>
              <div style={{ background: "#fffbeb", border: "2px dashed #f59e0b", borderRadius: 14, padding: "16px", textAlign: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>990원 무료쿠폰</p>
                <p style={{ fontSize: 26, fontWeight: 900, color: "#d97706", margin: "0 0 10px", letterSpacing: 2 }}>{code}</p>
                <button
                  onClick={copyCode}
                  style={{ padding: "6px 18px", borderRadius: 10, border: "1.5px solid #f59e0b", background: "#fff", color: "#d97706", fontWeight: 800, fontSize: 12, cursor: "pointer" }}
                >
                  {copied ? "✅ 복사됨" : "📋 코드 복사"}
                </button>
              </div>
              <button
                onClick={shareKakao}
                style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "#FEE500", color: "#3A1D1D", fontWeight: 900, fontSize: 14, cursor: "pointer", marginBottom: 8 }}
              >
                💬 카카오로 공유하기
              </button>
              <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: 0 }}>결제 화면 → 쿠폰 코드 입력 → 무료로 결제</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
