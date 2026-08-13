"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function DaewoonPayPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#1a0535,#0a0420)" }} />}>
      <DaewoonPayInner />
    </Suspense>
  );
}

function DaewoonPayInner() {
  const searchParams = useSearchParams();
  const price = Number(searchParams.get("price") || "2900");
  const count = Number(searchParams.get("count") || "1");
  const indices = searchParams.get("indices") || "";

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refundAgreed, setRefundAgreed] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  // 모바일 결제(카카오페이/카드)는 PG사 인증 후 이 페이지로 "새로 돌아오는" 방식이라
  // requestPayment()가 프로미스로 끝나지 않는 경우가 많음 — 결제 시작 전에 정보를
  // sessionStorage에 저장해두고, 돌아왔을 때 그 정보로 완료 처리를 이어감
  const finalizeSuccess = (info: { count: number; indices: string; mobile: string; name: string }) => {
    const cleanMobile = info.mobile.replace(/\D/g, "");
    fetch("/api/v2/save-payment", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: `daewoon_${Date.now()}`, phone: cleanMobile || "", name: info.name.trim() || "", amount: price, category: `대운 해설 ${info.count}개`, source: "daewoon" }),
    }).catch(() => {});
    window.location.href = `/main-v2/daewoon?daeunPaid=1&daeunCount=${info.count}&daeunIndices=${encodeURIComponent(info.indices)}`;
  };

  // 모바일에서 카카오페이/카드 인증 후 redirectUrl로 되돌아온 경우 감지 → 결제완료 처리 이어서 진행
  useEffect(() => {
    const pgPaymentId = searchParams.get("paymentId");
    if (!pgPaymentId) return;
    const pendingRaw = (sessionStorage.getItem("pay_pending") || localStorage.getItem("pay_pending"));
    if (!pendingRaw) return;
    sessionStorage.removeItem("pay_pending");
    try { localStorage.removeItem("pay_pending"); } catch {}
    const pgCode = searchParams.get("code");
    if (pgCode) {
      setError(searchParams.get("message") || "결제에 실패했습니다. 다시 시도해주세요.");
      return;
    }
    try {
      const info = JSON.parse(pendingRaw);
      finalizeSuccess(info);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pay = async (method: "CARD" | "KAKAOPAY" = "CARD") => {
    if (!refundAgreed) { setShowRefund(true); setError("결제 전 확인사항을 먼저 확인해주세요."); return; }
    setLoading(true); setError("");
    try {
      const cleanMobile = mobile.replace(/\D/g, "");
      const channelKey = method === "KAKAOPAY"
        ? "channel-key-b474ece1-40a8-4a8a-bc24-469e6dbf0948"
        : "channel-key-e3b35730-62df-4314-a2c9-afd813698cd7";
      const portone = await import("@portone/browser-sdk/v2");
      const pendingInfo = { count, indices, mobile, name };
      // 모바일 리디렉션 방식은 이 페이지가 새로 로드되며 돌아오므로, 완료 처리에
      // 필요한 정보를 미리 저장해둠 (redirectUrl로 돌아왔을 때 위 useEffect가 사용)
      try { sessionStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); localStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); } catch {}
      const res = await portone.requestPayment({
        storeId: "store-446686e2-22bd-4941-ae2a-83e7f3a15d87",
        channelKey,
        paymentId: `daewoon_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        orderName: `점운 대운 해설 ${count}개`,
        totalAmount: price,
        currency: "KRW",
        payMethod: method === "KAKAOPAY" ? "EASY_PAY" : "CARD",
        ...(method === "KAKAOPAY" ? { easyPay: { easyPayProvider: "KAKAOPAY" } } : {}),
        customer: { fullName: name.trim() || "고객", phoneNumber: cleanMobile || "01000000000" },
        // 이 페이지는 항상 ?price=...&count=... 물음표가 붙어서 열리는데,
        // 그게 redirectUrl에 그대로 들어가면 카카오페이가 돌아올 때 자기
        // 파라미터를 또 붙이면서 주소가 깨져 결제 후 사이트로 못 돌아오는
        // 문제가 있었음 → pathname만 남겨 항상 깨끗한 주소로 되돌아오게 함
        redirectUrl: `${window.location.origin}${window.location.pathname}`,
      });
      // 리디렉션 방식이면 여기 도달하지 않고 페이지가 이동함 — 아래는 PC 팝업 등
      // 리디렉션 없이 바로 결과를 돌려받는 경우에만 실행됨
      if (res && "code" in res) {
        setError(res.message || "결제에 실패했습니다.");
        try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {}
        return;
      }
      try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {}
      finalizeSuccess(pendingInfo);
    } catch { setError("결제 처리 중 오류가 발생했습니다."); }
    finally { setLoading(false); }
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0f0620 0%,#1a0535 40%,#0a0420 100%)",
      color: "white",
      fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif",
      padding: "24px 16px 60px",
    }}>
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <button onClick={() => window.history.back()} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 13, cursor: "pointer", padding: 0 }}>← 돌아가기</button>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>대운 해설 결제</span>
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌌</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fbbf24", margin: "0 0 8px" }}>대운(大運) 해설</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: 0 }}>10년마다 바뀌는 인생의 큰 챕터</p>
        </div>

        <div style={{ background: "rgba(139,92,246,0.15)", border: "1.5px solid rgba(139,92,246,0.5)", borderRadius: 20, padding: "24px 20px", marginBottom: 16 }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "0 0 16px", fontWeight: 700 }}>📋 결제 내역</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 700 }}>🌌 대운 해설 {count}개</span>
            <span style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900 }}>₩{price.toLocaleString()}</span>
          </div>
          {count > 1 && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "4px 0 0", fontWeight: 600 }}>기본 ₩2,900 + 추가 {count - 1}개 × ₩1,000</p>}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "white", fontSize: 15, fontWeight: 900 }}>최종 결제 금액</span>
            <span style={{ color: "#fbbf24", fontSize: 24, fontWeight: 900 }}>₩{price.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
          <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, margin: "0 0 10px" }}>✨ 대운 해설에 포함된 내용</p>
          {["멘탈 — 이 10년간의 심리적 흐름", "재물·돈의 흐름 — 수입·지출 패턴", "직업·커리어 — 최적의 활동 시기", "인간관계 — 귀인·주의 인물", "현실 — 실생활 체감 흐름", "이 10년을 내 편으로 — 핵심 전략"].map(item => (
            <p key={item} style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, margin: "4px 0", fontWeight: 600 }}>• {item}</p>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>이름 (선택)</label>
            <input style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "11px 14px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              placeholder="홍길동" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>휴대폰 번호 (선택)</label>
            <input style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "11px 14px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              placeholder="01012345678" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 11))} inputMode="numeric" />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <button type="button" onClick={() => setShowRefund(v => !v)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", padding: "4px 0", display: "flex", alignItems: "center", gap: 4 }}>
            📋 결제 전 확인사항 {showRefund ? "▲" : "▼"}
          </button>
          {showRefund && (
            <div style={{ marginTop: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px" }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>디지털 콘텐츠 특성상, 이용이 시작된 후에는 취소가 어렵습니다.</p>
            </div>
          )}
          <div onClick={() => setRefundAgreed(v => !v)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none", marginTop: 8 }}>
            <span style={{ fontSize: 18, color: refundAgreed ? "#4ade80" : "rgba(255,255,255,0.4)", lineHeight: 1 }}>{refundAgreed ? "✅" : "⬜"}</span>
            <span style={{ fontSize: 12, color: refundAgreed ? "#4ade80" : "rgba(255,255,255,0.5)", fontWeight: refundAgreed ? 700 : 400 }}>네, 확인했어요!</span>
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          <button onClick={() => pay("CARD")} disabled={loading || !refundAgreed}
            style={{ width: "100%", padding: "16px 0", background: (loading || !refundAgreed) ? "rgba(251,191,36,0.4)" : "linear-gradient(135deg,#fbbf24,#f59e0b)", color: "#1a0f2e", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: (loading || !refundAgreed) ? "not-allowed" : "pointer", boxShadow: (loading || !refundAgreed) ? "none" : "0 6px 24px rgba(251,191,36,0.4)" }}>
            {loading ? "결제 처리 중..." : `💳 신용카드로 결제 ₩${price.toLocaleString()}`}
          </button>
          <button onClick={() => pay("KAKAOPAY")} disabled={loading || !refundAgreed}
            style={{ width: "100%", padding: "16px 0", background: (loading || !refundAgreed) ? "#bba000" : "#FEE500", color: (loading || !refundAgreed) ? "rgba(0,0,0,0.4)" : "#3C1E1E", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: (loading || !refundAgreed) ? "not-allowed" : "pointer" }}>
            💛 카카오페이로 결제
          </button>
        </div>

        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", lineHeight: 1.6 }}>결제 후 대운 해설을 바로 확인하실 수 있어요.</p>
      </div>
    </main>
  );
}
