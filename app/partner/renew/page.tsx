"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { getPartnerTier } from "@/lib/partnerTiers";

export default function PartnerRenew() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [tierId, setTierId] = useState("free");
  const [renewing, setRenewing] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("partnerId");
    const name = localStorage.getItem("partnerName");
    const tier = localStorage.getItem("partnerTier");
    if (!id) { router.push("/partner/login"); return; }
    if (!tier || tier === "free") { router.push("/partner/create-analysis"); return; }
    setPartnerId(id);
    setPartnerName(name || "");
    setTierId(tier);
  }, [router]);

  const tierInfo = getPartnerTier(tierId);
  const finalFee = Math.round(tierInfo.annualFee * (1 - discountPercent / 100));

  const applyDiscountCode = async () => {
    try {
      const res = await fetch(`/api/promo-codes?code=${encodeURIComponent(discountInput)}`);
      if (!res.ok) { setDiscountError("유효하지 않은 할인코드입니다."); setDiscountPercent(0); return; }
      const data = await res.json();
      setDiscountPercent(data.code.discountPercent);
      setDiscountError("");
    } catch {
      setDiscountError("할인코드 확인 중 오류가 발생했습니다.");
    }
  };

  const handleRenew = async () => {
    if (!confirm(`${tierInfo.name} 등급 연회비를 갱신하시겠습니까?\n결제액: ₩${finalFee.toLocaleString()}`)) return;
    setRenewing(true);
    try {
      if (discountPercent > 0) {
        await fetch("/api/promo-codes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: discountInput }),
        });
      }
      const res = await fetch("/api/partner/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, paidAmount: finalFee, discountCode: discountInput, discountPercent }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "갱신에 실패했습니다."); return; }
      alert("연회비 갱신이 완료되었습니다!");
      router.push("/partner/create-analysis");
    } finally {
      setRenewing(false);
    }
  };

  return (
    <>
      <Head><title>연회비 갱신 - 점운 파트너</title></Head>
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "12px", maxWidth: "440px", width: "100%" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 8px", color: "#333", textAlign: "center" }}>🔔 연회비 갱신이 필요합니다</h1>
          <p style={{ fontSize: "14px", color: "#666", textAlign: "center", margin: "0 0 24px" }}>{partnerName}님, 가입(또는 마지막 결제)로부터 1년이 지났어요.<br/>갱신할 때까지 새 분석 생성이 제한됩니다.</p>

          <div style={{ background: "#eef0ff", padding: "16px", borderRadius: "10px", marginBottom: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#667eea", fontWeight: 900, margin: "0 0 4px" }}>{tierInfo.name} 등급</p>
            <p style={{ fontSize: "20px", fontWeight: 900, color: "#333", margin: 0 }}>
              {discountPercent > 0 ? (
                <>
                  <span style={{ textDecoration: "line-through", opacity: 0.5, fontSize: 14 }}>₩{tierInfo.annualFee.toLocaleString()}</span>{" "}
                  ₩{finalFee.toLocaleString()}
                </>
              ) : (
                <>₩{tierInfo.annualFee.toLocaleString()}</>
              )}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              value={discountInput}
              onChange={e => setDiscountInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && applyDiscountCode()}
              placeholder="🎟️ 할인코드 입력(선택)"
              style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }}
            />
            <button onClick={applyDiscountCode} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: "#667eea", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>적용</button>
          </div>
          {discountPercent > 0 && <p style={{ color: "#2e7d32", fontSize: 12, fontWeight: 800, margin: "0 0 16px" }}>✅ {discountPercent}% 할인 적용됨{discountPercent >= 100 ? " (무료)" : ""}</p>}
          {discountError && <p style={{ color: "#c33", fontSize: 12, fontWeight: 700, margin: "0 0 16px" }}>{discountError}</p>}

          <button onClick={handleRenew} disabled={renewing} style={{ width: "100%", padding: "14px", background: renewing ? "#ccc" : "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: "8px", fontWeight: 900, fontSize: "16px", cursor: renewing ? "not-allowed" : "pointer", marginBottom: "12px" }}>
            {renewing ? "처리중..." : `₩${finalFee.toLocaleString()} 결제하고 갱신하기`}
          </button>

          <button onClick={() => { localStorage.removeItem("partnerId"); localStorage.removeItem("partnerName"); localStorage.removeItem("partnerTier"); router.push("/partner/login"); }} style={{ width: "100%", padding: "10px", background: "none", border: "none", color: "#999", fontSize: "13px", cursor: "pointer" }}>
            로그아웃
          </button>
        </div>
      </main>
    </>
  );
}
