"use client";

import { useRouter } from "next/navigation";

export default function PartnerPolicy() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://i.pinimg.com/736x/1c/53/85/1c53852bba912431e0d66d7eb0e1ffc1.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", maxWidth: 900, margin: "0 auto" }}>
        
        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => router.push("/partner")} style={{ background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", padding: "10px 16px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>파트너 정책</h1>
          <p style={{ color: "#999999", fontSize: 12 }}>시행일: 2026년 5월 16일 | 최종 수정일: 2026년 5월 16일</p>
        </div>

        {/* 내용 */}
        <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>
          
          {/* 1. 파트너란 */}
          <section style={{ marginBottom: 30 }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>1. 파트너란?</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>점운의 파트너는 고객에게 직접 사주 분석 서비스를 판매하는 사업가입니다.<br/>고객에게 받는 가격은 파트너가 자유롭게 정하며, 점운의 분석 도구를 사용할 때마다 등급별로 할인된 사용료를 점운에 지불합니다.</p>
          </section>

          {/* 2. 등급별 혜택 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>2. 등급별 혜택</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 무료: 연회비 ₩0 / 월 30건(연 최대 360건) 한도 / 사용료 30% 할인</li>
              <li>• 실버: 연회비 ₩280,000 / 월 150건(연 최대 1,800건) 한도 / 사용료 45% 할인</li>
              <li>• 골드: 연회비 ₩480,000 / 월 300건(연 최대 3,600건) 한도 / 사용료 55% 할인</li>
              <li>• 다이아: 연회비 ₩1,980,000 / 무제한 / 사용료 70% 할인 / 나만의 독립 사주앱 브랜드 운영</li>
            </ul>
            <p style={{ color: "#cbb6ff", fontSize: 12, fontWeight: 600, marginTop: 12, marginBottom: 0 }}>※ "사용료 할인"은 분석 1건당 정가에서 등급별로 할인된 가격만 내면 된다는 뜻입니다(예: 다이아는 정가의 30%만 부가세 포함하여 지불).</p>
          </section>

          {/* 3. 사용료 결제 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>3. 사용료 결제 방식</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>고객 정보를 입력해 분석을 생성하는 즉시, 등급별 할인이 적용된 사용료가 자동으로 청구됩니다.<br/>매월 모아서 정산하는 절차 없이, 분석 생성 시점에 바로 처리됩니다.</p>
          </section>

          {/* 4. 신청 방법 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>4. 신청 방법</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 점운 사이트에서 파트너 가입 신청서 작성(이름·상호명·이메일·비밀번호·전화번호)</li>
              <li>• 가입 즉시 계정이 생성되며, 별도의 승인 절차 없이 바로 로그인하여 이용 가능</li>
              <li>• 같은 이름으로는 중복 가입이 불가하며, 등급을 변경하려면 로그인 후 "등급 업그레이드"를 이용</li>
            </ul>
          </section>

          {/* 5. 결과지 발송 방식 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>5. 결과지 발송 방식</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>결과지 상호명 표시 등 운영에 필요한 자세한 안내는 파트너 로그인 후 "운영 가이드"에서 확인하실 수 있습니다.</p>
          </section>

          {/* 6. 파트너 회비 환불정책 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>6. 파트너 회비 환불정책</h2>
            <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>아래 항목 중 하나라도 하면 환불 불가능:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 16 }}>
              <li>• 파트너 운영 가이드 확인</li>
              <li>• 온라인 미팅 참석</li>
              <li>• 고객분석 1건 이상 생성</li>
              <li>• 파트너 카톡방 입장</li>
            </ul>
            <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginBottom: 16 }}>7일 초과 → 무조건 환불불가</p>
            <p style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 800, lineHeight: 1.8, margin: 0 }}>⚠️ 가입비를 입금하지 않고 분석(결과지)을 생성한 경우, 가입비 환불 없이 즉시 탈퇴 처리됩니다.</p>
          </section>
        </div>

        {/* 하단 버튼 */}
        <div style={{ marginTop: 40, textAlign: "center", marginBottom: 40 }}>
          <button onClick={() => router.push("/partner")} style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>동의하고 돌아가기</button>
        </div>
      </div>
    </main>
  );
}