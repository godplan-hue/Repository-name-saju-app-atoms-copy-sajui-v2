"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

interface FortuneAngle {
  type: string;
  emoji: string;
  content: string;
}

interface Props {
  fortuneAngles: FortuneAngle[];
  keyword: string;
  emoji: string;
  luck: string;
}

export default function FortuneAnglesSection({ fortuneAngles, keyword, emoji, luck }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [restorePhone, setRestorePhone] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState("");

  useEffect(() => {
    try {
      const unlockUntil = Number(localStorage.getItem("haemong_unlock_until") || "0");
      if (unlockUntil > Date.now()) {
        const _up = localStorage.getItem("haemong_unlock_phone")||""; const _pp=(()=>{try{return(JSON.parse(localStorage.getItem("v2_saved_profile")||"{}").phone||"").replace(/\D/g,"");}catch{return "";}})();
        if (!_up || !_pp || _up === _pp) { setUnlocked(true); return; }
      }
      const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const hasRecentPurchase = hist.some((h: { isPaid?: boolean; date?: string }) => {
        if (!h.isPaid || !h.date) return false;
        return new Date(h.date).getTime() > oneDayAgo;
      });
      setUnlocked(hasRecentPurchase);
    } catch {}
    try {
      const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
      if (p.phone) setRestorePhone(p.phone);
    } catch {}
  }, []);

  const handleRestore = async () => {
    const ph = restorePhone.replace(/\D/g, "");
    if (ph.length < 10) { setRestoreMsg("전화번호를 확인해주세요."); return; }
    setRestoring(true); setRestoreMsg("");
    try {
      const r = await fetch(`/api/phone-unlock?phone=${ph}`);
      const d = await r.json();
      if (d.ok && d.unlocks?.haemong_unlock_until > Date.now()) {
        try { localStorage.setItem("haemong_unlock_until", String(d.unlocks.haemong_unlock_until)); } catch {}
        try { const _p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}"); _p.phone = restorePhone; localStorage.setItem("v2_saved_profile", JSON.stringify(_p)); } catch {}
        setRestoreMsg("✅ 이용권 복원 완료! 새로고침할게요.");
        setTimeout(() => window.location.reload(), 1000);
      } else { setRestoreMsg("해당 전화번호로 등록된 이용권이 없어요."); }
    } catch { setRestoreMsg("복원 중 오류가 발생했어요."); }
    finally { setRestoring(false); }
  };

  if (!fortuneAngles || fortuneAngles.length === 0) return null;

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px", marginBottom: 14, boxShadow: "0 2px 12px rgba(139,92,246,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>⭐</span>
        <span style={{ fontWeight: 800, fontSize: 15, color: "#4c1d95" }}>운세별 관점</span>
        {unlocked ? (
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: "#f0fdf4", color: "#16a34a" }}>✅ 오늘 전체 공개</span>
        ) : (
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: "#fef3c7", color: "#b45309" }}>🔒 결제 후 공개</span>
        )}
      </div>

      {unlocked ? (
        /* 사주앱 결제자 — 전체 공개 */
        <>
          {fortuneAngles.map((fa, i) => (
            <div key={i} style={{ background: "#fafafa", borderRadius: 12, padding: "14px", border: "1px solid #f3e8ff", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#be185d", marginBottom: 6 }}>{fa.emoji} {fa.type}</div>
              <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{fa.content}</div>
            </div>
          ))}
          <div style={{ marginTop: 4, padding: "10px 14px", borderRadius: 12, background: "linear-gradient(135deg,#fef2f2,#fee2e2)", border: "1.5px solid #fca5a5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 700 }}>📸 소개·추천 글 올리면 쿠폰 10장<br />+ 꿈해몽 무료!</span>
            <Link href="/share-coupon" style={{ fontSize: 11, fontWeight: 900, textDecoration: "none", background: "#dc2626", color: "#fff", padding: "4px 10px", borderRadius: 10 }}>받기 →</Link>
          </div>
        </>
      ) : (
        /* 미결제 — 전체 잠금 */
        <>
          {fortuneAngles.map((fa, i) => (
            <div key={i} style={{ background: "#fafafa", borderRadius: 12, padding: "12px 14px", border: "1px solid #f3e8ff", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#be185d", marginBottom: 3 }}>{fa.emoji} {fa.type}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>🔐 결제 후 전체 해석 공개</div>
              </div>
              <span style={{ fontSize: 22, opacity: 0.5 }}>🔒</span>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 12, background: "linear-gradient(135deg,#fef2f2,#fee2e2)", border: "1.5px solid #fca5a5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 700 }}>📸 소개·추천 글 올리면 쿠폰 10장<br />+ 꿈해몽 무료!</span>
            <Link href="/share-coupon" style={{ fontSize: 11, fontWeight: 900, textDecoration: "none", background: "#dc2626", color: "#fff", padding: "4px 10px", borderRadius: 10 }}>받기 →</Link>
          </div>
          <div style={{ marginTop: 12, borderTop: "1px solid rgba(236,72,153,0.15)", paddingTop: 12 }}>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 8px" }}>📱 PC나 다른 기기에서 이용하시려면 전화번호로 복원해요</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="tel" value={restorePhone} onChange={e => setRestorePhone(e.target.value.replace(/\D/g,"").slice(0,11))} placeholder="01012345678" style={{ flex: 1, background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, padding: "9px 12px", color: "#374151", fontSize: 13, outline: "none" }} inputMode="numeric" />
              <button onClick={handleRestore} disabled={restoring} style={{ background: "linear-gradient(135deg,#ec4899,#8b5cf6)", border: "none", borderRadius: 10, padding: "9px 16px", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{restoring ? "확인중..." : "복원"}</button>
            </div>
            {restoreMsg && <p style={{ fontSize: 12, margin: "8px 0 0", color: restoreMsg.startsWith("✅") ? "#16a34a" : "#dc2626" }}>{restoreMsg}</p>}
          </div>
        </>
      )}
    </div>
  );
}
