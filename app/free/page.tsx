import { Suspense } from "react";
import FreeForm from "./FreeForm";

const BG = "linear-gradient(160deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)";

export default function FreePage() {
  return (
    <main style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* 히어로 — 서버에서 즉시 렌더링 → LCP 개선 */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-block", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", color: "#fff", fontSize: 11, fontWeight: 900, padding: "4px 14px", borderRadius: 50, marginBottom: 10, letterSpacing: 0.5 }}>
            🔥 선착순 100명 한정
          </div>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🐱</div>
          <h1 style={{ color: "#fbbf24", fontSize: 22, fontWeight: 900, margin: "0 0 6px" }}>무료 재물운 받기</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
            이름·전화번호만 남기면<br />
            <strong style={{ color: "#ec4899" }}>AI 재물운 사주</strong> 바로 무료로 드려요
          </p>
        </div>

        {/* 폼 — 클라이언트 렌더링 (JS 필요) */}
        <Suspense fallback={<div style={{ background: "#fff", borderRadius: 20, padding: "24px 20px", minHeight: 300 }} />}>
          <FreeForm />
        </Suspense>

      </div>
    </main>
  );
}
