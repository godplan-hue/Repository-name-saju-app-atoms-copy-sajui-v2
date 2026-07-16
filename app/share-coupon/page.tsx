"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

export default function ShareCouponPage() {
  const router = useRouter();
  const [postUrl, setPostUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const SNS_DOMAINS = ["instagram.com", "youtube.com", "youtu.be", "tiktok.com", "blog.naver.com", "naver.com", "twitter.com", "x.com", "facebook.com", "threads.net", "story.kakao.com"];
  function isValidSnsUrl(url: string) {
    try { const u = new URL(url.startsWith("http") ? url : "https://" + url); return SNS_DOMAINS.some(d => u.hostname.includes(d)); } catch { return false; }
  }

  async function handleSubmit() {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 정확히 입력해주세요."); return; }
    if (!postUrl.trim()) { setError("게시글 URL을 입력해주세요."); return; }
    if (!isValidSnsUrl(postUrl.trim())) { setError("인스타그램·블로그·유튜브·틱톡 게시글 URL만 가능해요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/share-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, postUrl: postUrl.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
      } else {
        setError(data.error || "신청에 실패했어요. 다시 시도해주세요.");
      }
    } catch {
      setError("오류가 발생했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fdf2f8 0%,#ede9fe 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", padding: "0 0 60px" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.12)" }}>
        <Link href="/main-v2" style={{ color: "#8b5cf6", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>← 점운</Link>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>

        {/* 히어로 */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>📸</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 10px", lineHeight: 1.3 }}>
            SNS 후기 올리고<br />사주 쿠폰 10장!
          </h1>
          <p style={{ fontSize: 13, color: "#6d28d9", lineHeight: 1.8, margin: 0 }}>
            점운 후기를 SNS에 올리면<br />
            <strong style={{ color: "#be185d" }}>990원 쿠폰 10장(9,900원 상당)</strong>을 드려요 🎁<br />
            <span style={{ fontSize: 12, color: "#ec4899", fontWeight: 700 }}>+ 꿈해몽 24시간 무료 이용권 포함!</span>
          </p>
        </div>

        {/* 혜택 카드 */}
        <div style={{ background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: 16, padding: "16px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#be185d", margin: "0 0 2px" }}>10장</p>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>990원 쿠폰</p>
            </div>
            <div style={{ width: 1, height: 40, background: "#e5e7eb" }} />
            <div style={{ textAlign: "center", flex: 1 }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#7c3aed", margin: "0 0 2px" }}>9,900원</p>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>총 혜택</p>
            </div>
            <div style={{ width: 1, height: 40, background: "#e5e7eb" }} />
            <div style={{ textAlign: "center", flex: 1 }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#16a34a", margin: "0 0 2px" }}>1회</p>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>번호당</p>
            </div>
          </div>

          {/* HOW TO */}
          <div style={{ background: "rgba(139,92,246,0.08)", borderRadius: 12, padding: "12px 14px" }}>
            <p style={{ fontSize: 12, fontWeight: 900, color: "#6d28d9", margin: "0 0 8px" }}>✅ 이렇게 하면 돼요</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { n: "1", t: "SNS에 점운 후기 올리기", s: "1,000자 이상 · 사진 3장 이상 · 공개 게시글" },
                { n: "2", t: "아래 폼에 URL + 전화번호 입력" },
                { n: "3", t: "1~3일 내 확인 후 카카오로 쿠폰 발송" },
              ].map(item => (
                <div key={item.n} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 22, height: 22, borderRadius: "50%", background: G, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 900 }}>{item.n}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: "#4c1d95" }}>{item.t}</p>
                    {item.s && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>{item.s}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!done ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px", boxShadow: "0 4px 20px rgba(139,92,246,0.1)" }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#4c1d95", margin: "0 0 14px" }}>📝 신청하기</p>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6d28d9", marginBottom: 6 }}>올린 게시글 URL</label>
              <input
                type="url"
                value={postUrl}
                onChange={e => setPostUrl(e.target.value)}
                placeholder="https://instagram.com/p/... 또는 블로그 URL"
                style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "5px 0 0" }}>인스타그램 · 네이버 블로그 · 유튜브 · 틱톡 가능</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6d28d9", marginBottom: 6 }}>전화번호 (카카오 발송용)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "0 0 12px", fontWeight: 600 }}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: G, color: "#fff", fontSize: 15, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 4px 18px rgba(236,72,153,0.4)" }}
            >
              {loading ? "⏳ 신청 중..." : "🎁 쿠폰 10장 신청하기"}
            </button>

            <p style={{ fontSize: 11, color: "#dc2626", textAlign: "center", margin: "10px 0 0", fontWeight: 700, lineHeight: 1.7 }}>
              ⚠️ 공개 게시글만 · 1,000자 이상 · 사진 3장 이상 필수<br />
              기준 미달 시 발급 불가 · 1인 1회<br />
              <span style={{ color: "#9ca3af", fontWeight: 400 }}>비방·광고성 내용 포함 시 영구 이용 제한</span>
            </p>
          </div>
        ) : (
          /* 신청 완료 */
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 20px", boxShadow: "0 4px 20px rgba(139,92,246,0.12)", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <p style={{ fontSize: 22, fontWeight: 900, color: "#16a34a", margin: "0 0 8px" }}>신청 완료!</p>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.8 }}>
              후기를 확인한 후<br />
              <strong style={{ color: "#7c3aed" }}>1~3일 내 카카오로 쿠폰을 보내드려요</strong> 🎁<br />
              <span style={{ fontSize: 12 }}>입력하신 전화번호({phone})로 발송됩니다</span>
            </p>
            {/* 바이럴 유도 */}
            <div style={{ background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", border: "1.5px solid #ec4899", borderRadius: 14, padding: "14px 16px", marginBottom: 14, textAlign: "left" }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#be185d", margin: "0 0 6px" }}>🎁 쿠폰 10장 활용법</p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.9 }}>
                1장은 내가 쓰고,<br />
                <strong style={{ color: "#7c3aed" }}>나머지 9장은 친구·가족·지인에게 선물하세요!</strong><br />
                카카오로 쿠폰 코드 보내주면 바로 사용 가능해요 😊<br />
                <span style={{ fontSize: 11, color: "#ec4899" }}>"나 이거 써봤는데 신기해서 너도 해봐" 한마디면 충분!</span>
              </p>
            </div>

            <div style={{ background: "#f5f3ff", borderRadius: 12, padding: "12px 16px", marginBottom: 20, textAlign: "left" }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: "#6d28d9", margin: "0 0 6px" }}>📋 발송 전 확인 기준</p>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0, lineHeight: 1.8 }}>
                ✓ 1,000자 이상 작성<br />
                ✓ 사진 3장 이상 포함<br />
                ✓ 점운 소개·추천 내용<br />
                ✓ 공개 게시글
              </p>
            </div>
            <button
              onClick={() => router.push("/main-v2")}
              style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: G, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 16px rgba(236,72,153,0.4)" }}
            >
              🐱 사주 보러 가기
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
