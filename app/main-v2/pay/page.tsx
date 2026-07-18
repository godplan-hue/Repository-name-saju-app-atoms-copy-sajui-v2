"use client";

import { useState, Suspense, CSSProperties, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PayPage() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",background:"linear-gradient(160deg,#1a0535,#0a0420)"}}/>}>
      <PayInner />
    </Suspense>
  );
}

function PayInner() {
  const searchParams = useSearchParams();
  const urlAmount = Number(searchParams.get("amount") || "990");
  const amount = urlAmount || 990;
  const next = searchParams.get("next") || "/main-v2";
  const isTaegil = searchParams.get("taegil") === "1";
  const isFreeCat = searchParams.get("freeCat") === "1";

  const [cardNo, setCardNo] = useState("");
  const [expM, setExpM] = useState("");
  const [expY, setExpY] = useState("");
  const [birth, setBirth] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState("");
  const [couponFree, setCouponFree] = useState(false);
  const [discountPct, setDiscountPct] = useState(0);
  const [couponFullAccess, setCouponFullAccess] = useState(false);
  const [refundAgreed, setRefundAgreed] = useState(false);

  const displayAmount = discountPct > 0 ? Math.round(amount * (1 - discountPct / 100)) : amount;

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
      if (p.name) setName(p.name);
      if (p.phone) setMobile(p.phone);
      if (p.email) setEmail(p.email);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const autoPromo = sessionStorage.getItem("v2_auto_promo");
      if (!autoPromo) return;
      sessionStorage.removeItem("v2_auto_promo");
      setCouponCode(autoPromo);
      fetch(`/api/promo-codes?code=${encodeURIComponent(autoPromo)}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data || !data.active) return;
          if (data.discountPercent === 100) { setCouponFree(true); setDiscountPct(100); setCouponMsg("✅ 무료 쿠폰 자동 적용됐어요!"); }
          else { setDiscountPct(data.discountPercent); setCouponMsg(`✅ ${data.discountPercent}% 할인 자동 적용!`); }
        }).catch(() => {});
    } catch {}
  }, []);

  const verifyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true); setCouponMsg(""); setDiscountPct(0); setCouponFree(false);
    try {
      const res = await fetch(`/api/promo-codes?code=${encodeURIComponent(code)}`);
      if (!res.ok) { setCouponMsg("유효하지 않은 코드입니다."); return; }
      const data = await res.json();
      if (!data.active) { setCouponMsg("이미 사용된 코드입니다."); return; }
      if (data.maxAmount && amount > data.maxAmount) {
        setCouponMsg(`이 쿠폰은 ₩${data.maxAmount.toLocaleString()} 이하 상품에만 사용 가능해요.`);
        return;
      }
      if (data.discountPercent === 100) {
        setCouponFree(true);
        setDiscountPct(100);
        setCouponFullAccess(data.fullAccess ?? false);
        setCouponMsg("✅ 100% 무료 쿠폰 적용됐어요!");
      } else {
        setDiscountPct(data.discountPercent);
        setCouponFullAccess(data.fullAccess ?? false);
        setCouponMsg(`✅ ${data.discountPercent}% 할인 적용! ₩${Math.round(amount * (1 - data.discountPercent / 100)).toLocaleString()}로 결제됩니다.`);
      }
    } catch { setCouponMsg("코드 확인 중 오류가 발생했습니다."); }
    finally { setCouponLoading(false); }
  };

  const payFree = async () => {
    if (!mobile.replace(/\D/g, "") || mobile.replace(/\D/g, "").length < 10) { setError("전화번호를 입력해주세요."); return; }
    setLoading(true);
    try {
      await fetch("/api/promo-codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase() }),
      }).catch(() => {});

      // planType:"free" 분석은 allAnalyses가 없어서 결제 후 결과지에 유료 내용이
      // 안 보이는 버그를 막기 위해 유료 분석을 새로 호출해 v2_result 갱신
      try {
        const rawResult = localStorage.getItem("v2_result");
        const savedProfile = localStorage.getItem("v2_saved_profile");
        const profile = rawResult ? JSON.parse(rawResult).profile : (savedProfile ? JSON.parse(savedProfile) : null);
        if (profile?.name && profile?.birthYear) {
          const cat = isFreeCat ? "💰 재물운" : "💰 재물운";
          const res = await fetch("/api/v2/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: profile.name,
              birth: `${profile.birthYear}-${profile.birthMonth || "1"}-${profile.birthDay || "1"}`,
              birthHour: profile.birthHour || "",
              gender: profile.gender || "",
              category: cat,
              planType: "paid",
            }),
          });
          if (res.ok) {
            const data = await res.json();
            const existing = rawResult ? JSON.parse(rawResult) : {};
            localStorage.setItem("v2_result", JSON.stringify({
              ...data, category: cat, profile,
              histId: existing.histId ?? Date.now(),
              savedAt: existing.savedAt ?? new Date().toISOString(),
            }));
          }
        }
      } catch {}

      localStorage.setItem("v2_paid", "1");
      localStorage.setItem("v2_plan", "select");
      try { const sp = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}"); const cleanMob = mobile.replace(/\D/g,""); localStorage.setItem("v2_saved_profile", JSON.stringify({...sp, phone: cleanMob, email: email.trim()})); if (cleanMob) localStorage.setItem("v2_saved_phone", cleanMob); } catch {}
      try {
        const cats = JSON.parse(localStorage.getItem("v2_paid_cats") || "[]");
        if (!cats.includes("💰 재물운")) cats.push("💰 재물운");
        localStorage.setItem("v2_paid_cats", JSON.stringify(cats));
      } catch {}
      // fullAccess 쿠폰: 전체 앱 30일 열기
      if (couponFullAccess) {
        const _faKeys = ["haemong_unlock_until","momcare_unlock_until","gamjung_unlock_until","budget_unlock_until","tarot_unlock_until","petun_unlock_until","diet_unlock_until"];
        const _faUnlocks: Record<string, number> = {};
        _faKeys.forEach(k => { try { const _p=Number(localStorage.getItem(k)||0); const _u=(_p>Date.now()?_p:Date.now())+30*24*60*60*1000; localStorage.setItem(k,String(_u)); _faUnlocks[k]=_u; } catch {} });
        try {
          const _ph = (mobile||"").replace(/\D/g,"");
          if (_ph && Object.keys(_faUnlocks).length > 0) {
            fetch("/api/phone-unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:_ph,unlocks:_faUnlocks})}).catch(()=>{});
          }
        } catch {}
      }
      // 추천인 쿠폰 지급
      try {
        const refCode = localStorage.getItem("referred_by");
        if (refCode) {
          fetch("/api/referral", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refCode }),
          }).catch(() => {});
          localStorage.removeItem("referred_by");
        }
      } catch {}
      const freeNext = next.includes("paid=") ? next.replace(/([?&]paid=)[^&]+/, "$10") : next;
      window.location.href = isTaegil ? `${freeNext}${freeNext.includes("?") ? "&" : "?"}taegilPaid=1` : freeNext;
    } finally { setLoading(false); }
  };

  const formatCardNo = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 19);
    return d.match(/.{1,4}/g)?.join(" ") ?? d;
  };

  const pay = async () => {
    if (!refundAgreed) { setError("아래 체크박스를 먼저 체크해주세요. ✅"); return; }
    const clean = cardNo.replace(/\s/g, "");
    if (clean.length < 14) { setError("카드번호를 확인해주세요."); return; }
    if (!expM || !expY) { setError("유효기간을 입력해주세요."); return; }
    if (birth.length !== 6) { setError("생년월일 앞 6자리(YYMMDD)를 입력해주세요."); return; }
    if (pw.length !== 2) { setError("카드 비밀번호 앞 2자리를 입력해주세요."); return; }
    if (!name.trim()) { setError("이름을 입력해주세요."); return; }
    if (!mobile.replace(/\D/g, "") || mobile.replace(/\D/g, "").length < 10) { setError("전화번호를 입력해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/payup/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNo: clean,
          expireMonth: expM.padStart(2, "0"),
          expireYear: expY.slice(-2),
          birthday: birth,
          cardPw: pw,
          amount: displayAmount,
          itemName: "점운 운세",
          userName: name.trim(),
          mobileNumber: mobile.replace(/\D/g, ""),
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (couponCode.trim() && discountPct > 0) {
          fetch("/api/promo-codes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: couponCode.trim().toUpperCase() }) }).catch(() => {});
        }
        const cleanMobile = mobile.replace(/\D/g, "");
        if (cleanMobile) {
          try {
            localStorage.setItem("v2_saved_phone", cleanMobile);
            sessionStorage.setItem("v2_payment_phone", cleanMobile);
          } catch {}
        }
        try { const sp = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}"); localStorage.setItem("v2_saved_profile", JSON.stringify({...sp, phone: cleanMobile, email: email.trim()})); } catch {}
        // 맘케어 30일 + Q&A/복냥이 24시간 잠금 해제 (실카드 결제만)
        try { const _h = Date.now() + 24*60*60*1000; localStorage.setItem("v2_qa_unlock_until", String(_h)); } catch {}
        try { localStorage.setItem("momcare_unlock_until", String(Date.now() + 30 * 24 * 60 * 60 * 1000)); } catch {}
        // 결제 기록 Firebase 저장 (어드민 결제내역에 표시)
        if (displayAmount > 0 && name.trim()) {
          fetch("/api/v2/save-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: `pay_${Date.now()}`,
              date: new Date().toISOString(),
              name: name.trim(),
              phone: mobile.replace(/\D/g, ""),
              email: email.trim(),
              amount: displayAmount,
              package: "운세",
              categories: [],
              plan: "select",
              discountCode: couponCode.trim().toUpperCase() || "",
              discountPercent: discountPct,
              originalAmount: amount,
            }),
          }).catch(() => {});
        }
        // 추천인 쿠폰 지급
        try {
          const refCode = localStorage.getItem("referred_by");
          if (refCode) {
            fetch("/api/referral", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refCode }),
            }).catch(() => {});
            localStorage.removeItem("referred_by");
          }
        } catch {}
        // 카카오 알림톡 발송
        if (cleanMobile) {
          fetch("/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: cleanMobile, amount: displayAmount }),
          }).catch(() => {});
        }
        // 결과지 tier 인식용 — 패키지 외 990/2900/3900 결제도 select로 인식되게
        if (!isTaegil) {
          localStorage.setItem("v2_paid", "1");
          localStorage.setItem("price", String(amount));
          localStorage.setItem("v2_plan", "select");
        }
        window.location.href = isTaegil ? `${next}${next.includes("?") ? "&" : "?"}taegilPaid=1` : next;
      } else {
        setError(data.error || "결제에 실패했습니다. 다시 시도해주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const inp: CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid rgba(251,191,36,0.4)", background: "rgba(255,255,255,0.07)",
    color: "#fff", fontSize: 15, fontWeight: 700, outline: "none", boxSizing: "border-box",
  };
  const lbl: CSSProperties = { display: "block", color: "#fbbf24", fontSize: 11, fontWeight: 700, marginBottom: 4 };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0835,#0d0520)", color: "white", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <button onClick={() => window.history.back()} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", padding: "0 0 20px", display: "flex", alignItems: "center", gap: 4 }}>
          ← 돌아가기
        </button>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          {discountPct > 0 && !couponFree && (
            <p style={{ color: "rgba(196,181,253,0.5)", fontWeight: 700, fontSize: 14, margin: 0, textDecoration: "line-through" }}>₩{amount.toLocaleString()}</p>
          )}
          <p style={{ color: "#c4b5fd", fontWeight: 900, fontSize: 20, margin: 0 }}>결제금액 ₩{displayAmount.toLocaleString()}</p>
        </div>

        {/* 무료 쿠폰 */}
        <div style={{ marginBottom: 16, padding: "12px 14px", background: "rgba(255,255,255,0.06)", borderRadius: 12, border: "1px solid rgba(251,191,36,0.25)" }}>
          <label style={{ ...lbl, marginBottom: 8 }}>🎟 쿠폰 코드</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={couponCode}
              onChange={e => { setCouponCode(e.target.value); setCouponMsg(""); setCouponFree(false); }}
              onKeyDown={e => { if (e.key === "Enter") verifyCoupon(); }}
              placeholder="코드 입력"
              style={{ ...inp, flex: 1, fontSize: 13 }}
            />
            <button onClick={verifyCoupon} disabled={couponLoading || !couponCode.trim()}
              style={{ padding: "0 14px", background: couponCode.trim() ? "rgba(251,191,36,0.25)" : "rgba(255,255,255,0.05)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.4)", borderRadius: 10, fontWeight: 900, fontSize: 12, cursor: couponCode.trim() ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>
              {couponLoading ? "⏳" : "적용"}
            </button>
          </div>
          {couponMsg && <p style={{ fontSize: 11, fontWeight: 700, margin: "8px 0 0", color: couponFree ? "#4ade80" : "#ff6b6b" }}>{couponMsg}</p>}
        </div>

        {couponFree && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>핸드폰번호 <span style={{color:"#f472b6"}}>★ 필수사항</span></label>
              <input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="01012345678" inputMode="numeric" autoComplete="tel" style={inp} />
            </div>
            {error && <p style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700, margin: "0 0 12px", textAlign: "center" }}>⚠️ {error}</p>}
            <button onClick={payFree} disabled={loading}
              style={{ width: "100%", padding: "15px 0", background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#052e16", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 22px rgba(74,222,128,0.35)", marginBottom: 8 }}>
              {loading ? "처리 중..." : "🎁 무료로 시작하기"}
            </button>
          </>
        )}

        {!couponFree && (<>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>카드번호</label>
          <input value={cardNo} onChange={e => setCardNo(formatCardNo(e.target.value))} placeholder="0000 0000 0000 0000" inputMode="numeric" autoComplete="off" style={inp} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <div>
            <label style={lbl}>유효기간 월 (MM)</label>
            <input value={expM} onChange={e => setExpM(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="01" inputMode="numeric" maxLength={2} autoComplete="cc-exp-month" style={inp} />
          </div>
          <div>
            <label style={lbl}>유효기간 년 (YY)</label>
            <input value={expY} onChange={e => setExpY(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="27" inputMode="numeric" maxLength={2} autoComplete="cc-exp-year" style={inp} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <div>
            <label style={lbl}>생년월일 앞 6자리</label>
            <input value={birth} onChange={e => setBirth(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="예: 901225" inputMode="numeric" maxLength={6} autoComplete="off" style={inp} />
          </div>
          <div>
            <label style={lbl}>비밀번호 앞 2자리</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="••" inputMode="numeric" maxLength={2} autoComplete="off" style={{ ...inp, fontSize: 20 }} />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>이름 (카드 명의자)</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="홍길동" autoComplete="cc-name" style={inp} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>핸드폰번호 <span style={{color:"#f472b6"}}>★ 필수사항</span></label>
          <input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="01012345678" inputMode="numeric" autoComplete="tel" style={inp} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>이메일 (선택 — 운세·혜택 정보 수신)</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" inputMode="email" type="email" autoComplete="email" style={inp} />
        </div>

        {error && <p style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700, margin: "0 0 12px", textAlign: "center" }}>⚠️ {error}</p>}

        <p style={{ margin: "0 0 8px", fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>⚠️ 디지털 콘텐츠 특성상 결과 열람 후 환불이 불가합니다.</p>
        <div onClick={() => setRefundAgreed(v => !v)} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, cursor: "pointer", userSelect: "none" as const }}>
          <span style={{ fontSize: 20, color: refundAgreed ? "#4ade80" : "#9ca3af", lineHeight: 1 }}>{refundAgreed ? "✅" : "⬜"}</span>
          <span style={{ fontSize: 12, color: refundAgreed ? "#4ade80" : "rgba(255,255,255,0.6)", fontWeight: refundAgreed ? 700 : 400 }}>네, 확인했어요!</span>
        </div>

        <button
          onClick={pay}
          disabled={loading}
          style={{ width: "100%", padding: "15px 0", background: loading ? "rgba(251,191,36,0.3)" : "linear-gradient(135deg,#fbbf24,#ec4899,#8b5cf6)", color: "#1a0f2e", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 6px 22px rgba(251,191,36,0.3)", marginBottom: 8 }}
        >
          {loading ? "결제 중..." : `💳 ₩${displayAmount.toLocaleString()} 결제하기`}
        </button>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textAlign: "center", margin: "8px 0 0" }}>SSL 보안 결제 · 페이업㈜ 제공</p>
        </>)}
      </div>
    </main>
  );
}
