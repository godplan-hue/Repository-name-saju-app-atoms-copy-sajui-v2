"use client";
import { useState } from "react";

const AMOUNT = 990;

export default function GamjungPayPage() {
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

  const fmt = (v: string) => { const d = v.replace(/\D/g,"").slice(0,19); return d.match(/.{1,4}/g)?.join(" ")??d; };

  const pay = async () => {
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
        body: JSON.stringify({ cardNo: clean, expireMonth: expM.padStart(2,"0"), expireYear: expY.slice(-2), birthday: birth, cardPw: pw, amount: AMOUNT, itemName: "점운 감정일기 30일권", userName: name.trim(), mobileNumber: mobile.replace(/\D/g,"") }),
      });
      const data = await res.json();
      if (data.success) {
        try { const p = Number(localStorage.getItem("gamjung_unlock_until")||0); localStorage.setItem("gamjung_unlock_until", String((p>Date.now()?p:Date.now())+30*24*60*60*1000)); } catch {}
        fetch("/api/v2/save-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: `gamjung_${Date.now()}`, phone: mobile.replace(/\D/g,"")||"", name: name.trim(), amount: AMOUNT, category: "감정일기 30일권", source: "gamjung" }) }).catch(()=>{});
        window.location.href = "/gamjung";
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

  if (!showForm) {
    return (
      <div style={S.wrap}>
        <div style={S.inner}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
            <a href="/gamjung" style={{ color:"#a78bfa", fontSize:13, textDecoration:"none" }}>← 돌아가기</a>
            <span style={{ fontSize:13, color:"#6b7280" }}>이용권 선택</span>
          </div>
          <p style={{ textAlign:"center", fontSize:18, fontWeight:900, color:"white", margin:"0 0 6px" }}>이용권을 선택해 주세요</p>
          <p style={{ textAlign:"center", fontSize:13, color:"#9ca3af", margin:"0 0 24px" }}>감정일기 단독권 또는 7개앱 풀패스</p>
          <div onClick={()=>setShowForm(true)} style={{ cursor:"pointer", border:"1px solid rgba(255,255,255,0.18)", borderRadius:18, padding:"20px 18px", marginBottom:14, background:"rgba(255,255,255,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:20, fontWeight:900, color:"white" }}>₩990</span>
              <span style={{ fontSize:12, color:"#9ca3af" }}>이 앱만 30일</span>
            </div>
            <p style={{ fontSize:14, color:"#d1d5db", margin:0 }}>📔 감정일기 30일권</p>
            <p style={{ fontSize:12, color:"#6b7280", margin:"4px 0 0" }}>결제 완료 후 감정일기 30일 이용 가능</p>
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
          <p style={{ fontSize:11, color:"#6b7280", textAlign:"center" }}>990원 이용권은 감정일기 앱 하나만 30일 이용 가능합니다.</p>
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
        <div style={{ background:"linear-gradient(135deg,#1a1a2e,#2d1b69)", border:"1px solid rgba(124,58,237,0.4)", borderRadius:18, padding:"20px 18px", marginBottom:24, textAlign:"center" }}>
          <p style={{ fontSize:24, margin:"0 0 4px" }}>📔</p>
          <p style={{ fontSize:16, fontWeight:900, color:"white", margin:"0 0 6px" }}>점운 감정일기</p>
          <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 14px", lineHeight:1.6 }}>감정 기록 · 오행 감정 흐름 분석<br />30일 동안 마음껏 이용</p>
          <p style={{ fontSize:28, fontWeight:900, color:"white", margin:0 }}>₩{AMOUNT.toLocaleString()}</p>
        </div>
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
          <div style={S.row}><label style={S.label}>휴대폰 번호 (선택)</label><input style={S.input} placeholder="01012345678" value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,"").slice(0,11))} inputMode="numeric" /></div>
        </div>
        {error && <p style={{ color:"#f87171", fontSize:13, textAlign:"center", marginBottom:12 }}>{error}</p>}
        <button onClick={pay} disabled={loading} style={{ width:"100%", background:loading?"rgba(124,58,237,0.5)":"linear-gradient(135deg,#7c3aed,#ec4899)", color:"white", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:loading?"not-allowed":"pointer", marginBottom:12 }}>
          {loading ? "결제 처리 중..." : `₩${AMOUNT.toLocaleString()} 결제하기`}
        </button>
        <div style={{ marginBottom:16, padding:"12px 14px", background:"rgba(251,191,36,0.08)", borderRadius:12, border:"1px solid rgba(251,191,36,0.3)" }}>
          <p style={{ margin:"0 0 6px", fontSize:12, fontWeight:900, color:"#fbbf24" }}>⚠️ 꼭 확인하세요</p>
          <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.7 }}>
            결제 후 결과지·보관함은<br />
            결제하신 앱(브라우저)에서만 확인 가능해요.<br />
            · 카카오톡에서 결제하셨다면 카카오톡 안에서,<br />
            크롬에서 결제하셨다면 크롬에서 확인하세요.<br />
            · 디지털 콘텐츠 특성상 결과지 열람 후<br />
            환불이 불가합니다.
          </p>
        </div>
        <p style={{ fontSize:11, color:"#6b7280", textAlign:"center", lineHeight:1.6 }}>결제 후 감정일기 30일 이용권이 즉시 적용돼요.<br />카드 정보는 결제 후 저장되지 않습니다.</p>
      </div>
    </div>
  );
}
