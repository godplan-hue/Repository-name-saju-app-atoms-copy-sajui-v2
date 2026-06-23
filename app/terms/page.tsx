"use client";

import { useRouter } from "next/navigation";

export default function Terms() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://i.pinimg.com/736x/74/51/6c/74516ce2acf865e560cbca05007f9507.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", maxWidth: 900, margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => router.push("/main-v2")} style={{ background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", padding: "10px 16px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>이용약관</h1>
          <p style={{ color: "#999999", fontSize: 12 }}>시행일: 2026년 6월 23일 | 최종 수정일: 2026년 6월 23일</p>
        </div>

        {/* 내용 */}
        <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>

          <section style={{ marginBottom: 30 }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제1조 (목적)</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>이 약관은 점운("회사")이 운영하는 웹사이트(이하 "서비스")를 이용함에 있어 회사와 이용자의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제2조 (용어의 정의)</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• "서비스"란 회사가 제공하는 AI 사주 분석 및 관련 부가서비스를 의미합니다.</li>
              <li>• "이용자"란 이 약관에 따라 서비스를 이용하는 일반회원 및 파트너를 의미합니다.</li>
              <li>• "파트너"란 회사와 별도 계약을 통해 자신의 고객에게 서비스를 재판매하는 사업자를 의미합니다.</li>
            </ul>
          </section>

          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제3조 (약관의 효력 및 변경)</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 이 약관은 서비스 화면에 게시하여 공시함으로써 효력이 발생합니다.</li>
              <li>• 회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 시행일 7일 전(이용자에게 불리한 경우 30일 전) 공지합니다.</li>
              <li>• 이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
            </ul>
          </section>

          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제4조 (서비스의 내용)</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>회사는 다음과 같은 서비스를 제공합니다:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
              <li>• 생년월일 기반 AI 사주 분석 콘텐츠 제공(무료/유료)</li>
              <li>• 분석 결과 공유 링크 제공</li>
              <li>• 사업자(파트너) 대상 분석 도구 제공</li>
            </ul>
            <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, margin: 0 }}>※ 본 서비스의 사주 분석 콘텐츠는 오락 및 참고 목적으로 제공되며, 의학적·법률적·재정적 조언을 대체하지 않습니다.</p>
          </section>

          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제5조 (이용계약의 체결)</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 이용계약은 이용자가 이 약관에 동의하고 서비스 이용을 신청함으로써 체결됩니다.</li>
              <li>• 회사는 다음에 해당하는 경우 이용신청을 거부하거나 제한할 수 있습니다: 허위 정보 기재, 타인 명의 도용, 기타 회사가 정한 이용 요건 미충족</li>
            </ul>
          </section>

          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제6조 (서비스의 제공 및 변경·중단)</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</li>
              <li>• 회사는 시스템 점검, 교체, 장애, 천재지변 등 불가피한 사유가 있는 경우 서비스 제공을 일시적으로 중단할 수 있습니다.</li>
              <li>• 회사는 서비스의 내용을 변경할 수 있으며, 중대한 변경 시 사전에 공지합니다.</li>
            </ul>
          </section>

          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제7조 (이용료 및 결제)</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 일부 서비스는 유료이며, 정확한 가격은 결제 화면에 표시됩니다.</li>
              <li>• 결제는 회사가 지정한 전자결제대행사(PG사)를 통해 이루어집니다.</li>
              <li>• 파트너의 서비스 이용료(사용료)는 등급별로 별도 산정되며, 파트너와 회사 간 별도 계약에 따릅니다.</li>
            </ul>
          </section>

          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제8조 (청약철회 및 환불)</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>청약철회 및 환불에 관한 자세한 사항은 <a href="/refund" style={{ color: "#fbbf24", fontWeight: 900 }}>환불정책</a> 페이지를 따릅니다.</p>
          </section>

          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제9조 (회사의 의무)</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 회사는 관련 법령과 이 약관이 금지하는 행위를 하지 않으며, 안정적인 서비스 제공을 위해 노력합니다.</li>
              <li>• 회사는 이용자의 개인정보를 <a href="/privacy" style={{ color: "#fbbf24", fontWeight: 900 }}>개인정보처리방침</a>에 따라 보호합니다.</li>
            </ul>
          </section>

          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제10조 (이용자의 의무 및 금지행위)</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>이용자는 다음 행위를 해서는 안 됩니다:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 타인의 정보를 도용하는 행위</li>
              <li>• 서비스의 운영을 방해하거나 시스템에 무단으로 접근하는 행위</li>
              <li>• 서비스를 이용해 얻은 정보를 회사의 동의 없이 영리 목적으로 복제·배포하는 행위</li>
              <li>• 그 밖에 관련 법령에 위반되는 행위</li>
            </ul>
          </section>

          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제11조 (지적재산권)</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>서비스 내 모든 콘텐츠(디자인, 텍스트, 분석 결과물 등)에 대한 저작권은 회사에 귀속되며, 이용자는 회사의 사전 동의 없이 이를 영리적으로 이용할 수 없습니다.</p>
          </section>

          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제12조 (면책조항)</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 서비스의 사주 분석 콘텐츠는 오락 및 참고 목적이며, 그 정확성·신뢰성을 보장하지 않습니다.</li>
              <li>• 회사는 천재지변, 불가항력, 이용자의 귀책사유로 인한 서비스 장애에 대해 책임을 지지 않습니다.</li>
              <li>• 회사는 무료로 제공하는 서비스에 대해서는 관련 법령에 특별한 규정이 없는 한 책임을 지지 않습니다.</li>
            </ul>
          </section>

          <section style={{ paddingTop: 20, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>제13조 (분쟁해결 및 관할법원)</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 우선 협의를 통해 해결합니다.</li>
              <li>• 협의가 이루어지지 않는 경우, 민사소송법상의 관할 법원에 제소할 수 있습니다.</li>
              <li>• 문의: junga6783@gmail.com · 010-4714-2689</li>
            </ul>
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
