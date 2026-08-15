"use client";
import { useState, useEffect } from "react";

const AMOUNT = 5900;

const PASS_APPS = [
  { emoji: "📔", label: "감정일기", key: "gamjung_unlock_until", diary: true },
  { emoji: "🥗", label: "다이어트", key: "diet_unlock_until", diary: true },
  { emoji: "💰", label: "가계부", key: "budget_unlock_until", diary: true },
  { emoji: "👶", label: "육아일기", key: "momcare_unlock_until", diary: true },
];

export default function PassPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [refundAgreed, setRefundAgreed] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  const fmt = (v: string) => { const d = v.replace(/\D/g,"").slice(0,19); return d.match(/.{1,4}/g)?.join(" ")??d; };

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

  const unlockApps = async (phone: string) => {
    let fbUnlocks: Record<string,number> = {};
    try {
      if (phone) {
        const r = await fetch(`/api/phone-unlock?phone=${phone}`);
        const d = await r.json();
        if (d.ok) fbUnlocks = d.unlocks || {};
      }
    } catch {}
    const unlocks: Record<string,number> = {};
    PASS_APPS.forEach(app => {
      try {
        const local = Number(localStorage.getItem(app.key) || 0);
        const prev = Math.max(local, Number(fbUnlocks[app.key] || 0));
        const until = (prev > Date.now() ? prev : Date.now()) + 30*24*60*60*1000;
        localStorage.setItem(app.key, String(until));
        unlocks[app.key] = until;
      } catch {}
    });
    if (phone) fetch("/api/phone-unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone,unlocks})}).catch(()=>{});
    return unlocks;
  };

  const payFree = async () => {
    const ph = mobile.replace(/\D/g,"");
    if (ph.length < 10) { setError("휴대폰 번호를 입력해주세요."); return; }
    setLoading(true);
    try {
      await unlockApps(ph);
      fetch("/api/v2/save-payment",{method:"POST",headers:{"Content-Type":"application/json"},keepalive:true,body:JSON.stringify({id:`pass_${Date.now()}`,phone:ph,name:name.trim()||"",amount:0,category:"풀패스 쿠폰",source:"pass"})}).catch(()=>{});
      fetch("/api/promo-codes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:coupon.trim().toUpperCase()})}).catch(()=>{});
      await fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ph,amount:0,link:"https://jeomun.com/apps"})}).catch(()=>{});
      window.location.href = "/apps";
    } finally { setLoading(false); }
  };

  // 모바일 결제(카카오페이/카드)는 PG사 인증 후 이 페이지로 "새로 돌아오는" 방식이라
  // requestPayment()가 프로미스로 끝나지 않는 경우가 많음 — 결제 시작 전에 정보를
  // sessionStorage에 저장해두고, 돌아왔을 때 그 정보로 완료 처리를 이어감
  const finalizeSuccess = async (info: { mobile: string; name: string; amount: number; coupon: string; hasCoupon: boolean }) => {
    const cleanMobile = info.mobile.replace(/\D/g,"");
    if (info.coupon && info.hasCoupon) fetch("/api/promo-codes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:info.coupon.trim().toUpperCase()})}).catch(()=>{});
    await unlockApps(cleanMobile);
    fetch("/api/v2/save-payment",{method:"POST",headers:{"Content-Type":"application/json"},keepalive:true,body:JSON.stringify({id:`pass_${Date.now()}`,phone:cleanMobile,name:info.name.trim()||"",amount:info.amount,category:"풀패스 4개앱 30일권",source:"pass"})}).catch(()=>{});
    await fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:cleanMobile,amount:info.amount,link:"https://jeomun.com/apps"})}).catch(()=>{});
    window.location.href = "/apps";
  };

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
  }, []);

  // 토스페이먼츠 통합결제(카드+간편결제) successUrl/failUrl로 되돌아온 경우 감지 → 결제완료 처리 이어서 진행
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
    const pendingRaw = sessionStorage.getItem("pay_pending") || localStorage.getItem("pay_pending");
    let info: any = null;
    try { info = pendingRaw ? JSON.parse(pendingRaw) : null; } catch {}
    (async () => {
      try {
        const res = await fetch("/api/toss/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount: tossAmount }),
        });
        const data = await res.json();
        sessionStorage.removeItem("pay_pending");
        try { localStorage.removeItem("pay_pending"); } catch {}
        if (!res.ok || !data.ok) {
          setError(data.message || "결제 승인에 실패했어요. 다시 시도해주세요.");
          return;
        }
        const finalInfo = info || { mobile, name, amount: finalAmount, coupon, hasCoupon: !!couponData };
        finalizeSuccess(finalInfo);
      } catch {
        setError("결제 승인 처리 중 오류가 발생했어요. 다시 시도해주세요.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 토스페이먼츠 통합결제(카드+간편결제) — jeomun72su 직계약 MID
  const payToss = async () => {
    if (!refundAgreed) { setShowRefund(true); setError("결제 전 확인사항을 먼저 확인해주세요."); return; }
    const cleanMobile = mobile.replace(/\D/g,"");
    if (cleanMobile.length < 10) { setError("휴대폰 번호를 입력해주세요."); return; }
    if (isFree) { await payFree(); return; }
    setLoading(true); setError("");
    try {
      const { loadTossPayments, ANONYMOUS } = await import("@tosspayments/tosspayments-sdk");
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string;
      if (!clientKey) throw new Error("클라이언트 키가 설정되지 않았어요 (NEXT_PUBLIC_TOSS_CLIENT_KEY 없음)");
      const orderId = `jeomun-toss-pass-${Date.now()}`;
      const pendingInfo = { mobile: cleanMobile, name, amount: finalAmount, coupon, hasCoupon: !!couponData };
      try { sessionStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); localStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); } catch {}

      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: finalAmount },
        orderId,
        orderName: "점운 풀패스 4개앱 30일권",
        successUrl: `${window.location.origin}${window.location.pathname}`,
        failUrl: `${window.location.origin}${window.location.pathname}?tossFail=1`,
        customerName: name.trim() || "고객",
        customerMobilePhone: cleanMobile,
      });
      // 성공/실패 모두 successUrl·failUrl로 페이지가 이동하므로 여기 도달하지 않음
    } catch (err: any) {
      setError(`토스 오류: ${err?.message || err?.code || String(err)}`);
      try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {}
    } finally {
      setLoading(false);
    }
  };

  const pay = async (method: "CARD" | "KAKAOPAY" = "CARD") => {
    if (!refundAgreed) { setShowRefund(true); setError("결제 전 확인사항을 먼저 확인해주세요."); return; }
    const cleanMobile = mobile.replace(/\D/g,"");
    if (cleanMobile.length < 10) { setError("휴대폰 번호를 입력해주세요."); return; }
    if (isFree) { await payFree(); return; }
    setLoading(true); setError("");
    try {
      const channelKey = method === "KAKAOPAY"
        ? "channel-key-b474ece1-40a8-4a8a-bc24-469e6dbf0948"
        : "channel-key-e3b35730-62df-4314-a2c9-afd813698cd7";
      const portone = await import("@portone/browser-sdk/v2");
      const pendingInfo = { mobile: cleanMobile, name, amount: finalAmount, coupon, hasCoupon: !!couponData };
      // 모바일 리디렉션 방식은 이 페이지가 새로 로드되며 돌아오므로, 완료 처리에
      // 필요한 정보를 미리 저장해둠 (redirectUrl로 돌아왔을 때 위 useEffect가 사용)
      try { sessionStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); localStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); } catch {}
      const res = await portone.requestPayment({
        storeId: "store-446686e2-22bd-4941-ae2a-83e7f3a15d87",
        channelKey,
        paymentId: `pass_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        orderName: "점운 일기류 4개앱 30일 풀패스",
        totalAmount: finalAmount,
        currency: "KRW",
        payMethod: method === "KAKAOPAY" ? "EASY_PAY" : "CARD",
        ...(method === "KAKAOPAY" ? { easyPay: { easyPayProvider: "KAKAOPAY" } } : {}),
        windowType: { mobile: "REDIRECTION" },
        customer: { fullName: name.trim() || "고객", phoneNumber: cleanMobile },
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
      // 결제 성공
      await finalizeSuccess(pendingInfo);
    } catch { setError("결제 처리 중 오류가 발생했습니다."); }
    finally { setLoading(false); }
  };

  const S = {
    label: { fontSize:12, color:"#9ca3af", marginBottom:6, display:"block" as const },
    input: { width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"13px 14px", color:"white", fontSize:15, outline:"none", boxSizing:"border-box" as const },
    row: { marginBottom:16 },
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0f0520 0%,#1e1040 50%,#0a0818 100%)", padding:"28px 16px 60px" }}>
      <div style={{ maxWidth:440, margin:"0 auto" }}>

        <a href="/main-v2" style={{ fontSize:12, color:"rgba(255,255,255,0.45)", textDecoration:"none", display:"block", marginBottom:20 }}>← 메인으로</a>

        {/* 헤더 */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:10 }}>✨</div>
          <div style={{ fontSize:24, fontWeight:900, color:"#fff", marginBottom:6 }}>점운 풀패스</div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>일기류 4개 앱을 30일 동안<br />마음껏 이용하세요</div>
        </div>

        {/* 가격 카드 */}
        <div style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius:20, padding:"24px 20px", textAlign:"center", marginBottom:24, boxShadow:"0 8px 32px rgba(124,58,237,0.4)" }}>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", marginBottom:4 }}>30일 이용권</div>
          <div style={{ fontSize:42, fontWeight:900, color:"#fff", marginBottom:2 }}>
            {couponData && finalAmount < AMOUNT ? (
              <><span style={{ textDecoration:"line-through", fontSize:24, opacity:0.5 }}>₩{AMOUNT.toLocaleString()}</span> ₩{finalAmount.toLocaleString()}</>
            ) : `₩${AMOUNT.toLocaleString()}`}
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginBottom:8 }}>4개 앱 전체 · 30일 무제한</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>자동갱신 없음 · 일회성 결제</div>
        </div>

        {/* 쿠폰 */}
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

        {/* 이름/전화번호 */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:18, padding:"20px 18px", marginBottom:16 }}>
          <div style={S.row}><label style={S.label}>이름 (선택)</label><input style={S.input} placeholder="홍길동" value={name} onChange={e=>setName(e.target.value)} /></div>
          <div><label style={S.label}>휴대폰 번호 ★ 필수</label><input style={S.input} placeholder="01012345678" value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,"").slice(0,11))} inputMode="numeric" /></div>
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
        {error && <p style={{ color:"#f87171", fontSize:13, textAlign:"center", marginBottom:12 }}>{error}</p>}

        {/* 결제 버튼 */}
        {isFree ? (
          <button onClick={()=>pay()} disabled={loading} style={{ width:"100%", background:loading?"rgba(124,58,237,0.5)":"linear-gradient(135deg,#7c3aed,#a855f7)", color:"white", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:loading?"not-allowed":"pointer", marginBottom:10 }}>
            {loading?"처리 중...":"🎟 무료로 이용하기"}
          </button>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            <button onClick={()=>pay("CARD")} disabled={loading||!refundAgreed} style={{ width:"100%", background:(loading||!refundAgreed)?"rgba(124,58,237,0.5)":"linear-gradient(135deg,#7c3aed,#a855f7)", color:"white", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:(loading||!refundAgreed)?"not-allowed":"pointer" }}>
              {loading?"결제 처리 중...":"💳 신용카드로 결제"}
            </button>
            <button onClick={()=>pay("KAKAOPAY")} disabled={loading||!refundAgreed} style={{ width:"100%", background:(loading||!refundAgreed)?"#bba000":"#FEE500", color:(loading||!refundAgreed)?"rgba(0,0,0,0.4)":"#3C1E1E", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:(loading||!refundAgreed)?"not-allowed":"pointer" }}>
              💛 카카오페이로 결제
            </button>
            <button onClick={payToss} disabled={loading||!refundAgreed} style={{ width:"100%", background:(loading||!refundAgreed)?"rgba(0,100,255,0.3)":"#0064FF", color:"#fff", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:(loading||!refundAgreed)?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              {loading?"결제 중...":`토스로 결제 ₩${finalAmount.toLocaleString()}`}
            </button>
          </div>
        )}

        {/* 꼭 확인하세요 */}
        <div style={{ marginBottom:16, padding:"12px 14px", background:"rgba(251,191,36,0.08)", borderRadius:12, border:"1px solid rgba(251,191,36,0.3)" }}>
          <p style={{ margin:"0 0 6px", fontSize:12, fontWeight:900, color:"#fbbf24" }}>⚠️ 꼭 확인하세요</p>
          <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.9 }}>
            · 인앱브라우저(카카오톡 등)에서는 PC 기기에서 결제가 안 될 수 있어요.<br />
            (앱 목록 /apps → 이용권 불러오기)<br />
            · 이미 이용 중인 앱이 있다면 남은 기간에 30일이 자동으로 추가 연장돼요.
          </p>
        </div>

        {/* 포함 앱 목록 */}
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:18, padding:"4px 0", marginBottom:20, border:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textAlign:"center", padding:"14px 0 8px", fontWeight:700, letterSpacing:1 }}>포함된 앱 4가지</div>
          {PASS_APPS.map((app, i) => (
            <div key={app.key} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderTop:i===0?"none":"1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize:28, flexShrink:0 }}>{app.emoji}</span>
              <div style={{ flex:1, fontSize:15, fontWeight:800, color:"#fff" }}>{app.label}</div>
              <span style={{ fontSize:10, color:"#a78bfa", fontWeight:700, background:"rgba(124,58,237,0.2)", padding:"3px 8px", borderRadius:20, flexShrink:0 }}>30일</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.3)", lineHeight:1.8 }}>
          자동갱신 없는 1회 결제 상품이에요<br />
          사주 990원 결제와 별도 상품이에요<br />
          문의: 카카오톡 채널 @점운
        </div>

      </div>
    </div>
  );
}
