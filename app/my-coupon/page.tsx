"use client";

import { useState } from "react";
import Link from "next/link";

export default function MyCouponPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState<{ code: string; note: string }[]>([]);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function search() {
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 10) return;
    setLoading(true);
    setCodes([]);
    setSearched(false);
    try {
      const res = await fetch(`/api/my-coupon?phone=${clean}`);
      const data = await res.json();
      setCodes(data.codes || []);
    } catch {}
    finally {
      setSearched(true);
      setLoading(false);
    }
  }

  async function copy(code: string) {
    try { await navigator.clipboard.writeText(code); } catch {}
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fdf2f8,#ede9fe)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 16px 80px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Link href="/main-v2" style={{ color: "#8b5cf6", textDecoration: "none", fontSize: 14, fontWeight: 700, display: "inline-block", marginBottom: 24 }}>← 홈으로</Link>

        <div style={{ background: "#fff", borderRadius: 20, padding: "28px 20px", boxShadow: "0 4px 20px rgba(139,92,246,0.12)" }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#4c1d95", margin: "0 0 6px", textAlign: "center" }}>🎟 내 쿠폰 확인</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", margin: "0 0 24px" }}>발급받을 때 입력한 전화번호를 입력하세요</p>

          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") search(); }}
            placeholder="010-0000-0000"
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: "1.5px solid #e9d5ff", fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 12, textAlign: "center", letterSpacing: 1 }}
          />
          <button
            onClick={search}
            disabled={loading || phone.replace(/\D/g, "").length < 10}
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", color: "#fff", fontWeight: 900, fontSize: 15, cursor: "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "⏳ 조회 중..." : "쿠폰 조회하기"}
          </button>

          {searched && (
            <div style={{ marginTop: 20 }}>
              {codes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ fontSize: 14, color: "#6b7280", fontWeight: 600, margin: 0 }}>해당 번호로 발급된 쿠폰이 없어요</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>쿠폰 발급은 결과지 또는 공유 페이지에서 받을 수 있어요</p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#4c1d95", marginBottom: 12 }}>총 {codes.length}개의 쿠폰이 있어요</p>
                  {codes.map((c) => (
                    <div key={c.code} style={{ background: "#fffbeb", border: "2px dashed #f59e0b", borderRadius: 14, padding: "16px", marginBottom: 10, textAlign: "center" }}>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>{c.note || "할인 쿠폰"}</p>
                      <p style={{ fontSize: 26, fontWeight: 900, color: "#d97706", margin: "0 0 10px", letterSpacing: 2 }}>{c.code}</p>
                      <button
                        onClick={() => copy(c.code)}
                        style={{ padding: "7px 20px", borderRadius: 10, border: "1.5px solid #f59e0b", background: "#fff", color: "#d97706", fontWeight: 800, fontSize: 12, cursor: "pointer" }}
                      >
                        {copied === c.code ? "✅ 복사됨" : "📋 코드 복사"}
                      </button>
                    </div>
                  ))}
                  <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 8 }}>결제 화면 → 쿠폰 코드 입력란에 붙여넣기</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
