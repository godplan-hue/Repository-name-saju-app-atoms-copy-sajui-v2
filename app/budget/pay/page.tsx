"use client";
import { useState, useEffect } from "react";

const AMOUNT = 990;

export default function BudgetPayPage() {
  const [showForm, setShowForm] = useState(false);
  const [cardNo, setCardNo] = useState("");
  const [expM, setExpM] = useState("");
  const [expY, setExpY] = useState("");
  const [birth, setBirth] = useState("");
  const [pw, setPw] = useState("");
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
        if (d.maxAmount && 990 > d.maxAmount) { setError(`이 쿠폰은 ₩${d.maxAmount.toLocaleString()} 이하 상품에만 사용 가능해요.`); setCouponData(null); }
        else { setCouponData(d); setError(""); }
      } else { setError("유효하지 않은 쿠폰이에요."); setCouponData(null); }
    } catch { setError("쿠폰 확인 중 오류가 발생했어요."); }
    finally { setCouponLoading(false); }
  };

  const pay = async () => {
    if (!refundAgreed) { setShowRefund(true); setError("결제 전 확인사항을 먼저 확인해주세요."); return; }
    if (mobile.replace(/\D/g,"").length < 10) { setError("다른 기기에서도 이용하시려면 휴대폰 번호를 입력해주세요."); return; }
    const finalAmount = couponData ? Math.round(AMOUNT * (1 - couponData.discountPercent / 100)) : AMOUNT;
    if (couponData && (finalAmount === 0 || couponData.fullAccess)) {
      setLoading(true);
      try {
        const _ph = mobile.replace(/\D/g,"");
        const _until = Date.now()+30*24*60*60*1000;
        const _unlocks: Record<string,number> = couponData.fullAccess
          ? {haemong_unlock_until:_until,gamjung_unlock_until:_until,budget_unlock_until:_until,tarot_unlock_until:_until,petun_unlock_until:_until,diet_unlock_until:_until,momcare_unlock_until:_until}
          : {budget_unlock_until:_until};
        Object.entries(_unlocks).forEach(([k,v])=>{try{localStorage.setItem(k,String(v));}catch{}});
        if(_ph) fetch("/api/phone-unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:_ph,unlocks:_unlocks})}).catch(()=>{});
        fetch("/api/v2/save-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:`budget_${Date.now()}`,phone:_ph||"",name:name.trim()||"",amount:0,category:"가계부 쿠폰",source:"budget"})}).catch(()=>{});
        fetch("/api/promo-codes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:coupon.trim().toUpperCase()})}).catch(()=>{});
        window.location.href = "/budget";
      } finally { setLoading(false); }
      return;
    }
    const clean = cardNo.replace(/\s/g,"");
    if (clean.length < 14) { setError("카드번호를 확인해주세요."); return; }
    if (!expM || !expY) { setError("유효기간을 입력해주세요."); return; }
    if (birth.length !== 6) { setError("생년월일 앞 6자리(YYMMDD)를 입력해주세요."); return; }
    if (pw.length !== 2) { setError("카드 비밀번호 앞 2자리를 입력해주세요."); return; }
    if (!name.trim()) { setError("이름을 입력해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/payup/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNo: clean, expireMonth: expM.padStart(2,"0"), expireYear: expY.slice(-2), birthday: birth, cardPw: pw, amount: finalAmount, itemName: "점운 가계부 30일권", userName: name.trim(), mobileNumber: mobile.replace(/\D/g,"") }),
      });
      const data = await res.json();
      if (data.success) {
        if (coupon && couponData) fetch("/api/promo-codes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:coupon.trim().toUpperCase()})}).catch(()=>{});
        const _ph = mobile.replace(/\D/g,"");
        let _fbUntil = 0;
        if (_ph) { try { const _r = await fetch(`/api/phone-unlock?phone=${_ph}`); const _d = await _r.json(); if (_d.ok) _fbUntil = Number(_d.unlocks?.budget_unlock_until||0); } catch {} }
        const _local = Number(localStorage.getItem("budget_unlock_until")||0);
        const _p = Math.max(_local, _fbUntil);
        const _until = (_p>Date.now()?_p:Date.now())+30*24*60*60*1000;
        try { localStorage.setItem("budget_unlock_until", String(_until)); } catch {}
        if (_ph) fetch("/api/phone-unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:_ph,unlocks:{budget_unlock_until:_until}})}).catch(()=>{});
        fetch("/api/v2/save-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: `budget_${Date.now()}`, phone: _ph||"", name: name.trim(), amount: finalAmount, category: "가계부 30일권", source: "budget" }) }).catch(()=>{});
        window.location.href = "/budget";
      } else {
        setError(data.message || data.error || "결제에 실패했습니다. 카드 정보를 확인해주세요.");
      }
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

  const isFree = couponData && (Math.round(AMOUNT*(1-couponData.discountPercent/100))===0 || couponData.fullAccess);

  if (!showForm) {
    return (
      <div style={S.wrap}>
        <div style={S.inner}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
            <a href="/budget" style={{ color:"#a78bfa", fontSize:13, textDecoration:"none" }}>← 돌아가기</a>
            <span style={{ fontSize:13, color:"#6b7280" }}>이용권 선택</span>
          </div>
          <p style={{ textAlign:"center", fontSize:18, fontWeight:900, color:"white", margin:"0 0 6px" }}>이용권을 선택해 주세요</p>
          <p style={{ textAlign:"center", fontSize:13, color:"#9ca3af", margin:"0 0 24px" }}>가계부 단독권 또는 7개앱 풀패스</p>
          <div onClick={()=>setShowForm(true)} style={{ cursor:"pointer", border:"1px solid rgba(255,255,255,0.18)", borderRadius:18, padding:"20px 18px", marginBottom:14, background:"rgba(255,255,255,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:20, fontWeight:900, color:"white" }}>₩990</span>
              <span style={{ fontSize:12, color:"#9ca3af" }}>이 앱만 30일</span>
            </div>
            <p style={{ fontSize:14, color:"#d1d5db", margin:0 }}>💰 가계부 30일권</p>
            <p style={{ fontSize:12, color:"#6b7280", margin:"4px 0 0" }}>결제 완료 후 가계부 30일 이용 가능</p>
          </div>
          <div onClick={()=>{ window.location.href="/pass"; }} style={{ cursor:"pointer", border:"2px solid #f59e0b", borderRadius:18, padding:"20px 18px", marginBottom:24, background:"rgba(245,158,11,0.06)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:20, fontWeight:900, color:"#fbbf24" }}>₩4,900</span>
              <span style={{ background:"linear-gradient(135deg,#f59e0b,#ef4444)", color:"white", fontSize:11, fontWeight:900, padding:"3px 10px", borderRadius:20 }}>🔥 추천</span>
            </div>
            <p style={{ fontSize:14, color:"#fcd34d", margin:"0 0 4px", fontWeight:700 }}>7개앱 30일 풀패스</p>
            <p style={{ fontSize:12, color:"#d97706", margin:0 }}>꿈해몽·감정일기·다이어트·가계부·타로·펫운·맘케어</p>
            <p style={{ fontSize:12, color:"#9ca3af", margin:"6px 0 0" }}>앱 하나 값으로 7개앱 전부 30일 이용</p>
          </div>
          <p style={{ fontSize:11, color:"#6b7280", textAlign:"center" }}>990원 이용권은 가계부 앱 하나만 30일 이용 가능합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <button onClick={()=>setShowForm(false)} style={{ background:"none", border:"none", color:"#a78bfa", fontSize:13, cursor:"pointer", padding:0 }}>← 이용권 선택으로</button>
          <span style={{ fontSize:13, color:"#6b7280" }}>가계부 30일 이용권</span>
        </div>
        <div style={{ background:"linear-gradient(135deg,#0c1a2e,#0c2340)", border:"1px solid rgba(3,105,161,0.4)", borderRadius:18, padding:"20px 18px", marginBottom:16, textAlign:"center" }}>
          <p style={{ fontSize:24, margin:"0 0 4px" }}>💰</p>
          <p style={{ fontSize:16, fontWeight:900, color:"white", margin:"0 0 6px" }}>점운 가계부</p>
          <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 14px", lineHeight:1.6 }}>일기식 지출·수입 기록 · 재물운 연결<br />30일 동안 마음껏 이용</p>
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
          {couponData && <p style={{ fontSize:12, color:"#4ade80", marginTop:8, marginBottom:0 }}>✅ {isFree?"무료 이용권 — 카드 없이 바로 이용 가능!":`${couponData.discountPercent}% 할인 → ₩${Math.round(AMOUNT*(1-couponData.discountPercent/100)).toLocaleString()}`}</p>}
        </div>

        {!isFree && (
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:18, padding:"20px 18px", marginBottom:16 }}>
            <p style={{ fontSize:13, fontWeight:900, color:"#a78bfa", margin:"0 0 16px" }}>💳 카드 정보 입력</p>
            <div style={S.row}><label style={S.label}>카드번호</label><input style={S.input} placeholder="0000 0000 0000 0000" value={cardNo} onChange={e=>setCardNo(fmt(e.target.value))} inputMode="numeric" /></div>
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              <div style={{ flex:1 }}><label style={S.label}>유효기간 월 (MM)</label><input style={S.input} placeholder="MM" maxLength={2} value={expM} onChange={e=>setExpM(e.target.value.replace(/\D/g,"").slice(0,2))} inputMode="numeric" /></div>
              <div style={{ flex:1 }}><label style={S.label}>유효기간 년 (YY)</label><input style={S.input} placeholder="YY" maxLength={2} value={expY} onChange={e=>setExpY(e.target.value.replace(/\D/g,"").slice(0,2))} inputMode="numeric" /></div>
            </div>
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              <div style={{ flex:1 }}><label style={S.label}>생년월일 앞 6자리</label><input style={S.input} placeholder="YYMMDD" maxLength={6} value={birth} onChange={e=>setBirth(e.target.value.replace(/\D/g,"").slice(0,6))} inputMode="numeric" /></div>
              <div style={{ flex:1 }}><label style={S.label}>카드 비밀번호 앞 2자리</label><input style={S.input} placeholder="••" maxLength={2} type="password" value={pw} onChange={e=>setPw(e.target.value.replace(/\D/g,"").slice(0,2))} inputMode="numeric" /></div>
            </div>
            <div style={S.row}><label style={S.label}>이름</label><input style={S.input} placeholder="홍길동" value={name} onChange={e=>setName(e.target.value)} /></div>
            <div style={S.row}><label style={S.label}>휴대폰 번호 ★ 필수</label><input style={S.input} placeholder="01012345678" value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,"").slice(0,11))} inputMode="numeric" /></div>
          </div>
        )}
        {isFree && (
          <div style={{ marginBottom:16 }}>
            <div style={S.row}><label style={S.label}>이름 (선택)</label><input style={S.input} placeholder="홍길동" value={name} onChange={e=>setName(e.target.value)} /></div>
            <div style={S.row}><label style={S.label}>휴대폰 번호 ★ 필수</label><input style={S.input} placeholder="01012345678" value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,"").slice(0,11))} inputMode="numeric" /></div>
          </div>
        )}
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
        <button onClick={pay} disabled={loading||!refundAgreed} style={{ width:"100%", background:(loading||!refundAgreed)?"rgba(3,105,161,0.5)":"linear-gradient(135deg,#0369a1,#0ea5e9)", color:"white", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:(loading||!refundAgreed)?"not-allowed":"pointer", marginBottom:12 }}>
          {loading?"처리 중...":isFree?"🎟 무료로 이용하기":couponData?`₩${Math.round(AMOUNT*(1-couponData.discountPercent/100)).toLocaleString()} 결제하기`:`₩${AMOUNT.toLocaleString()} 결제하기`}
        </button>
        <div style={{ marginBottom:16, padding:"12px 14px", background:"rgba(251,191,36,0.08)", borderRadius:12, border:"1px solid rgba(251,191,36,0.3)" }}>
          <p style={{ margin:"0 0 6px", fontSize:12, fontWeight:900, color:"#fbbf24" }}>⚠️ 꼭 확인하세요</p>
          <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.7 }}>
            · 전화번호를 입력하시면 PC·모바일 어떤 기기에서도 이용 가능해요.<br />
            (앱 목록 /apps → 이용권 불러오기)<br />
            · 이미 이용 중이라면 남은 기간에 자동으로 연장돼요.
          </p>
        </div>
        <p style={{ fontSize:11, color:"#6b7280", textAlign:"center", lineHeight:1.6 }}>결제 후 가계부 30일 이용권이 즉시 적용돼요.<br />카드 정보는 결제 후 저장되지 않습니다.</p>
      </div>
    </div>
  );
}
