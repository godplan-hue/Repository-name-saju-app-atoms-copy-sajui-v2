"use client";
import { useState, useEffect } from "react";

const AMOUNT = 1980;

export default function GamjungPayPage() {
  const [showForm, setShowForm] = useState(false);
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
      if (p.name) setName(p.name);
      if (p.phone) setMobile(p.phone.replace(/\D/g,"").slice(0,11));
    } catch {}
  }, []);

  // 모바일에서 카카오페이/카드 인증 후 redirectUrl로 되돌아온 경우 감지 → 결제완료 처리 이어서 진행
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const pgPaymentId = sp.get("paymentId");
    if (!pgPaymentId) return;
    const pendingRaw = (sessionStorage.getItem("pay_pending") || localStorage.getItem("pay_pending"));
    if (!pendingRaw) return;
    sessionStorage.removeItem("pay_pending");
    try { localStorage.removeItem("pay_pending"); } catch {}
    const pgCode = sp.get("code");
    if (pgCode) {
      setError(sp.get("message") || "결제에 실패했습니다. 다시 시도해주세요.");
      return;
    }
    try {
      const info = JSON.parse(pendingRaw);
      finalizeSuccess(info);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 토스 결제 후 이 페이지로 돌아온 경우 감지
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const paymentKey = sp.get("paymentKey");
    const orderId = sp.get("orderId");
    const tossAmount = sp.get("amount");
    if (sp.get("tossFail") === "1") {
      sessionStorage.removeItem("pay_pending");
      try { localStorage.removeItem("pay_pending"); } catch {}
      setError(sp.get("message") || "결제가 취소됐어요. 다시 시도해주세요.");
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
        const cleanMobile = mobile.replace(/\D/g,"");
        const finalInfo = info || { paymentId: orderId, finalAmount: Number(tossAmount) || finalAmount, name, cleanMobile, coupon, hasCoupon: !!couponData };
        finalizeSuccess(finalInfo);
      } catch { setError("결제 승인 처리 중 오류가 발생했어요. 다시 시도해주세요."); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const payToss = async () => {
    if (!refundAgreed) { setShowRefund(true); setError("결제 전 확인사항을 먼저 확인해주세요."); return; }
    if (mobile.replace(/\D/g,"").length < 10) { setError("휴대폰 번호를 입력해주세요."); return; }
    setLoading(true); setError("");
    try {
      const { loadTossPayments, ANONYMOUS } = await import("@tosspayments/tosspayments-sdk");
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string;
      if (!clientKey) throw new Error("클라이언트 키가 설정되지 않았어요 (NEXT_PUBLIC_TOSS_CLIENT_KEY 없음)");
      const orderId = `gamjung-toss-${Date.now()}`;
      const cleanMobile = mobile.replace(/\D/g,"");
      const pendingInfo = { paymentId: orderId, finalAmount, name, cleanMobile, coupon, hasCoupon: !!couponData };
      try { sessionStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); localStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); } catch {}
      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: finalAmount },
        orderId,
        orderName: "점운 감정일기 30일권",
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

  const isFree = couponData && (Math.round(AMOUNT*(1-couponData.discountPercent/100))===0 || couponData.fullAccess);
  const finalAmount = couponData ? Math.round(AMOUNT*(1-couponData.discountPercent/100)) : AMOUNT;

  // 모바일 리디렉션 방식은 이 페이지가 새로 로드되며 돌아오므로, 완료 처리에
  // 필요한 정보를 미리 저장해둠 (redirectUrl로 돌아왔을 때 위 useEffect가 사용)
  const finalizeSuccess = async (info: { paymentId: string; finalAmount: number; name: string; cleanMobile: string; coupon: string; hasCoupon: boolean }) => {
    if (info.coupon && info.hasCoupon) fetch("/api/promo-codes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:info.coupon.trim().toUpperCase()})}).catch(()=>{});
    let _fbUntil = 0;
    if (info.cleanMobile) { try { const _r = await fetch(`/api/phone-unlock?phone=${info.cleanMobile}`); const _d = await _r.json(); if (_d.ok) _fbUntil = Number(_d.unlocks?.gamjung_unlock_until||0); } catch {} }
    const _local = Number(localStorage.getItem("gamjung_unlock_until")||0);
    const _p = Math.max(_local, _fbUntil);
    const _until = (_p>Date.now()?_p:Date.now())+30*24*60*60*1000;
    try { localStorage.setItem("gamjung_unlock_until", String(_until)); } catch {}
    if (info.cleanMobile) fetch("/api/phone-unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:info.cleanMobile,unlocks:{gamjung_unlock_until:_until}})}).catch(()=>{});
    fetch("/api/v2/save-payment",{method:"POST",headers:{"Content-Type":"application/json"},keepalive:true,body:JSON.stringify({id:info.paymentId,phone:info.cleanMobile||"",name:info.name.trim()||"",amount:info.finalAmount,category:"감정일기 30일권",source:"gamjung"})}).catch(()=>{});
    window.location.href = "/gamjung";
  };

  const pay = async (method: "CARD" | "KAKAOPAY" = "CARD") => {
    if (!refundAgreed) { setShowRefund(true); setError("결제 전 확인사항을 먼저 확인해주세요."); return; }
    if (mobile.replace(/\D/g,"").length < 10) { setError("휴대폰 번호를 입력해주세요."); return; }
    if (isFree) {
      setLoading(true);
      try {
        const _ph = mobile.replace(/\D/g,"");
        const _until24 = Date.now()+24*60*60*1000;
        const _until30 = Date.now()+30*24*60*60*1000;
        const _unlocks: Record<string,number> = couponData.fullAccess
          ? {haemong_unlock_until:_until24,gamjung_unlock_until:_until30,budget_unlock_until:_until30,tarot_unlock_until:_until24,petun_unlock_until:_until24,diet_unlock_until:_until30,momcare_unlock_until:_until30}
          : {gamjung_unlock_until:_until30};
        Object.entries(_unlocks).forEach(([k,v])=>{try{localStorage.setItem(k,String(v));}catch{}});
        if(_ph) fetch("/api/phone-unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:_ph,unlocks:_unlocks})}).catch(()=>{});
        fetch("/api/v2/save-payment",{method:"POST",headers:{"Content-Type":"application/json"},keepalive:true,body:JSON.stringify({id:`gamjung_${Date.now()}`,phone:_ph||"",name:name.trim()||"",amount:0,category:"감정일기 쿠폰",source:"gamjung"})}).catch(()=>{});
        fetch("/api/promo-codes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:coupon.trim().toUpperCase()})}).catch(()=>{});
        window.location.href = "/gamjung";
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
      const paymentId = `gamjung_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const pendingInfo = { paymentId, finalAmount, name, cleanMobile, coupon, hasCoupon: !!couponData };
      // 모바일 카카오페이는 PG 인증 후 이 페이지로 리디렉션되며 새로 로드되므로,
      // 완료 처리에 필요한 정보를 미리 저장해둠 (redirectUrl로 돌아왔을 때 위 useEffect가 사용)
      try { sessionStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); localStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); } catch {}
      const res = await portone.requestPayment({
        storeId: "store-446686e2-22bd-4941-ae2a-83e7f3a15d87",
        channelKey,
        paymentId,
        orderName: "점운 감정일기 30일권",
        totalAmount: finalAmount,
        currency: "KRW",
        payMethod: method === "KAKAOPAY" ? "EASY_PAY" : "CARD",
        ...(method === "KAKAOPAY" ? { easyPay: { easyPayProvider: "KAKAOPAY" } } : {}),
        windowType: { mobile: "REDIRECTION" },
        customer: { fullName: name.trim() || "고객", phoneNumber: cleanMobile },
        redirectUrl: `${window.location.origin}${window.location.pathname}`,
      });
      // 리디렉션 방식이면 여기 도달하지 않고 페이지가 이동함 — 아래는 리디렉션 없이
      // 바로 결과를 돌려받는 경우(PC 등)에만 실행됨
      if (res && "code" in res) { setError(res.message || "결제에 실패했습니다."); try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {} return; }
      try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {}
      await finalizeSuccess(pendingInfo);
    } catch { setError("결제 처리 중 오류가 발생했습니다."); }
    finally { setLoading(false); }
  };

  const S = {
    wrap: { minHeight:"100vh", background:"#030014", color:"#F5F5F5", fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth:440, margin:"0 auto", padding:"32px 16px 60px" },
    label: { fontSize:12, color:"#9ca3af", marginBottom:6, display:"block" as const },
    input: { width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"13px 14px", color:"white", fontSize:15, outline:"none", boxSizing:"border-box" as const },
    row: { marginBottom:16 },
  };

  if (!showForm) {
    return (
      <div style={S.wrap}>
        <div style={S.inner}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
            <a href="/gamjung" style={{ color:"#a78bfa", fontSize:13, textDecoration:"none" }}>← 돌아가기</a>
            <span style={{ fontSize:13, color:"#6b7280" }}>이용권 선택</span>
          </div>
          <p style={{ textAlign:"center", fontSize:18, fontWeight:900, color:"white", margin:"0 0 6px" }}>이용권을 선택해 주세요</p>
          <p style={{ textAlign:"center", fontSize:13, color:"#9ca3af", margin:"0 0 24px" }}>감정일기 단독권 또는 4개앱 풀패스</p>
          <div onClick={()=>setShowForm(true)} style={{ cursor:"pointer", border:"1px solid rgba(255,255,255,0.18)", borderRadius:18, padding:"20px 18px", marginBottom:14, background:"rgba(255,255,255,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:20, fontWeight:900, color:"white" }}>₩1,980</span>
              <span style={{ fontSize:12, color:"#9ca3af" }}>이 앱만 30일</span>
            </div>
            <p style={{ fontSize:14, color:"#d1d5db", margin:0 }}>📔 감정일기 30일권</p>
            <p style={{ fontSize:12, color:"#6b7280", margin:"4px 0 0" }}>결제 완료 후 감정일기 30일 이용 가능 · 추가 결제 시 기간 연장</p>
          </div>
          <div onClick={()=>{ window.location.href="/pass"; }} style={{ cursor:"pointer", border:"2px solid #f59e0b", borderRadius:18, padding:"20px 18px", marginBottom:24, background:"rgba(245,158,11,0.06)" }}>
            <p style={{ fontSize:11, color:"#9ca3af", margin:"0 0 4px", textDecoration:"line-through" }}>정가 ₩7,920 (개당 ₩1,980)</p>
            <p style={{ fontSize:11, fontWeight:900, color:"#ef4444", margin:"0 0 6px" }}>↓ 25% 할인</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:20, fontWeight:900, color:"#fbbf24" }}>₩5,900</span>
              <span style={{ background:"linear-gradient(135deg,#f59e0b,#ef4444)", color:"white", fontSize:11, fontWeight:900, padding:"3px 10px", borderRadius:20 }}>🔥 추천</span>
            </div>
            <p style={{ fontSize:14, color:"#fcd34d", margin:"0 0 4px", fontWeight:700 }}>4개앱 30일 풀패스</p>
            <p style={{ fontSize:12, color:"#d97706", margin:0 }}>감정일기·다이어트·가계부·육아일기</p>
            <p style={{ fontSize:12, color:"#9ca3af", margin:"6px 0 0" }}>일기류 4개 앱 전부 30일 이용 · 기간 자동 연장</p>
          </div>
          <p style={{ fontSize:11, color:"#6b7280", textAlign:"center" }}>1,980원 이용권은 감정일기 앱만 30일 이용 가능합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <button onClick={()=>setShowForm(false)} style={{ background:"none", border:"none", color:"#a78bfa", fontSize:13, cursor:"pointer", padding:0 }}>← 이용권 선택으로</button>
          <span style={{ fontSize:13, color:"#6b7280" }}>감정일기 30일 이용권</span>
        </div>
        <div style={{ background:"linear-gradient(135deg,#1a1a2e,#2d1b69)", border:"1px solid rgba(124,58,237,0.4)", borderRadius:18, padding:"20px 18px", marginBottom:16, textAlign:"center" }}>
          <p style={{ fontSize:24, margin:"0 0 4px" }}>📔</p>
          <p style={{ fontSize:16, fontWeight:900, color:"white", margin:"0 0 6px" }}>점운 감정일기</p>
          <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 14px", lineHeight:1.6 }}>감정 기록 · 오행 감정 흐름 분석<br />30일 동안 마음껏 이용</p>
          <p style={{ fontSize:28, fontWeight:900, color:"white", margin:0 }}>₩{AMOUNT.toLocaleString()}</p>
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

        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:18, padding:"20px 18px", marginBottom:16 }}>
          <div style={S.row}><label style={S.label}>이름 (선택)</label><input style={S.input} placeholder="홍길동" value={name} onChange={e=>setName(e.target.value)} /></div>
          <div><label style={S.label}>휴대폰 번호 ★ 필수</label><input style={S.input} placeholder="01012345678" value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,"").slice(0,11))} inputMode="numeric" /></div>
        </div>

        {!isFree && (
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
        )}
        {error && <p style={{ color:"#f87171", fontSize:13, textAlign:"center", marginBottom:12 }}>{error}</p>}

        {isFree ? (
          <button onClick={()=>pay()} disabled={loading} style={{ width:"100%", background:loading?"rgba(124,58,237,0.5)":"linear-gradient(135deg,#7c3aed,#ec4899)", color:"white", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:loading?"not-allowed":"pointer", marginBottom:12 }}>
            {loading?"처리 중...":"🎟 무료로 이용하기"}
          </button>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            <button onClick={()=>pay("CARD")} disabled={loading||!refundAgreed} style={{ width:"100%", background:(loading||!refundAgreed)?"rgba(124,58,237,0.5)":"linear-gradient(135deg,#7c3aed,#ec4899)", color:"white", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:(loading||!refundAgreed)?"not-allowed":"pointer" }}>
              {loading?"결제 처리 중...":"💳 신용카드로 결제"}
            </button>
            <button onClick={()=>pay("KAKAOPAY")} disabled={loading||!refundAgreed} style={{ width:"100%", background:(loading||!refundAgreed)?"#bba000":"#FEE500", color:(loading||!refundAgreed)?"rgba(0,0,0,0.4)":"#3C1E1E", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:(loading||!refundAgreed)?"not-allowed":"pointer" }}>
              💛 카카오페이로 결제
            </button>
            <button onClick={payToss} disabled={loading||!refundAgreed} style={{ width:"100%", background:(loading||!refundAgreed)?"rgba(0,100,255,0.4)":"#0064FF", color:"#fff", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:(loading||!refundAgreed)?"not-allowed":"pointer" }}>
              {loading?"결제 처리 중...":`토스로 결제 ₩${finalAmount.toLocaleString()}`}
            </button>
          </div>
        )}

        <div style={{ marginBottom:16, padding:"12px 14px", background:"rgba(251,191,36,0.08)", borderRadius:12, border:"1px solid rgba(251,191,36,0.3)" }}>
          <p style={{ margin:"0 0 6px", fontSize:12, fontWeight:900, color:"#fbbf24" }}>⚠️ 꼭 확인하세요</p>
          <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.7 }}>
            · 전화번호를 입력하시면 PC·모바일 어떤 기기에서도 이용 가능해요.<br />
            · 이미 이용 중이라면 남은 기간에 자동으로 연장돼요.
          </p>
        </div>
        <p style={{ fontSize:11, color:"#6b7280", textAlign:"center", lineHeight:1.6 }}>결제 후 감정일기 30일 이용권이 즉시 적용돼요.</p>
      </div>
    </div>
  );
}
