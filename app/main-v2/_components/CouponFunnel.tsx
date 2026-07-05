"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

export default function CouponFunnel() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const already = sessionStorage.getItem("coupon_funnel_shown");
    if (already) return;
    const t = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(t);
  }, [dismissed]);

  async function handleSubmit() {
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 10) { setError("전화번호를 정확히 입력해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/coupon-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: clean }),
      });
      const data = await res.json();
      if (data.code) {
        setCode(data.code);
        sessionStorage.setItem("coupon_funnel_shown", "1");
      } else {
        setError("쿠폰 발급에 실패했어요. 다시 시도해주세요.");
      }
    } catch {
      setError("오류가 발생했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  function dismiss() {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("coupon_funnel_shown", "1");
  }

  if (!visible) return null;

  return (
    <>
      {/* 딤 배경 */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9998 }}
        />
      )}

      {/* 바텀 배너 / 시트 */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, zIndex: 9999,
        borderRadius: open ? "20px 20px 0 0" : "20px 20px 0 0",
        overflow: "hidden",
        boxShadow: "0 -4px 30px rgba(236,72,153,0.3)",
        transition: "all 0.3s ease",
      }}>

        {!open ? (
          /* 접힌 배너 */
          <div
            onClick={() => setOpen(true)}
            style={{
              background: G, padding: "14px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 14, margin: 0 }}>🎁 30% 할인쿠폰 무료로 받기</p>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, margin: "2px 0 0" }}>전화번호만 남기면 바로 발급해드려요</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#fff", fontSize: 18, fontWeight: 900 }}>↑</span>
              <button
                onClick={e => { e.stopPropagation(); dismiss(); }}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 20, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 700 }}
              >
                닫기
              </button>
            </div>
          </div>
        ) : (
          /* 펼쳐진 시트 */
          <div style={{ background: "#fff", padding: "24px 20px 36px" }}>
            {/* 핸들 */}
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 4, margin: "0 auto 20px" }} />

            {!code ? (
              <>
                <p style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px", textAlign: "center" }}>🎁 30% 할인쿠폰</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px", textAlign: "center", lineHeight: 1.6 }}>
                  전화번호를 남겨주시면<br />지금 바로 30% 할인코드를 드려요
                </p>

                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  style={{
                    width: "100%", padding: "14px 16px", borderRadius: 12,
                    border: "1.5px solid #e5e7eb", fontSize: 16, outline: "none",
                    boxSizing: "border-box", marginBottom: 10,
                  }}
                />
                {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "0 0 8px" }}>{error}</p>}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width: "100%", padding: "15px", borderRadius: 12, border: "none",
                    background: G, color: "#fff", fontSize: 15, fontWeight: 900,
                    cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                    boxShadow: "0 4px 16px rgba(236,72,153,0.4)",
                  }}
                >
                  {loading ? "⏳ 발급 중..." : "쿠폰 받기 →"}
                </button>
                <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: "10px 0 0" }}>
                  마케팅 수신 동의 · 언제든지 수신거부 가능
                </p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 20, fontWeight: 900, color: "#16a34a", margin: "0 0 6px", textAlign: "center" }}>✅ 쿠폰 발급 완료!</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px", textAlign: "center" }}>결제 페이지에서 아래 코드를 입력하세요</p>

                <div style={{
                  background: "linear-gradient(135deg, #fdf2f8, #f5f3ff)",
                  border: "2px dashed #ec4899", borderRadius: 14,
                  padding: "18px", textAlign: "center", marginBottom: 16,
                }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>할인코드</p>
                  <p style={{ fontSize: 26, fontWeight: 900, color: "#be185d", margin: 0, letterSpacing: 2 }}>{code}</p>
                  <p style={{ fontSize: 12, color: "#6d28d9", margin: "6px 0 0", fontWeight: 700 }}>30% 할인 적용</p>
                </div>

                <button
                  onClick={() => router.push("/main-v2/pay?amount=693&next=/payment-complete%3Fprice%3D693")}
                  style={{
                    width: "100%", padding: "15px", borderRadius: 12, border: "none",
                    background: G, color: "#fff", fontSize: 15, fontWeight: 900,
                    cursor: "pointer", boxShadow: "0 4px 16px rgba(236,72,153,0.4)",
                  }}
                >
                  🐱 지금 바로 결제하러 가기
                </button>
                <button
                  onClick={() => setOpen(false)}
                  style={{ width: "100%", marginTop: 8, padding: "12px", borderRadius: 12, border: "none", background: "#f3f4f6", color: "#6b7280", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  나중에 할게요
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
