"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function JigunPayPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#030014" }} />}>
      <PayInner />
    </Suspense>
  );
}

function PayInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const AMOUNT = 990;

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
          amount: AMOUNT,
          itemName: "점운 직운 부업 추천",
          userName: name.trim(),
          mobileNumber: mobile.replace(/\D/g, ""),
        }),
      });
      const data = await res.json();
      if (data.success) {
        // 결제 기록 저장
        fetch("/api/v2/save-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: mobile.replace(/\D/g, "") || "",
            name: name.trim(),
            amount: AMOUNT,
            category: "직운 부업추천",
            source: "jigun",
          }),
        }).catch(() => {});
        // 24시간 잠금 해제
        localStorage.setItem("jigun_unlock_until", String(Date.now() + 24 * 60 * 60 * 1000));
        router.push(id ? `/jigun/result/${id}?paid=1` : "/jigun");
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
          <Link href={id ? `/jigun/result/${id}` : "/jigun"} style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>← 돌아가기</Link>
          <span style={{ fontSize: 13, color: "#6b7280" }}>직운 부업 추천</span>
        </div>

        {/* 상품 안내 */}
        <div style={{ background: "linear-gradient(135deg,#1a1a2e,#2d1b69)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 18, padding: "20px 18px", marginBottom: 24, textAlign: "center" }}>
          <p style={{ fontSize: 20, margin: "0 0 4px" }}>💼</p>
          <p style={{ fontSize: 16, fontWeight: 900, color: "white", margin: "0 0 6px" }}>직운 부업 추천 TOP 3 전체 공개</p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 6px", lineHeight: 1.6 }}>
            부업 TOP 3 상세 분석 · 수입 범위<br />
            3단계 시작법 · 플랫폼 · 함정 주의
          </p>
          <p style={{ fontSize: 12, color: "#a78bfa", margin: "0 0 14px" }}>결제 후 바로 열림 · 24시간 이용 가능</p>
          <p style={{ fontSize: 28, fontWeight: 900, color: "white", margin: 0 }}>
            ₩{AMOUNT.toLocaleString()}
          </p>
        </div>

        {/* 카드 정보 입력 */}
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
            <label style={S.label}>휴대폰 번호 (선택)</label>
            <input style={S.input} placeholder="01012345678" value={mobile}
              onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 11))} inputMode="numeric" />
          </div>
        </div>

        {error && (
          <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>
        )}

        <button
          onClick={pay}
          disabled={loading}
          style={{ width: "100%", background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", border: "none", borderRadius: 22, padding: "16px", fontSize: 16, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", marginBottom: 12 }}
        >
          {loading ? "결제 처리 중..." : `₩${AMOUNT.toLocaleString()} 결제하기`}
        </button>

        <p style={{ fontSize: 11, color: "#6b7280", textAlign: "center", lineHeight: 1.6 }}>
          결제 후 24시간 이용 가능합니다.<br />
          카드 정보는 결제 후 저장되지 않습니다.
        </p>
      </div>
    </div>
  );
}
