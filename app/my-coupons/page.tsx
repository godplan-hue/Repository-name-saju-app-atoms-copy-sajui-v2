"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

export default function MyCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<{ coupon: string; earnedAt: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [refCode, setRefCode] = useState("");

  useEffect(() => {
    const code = localStorage.getItem("my_ref_code") || "";
    setRefCode(code);
    if (!code) { setLoading(false); return; }
    fetch(`/api/referral?refCode=${code}`)
      .then(r => r.json())
      .then(d => setCoupons(d.coupons || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }

  const shareUrl = typeof window !== "undefined" && refCode
    ? `${window.location.origin}/main-v2?ref=${refCode}`
    : "";

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fdf2f8 0%,#ede9fe 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", padding: "0 0 60px" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.12)" }}>
        <Link href="/main-v2" style={{ color: "#8b5cf6", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>← 점운</Link>
        <span style={{ marginLeft: 12, fontSize: 15, fontWeight: 800, color: "#4c1d95" }}>내 추천 쿠폰</span>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>

        {/* 내 추천 링크 */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px", marginBottom: 20, boxShadow: "0 4px 20px rgba(139,92,246,0.1)" }}>
          <p style={{ fontSize: 14, fontWeight: 900, color: "#4c1d95", margin: "0 0 6px" }}>🔗 내 추천 링크</p>
          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>
            친구가 이 링크로 들어와서 결제하면<br />
            <strong style={{ color: "#be185d" }}>990원 무료 사주 쿠폰</strong>이 자동으로 생겨요<br />
            <span style={{ display: "inline-block", marginTop: 6, background: "#fdf2f8", border: "1px solid #f9a8d4", borderRadius: 8, padding: "3px 10px", fontSize: 11, color: "#be185d", fontWeight: 800 }}>🎁 친구 결제 시 한 번 더 지급!</span>
          </p>
          <div style={{ background: "#f5f3ff", borderRadius: 12, padding: "12px 14px", marginBottom: 10, wordBreak: "break-all", fontSize: 12, color: "#6d28d9", fontWeight: 600 }}>
            {shareUrl || "링크 생성 중..."}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => copy(shareUrl)}
              style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1.5px solid #8b5cf6", background: copied === shareUrl ? "#f5f3ff" : "#fff", color: "#6d28d9", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
            >
              {copied === shareUrl ? "✅ 복사됨" : "🔗 링크 복사"}
            </button>
            <button
              onClick={async () => {
                if (navigator.share) {
                  try { await navigator.share({ title: "점운 사주", text: "AI 사주 무료로 봐봐! 신기해 🐱", url: shareUrl }); } catch {}
                } else { copy(shareUrl); }
              }}
              style={{ flex: 1, padding: "11px", borderRadius: 12, border: "none", background: "#FEE500", color: "#1a1a2e", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
            >
              💬 카카오 공유
            </button>
          </div>
        </div>

        {/* 적립된 쿠폰 */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px", boxShadow: "0 4px 20px rgba(139,92,246,0.1)" }}>
          <p style={{ fontSize: 14, fontWeight: 900, color: "#4c1d95", margin: "0 0 16px" }}>
            🎁 받은 쿠폰 {loading ? "" : `(${coupons.length}장)`}
          </p>

          {loading ? (
            <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: "20px 0" }}>확인 중...</p>
          ) : coupons.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <p style={{ fontSize: 28, margin: "0 0 10px" }}>🌙</p>
              <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 6px", fontWeight: 600 }}>아직 적립된 쿠폰이 없어요</p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>위 추천 링크를 친구에게 공유해보세요!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {coupons.map((c, i) => (
                <div key={i} style={{ background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", border: "1.5px dashed #ec4899", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 3px" }}>990원 무료 사주 쿠폰</p>
                    <p style={{ fontSize: 20, fontWeight: 900, color: "#be185d", margin: 0, letterSpacing: 2 }}>{c.coupon}</p>
                    <p style={{ fontSize: 10, color: "#9ca3af", margin: "3px 0 0" }}>{new Date(c.earnedAt).toLocaleDateString("ko-KR")} 적립</p>
                  </div>
                  <button
                    onClick={() => copy(c.coupon)}
                    style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #ec4899", background: copied === c.coupon ? "#fdf2f8" : "#fff", color: "#be185d", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                  >
                    {copied === c.coupon ? "✅" : "복사"}
                  </button>
                </div>
              ))}
              <button
                onClick={() => router.push("/main-v2")}
                style={{ width: "100%", marginTop: 8, padding: "14px", borderRadius: 14, border: "none", background: G, color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 14px rgba(236,72,153,0.35)" }}
              >
                🐱 쿠폰 사용하러 가기
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
