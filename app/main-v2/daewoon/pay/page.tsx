"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DaewoonPayPage() {
  return (
    <Suspense fallback={null}>
      <DaewoonPayInner />
    </Suspense>
  );
}

function DaewoonPayInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const price = Number(searchParams.get("price") || "2900");
  const count = Number(searchParams.get("count") || "1");
  const indices = searchParams.get("indices") || "";

  const handleConfirmPay = () => {
    router.push(
      `/payment-complete?daeun=1&paid=${price}&daeunCount=${count}&daeunIndices=${indices}`
    );
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0f0620 0%,#1a0535 40%,#0a0420 100%)",
      color: "white",
      fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
    }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        {/* 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌌</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fbbf24", margin: "0 0 8px" }}>대운(大運) 해설</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: 0 }}>10년마다 바뀌는 인생의 큰 챕터</p>
        </div>

        {/* 결제 정보 카드 */}
        <div style={{
          background: "rgba(139,92,246,0.15)",
          border: "1.5px solid rgba(139,92,246,0.5)",
          borderRadius: 20, padding: "24px 20px", marginBottom: 20,
        }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "0 0 16px", fontWeight: 700 }}>📋 결제 내역</p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 700 }}>
              🌌 대운 해설 {count}개
            </span>
            <span style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900 }}>
              ₩{price.toLocaleString()}
            </span>
          </div>

          {count > 1 && (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "4px 0 0", fontWeight: 600 }}>
              기본 ₩2,900 + 추가 {count - 1}개 × ₩1,000
            </p>
          )}

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "white", fontSize: 15, fontWeight: 900 }}>최종 결제 금액</span>
            <span style={{ color: "#fbbf24", fontSize: 24, fontWeight: 900 }}>₩{price.toLocaleString()}</span>
          </div>
        </div>

        {/* 포함 내용 */}
        <div style={{
          background: "rgba(251,191,36,0.08)",
          border: "1px solid rgba(251,191,36,0.25)",
          borderRadius: 14, padding: "16px 18px", marginBottom: 24,
        }}>
          <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, margin: "0 0 10px" }}>✨ 대운 해설에 포함된 내용</p>
          {["멘탈 — 이 10년간의 심리적 흐름", "재물·돈의 흐름 — 수입·지출 패턴", "직업·커리어 — 최적의 활동 시기", "인간관계 — 귀인·주의 인물", "현실 — 실생활 체감 흐름", "이 10년을 내 편으로 — 핵심 전략"].map(item => (
            <p key={item} style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, margin: "4px 0", fontWeight: 600 }}>
              • {item}
            </p>
          ))}
        </div>

        {/* 결제 버튼 */}
        <button
          onClick={handleConfirmPay}
          style={{
            width: "100%", padding: "16px 0",
            background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
            color: "#1a0f2e", border: "none", borderRadius: 50,
            fontWeight: 900, fontSize: 16, cursor: "pointer",
            boxShadow: "0 6px 24px rgba(251,191,36,0.4)",
            marginBottom: 12,
          }}
        >
          💳 ₩{price.toLocaleString()} 결제하기
        </button>

        <button
          onClick={() => router.back()}
          style={{
            width: "100%", padding: "13px 0",
            background: "transparent", color: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 50,
            fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}
        >
          ← 돌아가기
        </button>
      </div>
    </main>
  );
}
