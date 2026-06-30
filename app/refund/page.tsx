"use client";

import { useRouter } from "next/navigation";

export default function Refund() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://i.pinimg.com/736x/1c/53/85/1c53852bba912431e0d66d7eb0e1ffc1.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", maxWidth: 900, margin: "0 auto" }}>
        
        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => router.push("/main-v2")} style={{ background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", padding: "10px 16px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>환불정책</h1>
          <p style={{ color: "#999999", fontSize: 12 }}>시행일: 2026년 5월 16일 | 최종 수정일: 2026년 5월 16일</p>
        </div>

        {/* 내용 */}
        <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>
          
          {/* 서문 */}
          <section style={{ marginBottom: 30, padding: 16, background: "rgba(255,20,147,0.1)", borderRadius: 8, border: "1px solid rgba(255,20,147,0.3)" }}>
            <p style={{ color: "#ff1493", fontSize: 14, fontWeight: 900, margin: 0 }}>⚠️ 중요: 본 환불정책은 「전자상거래 등에서의 소비자보호에 관한 법률」을 기준으로 합니다.</p>
          </section>

          {/* 1. 기본 원칙 */}
          <section style={{ marginBottom: 30, padding: 16, background: "rgba(239,68,68,0.12)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.4)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>1. 기본 원칙</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>점운의 사주 분석 결과는 디지털 콘텐츠입니다.<br/>고객이 다운로드하면 서비스 이용이 완료됩니다.</p>
            <p style={{ color: "#ff6b6b", fontSize: 14, fontWeight: 900, lineHeight: 1.8, margin: 0 }}>⚠️ AI 사주 분석 결과가 화면에 표시된 이후에는 디지털 콘텐츠 특성상 <span style={{ textDecoration: "underline" }}>어떠한 사유로도 환불이 불가</span>합니다.</p>
          </section>

          {/* 2. 환불 가능 조건 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>2. 환불 가능 조건 (7일 이내)</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>다음의 경우 현금 환불 또는 1회 재분석을 선택할 수 있습니다:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 16 }}>
              <li>• 심각한 기술 오류로 인한 분석 실패</li>
              <li>• 명백한 오타 또는 문법 오류</li>
              <li>• 내용 누락 또는 손상</li>
              <li>• 회사 시스템 오류로 인한 결함</li>
            </ul>
            <p style={{ color: "#90EE90", fontSize: 14, fontWeight: 900, marginBottom: 12 }}>담당자 검토 후 오류가 확인되면:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• A) 현금 환불 (100%)</li>
              <li>• B) 1회 재분석 제공</li>
              <li>• (고객이 선택)</li>
            </ul>
          </section>

          {/* 3. 환불 불가능한 경우 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>3. 환불 불가능한 경우</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20 }}>
              <li>• 분석 결과의 내용에 만족하지 않음</li>
              <li>• 고객의 실수로 인한 결제</li>
              <li>• 기대치와 다른 결과</li>
              <li>• 7일 초과 후 요청</li>
            </ul>
          </section>

          {/* 4. 환불 신청 방법 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>4. 환불 신청 방법</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 이메일: info@jeomun.com</li>
              <li>• 필수 정보: 주문번호, 결제 수단, 오류 내용 상세 설명</li>
            </ul>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>처리 과정:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 담당자 검토: 3~5일</li>
              <li>• 처리: 3~7일 이내 (환불) 또는 즉시 (재분석)</li>
            </ul>
          </section>

          {/* 5. 7일 초과 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>5. 7일 초과</h2>
            <p style={{ color: "#ff6b6b", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>환불 불가능합니다.</p>
          </section>

          {/* 파트너 회비 환불정책은 파트너정책 페이지로 이동 */}
          <section style={{ marginBottom: 0, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <p style={{ color: "#cbb6ff", fontSize: 12, fontWeight: 600, margin: 0 }}>※ 파트너 회비 환불정책은 <a href="/partner-policy" style={{ color: "#fbbf24" }}>파트너 정책</a> 페이지에서 확인하실 수 있습니다.</p>
          </section>
        </div>

        {/* 하단 버튼 */}
        <div style={{ marginTop: 40, textAlign: "center", marginBottom: 40 }}>
          <button onClick={() => router.push("/main-v2")} style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>동의하고 돌아가기</button>
        </div>
      </div>
    </main>
  );
}