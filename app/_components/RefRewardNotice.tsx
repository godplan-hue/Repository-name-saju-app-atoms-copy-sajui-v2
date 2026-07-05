"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefRewardNotice() {
  const router = useRouter();
  const [newCount, setNewCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const refCode = localStorage.getItem("my_ref_code");
        if (!refCode) return;

        const res = await fetch(`/api/referral?refCode=${refCode}`);
        const data = await res.json();
        const coupons: { coupon: string; earnedAt: number }[] = data.coupons || [];
        if (coupons.length === 0) return;

        const lastSeen = Number(localStorage.getItem("ref_last_seen_count") || "0");
        if (coupons.length > lastSeen) {
          setNewCount(coupons.length - lastSeen);
          setVisible(true);
        }
      } catch {}
    };

    // 2초 후 조용히 체크 (페이지 로딩 방해 안 되게)
    const t = setTimeout(check, 2000);
    return () => clearTimeout(t);
  }, []);

  function handleConfirm() {
    const refCode = localStorage.getItem("my_ref_code");
    const res = fetch(`/api/referral?refCode=${refCode}`)
      .then(r => r.json())
      .then(d => {
        const count = (d.coupons || []).length;
        localStorage.setItem("ref_last_seen_count", String(count));
      })
      .catch(() => {});
    setVisible(false);
    router.push("/my-coupons");
  }

  function handleDismiss() {
    // 닫기만 하고 나중에 다시 알려줌 (seen 업데이트 안 함)
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
      width: "calc(100% - 32px)", maxWidth: 440,
      background: "linear-gradient(135deg, #16a34a, #15803d)",
      borderRadius: 18, padding: "16px 18px",
      boxShadow: "0 8px 32px rgba(22,163,74,0.45)",
      zIndex: 10000, display: "flex", alignItems: "center", gap: 14,
      fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif",
      animation: "slideUp 0.3s ease",
    }}>
      <style>{`@keyframes slideUp { from { transform: translateX(-50%) translateY(100px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }`}</style>

      <div style={{ fontSize: 32 }}>🎁</div>
      <div style={{ flex: 1 }}>
        <p style={{ color: "#fff", fontWeight: 900, fontSize: 14, margin: "0 0 3px" }}>
          쿠폰 {newCount}장 적립됐어요!
        </p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, margin: 0 }}>
          친구가 결제했어요 — 990원 무료 사주 쿠폰
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <button
          onClick={handleConfirm}
          style={{ padding: "7px 14px", borderRadius: 10, border: "none", background: "#fff", color: "#16a34a", fontSize: 12, fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap" }}
        >
          확인하기 →
        </button>
        <button
          onClick={handleDismiss}
          style={{ padding: "5px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.4)", background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
        >
          나중에
        </button>
      </div>
    </div>
  );
}
