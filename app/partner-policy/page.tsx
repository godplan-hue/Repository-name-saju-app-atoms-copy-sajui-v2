"use client";

import { useRouter } from "next/navigation";

export default function PartnerPolicy() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", maxWidth: 900, margin: "0 auto" }}>
        
        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => router.back()} style={{ background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", padding: "10px 16px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>파트너 정책</h1>
          <p style={{ color: "#999999", fontSize: 12 }}>시행일: 2026년 5월 16일 | 최종 수정일: 2026년 5월 16일</p>
        </div>

        {/* 내용 */}
        <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>
          
          {/* 1. 파트너란 */}
          <section style={{ marginBottom: 30 }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>1. 파트너란?</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>점운의 파트너는 사주 분석 서비스를 고객에게 제공하고 수익을 얻는 사업가입니다.<br/>별도의 기술 지식 없이 점운의 AI 시스템을 활용하여 수익을 창출할 수 있습니다.</p>
          </section>

          {/* 2. 등급별 혜택 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>2. 등급별 혜택</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 무료: 연회비 ₩0 / 월 50명(연 최대 600명) 한도 / 수익 30%</li>
              <li>• 실버: 연회비 ₩150,000 / 월 150명(연 최대 1,800명) 한도 / 수익 40%</li>
              <li>• 골드: 연회비 ₩350,000 / 월 300명(연 최대 3,600명) 한도 / 수익 45%</li>
              <li>• 플래티넘: 연회비 ₩1,000,000 / 월 600명(연 최대 7,200명) 한도 / 수익 55%</li>
              <li>• 다이아: 연회비 ₩2,000,000 / 무제한 / 수익 70%</li>
            </ul>
            <p style={{ color: "#cbb6ff", fontSize: 12, fontWeight: 600, marginTop: 12, marginBottom: 0 }}>※ 수익률은 결제금액에서 카드(PG) 수수료와 부가세를 차감한 순수익 기준입니다.</p>
          </section>

          {/* 3. 수수료율 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>3. 수수료율</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>고객이 결제한 금액의 일정 비율을 수수료로 받습니다.<br/>(등급별로 상이함 - 위 표 참고)</p>
          </section>

          {/* 4. 정산 기간 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>4. 정산 기간</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>매월 25일에 정산합니다.<br/>(결제일 기준 다음달 25일 지급)</p>
          </section>

          {/* 5. 신청 방법 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>5. 신청 방법</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 점운 사이트에서 파트너 가입 신청</li>
              <li>• 담당자 검토 후 승인</li>
              <li>• 파트너 대시보드 접근 가능</li>
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