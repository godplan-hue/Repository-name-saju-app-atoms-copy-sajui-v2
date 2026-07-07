"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 80 }, (_, i) => 2006 - i);

export default function FreePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("1990");
  const [birthMonth, setBirthMonth] = useState("1");
  const [birthDay, setBirthDay] = useState("1");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ code: string; teaser: string; alreadyUsed?: boolean } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) { setError("이름을 입력해주세요."); return; }
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 10) { setError("전화번호를 정확히 입력해주세요."); return; }
    if (!agreed) { setError("개인정보 수집·마케팅 수신 동의를 체크해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/free-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: clean, birthYear }),
      });
      const data = await res.json();
      if (data.code) {
        setResult(data);
      } else {
        setError(data.error || "오류가 발생했어요. 다시 시도해주세요.");
      }
    } catch {
      setError("오류가 발생했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function copyAndGo() {
    try { await navigator.clipboard.writeText(result!.code); } catch {}
    setCopied(true);
    setTimeout(() => {
      router.push("/main-v2");
    }, 800);
  }

  const selectStyle = {
    padding: "12px 10px", borderRadius: 10, border: "1.5px solid #e5e7eb",
    fontSize: 15, outline: "none", background: "#fff", color: "#111", flex: 1,
  };

  return (
    <main style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-block", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", color: "#fff", fontSize: 11, fontWeight: 900, padding: "4px 14px", borderRadius: 50, marginBottom: 10, letterSpacing: 0.5 }}>
            🔥 선착순 100명 한정
          </div>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🐱</div>
          <h1 style={{ color: "#fbbf24", fontSize: 22, fontWeight: 900, margin: "0 0 6px" }}>무료 재물운 받기</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
            이름·생년월일·전화번호만 남기면<br />
            <strong style={{ color: "#ec4899" }}>재물운 사주 무료쿠폰</strong> 바로 드려요
          </p>
        </div>

        {!result ? (
          /* 입력 폼 */
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 20px", boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
            {/* 이름 */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 6 }}>이름</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="홍길동"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* 생년월일 */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 6 }}>생년월일</label>
              <div style={{ display: "flex", gap: 6 }}>
                <select value={birthYear} onChange={e => setBirthYear(e.target.value)} style={selectStyle}>
                  {YEARS.map(y => <option key={y} value={y}>{y}년</option>)}
                </select>
                <select value={birthMonth} onChange={e => setBirthMonth(e.target.value)} style={selectStyle}>
                  {MONTHS.map(m => <option key={m} value={m}>{m}월</option>)}
                </select>
                <select value={birthDay} onChange={e => setBirthDay(e.target.value)} style={selectStyle}>
                  {DAYS.map(d => <option key={d} value={d}>{d}일</option>)}
                </select>
              </div>
            </div>

            {/* 전화번호 */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 6 }}>전화번호</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* 수신동의 */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  style={{ marginTop: 2, accentColor: "#ec4899", width: 16, height: 16, flexShrink: 0 }}
                />
                <span style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6 }}>
                  <strong style={{ color: "#374151" }}>[필수] 개인정보 수집·이용 및 마케팅 수신 동의</strong><br />
                  점운(<a href="https://jeomun.com" target="_blank" rel="noreferrer" style={{ color: "#7c3aed" }}>jeomun.com</a>)이 이름·생년월일·전화번호를 수집하여
                  운세 정보 및 혜택 안내에 활용하며, <strong>3년간</strong> 보유 후 파기합니다. 언제든지 수신거부 가능합니다.
                </span>
              </label>
            </div>

            {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "0 0 10px", textAlign: "center" }}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", padding: "15px", borderRadius: 12, border: "none", background: G, color: "#fff", fontSize: 16, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 4px 16px rgba(236,72,153,0.4)" }}
            >
              {loading ? "⏳ 발급 중..." : "🔮 무료 재물운 + 쿠폰 받기 →"}
            </button>
            <p style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", margin: "10px 0 0" }}>
              전화번호당 1회 제공 · 언제든지 수신거부 가능
            </p>
            <p style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", margin: "6px 0 0" }}>
              운영: <a href="https://jeomun.com" target="_blank" rel="noreferrer" style={{ color: "#7c3aed", textDecoration: "none" }}>점운 (jeomun.com)</a>
            </p>
          </div>
        ) : (
          /* 결과 화면 */
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 20px", boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
            <p style={{ fontSize: 18, fontWeight: 900, color: "#16a34a", margin: "0 0 4px", textAlign: "center" }}>
              ✅ {result.alreadyUsed ? "이미 발급된 쿠폰이에요!" : "발급 완료!"}
            </p>
            <p style={{ fontSize: 12, color: "#6b7280", textAlign: "center", margin: "0 0 20px" }}>
              {name}님의 재물운 요약이에요
            </p>

            {/* 재물운 요약 */}
            <div style={{ background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", borderRadius: 14, padding: "16px", marginBottom: 16, border: "1.5px solid #e9d5ff" }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: "#7c3aed", margin: "0 0 8px" }}>💰 재물운 요약</p>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, margin: 0 }}>{result.teaser}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "10px 0 0", textAlign: "right" }}>
                전체 재물운 분석은 앱에서 확인하세요 →
              </p>
            </div>

            {/* 쿠폰 */}
            <div style={{ background: "linear-gradient(135deg,#fef2f2,#fff7ed)", border: "2px dashed #ec4899", borderRadius: 14, padding: "16px", textAlign: "center", marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>운세 무료쿠폰 코드</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#be185d", margin: "0 0 4px", letterSpacing: 3 }}>{result.code}</p>
              <p style={{ fontSize: 11, color: "#6d28d9", margin: 0, fontWeight: 700 }}>결제 화면에서 입력 → 운세 1개 무료</p>
            </div>

            <button
              onClick={copyAndGo}
              style={{ width: "100%", padding: "15px", borderRadius: 12, border: "none", background: G, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 16px rgba(236,72,153,0.4)" }}
            >
              {copied ? "✅ 복사됨! 이동 중..." : "📋 코드 복사 후 사주보기 →"}
            </button>
            <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: "10px 0 0" }}>
              코드 복사 후 앱에서 원하는 운세 결제 시 입력하세요
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
