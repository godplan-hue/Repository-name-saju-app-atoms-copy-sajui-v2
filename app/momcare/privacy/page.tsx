import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", gap: 16, alignItems: "center" }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: "#f97316", textDecoration: "none" }}>맘케어</Link>
        <span style={{ fontSize: 14, color: "#6b7280" }}>개인정보처리방침</span>
      </nav>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ background: "white", borderRadius: 18, padding: "36px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", lineHeight: 1.8, color: "#374151" }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>개인정보처리방침</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 32px" }}>시행일: 2026년 7월 1일 | 최종 수정: 2026년 7월 9일</p>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제1조 (개인정보의 수집 목적)</h2>
          <p>맘케어(MomCare, 이하 "회사")는 다음의 목적으로 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px" }}>
            <li>회원 가입 및 관리</li>
            <li>아기 성장 기록 서비스 제공</li>
            <li>유료 서비스 결제 및 관리</li>
            <li>고객 지원 및 문의 응대</li>
            <li>서비스 개선 및 신규 서비스 개발</li>
          </ul>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제2조 (수집하는 개인정보의 항목)</h2>
          <p><strong>필수 항목:</strong> 이름, 이메일 주소, 비밀번호(암호화 저장)</p>
          <p><strong>선택 항목:</strong> 아기 이름, 아기 출생일, 성장 측정값(키/몸무게/머리둘레), 수면·수유·기저귀 기록, 소중한 순간 일기</p>
          <p><strong>자동 수집:</strong> IP 주소, 접속 기기 정보, 서비스 이용 기록, 쿠키(선택적)</p>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제3조 (개인정보의 보유 및 이용 기간)</h2>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px" }}>
            <li>회원 정보: 회원 탈퇴 시까지 (탈퇴 후 30일 이내 삭제)</li>
            <li>결제 기록: 5년 (전자상거래법)</li>
            <li>민원 처리 기록: 3년 (전자상거래법)</li>
            <li>아기 성장 기록: 회원 탈퇴 시까지</li>
          </ul>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제4조 (개인정보의 제3자 제공)</h2>
          <p>회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:</p>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px" }}>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제5조 (개인정보 처리의 위탁)</h2>
          <p>회사는 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다:</p>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px" }}>
            <li>Google Firebase: 데이터 저장 및 인증 서비스 (미국 소재, EU-US 데이터 이전 협정 준수)</li>
            <li>Polar: 결제 처리 (결제 관련 정보에 한함)</li>
          </ul>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제6조 (이용자의 권리와 행사 방법)</h2>
          <p>이용자는 개인정보 주체로서 다음과 같은 권리를 행사할 수 있습니다:</p>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px" }}>
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리 정지 요구</li>
          </ul>
          <p>권리 행사는 momcare@gmail.com으로 서면, 이메일 등을 통해 하실 수 있으며, 10일 이내에 조치하겠습니다.</p>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제7조 (쿠키 사용)</h2>
          <p>회사는 이용자에게 맞춤형 서비스를 제공하기 위해 쿠키를 사용합니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 일부 서비스 이용에 제한이 생길 수 있습니다.</p>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제8조 (개인정보 보호책임자)</h2>
          <p><strong>개인정보 보호책임자:</strong> 맘케어 운영팀</p>
          <p><strong>이메일:</strong> momcare@gmail.com</p>
          <p><strong>응답 시간:</strong> 영업일 기준 3일 이내</p>

          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>제9조 (개인정보처리방침 변경)</h2>
          <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경 사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>

          <div style={{ marginTop: 32, padding: "16px", background: "#f9fafb", borderRadius: 12, fontSize: 13, color: "#6b7280" }}>
            <p style={{ margin: 0 }}>문의사항: momcare@gmail.com | © 2026 MomCare. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
