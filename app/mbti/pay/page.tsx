"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function MbtiPayPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#07000f" }} />}>
      <PayInner />
    </Suspense>
  );
}

function PayInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const AMOUNT = 990;

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [refundAgreed, setRefundAgreed] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
      if (p.phone) setMobile(p.phone.replace(/\D/g,"").slice(0,11));
    } catch {}
    if (id) {
      fetch(`/api/mbti/analyze?id=${id}`).then(r => r.json()).then(d => {
        if (d?.phone) setMobile(String(d.phone).replace(/\D/g,"").slice(0,11));
      }).catch(() => {});
    }
  }, [id]);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    try {
      const r = await fetch(`/api/promo-codes?code=${coupon.trim().toUpperCase()}`);
      const d = await r.json();
      if (d.found) {
        if (d.maxAmount && AMOUNT > d.maxAmount) { setError(`이 쿠폰은 ₩${d.maxAmount.toLocaleString()} 이하 상품에만 사용 가능해요.`); setCouponData(null); }
        else { setCouponData(d); setError(""); }
      } else { setError("유효하지 않은 쿠폰이에요."); setCouponData(null); }
    } catch { setError("쿠폰 확인 중 오류가 발생했어요."); }
    finally { setCouponLoading(false); }
  };

  const finalAmount = couponData ? Math.round(AMOUNT * (1 - couponData.discountPercent / 100)) : AMOUNT;
  const isFree = couponData && (finalAmount === 0 || couponData.fullAccess);

  const setUnlock = (ph?: string, resultId?: string) => {
    const cleanPh = (ph ?? mobile).replace(/\D/g,"");
    const rid = resultId || id;
    if (rid) localStorage.setItem(`mbti_unlock_until_${rid}`, String(Date.now() + 24*60*60*1000));
    if (cleanPh) {
      if (rid) localStorage.setItem(`mbti_unlock_phone_${rid}`, cleanPh);
      try { const sp=JSON.parse(localStorage.getItem("v2_saved_profile")||"{}"); localStorage.setItem("v2_saved_profile",JSON.stringify({...sp,phone:cleanPh})); } catch {}
    }
  };

  // 모바일 카카오페이/카드 결제는 PG사 인증 후 이 페이지로 "새로 돌아오는" 방식이라
  // requestPayment()가 프로미스로 끝나지 않는 경우가 많음 — 결제 시작 전에 완료 처리에
  // 필요한 정보를 sessionStorage에 저장해두고, 돌아왔을 때 그 정보로 이어서 처리함
  const finalizeSuccess = (info: { id: string; cleanMobile: string; name: string; finalAmount: number; coupon: string; hasCoupon: boolean; adSource?: string }) => {
    if (info.hasCoupon) fetch("/api/promo-codes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:info.coupon.trim().toUpperCase()})}).catch(()=>{});
    fetch("/api/v2/save-payment",{method:"POST",headers:{"Content-Type":"application/json"},keepalive:true,body:JSON.stringify({id:`mbti_${Date.now()}`,phone:info.cleanMobile||"",name:info.name.trim()||"",amount:info.finalAmount,category:"MBTI 심층 분석",source:"mbti",adSource:info.adSource||""})}).catch(()=>{});
    setUnlock(info.cleanMobile, info.id);
    if (info.cleanMobile) fetch("/api/phone-unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:info.cleanMobile,unlocks:{mbti_unlock_until:Date.now()+24*60*60*1000}})}).catch(()=>{});
    window.location.href = info.id ? `/mbti/result/${info.id}?paid=1` : "/mbti";
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
      if (info.paymentId && info.paymentId !== pgPaymentId) return;
      finalizeSuccess(info);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 토스 결제창에서 되돌아온 경우 감지 → 결제완료 처리 이어서 진행
  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const tossAmount = searchParams.get("amount");
    if (searchParams.get("tossFail") === "1") {
      sessionStorage.removeItem("pay_pending");
      try { localStorage.removeItem("pay_pending"); } catch {}
      setError(searchParams.get("message") || "결제가 취소됐어요. 다시 시도해주세요.");
      return;
    }
    if (!paymentKey || !orderId) return;
    const pendingRaw2 = sessionStorage.getItem("pay_pending") || localStorage.getItem("pay_pending");
    let info: any = null;
    try { info = pendingRaw2 ? JSON.parse(pendingRaw2) : null; } catch {}
    (async () => {
      try {
        const res = await fetch("/api/toss/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentKey, orderId, amount: tossAmount }) });
        const data = await res.json();
        sessionStorage.removeItem("pay_pending");
        try { localStorage.removeItem("pay_pending"); } catch {}
        if (!res.ok || !data.ok) { setError(data.message || "결제 승인에 실패했어요. 다시 시도해주세요."); return; }
        const finalInfo = info || { id, cleanMobile: mobile.replace(/\D/g,""), name, finalAmount: Number(tossAmount) || finalAmount, coupon, hasCoupon: !!(coupon && couponData), adSource: localStorage.getItem("first_source") || "" };
        finalizeSuccess(finalInfo);
      } catch { setError("결제 승인 처리 중 오류가 발생했어요. 다시 시도해주세요."); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const payToss = async () => {
    if (!refundAgreed) { setShowRefund(true); setError("결제 전 확인사항을 먼저 확인해주세요."); return; }
    setLoading(true); setError("");
    try {
      const { loadTossPayments, ANONYMOUS } = await import("@tosspayments/tosspayments-sdk");
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string;
      if (!clientKey) throw new Error("클라이언트 키가 설정되지 않았어요 (NEXT_PUBLIC_TOSS_CLIENT_KEY 없음)");
      const orderId = `mbti-toss-${Date.now()}`;
      const cleanMobile = mobile.replace(/\D/g,"");
      const pendingInfo = { id, cleanMobile, name, finalAmount, coupon, hasCoupon: !!(coupon && couponData), adSource: localStorage.getItem("first_source") || "" };
      try { sessionStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); localStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); } catch {}
      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: finalAmount },
        orderId,
        orderName: "점운 MBTI 심층 분석",
        successUrl: `${window.location.origin}${window.location.pathname}`,
        failUrl: `${window.location.origin}${window.location.pathname}?tossFail=1`,
        customerName: name.trim() || "고객",
        customerMobilePhone: cleanMobile || "01000000000",
      });
    } catch (err: any) {
      setError(`토스 오류: ${err?.message || err?.code || String(err)}`);
      try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {}
    } finally { setLoading(false); }
  };

  const pay = async (method: "CARD" | "KAKAOPAY" = "CARD") => {
    if (!refundAgreed) { setShowRefund(true); setError("결제 전 확인사항을 먼저 확인해주세요."); return; }
    if (isFree) {
      setLoading(true);
      try {
        const _ph = mobile.replace(/\D/g,"");
        if (_ph) fetch("/api/phone-unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:_ph,unlocks:{mbti_unlock_until:Date.now()+24*60*60*1000}})}).catch(()=>{});
        fetch("/api/v2/save-payment",{method:"POST",headers:{"Content-Type":"application/json"},keepalive:true,body:JSON.stringify({id:`mbti_${Date.now()}`,phone:_ph||"",name:name.trim()||"",amount:0,category:"MBTI 쿠폰",source:"mbti"})}).catch(()=>{});
        fetch("/api/promo-codes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:coupon.trim().toUpperCase()})}).catch(()=>{});
        setUnlock();
        window.location.href = id ? `/mbti/result/${id}?paid=1` : "/mbti";
      } finally { setLoading(false); }
      return;
    }
    setLoading(true); setError("");
    try {
      const cleanMobile = mobile.replace(/\D/g,"");
      const channelKey = method === "KAKAOPAY"
        ? "channel-key-b474ece1-40a8-4a8a-bc24-469e6dbf0948"
        : "channel-key-e3b35730-62df-4314-a2c9-afd813698cd7";
      const portone = await import("@portone/browser-sdk/v2");
      const paymentId = `mbti_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const pendingInfo = { paymentId, id, cleanMobile, name, finalAmount, coupon, hasCoupon: !!(coupon && couponData), adSource: localStorage.getItem("first_source") || "" };
      // 모바일 리디렉션 방식은 이 페이지가 새로 로드되며 돌아오므로, 완료 처리에
      // 필요한 정보를 미리 저장해둠 (redirectUrl로 돌아왔을 때 위 useEffect가 사용)
      try { sessionStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); localStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); } catch {}
      const res = await portone.requestPayment({
        storeId: "store-446686e2-22bd-4941-ae2a-83e7f3a15d87",
        channelKey,
        paymentId,
        orderName: "점운 MBTI 심층 분석",
        totalAmount: finalAmount,
        currency: "KRW",
        payMethod: method === "KAKAOPAY" ? "EASY_PAY" : "CARD",
        ...(method === "KAKAOPAY" ? { easyPay: { easyPayProvider: "KAKAOPAY" } } : {}),
        windowType: { mobile: "REDIRECTION" },
        customer: { fullName: name.trim() || "고객", phoneNumber: cleanMobile || "01000000000" },
        redirectUrl: `${window.location.origin}${window.location.pathname}`,
      });
      // 리디렉션 방식이면 여기 도달하지 않고 페이지가 이동함 — 아래는 리디렉션 없이
      // 바로 결과를 돌려받는 경우에만 실행됨
      if (res && "code" in res) { setError(res.message || "결제에 실패했습니다."); try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {} return; }
      try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {}
      finalizeSuccess(pendingInfo);
    } catch { setError("결제 처리 중 오류가 발생했습니다."); }
    finally { setLoading(false); }
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#07000f", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "32px 16px 60px" },
    label: { fontSize: 12, color: "#9ca3af", marginBottom: 6, display: "block" as const },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const },
    row: { marginBottom: 16 },
  };

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <a href={id ? `/mbti/result/${id}` : "/mbti"} style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>← 돌아가기</a>
          <span style={{ fontSize: 13, color: "#6b7280" }}>MBTI 심층 분석</span>
        </div>

        <div style={{ background: "linear-gradient(135deg,#1a0a2e,#2d1269)", border: "1px solid rgba(167,139,250,0.4)", borderRadius: 18, padding: "24px 20px", marginBottom: 24, textAlign: "center" }}>
          <p style={{ fontSize: 28, margin: "0 0 8px" }}>🧠</p>
          <p style={{ fontSize: 17, fontWeight: 900, color: "white", margin: "0 0 8px" }}>MBTI 심층 분석 전체 공개</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "14px 0 16px", textAlign: "left" }}>
            {["💕 연애 심층 분석", "💼 커리어 심층 분석", "⚡ 스트레스 & 회복법", "🤝 인간관계 팁", "🌱 성장 메시지", "💰 돈 쓰는 스타일", "🔮 전생 이야기", "🖤 흑화 버전", "🎭 이중생활", "👀 썸 상대 마음 훔쳐보기"].map(item => (
              <div key={item} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px 10px", fontSize: 12, color: "#c4b5fd" }}>{item}</div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#a78bfa", margin: "0 0 14px" }}>결제 후 바로 열림 · 24시간 이용</p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "white", margin: 0 }}>₩{AMOUNT.toLocaleString()}</p>
        </div>

        <div style={{ marginBottom:16, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"14px 16px" }}>
          <label style={{ fontSize:12, color:"#9ca3af", marginBottom:8, display:"block" as const }}>🎟 쿠폰 코드 (선택)</label>
          <div style={{ display:"flex", gap:8 }}>
            <input style={{ flex:1, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"11px 14px", color:"white", fontSize:14, outline:"none" }}
              placeholder="쿠폰 코드 입력" value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&applyCoupon()} />
            <button onClick={applyCoupon} disabled={couponLoading} style={{ background:"rgba(124,58,237,0.3)", border:"1px solid rgba(124,58,237,0.6)", color:"#c4b5fd", fontSize:13, fontWeight:700, padding:"0 16px", borderRadius:12, cursor:"pointer", flexShrink:0 }}>
              {couponLoading?"...":"적용"}
            </button>
          </div>
          {couponData && <p style={{ fontSize:12, color:"#4ade80", marginTop:8, marginBottom:0 }}>✅ {isFree?"무료 이용권 — 카드 없이 바로 이용 가능!":`${couponData.discountPercent}% 할인 → ₩${finalAmount.toLocaleString()}`}</p>}
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "20px 18px", marginBottom: 16 }}>
          <div style={S.row}><label style={S.label}>이름 (선택)</label><input style={S.input} placeholder="홍길동" value={name} onChange={e=>setName(e.target.value)} /></div>
          <div><label style={S.label}>휴대폰 번호 (선택)</label><input style={S.input} placeholder="01012345678" value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,"").slice(0,11))} inputMode="numeric" /></div>
        </div>

        <div style={{ marginBottom:12 }}>
          <button type="button" onClick={()=>setShowRefund(v=>!v)} style={{ background:"none", border:"none", color:"#9ca3af", fontSize:12, cursor:"pointer", padding:"4px 0", display:"flex", alignItems:"center", gap:4 }}>
            📋 결제 전 확인사항 {showRefund?"▲":"▼"}
          </button>
          {showRefund && (
            <div style={{ marginTop:8, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px 14px" }}>
              <p style={{ fontSize:12, color:"#9ca3af", margin:0, lineHeight:1.6 }}>디지털 콘텐츠 특성상, 이용이 시작된 후에는 취소가 어렵습니다.</p>
            </div>
          )}
          <div onClick={()=>setRefundAgreed(v=>!v)} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none" as const, marginTop:8 }}>
            <span style={{ fontSize:18, color:refundAgreed?"#4ade80":"#9ca3af", lineHeight:1 }}>{refundAgreed?"✅":"⬜"}</span>
            <span style={{ fontSize:12, color:refundAgreed?"#4ade80":"rgba(255,255,255,0.6)", fontWeight:refundAgreed?700:400 }}>네, 확인했어요!</span>
          </div>
        </div>
        {error && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>}

        {isFree ? (
          <button onClick={()=>pay()} disabled={loading} style={{ width:"100%", background:loading?"rgba(124,58,237,0.5)":"linear-gradient(135deg,#7c3aed,#a855f7)", color:"white", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:loading?"not-allowed":"pointer", marginBottom:12 }}>
            {loading?"처리 중...":"🎟 무료로 이용하기"}
          </button>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            <button onClick={()=>pay("CARD")} disabled={loading||!refundAgreed} style={{ width:"100%", background:(loading||!refundAgreed)?"rgba(124,58,237,0.5)":"linear-gradient(135deg,#7c3aed,#a855f7)", color:"white", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:(loading||!refundAgreed)?"not-allowed":"pointer" }}>
              {loading?"결제 처리 중...":"🧠 신용카드로 결제"}
            </button>
            <button onClick={()=>pay("KAKAOPAY")} disabled={loading||!refundAgreed} style={{ width:"100%", background:(loading||!refundAgreed)?"#bba000":"#FEE500", color:(loading||!refundAgreed)?"rgba(0,0,0,0.4)":"#3C1E1E", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:(loading||!refundAgreed)?"not-allowed":"pointer" }}>
              💛 카카오페이로 결제
            </button>
            <button onClick={payToss} disabled={loading||!refundAgreed} style={{ width:"100%", background:(loading||!refundAgreed)?"rgba(0,100,255,0.4)":"#0064FF", color:"#fff", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:(loading||!refundAgreed)?"not-allowed":"pointer" }}>
              {loading?"결제 처리 중...":`토스로 결제 ₩${finalAmount.toLocaleString()}`}
            </button>
          </div>
        )}

        <p style={{ fontSize: 11, color: "#6b7280", textAlign: "center", lineHeight: 1.6 }}>
          결제 후 24시간 이용 가능합니다.
        </p>
      </div>
    </div>
  );
}
