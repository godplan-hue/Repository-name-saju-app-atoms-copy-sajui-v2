"use client";

import { useState, Suspense, CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PayPage() {
  return (
    <Suspense fallback={null}>
      <PayInner />
    </Suspense>
  );
}

function PayInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = Number(searchParams.get("amount") || "0");
  const next = searchParams.get("next") || "/main-v2";

  const [cardNo, setCardNo] = useState("");
  const [expM, setExpM] = useState("");
  const [expY, setExpY] = useState("");
  const [birth, setBirth] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatCardNo = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 19);
    return d.match(/.{1,4}/g)?.join(" ") ?? d;
  };

  const pay = async () => {
    const clean = cardNo.replace(/\s/g, "");
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
        body: JSON.stringify({
          cardNo: clean,
          expireMonth: expM.padStart(2, "0"),
          expireYear: expY.slice(-2),
          birthday: birth,
          cardPw: pw,
          amount,
          itemName: "점운 운세",
          userName: name.trim(),
          mobileNumber: mobile.replace(/\D/g, ""),
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(next);
      } else {
        setError(data.error || "결제에 실패했습니다. 다시 시도해주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
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

  if (!amount) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0520", color: "white", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
        <p>잘못된 접근입니다.</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0835,#0d0520)", color: "white", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", padding: "0 0 20px", display: "flex", alignItems: "center", gap: 4 }}>
          ← 돌아가기
        </button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p style={{ color: "#fbbf24", fontWeight: 900, fontSize: 22, margin: "0 0 4px" }}>💳 카드 결제</p>
          <p style={{ color: "#c4b5fd", fontWeight: 700, fontSize: 18, margin: 0 }}>₩{amount.toLocaleString()}</p>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>카드번호</label>
          <input value={cardNo} onChange={e => setCardNo(formatCardNo(e.target.value))} placeholder="0000 0000 0000 0000" inputMode="numeric" style={inp} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <div>
            <label style={lbl}>유효기간 월 (MM)</label>
            <input value={expM} onChange={e => setExpM(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="01" inputMode="numeric" maxLength={2} style={inp} />
          </div>
          <div>
            <label style={lbl}>유효기간 년 (YY)</label>
            <input value={expY} onChange={e => setExpY(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="27" inputMode="numeric" maxLength={2} style={inp} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <div>
            <label style={lbl}>생년월일 앞 6자리</label>
            <input value={birth} onChange={e => setBirth(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="예: 901225" inputMode="numeric" maxLength={6} style={inp} />
          </div>
          <div>
            <label style={lbl}>비밀번호 앞 2자리</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="••" inputMode="numeric" maxLength={2} style={{ ...inp, fontSize: 20 }} />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>이름 (카드 명의자)</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="홍길동" style={inp} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>핸드폰번호 (선택 — 카카오 결제알림)</label>
          <input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="01012345678" inputMode="numeric" style={inp} />
        </div>

        {error && <p style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700, margin: "0 0 12px", textAlign: "center" }}>⚠️ {error}</p>}

        <button
          onClick={pay}
          disabled={loading}
          style={{ width: "100%", padding: "15px 0", background: loading ? "rgba(251,191,36,0.4)" : "linear-gradient(135deg,#fbbf24,#ec4899,#8b5cf6)", color: "#1a0f2e", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 22px rgba(251,191,36,0.3)", marginBottom: 8 }}
        >
          {loading ? "결제 중..." : `💳 ₩${amount.toLocaleString()} 결제하기`}
        </button>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textAlign: "center", margin: "8px 0 0" }}>SSL 보안 결제 · 페이업㈜ 제공</p>
      </div>
    </main>
  );
}
