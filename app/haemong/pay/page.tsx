"use client";
import { useState, useEffect } from "react";

const AMOUNT = 990;

export default function HaemongPayPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
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

  // 모바일 카카오페이/카드 결제는 PG 인증 후 이 페이지로 "새로 돌아오는" 방식이라
  // requestPayment()가 프로미스로 끝나지 않는 경우가 많음 — 결제 시작 전에 완료 처리에
  // 필요한 정보를 sessionStorage에 저장해두고, 돌아왔을 때 그 정보로 이어서 처리함
  const finalizeSuccess = (info: { paymentId: string; finalAmount: number; name: string; mobile: string; email: string; couponCode: string; hasCoupon: boolean }) => {
    const cleanMobile = info.mobile.replace(/\D/g, "");
    if (info.hasCoupon) fetch("/api/promo-codes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:info.couponCode.trim().toUpperCase()})}).catch(()=>{});
    const _until = Date.now()+24*60*60*1000;
    try { localStorage.setItem("haemong_unlock_until", String(_until)); } catch {}
    if (cleanMobile) try { localStorage.setItem("haemong_unlock_phone", cleanMobile); } catch {}
    if (cleanMobile) fetch("/api/phone-unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:cleanMobile,unlocks:{haemong_unlock_until:_until}})}).catch(()=>{});
    try { const sp=JSON.parse(localStorage.getItem("v2_saved_profile")||"{}"); localStorage.setItem("v2_saved_profile",JSON.stringify({...sp,phone:cleanMobile,email:info.email.trim()})); if(cleanMobile) localStorage.setItem("v2_saved_phone",cleanMobile); } catch {}
    fetch("/api/v2/save-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:`haemong_${Date.now()}`,phone:cleanMobile||"",name:info.name.trim()||"",email:info.email.trim()||"",amount:info.finalAmount,category:"꿈해몽 24시간 이용권",source:"haemong"})}).catch(()=>{});
    window.location.href = "/haemong";
  };

  // 모바일에서 카카오페이/카드 인증 후 redirectUrl로 되돌아온 경우 감지 → 결제완료 처리 이어서 진행
  useEffect(() => {
    try {
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
      const info = JSON.parse(pendingRaw);
      finalizeSuccess(info);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pay = async (method: "CARD" | "KAKAOPAY" = "CARD") => {
    if (!mobile.replace(/\D/g,"") || mobile.replace(/\D/g,"").length < 10) { setError("전화번호를 입력해주세요. (필수사항)"); return; }
    if (isFree) {
      setLoading(true);
      try {
        const _ph = mobile.replace(/\D/g,"");
        const _until24 = Date.now()+24*60*60*1000;
        const _until30 = Date.now()+30*24*60*60*1000;
        const _unlocks: Record<string,number> = couponData.fullAccess
          ? {haemong_unlock_until:_until24,gamjung_unlock_until:_until30,budget_unlock_until:_until30,tarot_unlock_until:_until24,petun_unlock_until:_until24,diet_unlock_until:_until30,momcare_unlock_until:_until30}
          : {haemong_unlock_until:_until24};
        Object.entries(_unlocks).forEach(([k,v])=>{try{localStorage.setItem(k,String(v));}catch{}});
        if(_ph) try { localStorage.setItem("haemong_unlock_phone", _ph); } catch {}
        if(_ph) fetch("/api/phone-unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:_ph,unlocks:_unlocks})}).catch(()=>{});
        try { const sp=JSON.parse(localStorage.getItem("v2_saved_profile")||"{}"); localStorage.setItem("v2_saved_profile",JSON.stringify({...sp,phone:_ph,email:email.trim()})); if(_ph) localStorage.setItem("v2_saved_phone",_ph); } catch {}
        fetch("/api/v2/save-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:`haemong_${Date.now()}`,phone:_ph||"",name:name.trim()||"",email:email.trim()||"",amount:0,category:"꿈해몽 쿠폰",source:"haemong"})}).catch(()=>{});
        fetch("/api/promo-codes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:coupon.trim().toUpperCase()})}).catch(()=>{});
        window.location.href = "/haemong";
      } finally { setLoading(false); }
      return;
    }
    if (!refundAgreed) { setShowRefund(true); setError("결제 전 확인사항을 먼저 확인해주세요."); return; }
    setLoading(true); setError("");
    try {
      const cleanMobile = mobile.replace(/\D/g,"");
      const channelKey = method === "KAKAOPAY"
        ? "channel-key-b474ece1-40a8-4a8a-bc24-469e6dbf0948"
        : "channel-key-e3b35730-62df-4314-a2c9-afd813698cd7";
      const portone = await import("@portone/browser-sdk/v2");
      const paymentId = `haemong_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const pendingInfo = { paymentId, finalAmount, name, mobile, email, couponCode: coupon, hasCoupon: !!(coupon && couponData) };
      try { sessionStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); localStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); } catch {}
      const res = await portone.requestPayment({
        storeId: "store-446686e2-22bd-4941-ae2a-83e7f3a15d87",
        channelKey,
        paymentId,
        orderName: "점운 꿈해몽 24시간 이용권",
        totalAmount: finalAmount,
        currency: "KRW",
        payMethod: method === "KAKAOPAY" ? "EASY_PAY" : "CARD",
        ...(method === "KAKAOPAY" ? { easyPay: { easyPayProvider: "KAKAOPAY" } } : {}),
        windowType: { mobile: "REDIRECTION" },
        customer: { fullName: name.trim() || "고객", phoneNumber: cleanMobile },
        redirectUrl: `${window.location.origin}${window.location.pathname}`,
      });
      if (res && "code" in res) { setError(res.message || "결제에 실패했습니다."); try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {} return; }
      try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {}
      finalizeSuccess(pendingInfo);
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

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <a href="/haemong" style={{ color:"#a78bfa", fontSize:13, textDecoration:"none" }}>← 돌아가기</a>
          <span style={{ fontSize:13, color:"#6b7280" }}>꿈해몽 24시간 이용권</span>
        </div>
        <div style={{ background:"linear-gradient(135deg,#0f0a2e,#1a1060)", border:"1px solid rgba(124,58,237,0.4)", borderRadius:18, padding:"20px 18px", marginBottom:16, textAlign:"center" }}>
          <p style={{ fontSize:24, margin:"0 0 4px" }}>🌙</p>
          <p style={{ fontSize:16, fontWeight:900, color:"white", margin:"0 0 6px" }}>점운 꿈해몽</p>
          <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 14px", lineHeight:1.6 }}>꿈 해석 · 태몽 · 흉몽 · 길몽 전부<br />24시간 동안 마음껏 이용</p>
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
          <div style={S.row}><label style={S.label}>휴대폰 번호 <span style={{color:"#f472b6"}}>★ 필수사항</span></label><input style={S.input} placeholder="01012345678" value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,"").slice(0,11))} inputMode="numeric" /></div>
          <div><label style={S.label}>이메일 (선택)</label><input style={S.input} placeholder="example@email.com" type="email" inputMode="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
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
          <button onClick={()=>pay()} disabled={loading} style={{ width:"100%", background:loading?"rgba(124,58,237,0.5)":"linear-gradient(135deg,#7c3aed,#6d28d9)", color:"white", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:loading?"not-allowed":"pointer", marginBottom:12 }}>
            {loading?"처리 중...":"결제하기"}
          </button>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            <button onClick={()=>pay("CARD")} disabled={loading||!refundAgreed} style={{ width:"100%", background:(loading||!refundAgreed)?"rgba(124,58,237,0.5)":"linear-gradient(135deg,#7c3aed,#6d28d9)", color:"white", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:(loading||!refundAgreed)?"not-allowed":"pointer" }}>
              {loading?"결제 처리 중...":"💳 신용카드로 결제"}
            </button>
            <button onClick={()=>pay("KAKAOPAY")} disabled={loading||!refundAgreed} style={{ width:"100%", background:(loading||!refundAgreed)?"#bba000":"#FEE500", color:(loading||!refundAgreed)?"rgba(0,0,0,0.4)":"#3C1E1E", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:(loading||!refundAgreed)?"not-allowed":"pointer" }}>
              💛 카카오페이로 결제
            </button>
          </div>
        )}

        <div style={{ marginBottom:16, padding:"12px 14px", background:"rgba(251,191,36,0.08)", borderRadius:12, border:"1px solid rgba(251,191,36,0.3)" }}>
          <p style={{ margin:"0 0 6px", fontSize:12, fontWeight:900, color:"#fbbf24" }}>⚠️ 꼭 확인하세요</p>
          <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.7 }}>
            · 전화번호를 입력하시면 PC·모바일 어떤 기기에서도 이용 가능해요.<br />
            (앱 목록 /apps → 이용권 불러오기)<br />
            · 디지털 콘텐츠 특성상 환불이 불가합니다.
          </p>
        </div>
        <p style={{ fontSize:11, color:"#6b7280", textAlign:"center", lineHeight:1.6 }}>결제 후 꿈해몽 24시간 이용권이 즉시 적용돼요.</p>
      </div>
    </div>
  );
}
