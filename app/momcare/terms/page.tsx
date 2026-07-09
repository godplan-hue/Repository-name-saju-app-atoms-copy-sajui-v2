import Link from "next/link";

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", gap: 16, alignItems: "center" }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: "#f97316", textDecoration: "none" }}>맘케어</Link>
        <span style={{ fontSize: 14, color: "#6b7280" }}>이용약관</span>
      </nav>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ background: "white", borderRadius: 18, padding: "36px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", lineHeight: 1.8, color: "#374151" }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>이용약관</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 32px" }}>시행일: 2026년 7월 1일 | 최종 수정: 2026년 7월 9일</p>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제1조 (목적)</h2>
          <p>이 약관은 맘케어(MomCare, 이하 "회사")가 제공하는 AI 육아 앱 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제2조 (정의)</h2>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px" }}>
            <li>"서비스"란 회사가 제공하는 아기 성장 기록, 수면·수유 트래커, 성장 위기 캘린더, 소중한 순간 저널 등의 육아 지원 서비스를 말합니다.</li>
            <li>"이용자"란 이 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
            <li>"회원"이란 회사와 서비스 이용 계약을 체결하고 이용자 아이디(ID)를 부여받은 자를 말합니다.</li>
            <li>"PRO 회원"이란 유료 구독을 통해 프리미엄 기능을 이용하는 회원을 말합니다.</li>
          </ul>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제3조 (약관의 게시와 개정)</h2>
          <p>회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위에서 이 약관을 개정할 수 있으며, 개정 시 최소 7일 전에 공지합니다.</p>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제4조 (서비스의 제공)</h2>
          <p>회사는 다음의 서비스를 제공합니다:</p>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px" }}>
            <li>성장 위기 캘린더 (생후 156주까지 발달 일정 안내)</li>
            <li>일일 트래커 (수면, 수유, 기저귀, 유축, 기분 기록)</li>
            <li>성장 일기 (키, 몸무게, 머리둘레 기록 및 WHO 기준 비교)</li>
            <li>소중한 순간 저널 (아기의 첫 순간 기록)</li>
            <li>250가지 이상의 발달 운동 가이드</li>
            <li>PRO 회원 전용 무제한 기록 및 고급 분석 기능</li>
          </ul>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제5조 (회원 가입)</h2>
          <p>이용자는 회사가 정한 가입 양식에 따라 회원 정보를 기입하고 이 약관에 동의함으로써 회원 가입을 신청합니다. 회사는 다음 각 호에 해당하는 신청에 대해서는 승낙하지 않습니다:</p>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px" }}>
            <li>타인의 명의를 사용한 경우</li>
            <li>허위 정보를 기재한 경우</li>
            <li>14세 미만인 경우 (법정대리인 동의 필요)</li>
          </ul>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제6조 (유료 서비스 및 결제)</h2>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px" }}>
            <li>무료 플랜: 월 10건 기록 제한, 기본 기능 제공</li>
            <li>PRO 월간: ₩9,900/월 (자동 갱신)</li>
            <li>PRO 연간: ₩83,160/년 (30% 할인, 자동 갱신)</li>
            <li>처음 가입 후 7일간 모든 PRO 기능 무료 체험 가능</li>
          </ul>
          <p>결제는 Polar를 통해 처리되며, 구독은 해지 전까지 자동 갱신됩니다. 환불은 구독 시작 후 7일 이내 요청 시 전액 환불됩니다.</p>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제7조 (이용자의 의무)</h2>
          <p>이용자는 다음 행위를 해서는 안 됩니다:</p>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px" }}>
            <li>서비스 내 허위 정보 등록</li>
            <li>타인의 정보 도용</li>
            <li>회사가 정한 이용 목적 외의 서비스 이용</li>
            <li>회사의 서비스를 상업적 목적으로 무단 이용</li>
          </ul>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제8조 (서비스 중단)</h2>
          <p>회사는 다음의 경우 서비스를 일시적으로 중단할 수 있습니다:</p>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px" }}>
            <li>시스템 점검, 교체, 고장, 통신 두절 등</li>
            <li>국가 비상사태, 정전, 서비스 설비의 장애</li>
          </ul>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제9조 (저작권)</h2>
          <p>회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다. 이용자가 서비스에 입력한 아기 기록 데이터의 소유권은 이용자에게 있으며, 이용자는 언제든지 해당 데이터를 삭제하거나 다운로드할 수 있습니다.</p>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제10조 (책임 제한)</h2>
          <p>회사는 무료로 제공되는 서비스 이용과 관련하여 발생한 손해에 대해서는 책임을 지지 않습니다. 서비스에 제공되는 의료 정보는 참고용이며, 실제 의료 진단이나 치료를 대체하지 않습니다. 모든 의료적 결정은 반드시 소아과 전문의와 상담하시기 바랍니다.</p>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제11조 (분쟁 해결)</h2>
          <p>이 약관과 관련한 분쟁은 대한민국 법률에 따르며, 분쟁 발생 시 대한민국 법원을 관할 법원으로 합니다.</p>

          <div style={{ marginTop: 32, padding: "16px", background: "#f9fafb", borderRadius: 12, fontSize: 13, color: "#6b7280" }}>
            <p style={{ margin: 0 }}>문의사항: momcare@gmail.com | © 2026 MomCare. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
