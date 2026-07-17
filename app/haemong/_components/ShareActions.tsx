"use client";

import { useState } from "react";
import Script from "next/script";

interface Props {
  keyword: string;
}

export default function ShareActions({ keyword }: Props) {
  const [modal, setModal] = useState<null | "guide" | "copied">(null);

  function handleShare() {
    const base = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
    const myRef = typeof window !== "undefined" ? (localStorage.getItem("my_ref_code") || "") : "";
    const url = myRef ? `${base}?ref=${myRef}` : base;
    const kakao = typeof window !== "undefined" ? (window as any).Kakao : null;
    if (kakao?.isInitialized() && kakao?.Share) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: `🌙 ${keyword} 해몽 결과`,
            description: `${keyword}을(를) 꿨다면? 점운에서 무료로 해석해보세요!`,
            imageUrl: "https://i.pinimg.com/1200x/50/73/a5/5073a503cb18b1cd3459fba8e402c389.webp",
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [
            { title: "해몽 결과 보기 🌙", link: { mobileWebUrl: url, webUrl: url } },
            { title: "나도 해보기 →", link: { mobileWebUrl: "https://jeomun.com/haemong", webUrl: "https://jeomun.com/haemong" } },
          ],
        });
        return;
      } catch {}
    }
    navigator.clipboard?.writeText(url);
    setModal("copied");
    setTimeout(() => setModal(null), 2000);
  }

  return (
    <>
      {/* 상단 액션바 */}
      <div style={{
        display: "flex", gap: 8, padding: "10px 14px", alignItems: "center",
        background: "rgba(255,255,255,0.95)", borderBottom: "1px solid rgba(236,72,153,0.12)",
      }}>
        <button
          onClick={() => setModal("guide")}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "#dc2626", color: "#fff", border: "none",
            borderRadius: 20, padding: "7px 14px", fontSize: 12, fontWeight: 800,
            cursor: "pointer", boxShadow: "0 2px 8px rgba(220,38,38,0.4)",
          }}
        >
          💬 이용 안내
        </button>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleShare}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "#FEE500", color: "#1a1a2e", border: "none",
            borderRadius: 20, padding: "7px 14px", fontSize: 12, fontWeight: 800,
            cursor: "pointer", boxShadow: "0 2px 6px rgba(254,229,0,0.5)",
          }}
        >
          💬 카카오로 공유하기
        </button>
      </div>

      {/* 링크 복사 토스트 (PC) */}
      {modal === "copied" && (
        <div style={{
          position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)",
          background: "#16a34a", color: "#fff", padding: "10px 20px",
          borderRadius: 24, fontSize: 13, fontWeight: 700, zIndex: 9999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)", whiteSpace: "nowrap",
        }}>
          ✅ 링크가 복사됐어요!
        </div>
      )}

      {/* 가이드 모달 */}
      {modal === "guide" && (
        <div
          onClick={() => setModal(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 9999, display: "flex", alignItems: "flex-end",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 480, margin: "0 auto",
              background: "#fff", borderRadius: "24px 24px 0 0",
              padding: "24px 20px 40px", maxHeight: "80vh", overflowY: "auto",
            }}
          >
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 4, margin: "0 auto 20px" }} />

            <h2 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a2e", margin: "0 0 20px", textAlign: "center" }}>
              🌙 꿈해몽 활용 가이드
            </h2>

            {/* 카카오 공유 */}
            <div style={{ background: "#fffde7", borderRadius: 16, padding: "16px", marginBottom: 12, border: "1px solid #fde68a" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#92400e", marginBottom: 8 }}>💬 카카오톡으로 공유하는 법</div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                1. 상단 <b>[카카오로 공유하기]</b> 버튼 클릭<br />
                2. 모바일에서는 카카오톡 바로 공유 가능<br />
                3. PC에서는 링크가 복사됨<br />
                &nbsp;&nbsp;&nbsp;→ 카카오 직접 붙여넣기<br />
                <span style={{ fontSize: 13, fontWeight: 800, color: "#374151" }}>* 친구에게 오늘 꾼 꿈 해몽 결과를<br />바로 보낼 수 있어요</span>
              </div>
            </div>

            {/* 카카오에서 더 잘 보는 법 */}
            <div style={{ background: "#f0fdf4", borderRadius: 16, padding: "16px", marginBottom: 20, border: "1px solid #86efac" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#166534", marginBottom: 8 }}>📱 카카오톡 안에서 더 잘 보는 법</div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                카카오 내장 브라우저에서<br />
                일부 기능이 제한될 수 있어요.<br /><br />
                <b>더 잘 보려면:</b><br />
                1. 카카오톡에서 링크 열기<br />
                2. 우측 하단 <b>[···]</b> (더보기) 클릭<br />
                3. 점운 사주앱으로 이동하면 꿈 +<br />
                &nbsp;&nbsp;&nbsp;내 사주를 함께 분석해<br />
                &nbsp;&nbsp;&nbsp;더 정확한 운세를 볼 수 있어요 🐱<br />
                &nbsp;&nbsp;&nbsp;🔊 결과를 음성으로 읽어드려요<br />
                <span style={{ fontSize: 13, fontWeight: 800, color: "#374151" }}>* 점운(jeomun.com) — <span style={{ color: "#dc2626" }}>990원 사주</span> · AI 꿈해몽</span>
              </div>
            </div>

            <button
              onClick={() => setModal(null)}
              style={{
                width: "100%", padding: "14px", borderRadius: 16, border: "none",
                background: "linear-gradient(135deg,#ec4899,#8b5cf6)",
                color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer",
              }}
            >
              확인했어요 ✓
            </button>
          </div>
        </div>
      )}
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const k = (window as any).Kakao;
          if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }}
      />
    </>
  );
}
