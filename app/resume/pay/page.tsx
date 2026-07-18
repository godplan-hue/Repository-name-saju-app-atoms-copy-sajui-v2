"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ResumePayPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#030014" }} />}>
      <PayInner />
    </Suspense>
  );
}

function PayInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const AMOUNT = 990;
  const PLAN_LABEL = "합격 전략 분석";

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

  const formatCardNo = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 19);
    return d.match(/.{1,4}/g)?.join(" ") ?? d;
  };

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
        if (d.maxAmount && AMOUNT > d.maxAmount) { setError(`이 쿠폰은 ₩${d.maxAmount.toLocaleString()} 이하 상품에만 사용 가능해요.`); setCouponData(null); }
        else { setCouponData(d); setError(""); }
      } else { setError("유효하지 않은 쿠폰이에요."); setCouponData(null); }
    } catch { setError("쿠폰 확인 중 오류가 발생했어요."); }
    finally { setCouponLoading(false); }
  };

  const pay = async () => {
    const finalAmount = couponData ? Math.round(AMOUNT * (1 - couponData.discountPercent / 100)) : AMOUNT;
    if (couponData && (finalAmount === 0 || couponData.fullAccess)) {
      setLoading(true);
      try {
        const _ph = mobile.replace(/\D/g,"");
        fetch("/api/v2/save-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:`resume_${Date.now()}`,phone:_ph||"",name:name.trim()||"",amount:0,category:"합격자소서 쿠폰",source:"resume"})}).catch(()=>{});
        fetch("/api/promo-codes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:coupon.trim().toUpperCase()})}).catch(()=>{});
        if (id) fetch("/api/resume/analyze",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}).catch(()=>{});
        window.location.href = id ? `/resume/result/${id}?paid=1` : "/resume/start";
      } finally { setLoading(false); }
      return;
    }
    const clean = cardNo.replace(/\s/g, "");
    if (clean.length < 14) { setError("카드번호를 확인해주세요."); return; }
    if (!expM || !expY) { setError("유효기간을 입력해주세요."); return; }
    if (birth.length !== 6) { setError("생년월일 앞 6자리(YYMMDD)를 입력해주세요."); return; }
    if (pw.length !== 2) { setError("카드 비밀번호 앞 2자리를 입력해주세요."); return; }
    if (!name.trim()) { setError("이름을 입력해주세요."); return; }
    if (mobile.replace(/\D/g, "").length < 10) { setError("다른 기기에서도 이용하시려면 휴대폰 번호를 입력해주세요."); return; }
    if (!id) { setError("분석 ID가 없습니다. 다시 분석해주세요."); return; }
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
          amount: finalAmount,
          itemName: "점운 합격자소서 분석 1회",
          userName: name.trim(),
          mobileNumber: mobile.replace(/\D/g, ""),
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (coupon && couponData) fetch("/api/promo-codes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:coupon.trim().toUpperCase()})}).catch(()=>{});
        if (name.trim()) {
          fetch("/api/v2/save-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: `resume_${Date.now()}`,
              phone: mobile.replace(/\D/g, "") || "",
              name: name.trim(),
              amount: finalAmount,
              category: "합격자소서 1회권",
              source: "resume",
            }),
          }).catch(() => {});
        }
        if (id) {
          fetch("/api/resume/analyze", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }).catch(() => {});
          window.location.href = `/resume/result/${id}?paid=1`;
        } else {
          window.location.href = "/resume/start";
        }
      } else {
        setError(data.message || data.error || "결제에 실패했습니다. 카드 정보를 확인해주세요.");
      }
    } catch {
      setError("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#030014", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "32px 16px 60px" },
    label: { fontSize: 12, color: "#9ca3af", marginBottom: 6, display: "block" as const },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const },
    row: { marginBottom: 16 },
  };

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <a href={id ? `/resume/result/${id}` : "/resume"} style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>← 돌아가기</a>
          <span style={{ fontSize: 13, color: "#6b7280" }}>합격 전략 분석</span>
        </div>

        {/* 상품 안내 */}
        <div style={{ background: "linear-gradient(135deg,#1a1a2e,#2d1b69)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 18, padding: "20px 18px", marginBottom: 24, textAlign: "center" }}>
          <p style={{ fontSize: 20, margin: "0 0 4px" }}>🎓</p>
          <p style={{ fontSize: 16, fontWeight: 900, color: "white", margin: "0 0 6px" }}>합격자소서 {PLAN_LABEL}</p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 6px", lineHeight: 1.6 }}>
            오행 기질 · 직무 키워드 5개 · 기업별 전략<br />
            면접 예상 질문 TOP 5 · 합격 에너지 분석
          </p>
          <p style={{ fontSize: 12, color: "#a78bfa", margin: "0 0 14px" }}>결제 후 바로 이름·직무 입력 → 분석 즉시 공개</p>
          <p style={{ fontSize: 28, fontWeight: 900, color: "white", margin: 0 }}>
            ₩{AMOUNT.toLocaleString()}
          </p>
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
          {couponData && <p style={{ fontSize:12, color:"#4ade80", marginTop:8, marginBottom:0 }}>✅ {(Math.round(AMOUNT*(1-couponData.discountPercent/100))===0||couponData.fullAccess)?"무료 이용권 — 카드 없이 바로 이용 가능!":`${couponData.discountPercent}% 할인 → ₩${Math.round(AMOUNT*(1-couponData.discountPercent/100)).toLocaleString()}`}</p>}
        </div>

        {/* 카드 정보 입력 */}
        {!(couponData && (Math.round(AMOUNT*(1-couponData.discountPercent/100))===0||couponData.fullAccess)) && (
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "20px 18px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#a78bfa", margin: "0 0 16px" }}>💳 카드 정보 입력</p>

          <div style={S.row}>
            <label style={S.label}>카드번호</label>
            <input style={S.input} placeholder="0000 0000 0000 0000" value={cardNo}
              onChange={e => setCardNo(formatCardNo(e.target.value))} inputMode="numeric" />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>유효기간 월 (MM)</label>
              <input style={S.input} placeholder="MM" maxLength={2} value={expM}
                onChange={e => setExpM(e.target.value.replace(/\D/g, "").slice(0, 2))} inputMode="numeric" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>유효기간 년 (YY)</label>
              <input style={S.input} placeholder="YY" maxLength={2} value={expY}
                onChange={e => setExpY(e.target.value.replace(/\D/g, "").slice(0, 2))} inputMode="numeric" />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>생년월일 앞 6자리</label>
              <input style={S.input} placeholder="YYMMDD" maxLength={6} value={birth}
                onChange={e => setBirth(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>카드 비밀번호 앞 2자리</label>
              <input style={S.input} placeholder="••" maxLength={2} type="password" value={pw}
                onChange={e => setPw(e.target.value.replace(/\D/g, "").slice(0, 2))} inputMode="numeric" />
            </div>
          </div>

          <div style={S.row}>
            <label style={S.label}>이름</label>
            <input style={S.input} placeholder="홍길동" value={name}
              onChange={e => setName(e.target.value)} />
          </div>

          <div style={S.row}>
            <label style={S.label}>휴대폰 번호 ★ 필수</label>
            <input style={S.input} placeholder="01012345678" value={mobile}
              onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 11))} inputMode="numeric" />
          </div>
        </div>
        )}

        {error && (
          <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>
        )}

        <button
          onClick={pay}
          disabled={loading}
          style={{ width: "100%", background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", border: "none", borderRadius: 22, padding: "16px", fontSize: 16, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", marginBottom: 12 }}
        >
          {loading?"처리 중...":(couponData&&(Math.round(AMOUNT*(1-couponData.discountPercent/100))===0||couponData.fullAccess))?"🎟 무료로 이용하기":couponData?`₩${Math.round(AMOUNT*(1-couponData.discountPercent/100)).toLocaleString()} 결제하기`:`₩${AMOUNT.toLocaleString()} 결제하기`}
        </button>

        <p style={{ fontSize: 11, color: "#6b7280", textAlign: "center", lineHeight: 1.6 }}>
          결제 후 바로 전체 분석 결과를 보실 수 있어요.<br />
          카드 정보는 결제 후 저장되지 않습니다.
        </p>
      </div>
    </div>
  );
}
