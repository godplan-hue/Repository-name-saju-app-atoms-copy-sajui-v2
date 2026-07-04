"use client";

import { useState } from "react";

interface Props {
  keyword: string;
}

export default function ShareActions({ keyword }: Props) {
  const [modal, setModal] = useState<null | "guide" | "copied">(null);

  function getUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  async function handleShare() {
    const url = getUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${keyword} 해몽 — 점운`,
          text: `${keyword}을(를) 꿨다면? 점운에서 무료로 해석해보세요 🌙`,
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setModal("copied");
      setTimeout(() => setModal(null), 2000);
    }
  }

  async function handleSave() {
    const url = getUrl();
    await navigator.clipboard.writeText(url);
    setModal("copied");
    setTimeout(() => setModal(null), 2000);
  }

  return (
    <>
      {/* 상단 액션바 */}
      <div style={{
        display: "flex", gap: 8, padding: "10px 14px", alignItems: "center",
        background: "rgba(255,255,255,0.95)", borderBottom: "1px solid rgba(236,72,153,0.12)",
        flexWrap: "wrap",
      }}>
        {/* 꼭 읽어보세요 버튼 */}
        <button
          onClick={() => setModal("guide")}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "#dc2626", color: "#fff", border: "none",
            borderRadius: 20, padding: "7px 14px", fontSize: 12, fontWeight: 800,
            cursor: "pointer", boxShadow: "0 2px 8px rgba(220,38,38,0.4)",
          }}
        >
          ❗ 꼭 읽어보세요
        </button>

        <div style={{ flex: 1 }} />

        {/* 보관하기 */}
        <button
          onClick={handleSave}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe",
            borderRadius: 20, padding: "7px 12px", fontSize: 12, fontWeight: 700,
            cursor: "pointer",
          }}
        >
          🔖 보관하기
        </button>

        {/* 공유하기 */}
        <button
          onClick={handleShare}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "#FEE500", color: "#1a1a2e", border: "none",
            borderRadius: 20, padding: "7px 12px", fontSize: 12, fontWeight: 800,
            cursor: "pointer", boxShadow: "0 2px 6px rgba(254,229,0,0.5)",
          }}
        >
          💬 카카오 공유
        </button>
      </div>

      {/* URL 복사 완료 토스트 */}
      {modal === "copied" && (
        <div style={{
          position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)",
          background: "#1a1a2e", color: "#fff", padding: "10px 20px",
          borderRadius: 24, fontSize: 13, fontWeight: 700, zIndex: 9999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}>
          ✅ 링크가 복사됐어요! 카카오·메모장에 붙여넣기 하세요
        </div>
      )}

      {/* 꼭 읽어보세요 가이드 모달 */}
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
            {/* 핸들 */}
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 4, margin: "0 auto 20px" }} />

            <h2 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a2e", margin: "0 0 20px", textAlign: "center" }}>
              🌙 꿈해몽 활용 가이드
            </h2>

            {/* 보관하는 법 */}
            <div style={{ background: "#f5f3ff", borderRadius: 16, padding: "16px", marginBottom: 12, border: "1px solid #ddd6fe" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#6d28d9", marginBottom: 8 }}>🔖 이 해몽 보관하는 법</div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                1. 상단 <b>[보관하기]</b> 버튼 → 링크가 자동 복사돼요<br />
                2. 카카오톡 "나에게 보내기"에 붙여넣기<br />
                3. 또는 메모앱·즐겨찾기에 저장<br />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>* 꿈해몽 결과는 로그인 없이 URL로 보관됩니다</span>
              </div>
            </div>

            {/* 카카오 공유 */}
            <div style={{ background: "#fffde7", borderRadius: 16, padding: "16px", marginBottom: 12, border: "1px solid #fde68a" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#92400e", marginBottom: 8 }}>💬 카카오톡으로 공유하는 법</div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                1. 상단 <b>[카카오 공유]</b> 버튼 클릭<br />
                2. 모바일에서는 카카오톡 바로 공유 가능<br />
                3. PC에서는 링크가 복사됨 → 카카오 직접 붙여넣기<br />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>* 친구에게 오늘 꾼 꿈 해몽 결과를 바로 보낼 수 있어요</span>
              </div>
            </div>

            {/* 카카오에서 읽는 법 */}
            <div style={{ background: "#f0fdf4", borderRadius: 16, padding: "16px", marginBottom: 20, border: "1px solid #86efac" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#166534", marginBottom: 8 }}>📱 카카오톡 안에서 더 잘 보는 법</div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                카카오 내장 브라우저에서 일부 기능이 제한될 수 있어요.<br /><br />
                <b>더 잘 보려면:</b><br />
                1. 카카오톡에서 링크 열기<br />
                2. 우측 상단 <b>[···]</b> (더보기) 클릭<br />
                3. <b>"Safari로 열기"</b> 또는 <b>"기본 브라우저로 열기"</b> 선택<br />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>* 이렇게 하면 결과지가 훨씬 선명하게 보입니다</span>
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
    </>
  );
}
