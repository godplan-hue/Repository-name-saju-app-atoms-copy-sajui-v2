"use client";

import { useRouter } from "next/navigation";

export default function Privacy() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", maxWidth: 900, margin: "0 auto" }}>
        
        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => router.back()} style={{ background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", padding: "10px 16px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>개인정보처리방침</h1>
          <p style={{ color: "#999999", fontSize: 14 }}>최종 수정일: 2026년 5월 16일</p>
        </div>

        {/* 내용 */}
        <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>
          
          {/* 1. 개요 */}
          <section style={{ marginBottom: 30 }}>
            <h2 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>1. 개인정보의 처리 목적</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>점운(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 사주 분석 서비스 제공</li>
              <li>• 결제 및 환불 처리</li>
              <li>• 고객 지원 및 문의 응답</li>
              <li>• 서비스 개선 및 통계 분석</li>
              <li>• 법적 의무 준수</li>
            </ul>
          </section>

          {/* 2. 수집 항목 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>2. 수집하는 개인정보의 항목</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>회사는 다음의 개인정보를 수집합니다:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 필수: 이름, 이메일, 전화번호</li>
              <li>• 선택: 생년월일, 출생시간, 출생지</li>
              <li>• 자동수집: IP주소, 접속일시, 이용 기록</li>
            </ul>
          </section>

          {/* 3. 보관 및 삭제 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>3. 개인정보의 보관 및 삭제</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>① 개인정보 보관:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 서비스 제공 기간 동안 안전하게 보관합니다</li>
              <li>• 결제 기록은 5년 보관 (전자상거래법)</li>
              <li>• 고객 요청 시 즉시 삭제 가능</li>
            </ul>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>② 개인정보 삭제:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 고객 요청: 언제든지 삭제 요청 가능</li>
              <li>• 자동삭제: 서비스 종료 후 30일 자동 삭제</li>
              <li>• 법적 요구: 관련 법규에 따라 일정 기간 보관</li>
            </ul>
          </section>

          {/* 4. 보안 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>4. 개인정보의 보안</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>회사는 다음 조치로 개인정보를 보호합니다:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 암호화 전송 (HTTPS)</li>
              <li>• 접근 제한 (최소 권한 원칙)</li>
              <li>• 주기적 보안 감시</li>
              <li>• 직원 교육 및 보안 서약</li>
            </ul>
          </section>

          {/* 5. 제3자 제공 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>5. 제3자 제공</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>회사는 개인정보를 다음 경우를 제외하고 제3자에게 제공하지 않습니다:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 고객의 명시적 동의</li>
              <li>• 법령에 의한 요청</li>
              <li>• 결제 처리 (결제 게이트웨이만)</li>
            </ul>
          </section>

          {/* 6. 고객 권리 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>6. 개인정보 관련 고객 권리</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>고객은 다음 권리를 행사할 수 있습니다:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 열람 권: 자신의 정보 조회</li>
              <li>• 수정 권: 잘못된 정보 수정</li>
              <li>• 삭제 권: 정보 삭제 요청</li>
              <li>• 처리 정지 권: 처리 중단 요청</li>
            </ul>
          </section>

          {/* 7. 문의 */}
          <section style={{ paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, marginBottom: 16 }}>7. 문의</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>개인정보 관련 문의:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginLeft: 20 }}>
              <li>• 이메일: support@joomeun.com</li>
              <li>• 문의 응답 기간: 5일 이내</li>
            </ul>
          </section>
        </div>

        {/* 하단 버튼 */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button onClick={() => router.back()} style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>동의하고 돌아가기</button>
        </div>
      </div>
    </main>
  );
}