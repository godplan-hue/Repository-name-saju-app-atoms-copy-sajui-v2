"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PartnerGuide() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("partnerId");
    if (!id) { router.push("/partner/login"); return; }
    setPartnerId(id);
  }, [router]);

  const handleConfirm = async () => {
    if (confirming) return;
    setConfirming(true);
    try {
      await fetch("/api/partner/confirm-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId }),
      });
    } finally {
      setConfirmed(true);
      setConfirming(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://i.pinimg.com/736x/67/84/94/6784947e21b13a57868d12aaa34ed188.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.65)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, maxWidth: 700, margin: "0 auto", padding: "40px 16px" }}>
        <button onClick={() => router.push("/partner/login")} style={{ background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", padding: "10px 16px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
        <h1 style={{ color: "#fbbf24", fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 900, marginBottom: 24 }}>📘 파트너 운영 가이드</h1>

        {!confirmed ? (
          <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)", textAlign: "center" }}>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 14 }}>상호명 변경, 결과지 발송 방법 등<br/>파트너 운영에 필요한 안내를<br/>확인하실 수 있어요.</p>
            <p style={{ color: "#cbb6ff", fontSize: 12, fontWeight: 600, marginBottom: 20 }}>가이드 확인 시 환불 규정이 적용돼요</p>
            <button onClick={handleConfirm} disabled={confirming} style={{ padding: "12px 32px", background: confirming ? "#999" : "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: confirming ? "not-allowed" : "pointer" }}>
              {confirming ? "처리중..." : "확인하고 보기"}
            </button>
          </div>
        ) : (
          <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>
            <section style={{ marginBottom: 30 }}>
              <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>1. 파트너란?</h2>
              <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>점운의 파트너는 고객에게 직접 사주 분석 서비스를 판매하는 사업가입니다.<br/>고객에게 받는 가격은 파트너가 자유롭게 정하며, 점운의 분석 도구를 사용할 때마다 등급별로 할인된 사용료를 점운에 지불합니다.</p>
            </section>

            <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
              <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>2. 등급별 혜택</h2>
              <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
                <li>• 무료: 연회비 ₩0 / 월 50건(연 최대 600건) 한도 / 사용료 30% 할인</li>
                <li>• 실버: 연회비 ₩280,000 / 월 150건(연 최대 1,800건) 한도 / 사용료 45% 할인</li>
                <li>• 골드: 연회비 ₩480,000 / 월 300건(연 최대 3,600건) 한도 / 사용료 55% 할인</li>
                <li>• 다이아: 연회비 ₩980,000 / 무제한 / 사용료 70% 할인</li>
              </ul>
              <p style={{ color: "#cbb6ff", fontSize: 12, fontWeight: 600, marginTop: 12, marginBottom: 4 }}>※ "사용료 할인"은 분석 1건당 정가에서 등급별로 할인된 가격만 내면 된다는 뜻입니다(예: 다이아는 정가의 30%만 부가세 포함하여 지불).</p>
              <p style={{ color: "#cbb6ff", fontSize: 12, fontWeight: 600, marginTop: 0, marginBottom: 0 }}>※ 유료 등급은 이 사용료 할인·한도뿐 아니라 카카오톡 공유 기능까지 함께 제공됩니다(자세한 내용은 5번 참고).</p>
            </section>

            <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
              <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>3. 사용료 결제 방식</h2>
              <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>고객 정보를 입력해 분석을 생성하는 즉시, 등급별 할인이 적용된 사용료가 자동으로 청구됩니다.<br/>매월 모아서 정산하는 절차 없이, 분석 생성 시점에 바로 처리됩니다.</p>
            </section>

            <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
              <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>4. 신청 방법</h2>
              <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
                <li>• 점운 사이트에서 파트너 가입 신청서 작성(이름·상호명·이메일·비밀번호·전화번호)</li>
                <li>• 가입 즉시 계정이 생성되며, 별도의 승인 절차 없이 바로 로그인하여 이용 가능</li>
                <li>• 같은 이름으로는 중복 가입이 불가하며, 등급을 변경하려면 로그인 후 "등급 업그레이드"를 이용</li>
              </ul>
            </section>

            <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
              <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>5. 결과지 발송 방식</h2>
              <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
                <li>• 결과지에는 "점운" 대신 파트너님이 등록하신 상호명이 자동으로 표시됩니다(가입 시 한 번만 등록하면 이후 모든 결과지에 자동 적용)</li>
                <li>• 실버 등급 이상부터는 결과지를 공유 링크로 만들어 카카오톡 등으로 보낼 수 있습니다(고객이 링크를 누르면 결과를 바로 확인할 수 있어요)</li>
                <li>• 무료 등급이거나, 고객이 카카오톡을 사용하지 않는 경우에는 "🖼️ 이미지 저장" 버튼으로 결과지를 직접 다운로드한 뒤 본인이 원하는 방법으로 직접 전달해야 합니다(이 사이트에서 자동으로 발송해드리지는 않습니다)</li>
              </ul>
            </section>

            <section style={{ paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
              <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>6. 파트너 회비 환불정책</h2>
              <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>아래 항목 중 하나라도 하면 환불 불가능:</p>
              <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 16 }}>
                <li>• 파트너 운영 가이드 확인</li>
                <li>• 온라인 미팅 참석</li>
                <li>• 고객분석 1건 이상 생성</li>
                <li>• 파트너 카톡방 입장</li>
              </ul>
              <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8 }}>7일 초과 → 무조건 환불불가</p>
            </section>

            <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
              <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>7. 내 이용내역 확인</h2>
              <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 14 }}>지금까지 생성한 분석과 그때마다 점운에 지불한 이용료를 확인할 수 있어요.</p>
              <button onClick={() => router.push("/partner/sales")} style={{ padding: "10px 22px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 13, cursor: "pointer" }}>
                💰 내 이용내역 보기
              </button>
            </section>

            <section style={{ paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
              <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>8. 새로 추가된 기능 안내</h2>
              <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 16 }}>
                <li>• 결과지 화면에 "🔊 읽기" 버튼이 추가되어, 글을 음성으로 읽어주는 기능을 쓸 수 있습니다</li>
                <li>• 공유 링크로 받은 결과는 다른 휴대폰이나 다른 브라우저로 열어도 다시 분석할 필요 없이 그대로 이어서 볼 수 있습니다</li>
                <li>• 결과지에 "사주팔자 한눈에 보기"(띠·오행·천간)와 "분야별 운세 점수" 항목이 자동으로 함께 표시됩니다</li>
                <li>• "🖼️ 이미지 저장"으로 패키지처럼 여러 장을 한 번에 받을 때, 모바일에서는 보안 정책상 한 장씩 다운로드 확인을 눌러야 합니다(PC는 한 번에 받아짐)</li>
              </ul>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
