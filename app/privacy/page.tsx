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
          <p style={{ color: "#999999", fontSize: 12 }}>시행일: 2026년 5월 16일 | 최종 수정일: 2026년 5월 16일</p>
        </div>

        {/* 내용 */}
        <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>
          
          {/* 서문 */}
          <section style={{ marginBottom: 30, padding: 16, background: "rgba(255,20,147,0.1)", borderRadius: 8, border: "1px solid rgba(255,20,147,0.3)" }}>
            <p style={{ color: "#ff1493", fontSize: 14, fontWeight: 900, margin: 0 }}>⚠️ 중요: 점운("회사")은 「개인정보보호법」을 준수하며 고객의 개인정보를 안전하게 보호합니다. 서비스 이용 전 반드시 읽어주세요.</p>
          </section>

          {/* 1. 개인정보 수집 및 이용 목적 */}
          <section style={{ marginBottom: 30 }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>1. 개인정보 수집 및 이용 목적</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>회사는 다음의 목적을 위하여 최소한의 개인정보만 수집합니다:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 16 }}>
              <li>• 서비스 제공 (사주 분석 AI 분석)</li>
              <li>• 결제 및 환불 처리</li>
              <li>• 고객 지원 및 분쟁 해결</li>
              <li>• 법적 의무 이행 (전자상거래법, 통신판매법)</li>
              <li>• 서비스 개선 및 통계 분석 (익명화된 데이터)</li>
            </ul>
          </section>

          {/* 2. 수집하는 개인정보의 항목 및 수집 방법 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>2. 수집하는 개인정보의 항목 및 수집 방법</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>① 직접 수집:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 16 }}>
              <li>• 필수: 이름, 이메일, 전화번호</li>
              <li>• 선택: 생년월일, 출생지, 출생시간</li>
            </ul>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>② 자동 수집:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20 }}>
              <li>• IP 주소, 쿠키, 접속 로그, 이용 기록</li>
              <li>• 목적: 서비스 보안 및 통계</li>
            </ul>
          </section>

          {/* 3. 개인정보의 보유 및 이용 기간 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>3. 개인정보의 보유 및 이용 기간</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>① 기본 원칙:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 16 }}>
              <li>• 수집 목적 달성 시 지체 없이 파기</li>
              <li>• 고객 요청 시 즉시 삭제</li>
            </ul>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>② 법적 보관 기간:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20 }}>
              <li>• 결제 기록: 5년 (전자상거래법)</li>
              <li>• 계약 기록: 5년 (전자상거래법)</li>
              <li>• 회원 가입 정보: 서비스 이용 기간 + 30일</li>
              <li>• 법원/수사 기관 요청: 법적 기간</li>
            </ul>
          </section>

          {/* 4. 개인정보의 안전성 확보 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>4. 개인정보의 안전성 확보</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>회사는 다음 기술적·관리적 조치로 개인정보를 보호합니다:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20 }}>
              <li>• HTTPS 암호화 통신</li>
              <li>• 데이터베이스 암호화</li>
              <li>• 접근 권한 제한 (최소 권한 원칙)</li>
              <li>• 직원 보안 교육</li>
              <li>• 정기적 보안 감시</li>
              <li>• 비밀번호 해싱 저장</li>
            </ul>
          </section>

          {/* 5. 개인정보의 제3자 제공 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>5. 개인정보의 제3자 제공</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>회사는 다음 경우를 제외하고 고객의 개인정보를 제3자에게 제공하지 않습니다:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20 }}>
              <li>• 고객의 명시적 동의</li>
              <li>• 법령에 의한 요청 (경찰, 검찰, 법원)</li>
              <li>• 결제 처리를 위한 결제 게이트웨이 (Toss 등)</li>
            </ul>
          </section>

          {/* 6. 고객의 권리 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>6. 고객의 권리</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>고객은 다음 권리를 행사할 수 있습니다:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 16 }}>
              <li>• 개인정보 열람 요청</li>
              <li>• 개인정보 수정 요청</li>
              <li>• 개인정보 삭제 요청 ("잊혀질 권리")</li>
              <li>• 개인정보 처리 중단 요청</li>
              <li>• 개인정보 이동 요청</li>
              <li>• 마케팅 수신 거부</li>
            </ul>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8 }}>요청 방법: junga6783@gmail.com (7일 이내 처리)</p>
          </section>

          {/* 7. 쿠키 및 추적 기술 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>7. 쿠키 및 추적 기술</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20 }}>
              <li>• 사용 목적: 로그인 상태 유지, 사용자 분석</li>
              <li>• 거부 방법: 브라우저 설정에서 쿠키 차단</li>
              <li>• 거부 시 일부 기능 제한 가능</li>
            </ul>
          </section>

          {/* 8. 문의 및 신고 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>8. 문의 및 신고</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>개인정보 관련 문의:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 16 }}>
              <li>• 이메일: junga6783@gmail.com</li>
              <li>• 응답 기간: 7일 이내</li>
            </ul>
          </section>

          {/* 9. 정책 변경 */}
          <section style={{ paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>9. 정책 변경</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20 }}>
              <li>• 본 방침은 예고 없이 변경될 수 있습니다</li>
              <li>• 주요 변경 사항은 이메일로 사전 공지합니다</li>
              <li>• 공지 후 30일 후 효력 발생</li>
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