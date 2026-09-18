"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ZODIAC_PREVIEW = ["🐭", "🐮", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐵", "🐔", "🐶", "🐷"];

function getTodayCount() {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
  const lcg = ((seed * 1664525 + 1013904223) & 0xffffffff) >>> 0;
  const base = 340 + (lcg % 180);
  const block = new Date().getHours() < 8 ? 0 : new Date().getHours() < 16 ? 1 : 2;
  return (base + (block >= 1 ? 260 + (lcg % 140) : 0) + (block >= 2 ? 300 + ((lcg >> 4) % 180) : 0)).toLocaleString();
}

export default function BokmunPage() {
  const count = getTodayCount();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hpField, setHpField] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
      const verifiedPhone = localStorage.getItem("v2_verified_phone");
      const phoneOk = !!verifiedPhone && (p.phone || "").replace(/[^0-9]/g, "") === verifiedPhone;
      if (phoneOk && p.name) setName(p.name);
      if (phoneOk && p.phone) setPhone(p.phone);
      if (phoneOk && p.email) setEmail(p.email);
    } catch {}
  }, []);

  const analyze = async () => {
    if (hpField) return;
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 입력해주세요."); return; }
    if (!birthYear || birthYear.length < 4) { setError("출생연도를 입력해주세요."); return; }
    if (!agreed) { setError("개인정보 수집 동의를 체크해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/bokmun/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone: cleanPhone, email,
          birthYear: Number(birthYear),
          birthMonth: birthMonth ? Number(birthMonth) : undefined,
          birthDay: birthDay ? Number(birthDay) : undefined,
          marketing: marketingAgreed,
          adSource: (() => { try { return localStorage.getItem("first_source") || ""; } catch { return ""; } })(),
        }),
      });
      const data = await res.json();
      if (data.id) {
        window.location.href = `/bokmun/result/${data.id}`;
      } else {
        setError("오류가 발생했습니다. 다시 시도해주세요.");
        setLoading(false);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#1a0a05", color: "#F5F1E8", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const },
    label: { fontSize: 12, color: "#d1a76a", marginBottom: 6, display: "block" as const },
    btn: { width: "100%", background: "linear-gradient(135deg,#dc2626,#991b1b)", color: "#fef3c7", border: "1px solid #fbbf24", borderRadius: 22, padding: "17px", fontSize: 17, fontWeight: 900, cursor: "pointer" },
  };

  if (loading) {
    return (
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: 52, animation: "spin 1s linear infinite", marginBottom: 20 }}>🧧</div>
        <p style={{ color: "#fbbf24", fontSize: 16, fontWeight: 700 }}>내 띠 부적 준비 중...</p>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} } @keyframes glow { 0%,100%{box-shadow:0 0 20px #fbbf2444;} 50%{box-shadow:0 0 40px #fbbf2488;} }`}</style>

      <div style={{ background: "linear-gradient(180deg,#2d0f08 0%,#1a0a05 100%)" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 24px 0", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Link href="/main-v2" style={{ color: "#fbbf24", fontSize: 13, textDecoration: "none" }}>← 점운 홈</Link>
            <button onClick={() => { const d = { title: "점운 복문 — 내 띠 전용 부적", text: "내 생년월일로 내 띠 부적을 무료로 받아보세요! 🧧", url: "https://jeomun.com/bokmun" }; const _k=(window as any).Kakao; if(_k?.isInitialized()&&_k?.Share){_k.Share.sendDefault({objectType:"feed",content:{title:d.title,description:d.text,imageUrl:"https://i.pinimg.com/736x/bc/72/81/bc7281694d741c357b826a29c17023b3.jpg",link:{mobileWebUrl:d.url,webUrl:d.url}},buttons:[{title:"바로 보기",link:{mobileWebUrl:d.url,webUrl:d.url}},{title:"나도 해보기 →",link:{mobileWebUrl:d.url,webUrl:d.url}}]});}else{window.location.href=`kakaotalk://msg/send?text=${encodeURIComponent(d.text+'\n'+d.url)}`;}; }} style={{ fontSize: 12, color: "#fbbf24", fontWeight: 700, background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: 20, padding: "5px 12px", cursor: "pointer" }}>🔗 공유</button>
          </div>

          <div style={{ fontSize: 56, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🧧</div>
          <h1 style={{ fontSize: 27, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.3 }}>
            내 띠 전용<br />
            <span style={{ background: "linear-gradient(135deg,#fbbf24,#dc2626)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              복문(福文) 부적
            </span>
          </h1>
          <p style={{ color: "#f5d9a8", fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>
            생년월일 → 12띠 판별 → 나만의 부적<br />
            캡처해서 폰에 간직하세요
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginBottom: 28, padding: "0 8px" }}>
            {ZODIAC_PREVIEW.map((e, i) => (
              <div key={i} style={{ position: "relative", width: "100%", paddingBottom: "100%" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {e}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "24px 20px 80px" }}>
        <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 20, padding: "20px 18px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24", margin: "0 0 16px" }}>🎯 정보 입력</p>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>이름 또는 별명 (선택)</label>
            <input style={S.input} placeholder="예) 에스더" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>전화번호 (필수)</label>
            <input style={{ ...S.input, border: `1px solid ${error && !phone ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}` }} placeholder="010-0000-0000" inputMode="tel" value={phone} onChange={e => { setPhone(e.target.value); setError(""); }} />
            <input
              type="text" name="website" value={hpField} onChange={e => setHpField(e.target.value)}
              autoComplete="off" tabIndex={-1} aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>이메일 (선택)</label>
            <input style={S.input} placeholder="example@email.com" inputMode="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1.3 }}>
              <label style={S.label}>출생연도 *</label>
              <input style={S.input} placeholder="1990" maxLength={4} inputMode="numeric"
                value={birthYear} onChange={e => setBirthYear(e.target.value.replace(/\D/g,"").slice(0,4))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>월 (선택)</label>
              <input style={S.input} placeholder="3" maxLength={2} inputMode="numeric"
                value={birthMonth} onChange={e => setBirthMonth(e.target.value.replace(/\D/g,"").slice(0,2))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>일 (선택)</label>
              <input style={S.input} placeholder="15" maxLength={2} inputMode="numeric"
                value={birthDay} onChange={e => setBirthDay(e.target.value.replace(/\D/g,"").slice(0,2))} />
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setError(""); }}
                style={{ marginTop: 3, accentColor: "#dc2626", width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#c9a876", lineHeight: 1.6 }}>
                <strong style={{ color: "#f5f1e8" }}>[필수] 개인정보 수집·이용 동의</strong><br />
                점운(jeomun.com)이 전화번호·이메일을 서비스 제공에 활용하며, 3년간 보유 후 파기합니다.
              </span>
            </label>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", marginTop: 8 }}>
              <input type="checkbox" checked={marketingAgreed} onChange={e => setMarketingAgreed(e.target.checked)}
                style={{ marginTop: 3, accentColor: "#dc2626", width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#c9a876", lineHeight: 1.6 }}>
                <strong style={{ color: "#f5f1e8" }}>[선택] 마케팅 수신 동의</strong><br />
                이벤트·할인·운세 소식을 문자·카카오로 받습니다. 언제든지 수신거부 가능합니다.
              </span>
            </label>
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>}

        <button onClick={analyze} style={S.btn}>
          내 띠 부적 받기 🧧 →
        </button>
        <p style={{ fontSize: 11, color: "#8a7355", textAlign: "center", marginTop: 10 }}>완전 무료 · 12띠 사주 기반</p>
        <p style={{ color: '#c9a876', fontSize: 13, marginTop: 8, textAlign: 'center' }}>오늘 <strong style={{ color: '#fbbf24' }}>{count}</strong>명이 부적을 받았어요</p>
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(251,191,36,0.55)", marginTop: 10, lineHeight: 1.6, letterSpacing: "0.02em" }}>
          🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
        </p>

        <div style={{ marginTop: 28 }}>
          {[
            { icon: "🐯", t: "12띠 전용 부적", s: "월별이 아닌 내 띠에 딱 맞는\n고유한 부적을 받아보세요" },
            { icon: "📸", t: "캡처해서 간직", s: "부적 이미지를 저장해서\n폰 배경화면이나 잠금화면으로 써보세요" },
            { icon: "📤", t: "결과 공유", s: "친구에게 공유하고 서로의 부적을 비교해보세요" },
          ].map(f => (
            <div key={f.t} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: 14, color: "#f5d9a8" }}>{f.t}</p>
                <p style={{ color: "#c9a876", fontSize: 12, margin: 0, lineHeight: 1.5, whiteSpace: "pre-line" }}>{f.s}</p>
              </div>
            </div>
          ))}
        </div>

      {/* 회사정보 */}
      <footer style={{ padding: "32px 20px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 380, margin: "0 auto", padding: "20px 18px", borderRadius: 20, background: "#120500", border: "1px solid rgba(255,255,255,0.15)" }}>
          <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, margin: "0 0 10px" }}>© 2026 점운 · Powered by 점운</p>
          <div style={{ color: "#94a3b8", fontSize: 10.5, lineHeight: 1.9, marginBottom: 14 }}>
            <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신</p>
            <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
            <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
            <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38,<br />7층 7017호(대치동)</p>
            <p style={{ margin: 0 }}>대표전화 010-2106-2689 · 유선 031-585-7255</p>
            <p style={{ margin: "4px 0 0", color: "#f87171", fontWeight: 900, fontSize: 11 }}>※ 전화 문의는 받지 않습니다.<br />카카오톡으로 문의해 주세요.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 12 }}>
            <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "7px 18px", background: "#FEE500", color: "#1a1a1a", borderRadius: 20, textDecoration: "none", fontWeight: 900, fontSize: 12 }}>💬 카카오톡 문의</a>
            <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ display: "inline-block", padding: "7px 18px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, color: "#e2e8f0", textDecoration: "none", fontWeight: 700, fontSize: 12 }}>📧 이메일 문의</a>
          </div>
          <div style={{ fontSize: 11, display: "flex", justifyContent: "center", gap: 12 }}>
            <a href="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>이용약관</a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <a href="/privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>개인정보처리방침</a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <a href="/refund" style={{ color: "#94a3b8", textDecoration: "none" }}>환불정책</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
