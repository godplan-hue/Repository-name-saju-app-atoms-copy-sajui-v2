"use client";
import { useState } from "react";

const AMOUNT = 4900;

const PASS_APPS = [
  { emoji: "🌙", label: "꿈해몽", key: "haemong_unlock_until" },
  { emoji: "📔", label: "감정일기", key: "gamjung_unlock_until" },
  { emoji: "🥗", label: "다이어트", key: "diet_unlock_until" },
  { emoji: "💰", label: "가계부", key: "budget_unlock_until" },
  { emoji: "🃏", label: "타로", key: "tarot_unlock_until" },
  { emoji: "🐾", label: "펫운", key: "petun_unlock_until" },
  { emoji: "👶", label: "맘케어", key: "momcare_unlock_until" },
];

export default function PassPage() {
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
        body: JSON.stringify({ cardNo: clean, expireMonth: expM.padStart(2,"0"), expireYear: expY.slice(-2), birthday: birth, cardPw: pw, amount: AMOUNT, itemName: "점운 풀패스 7개앱 30일권", userName: name.trim(), mobileNumber: mobile.replace(/\D/g,"") }),
      });
      const data = await res.json();
      if (data.success) {
        const _ph = mobile.replace(/\D/g,"");
        const _baseUntil = Date.now() + 30*24*60*60*1000;
        const _unlocks: Record<string, number> = {};
        // 새 브라우저에서도 기존 기간이 정확히 연장되도록 Firebase에서 먼저 확인
        let _fbUnlocks: Record<string, number> = {};
        try {
          if (_ph) {
            const _fbRes = await fetch(`/api/phone-unlock?phone=${_ph}`);
            const _fbData = await _fbRes.json();
            if (_fbData.ok) _fbUnlocks = _fbData.unlocks || {};
          }
        } catch {}
        PASS_APPS.forEach(app => {
          try {
            const _local = Number(localStorage.getItem(app.key)||0);
            const _fb = Number(_fbUnlocks[app.key]||0);
            const p = Math.max(_local, _fb);
            const u = p>Date.now()?p+30*24*60*60*1000:_baseUntil;
            localStorage.setItem(app.key, String(u));
            _unlocks[app.key] = u;
          } catch {}
        });
        if (_ph) fetch("/api/phone-unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:_ph,unlocks:_unlocks})}).catch(()=>{});
        fetch("/api/v2/save-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: `pass_${Date.now()}`, phone: _ph||"", name: name.trim(), amount: AMOUNT, category: "풀패스 7개앱 30일권", source: "pass" }) }).catch(()=>{});
        window.location.href = "/apps";
      } else {
        setError(data.message || data.error || "결제에 실패했습니다. 카드 정보를 확인해주세요.");
      }
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
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>7개 앱 전체를 30일 동안<br />마음껏 이용하세요</div>
        </div>

        {/* 가격 카드 */}
        <div style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius:20, padding:"24px 20px", textAlign:"center", marginBottom:24, boxShadow:"0 8px 32px rgba(124,58,237,0.4)" }}>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", marginBottom:4 }}>30일 이용권</div>
          <div style={{ fontSize:42, fontWeight:900, color:"#fff", marginBottom:2 }}>₩4,900</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginBottom:20 }}>7개 앱 전체 · 30일 무제한</div>
          {!showForm && (
            <button onClick={()=>setShowForm(true)} style={{ width:"100%", padding:"16px 0", background:"#fff", color:"#7c3aed", fontSize:16, fontWeight:900, borderRadius:14, border:"none", cursor:"pointer" }}>
              30일 이용권 구매하기
            </button>
          )}
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginTop:12 }}>자동갱신 없음 · 일회성 결제</div>
        </div>

        {/* 카드 결제 폼 */}
        {showForm && (
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
            {error && <p style={{ color:"#f87171", fontSize:13, textAlign:"center", marginBottom:12 }}>{error}</p>}
            <button onClick={pay} disabled={loading} style={{ width:"100%", background:loading?"rgba(124,58,237,0.5)":"linear-gradient(135deg,#7c3aed,#a855f7)", color:"white", border:"none", borderRadius:22, padding:"16px", fontSize:16, fontWeight:900, cursor:loading?"not-allowed":"pointer", marginBottom:8 }}>
              {loading ? "결제 처리 중..." : "₩4,900 결제하기 (7개앱 30일)"}
            </button>
            <button onClick={()=>setShowForm(false)} style={{ width:"100%", background:"transparent", color:"rgba(255,255,255,0.4)", border:"none", fontSize:13, cursor:"pointer", padding:"8px" }}>취소</button>
          </div>
        )}

        {/* 꼭 확인하세요 */}
        <div style={{ marginBottom:16, padding:"12px 14px", background:"rgba(251,191,36,0.08)", borderRadius:12, border:"1px solid rgba(251,191,36,0.3)" }}>
          <p style={{ margin:"0 0 6px", fontSize:12, fontWeight:900, color:"#fbbf24" }}>⚠️ 꼭 확인하세요</p>
          <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.9 }}>
            · 전화번호를 입력하시면 PC·모바일 어떤 기기에서도 이용 가능해요.<br />
            (앱 목록 /apps → 이용권 불러오기)<br />
            · 이미 이용 중인 앱이 있다면 남은 기간에 30일이 자동으로 추가 연장돼요.<br />
            · 디지털 콘텐츠 특성상 환불이 불가합니다.
          </p>
        </div>

        {/* 포함 앱 목록 */}
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:18, padding:"4px 0", marginBottom:20, border:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textAlign:"center", padding:"14px 0 8px", fontWeight:700, letterSpacing:1 }}>포함된 앱 7가지</div>
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
