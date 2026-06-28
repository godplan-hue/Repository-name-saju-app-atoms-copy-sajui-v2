"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { PARTNER_TIERS, getTierIndex } from "@/lib/partnerTiers";

export default function PartnerUpgrade() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [currentTier, setCurrentTier] = useState("free");
  const [upgrading, setUpgrading] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("partnerId");
    const name = localStorage.getItem("partnerName");
    const tier = localStorage.getItem("partnerTier");
    if (!id) { router.push("/partner/login"); return; }
    setPartnerId(id);
    setPartnerName(name || "");
    setCurrentTier(tier || "free");
  }, [router]);

  const currentIndex = getTierIndex(currentTier);
  const currentTierInfo = PARTNER_TIERS[currentIndex];

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

  const handleUpgrade = async (newTier: string, fee: number) => {
    const finalFee = Math.round(fee * (1 - discountPercent / 100));
    if (!confirm(`${PARTNER_TIERS.find(t => t.id === newTier)?.name} 등급으로 업그레이드하시겠습니까?\n결제액: ₩${finalFee.toLocaleString()}`)) return;
    setUpgrading(true);
    try {
      if (discountPercent > 0) {
        await fetch("/api/promo-codes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: discountInput }),
        });
      }
      const res = await fetch("/api/partner/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, newTier, paidAmount: finalFee, discountCode: discountInput, discountPercent }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "업그레이드에 실패했습니다."); return; }
      localStorage.setItem("partnerTier", newTier);
      setCurrentTier(newTier);
      alert(`업그레이드 완료!\n추가 결제(차액): ₩${finalFee.toLocaleString()}\n이번 달 이미 사용: ${data.usedThisMonth}건\n남은 한도: ${data.remainingThisMonth === null ? "무제한" : `${data.remainingThisMonth}건`}`);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <>
      <Head><title>등급 업그레이드 - 점운 파트너</title></Head>
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", backgroundImage: "url('https://i.pinimg.com/736x/5a/ac/03/5aac03a5583b75939362ca57c2bfbbc7.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", padding: "20px", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative" }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.65)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 900, margin: 0, color: "#333" }}>⭐ {partnerName}님<br/>등급<br/>업그레이드</h1>
              <p style={{ fontSize: "14px", color: "#666", margin: "5px 0 0 0" }}>현재 등급: {currentTierInfo?.name}</p>
            </div>
            <button onClick={() => router.push("/partner/create-analysis")} style={{ padding: "10px 20px", background: "#eef0ff", color: "#667eea", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>분석 생성</button>
          </div>

          <div style={{ background: "white", padding: "30px", borderRadius: "12px" }}>
            <p style={{ fontSize: "13px", color: "#111", fontWeight: 700, marginTop: 0, marginBottom: 20 }}>업그레이드 시 새 등급 연회비에서<br/>기존에 낸 연회비를 뺀 차액만 결제하면<br/>바로 적용됩니다.<br/>이번 달 이미 사용한 건수는 그대로 유지되고,<br/>새 등급의 한도 안에서 계속 쓸 수 있습니다.</p>

            {/* 할인코드 */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input
                value={discountInput}
                onChange={e => setDiscountInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && applyDiscountCode()}
                placeholder="🎟️ 할인코드 입력(선택)"
                style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }}
              />
              <button onClick={applyDiscountCode} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: "#667eea", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>적용</button>
            </div>
            {discountPercent > 0 && <p style={{ color: "#2e7d32", fontSize: 12, fontWeight: 800, marginTop: -12, marginBottom: 20 }}>✅ {discountPercent}% 할인 적용됨{discountPercent >= 100 ? " (무료)" : ""}</p>}
            {discountError && <p style={{ color: "#c33", fontSize: 12, fontWeight: 700, marginTop: -12, marginBottom: 20 }}>{discountError}</p>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
              {PARTNER_TIERS.map((tier, idx) => {
                const isCurrent = tier.id === currentTier;
                const isLower = idx < currentIndex;
                const fee = Math.max(0, tier.annualFee - currentTierInfo.annualFee);
                const finalFee = Math.round(fee * (1 - discountPercent / 100));
                return (
                  <div key={tier.id} style={{ border: isCurrent ? "3px solid #667eea" : "2px solid #ddd", borderRadius: 12, padding: 20, textAlign: "center", opacity: isLower ? 0.4 : 1 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 10px", color: "#333" }}>{tier.name}</h2>
                    <p style={{ fontSize: 12, color: "#666", margin: "0 0 6px" }}>월 {tier.monthlyLimit === null ? "무제한" : `${tier.monthlyLimit}건(연 최대 ${(tier.monthlyLimit * 12).toLocaleString()}건)`}</p>
                    <p style={{ fontSize: 12, color: "#ff9500", fontWeight: 900, margin: "0 0 14px" }}>사용료 {tier.feeDiscountPercent}% 할인</p>
                    {isCurrent ? (
                      <div style={{ padding: 10, background: "#eef0ff", borderRadius: 8, color: "#667eea", fontWeight: 900, fontSize: 13 }}>현재 등급</div>
                    ) : isLower ? (
                      <div style={{ padding: 10, color: "#999", fontSize: 12 }}>다운그레이드 불가</div>
                    ) : (
                      <button onClick={() => handleUpgrade(tier.id, fee)} disabled={upgrading} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: 8, fontWeight: 900, fontSize: 13, cursor: "pointer" }}>
                        {discountPercent > 0 ? <>차액 <span style={{ textDecoration: "line-through", opacity: 0.7 }}>₩{fee.toLocaleString()}</span> ₩{finalFee.toLocaleString()} 결제</> : <>차액 ₩{fee.toLocaleString()} 결제</>}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
