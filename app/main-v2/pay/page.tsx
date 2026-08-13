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
  const [showRefundNote, setShowRefundNote] = useState(false);

  const displayAmount = discountPct > 0 ? Math.round(amount * (1 - discountPct / 100)) : amount;

  useEffect(() => {
    // 택일은 별도 입력 폼 있으므로 생년월일 체크 불필요
    if (!isTaegil) {
      try {
        const sp = localStorage.getItem("v2_saved_profile");
        const p = sp ? JSON.parse(sp) : {};
        const loggedInName = localStorage.getItem("v2_user_name") ?? "";
        // 로그인 이름이 저장된 이름과 다른 사람이면 → 이전 정보 초기화 → 프로필부터
        if (loggedInName && p.name && loggedInName !== p.name) {
          localStorage.removeItem("v2_saved_profile");
          localStorage.removeItem("v2_verified_phone");
          sessionStorage.setItem("v2_profile_next_url", window.location.href);
          sessionStorage.setItem("v2_from_app", "1");
          document.cookie = "jeomun_from_app=1; path=/; max-age=30";
          window.location.href = "/main-v2/profile";
          return;
        }
        if (!p.birthYear || !p.gender || !p.birthHour) {
          // 생년월일 없으면 프로필 먼저 → 완료 후 이 결제 페이지로 복귀
          sessionStorage.setItem("v2_profile_next_url", window.location.href);
          sessionStorage.setItem("v2_from_app", "1");
          document.cookie = "jeomun_from_app=1; path=/; max-age=30";
          window.location.href = "/main-v2/profile";
          return;
        }
        if (p.name) setName(p.name);
        if (p.phone) setMobile(p.phone);
        if (p.email) setEmail(p.email);
      } catch {}
    } else {
      try {
        const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
        if (p.name) setName(p.name);
        if (p.phone) setMobile(p.phone);
        if (p.email) setEmail(p.email);
      } catch {}
    }
  }, [isTaegil]);

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
          const cat = "💰 재물운";
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
          if (_ph) {
            if (Object.keys(_faUnlocks).length > 0) fetch("/api/phone-unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:_ph,unlocks:_faUnlocks})}).catch(()=>{});
            localStorage.setItem("haemong_unlock_phone", _ph);
            localStorage.setItem("tarot_unlock_phone", _ph);
            localStorage.setItem("petun_unlock_phone", _ph);
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

  // 모바일 결제(카카오페이/카드)는 PG사 인증 후 이 페이지로 "새로 돌아오는" 방식이라
  // requestPayment()가 프로미스로 끝나지 않는 경우가 많음 — 결제 시작 전에 정보를
  // sessionStorage에 저장해두고, 돌아왔을 때 그 정보로 완료 처리를 이어감
  const finalizeSuccess = (info: {
    paymentId: string; amount: number; displayAmount: number; name: string; mobile: string; email: string;
    couponCode: string; discountPct: number; next: string; isTaegil: boolean; sourceInfo: string;
  }) => {
    if (info.couponCode.trim() && info.discountPct > 0) {
      fetch("/api/promo-codes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: info.couponCode.trim().toUpperCase() }) }).catch(() => {});
    }
    const cleanMobile = info.mobile.replace(/\D/g, "");
    if (cleanMobile) {
      try {
        localStorage.setItem("v2_saved_phone", cleanMobile);
        sessionStorage.setItem("v2_payment_phone", cleanMobile);
      } catch {}
    }
    try { const sp = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}"); localStorage.setItem("v2_saved_profile", JSON.stringify({ ...sp, phone: cleanMobile, email: info.email.trim() })); } catch {}
    try { const _h = Date.now() + 24*60*60*1000; localStorage.setItem("v2_qa_unlock_until", String(_h)); const _existH = Number(localStorage.getItem("haemong_unlock_until")||0); localStorage.setItem("haemong_unlock_until", String(Math.max(_existH, _h))); if (cleanMobile) localStorage.setItem("haemong_unlock_phone", cleanMobile); } catch {}
    if (info.displayAmount > 0 && info.name.trim()) {
      fetch("/api/v2/save-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: info.paymentId,
          date: new Date().toISOString(),
          name: info.name.trim(),
          phone: cleanMobile,
          email: info.email.trim(),
          amount: info.displayAmount,
          package: "운세",
          categories: [],
          plan: "select",
          discountCode: info.couponCode.trim().toUpperCase() || "",
          discountPercent: info.discountPct,
          originalAmount: info.amount,
          source: info.sourceInfo,
        }),
      }).catch(() => {});
    }
    try {
      const refCode = localStorage.getItem("referred_by");
      if (refCode) {
        fetch("/api/referral", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refCode }) }).catch(() => {});
        localStorage.removeItem("referred_by");
      }
    } catch {}
    if (!info.isTaegil) {
      localStorage.setItem("v2_paid", "1");
      localStorage.setItem("price", String(info.amount));
      localStorage.setItem("v2_plan", "select");
    }
    const targetUrl = info.isTaegil ? `${info.next}${info.next.includes("?") ? "&" : "?"}taegilPaid=1` : info.next;
    try {
      if (typeof (window as any).gtag === "function") {
        let navigated = false;
        const goNow = () => {
          if (navigated) return;
          navigated = true;
          window.location.href = targetUrl;
        };
        (window as any).gtag("event", "conversion", {
          send_to: "AW-459070148/D7-4CKip7e0BEMS189oB",
          transaction_id: info.paymentId,
          event_callback: goNow,
        });
        setTimeout(goNow, 1000);
      } else {
        window.location.href = targetUrl;
      }
    } catch {
      window.location.href = targetUrl;
    }
  };

  // 모바일에서 카카오페이/카드 인증 후 redirectUrl로 되돌아온 경우 감지 → 결제완료 처리 이어서 진행
  useEffect(() => {
    const pgPaymentId = searchParams.get("paymentId");
    const pendingRaw = sessionStorage.getItem("pay_pending") || localStorage.getItem("pay_pending");
    if (!pendingRaw) return;

    const pgCode = searchParams.get("code");
    if (pgPaymentId && pgCode) {
      sessionStorage.removeItem("pay_pending");
      try { localStorage.removeItem("pay_pending"); } catch {}
      setError(searchParams.get("message") || "결제에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    let info: any;
    try { info = JSON.parse(pendingRaw); } catch { return; }

    if (pgPaymentId) {
      sessionStorage.removeItem("pay_pending");
      try { localStorage.removeItem("pay_pending"); } catch {}
      finalizeSuccess(info);
      return;
    }

    // 일부 모바일 브라우저(구글/크롬 등)는 결제 앱에서 돌아올 때 주소창의 paymentId가
    // 유실되는 경우가 있음 → 결제 게이트웨이에서 돌아온 것으로 보이고(referrer),
    // 결제 시작 정보가 20분 이내로 신선하면 저장해둔 정보로 완료 처리를 이어감
    const referer = document.referrer || "";
    const fromPaymentGateway = /kakaopay|portone|inicis|kcp|nice|kftc|payapp/i.test(referer);
    const isFresh = typeof info.savedAt === "number" && Date.now() - info.savedAt < 20 * 60 * 1000;
    if (fromPaymentGateway && isFresh) {
      sessionStorage.removeItem("pay_pending");
      try { localStorage.removeItem("pay_pending"); } catch {}
      finalizeSuccess(info);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pay = async (method: "CARD" | "KAKAOPAY" = "CARD") => {
    if (!refundAgreed) { setError("아래 체크박스를 먼저 체크해주세요. ✅"); return; }
    if (!mobile.replace(/\D/g, "") || mobile.replace(/\D/g, "").length < 10) { setError("전화번호를 입력해주세요."); return; }
    setLoading(true); setError("");
    try {
      const PortOne = await import("@portone/browser-sdk/v2");
      const paymentId = `jeomun-${Date.now()}`;
      const channelKey = method === "KAKAOPAY"
        ? "channel-key-b474ece1-40a8-4a8a-bc24-469e6dbf0948"
        : "channel-key-e3b35730-62df-4314-a2c9-afd813698cd7";

      const referer = document.referrer || "";
      const sourceLabel = referer.includes("google") ? "구글"
        : referer.includes("naver") ? "네이버"
        : referer.includes("daum") ? "다음"
        : referer.includes("bing") ? "빙"
        : referer.includes("kakao") || referer.includes("kakaotalk") ? "카카오"
        : referer.includes("instagram") ? "인스타"
        : referer.includes("youtube") ? "유튜브"
        : referer.includes("tiktok") ? "틱톡"
        : referer.includes("facebook") ? "페이스북"
        : referer.includes("jeomun.com/main-v2/share") ? "공유페이지"
        : referer.includes("jeomun.com/main-v2/result") ? "결과지"
        : referer.includes("jeomun.com/free") ? "무료랜딩"
        : referer.includes("jeomun.com/main-v2/payment") ? "결제선택"
        : referer.includes("jeomun.com/main-v2") ? "메인"
        : referer.includes("jeomun.com/love") || referer.includes("jeomun.com/career") || referer.includes("jeomun.com/wealth") || referer.includes("jeomun.com/marriage") || referer.includes("jeomun.com/health") ? "SEO랜딩"
        : referer.includes("jeomun") ? "점운내부"
        : referer ? referer.split("/")[2] || "기타"
        : "직접";
      const partnerCode = localStorage.getItem("referred_by");
      const sourceInfo = partnerCode ? `파트너:${partnerCode}` : sourceLabel;

      const pendingInfo = {
        paymentId, amount, displayAmount, name, mobile, email,
        couponCode, discountPct, next, isTaegil, sourceInfo,
        savedAt: Date.now(),
      };
      // 모바일 리디렉션 방식은 이 페이지가 새로 로드되며 돌아오므로, 완료 처리에
      // 필요한 정보를 미리 저장해둠 (redirectUrl로 돌아왔을 때 위 useEffect가 사용)
      try { sessionStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); localStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); } catch {}

      const paymentRequest: Parameters<typeof PortOne.requestPayment>[0] = {
        storeId: "store-446686e2-22bd-4941-ae2a-83e7f3a15d87",
        channelKey,
        paymentId,
        orderName: "점운 사주 분석",
        totalAmount: displayAmount,
        currency: "KRW",
        payMethod: method === "KAKAOPAY" ? "EASY_PAY" : "CARD",
        customer: {
          fullName: name.trim() || "고객",
          phoneNumber: mobile.replace(/\D/g, ""),
          email: email.trim() || undefined,
        },
        redirectUrl: `${window.location.origin}${window.location.pathname}`,
        ...(method === "KAKAOPAY" ? { easyPay: { easyPayProvider: "KAKAOPAY" } } : {}),
        windowType: { mobile: "REDIRECTION" },
      };
      const response = await PortOne.requestPayment(paymentRequest);
      // 리디렉션 방식이면 여기 도달하지 않고 페이지가 이동함 — 아래는 PC 팝업 등
      // 리디렉션 없이 바로 결과를 돌려받는 경우에만 실행됨
      if (response?.code) {
        setError(response.message || "결제에 실패했습니다. 다시 시도해주세요.");
        try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {}
        return;
      }
      try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {}
      finalizeSuccess(pendingInfo);
    } catch {
      setError("결제 중 오류가 발생했습니다. 다시 시도해주세요.");
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

        {/* 결제 혜택 배너 */}
        {!isTaegil && (
          <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(139,92,246,0.12)", borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#c4b5fd", fontWeight: 700, lineHeight: 1.8 }}>
              🎁 결제하면 3종 24시간 무료!<br />
              <b style={{ color: "#f9a8d4" }}>꿈해몽 전체</b> · <b style={{ color: "#f9a8d4" }}>점냥이 채팅</b> · <b style={{ color: "#f9a8d4" }}>Q&A 전체</b><br />
              <span style={{ color: "rgba(196,181,253,0.7)", fontSize: 11 }}>결제 후 24시간 동안 무료로 이용할 수 있어요</span>
            </p>
          </div>
        )}

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
              {loading ? "처리 중..." : "결제하기"}
            </button>
          </>
        )}

        {!couponFree && (<>
        <div style={{ marginBottom: 12, padding: "10px 14px", background: "rgba(251,191,36,0.08)", borderRadius: 10, border: "1px solid rgba(251,191,36,0.2)" }}>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>💛 <b style={{color:"#FEE500"}}>카카오페이</b> 또는 <b style={{color:"#fbbf24"}}>신용카드</b>로 결제하세요.</p>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>이름 (선택)</label>
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

        <div style={{ marginBottom: 8 }}>
          <div onClick={() => setShowRefundNote(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: showRefundNote ? 8 : 0 }}>
            <span style={{ fontSize: 14 }}>📋</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 700 }}>결제 전 확인사항 {showRefundNote ? "▲" : "▼"}</span>
          </div>
          {showRefundNote && (
            <p style={{ margin: "0 0 0 20px", fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
              · 디지털 콘텐츠 특성상 결과 열람 후 환불이 불가합니다.<br />
              · 전화번호 입력 시 모든 기기·브라우저에서 결과 자동 복원돼요.
            </p>
          )}
        </div>
        <div onClick={() => setRefundAgreed(v => !v)} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, cursor: "pointer", userSelect: "none" as const }}>
          <span style={{ fontSize: 20, color: refundAgreed ? "#4ade80" : "#9ca3af", lineHeight: 1 }}>{refundAgreed ? "✅" : "⬜"}</span>
          <span style={{ fontSize: 12, color: refundAgreed ? "#4ade80" : "rgba(255,255,255,0.6)", fontWeight: refundAgreed ? 700 : 400 }}>네, 확인했어요!</span>
        </div>

        <button
          onClick={() => pay("KAKAOPAY")}
          disabled={loading}
          style={{ width: "100%", padding: "15px 0", background: loading ? "rgba(254,229,0,0.3)" : "#FEE500", color: "#191600", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 6px 22px rgba(254,229,0,0.35)", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <span style={{ fontSize: 18 }}>💛</span>
          {loading ? "결제 중..." : `카카오페이 ₩${displayAmount.toLocaleString()}`}
        </button>

        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textAlign: "center", margin: "0 0 8px", lineHeight: 1.5 }}>
          💡 카드 결제는 본인 폰의 카드앱(KB Pay, 삼성카드 앱 등) 인증이 필요해요
        </p>
        <button
          onClick={() => pay("CARD")}
          disabled={loading}
          style={{ width: "100%", padding: "15px 0", background: loading ? "rgba(251,191,36,0.3)" : "linear-gradient(135deg,#fbbf24,#ec4899,#8b5cf6)", color: "#1a0f2e", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 6px 22px rgba(251,191,36,0.3)", marginBottom: 8 }}
        >
          {loading ? "결제 중..." : `💳 신용카드 ₩${displayAmount.toLocaleString()}`}
        </button>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textAlign: "center", margin: "8px 0 0" }}>SSL 보안 결제 · NHN KCP · 카카오페이</p>
        </>)}
      </div>
    </main>
  );
}
