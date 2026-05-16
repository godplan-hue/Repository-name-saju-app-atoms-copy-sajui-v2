"use client";

import { useRouter } from "next/navigation";

export default function Refund() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", maxWidth: 900, margin: "0 auto" }}>
        
        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => router.back()} style={{ background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", padding: "10px 16px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>환불정책</h1>
          <p style={{ color: "#999999", fontSize: 12 }}>시행일: 2026년 5월 16일 | 최종 수정일: 2026년 5월 16일</p>
        </div>

        {/* 내용 */}
        <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>
          
          {/* 서문 */}
          <section style={{ marginBottom: 30, padding: 16, background: "rgba(255,20,147,0.1)", borderRadius: 8, border: "1px solid rgba(255,20,147,0.3)" }}>
            <p style={{ color: "#ff1493", fontSize: 14, fontWeight: 900, margin: 0 }}>⚠️ 중요: 본 환불정책은 「전자상거래 등에서의 소비자보호에 관한 법률」을 기준으로 합니다.</p>
          </section>

          {/* 1. 환불 기준 */}
          <section style={{ marginBottom: 30 }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>1. 환불 기준</h2>
            
            <p style={{ color: "#90EE90", fontSize: 14, fontWeight: 900, marginBottom: 8 }}>✅ 환불 가능한 경우:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 16 }}>
              <li>• PDF 다운로드 이전 환불 요청</li>
              <li>• 중복 결제 (같은 상품 2회 이상 결제)</li>
              <li>• 회사 측 기술 오류로 인한 결제</li>
              <li>• 결제 후 7일 이내 요청</li>
            </ul>

            <p style={{ color: "#ff6b6b", fontSize: 14, fontWeight: 900, marginBottom: 8 }}>❌ 환불 불가능한 경우:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• PDF 다운로드 후 요청 (디지털 상품 특성)</li>
              <li>• 결과물 내용에 대한 만족도 불만족</li>
              <li>• 고객 실수로 인한 결제</li>
              <li>• 7일 초과 후 요청</li>
              <li>• 명백한 환불 악용 시도</li>
            </ul>
          </section>

          {/* 2. 환불 절차 및 기간 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>2. 환불 절차 및 기간</h2>
            
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>① 환불 신청:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 방법: support@joomeun.com 이메일 신청</li>
              <li>• 필수 정보: 주문번호, 결제 수단, 환불 사유</li>
            </ul>

            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>② 환불 심사:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 기간: 신청 후 3일 이내</li>
              <li>• 결과: 이메일로 안내</li>
            </ul>

            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>③ 환불 처리:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 승인 후 5일 이내 환불</li>
              <li>• 카드 결제: 3~5일 소요</li>
              <li>• 계좌이체: 1~2일 소요</li>
              <li>• 휴대폰 결제: 해당 통신사 기준</li>
            </ul>
          </section>

          {/* 3. 디지털 상품 환불 정책 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>3. 디지털 상품 환불 정책</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>① 디지털 상품의 특성:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 사주 분석 PDF는 디지털 상품입니다</li>
              <li>• 다운로드 시점부터 제공되는 서비스</li>
              <li>• 다운로드 = 이용 완료</li>
            </ul>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>② 환불 정책:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 다운로드 전: 100% 환불 가능</li>
              <li>• 다운로드 후: 환불 불가 (단, 회사 오류 제외)</li>
              <li>• 전자상거래법 준수 (디지털상품 특례)</li>
            </ul>
          </section>

          {/* 4. 특수 환불 사항 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>4. 특수 상황별 환불</h2>
            
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>① 중복 결제:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 자동 감지 및 즉시 환불</li>
              <li>• 처리 기간: 1일 이내</li>
            </ul>

            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>② 회사 기술 오류:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 환불율: 100%</li>
              <li>• 처리 기간: 1일 이내</li>
              <li>• 재분석 제공 가능</li>
            </ul>

            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>③ 결제 취소 요청:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20 }}>
              <li>• PDF 미다운로드 상태: 결제 취소 가능</li>
              <li>• 즉시 처리 (카드사 확인 후)</li>
            </ul>
          </section>

          {/* 5. 분쟁 해결 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>5. 분쟁 해결 절차</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>① 1단계 (직접 해결):</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• support@joomeun.com으로 문의</li>
              <li>• 3일 이내 답변</li>
            </ul>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>② 2단계 (중재):</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 한국소비자원 (www.kca.go.kr)</li>
              <li>• 1670-0947</li>
            </ul>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>③ 3단계 (소송):</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20 }}>
              <li>• 관할 법원에 소송</li>
              <li>• 소비자 보호법에 따라 진행</li>
            </ul>
          </section>

          {/* 6. 문의 */}
          <section style={{ paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>6. 문의</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20 }}>
              <li>• 이메일: support@joomeun.com</li>
              <li>• 응답 기간: 3일 이내</li>
              <li>• 정책 변경: 30일 전 공지</li>
            </ul>
          </section>
        </div>

        {/* 하단 버튼 */}
        <div style={{ marginTop: 40, textAlign: "center", marginBottom: 40 }}>
          <button onClick={() => router.back()} style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>동의하고 돌아가기</button>
        </div>
      </div>
    </main>
  );
}