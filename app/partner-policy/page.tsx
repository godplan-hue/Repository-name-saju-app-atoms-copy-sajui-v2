"use client";

import { useRouter } from "next/navigation";

export default function PartnerPolicy() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://i.pinimg.com/736x/1c/53/85/1c53852bba912431e0d66d7eb0e1ffc1.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflowX: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, minHeight: "100%", background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", maxWidth: 900, margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => router.push("/partner")} style={{ background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", padding: "10px 16px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>파트너 정책</h1>
          <p style={{ color: "#999999", fontSize: 12, marginBottom: 8 }}>시행일: 2026년 5월 16일 | 최종 수정일: 2026년 7월 15일</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.02em" }}>🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱</p>
        </div>

        {/* 부업 안내 카드 */}
        <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(99,102,241,0.2))", border: "2px solid rgba(124,58,237,0.6)", borderRadius: 16, padding: "28px 24px", marginBottom: 28 }}>
          <div style={{ display: "inline-block", background: "#7c3aed", color: "white", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 700, marginBottom: 14 }}>🔥 부업으로 시작하는 분들께</div>
          <h2 style={{ color: "white", fontSize: 18, fontWeight: 900, margin: "0 0 16px", lineHeight: 1.5 }}>돈 한 푼 안 들이고<br />AI 사주 부업을 시작하는 법</h2>
          <ul style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600, lineHeight: 2.2, marginLeft: 4, marginBottom: 16, listStyle: "none", padding: 0 }}>
            <li>✅ <strong>무료 파트너 등록</strong> — 가입비 0원, 즉시 시작</li>
            <li>✅ 고객 생년월일 입력 → AI가 결과지 자동 생성</li>
            <li>✅ 결과지 링크를 카카오·인스타·블로그에 공유</li>
            <li>✅ 고객이 결과지를 열람하면<br />&nbsp;&nbsp;&nbsp;&nbsp;분석 1건 사용료만 납부</li>
            <li>✅ 고객에게 받는 판매 가격은<br />&nbsp;&nbsp;&nbsp;&nbsp;<strong>파트너가 자유롭게 설정</strong></li>
          </ul>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 2, marginBottom: 16 }}>
            <strong style={{ color: "#fbbf24" }}>📌 수익 예시</strong><br />
            분석 1건 사용료: 2,000원 (무료 등급 30% 할인 기준)<br />
            고객에게 받는 가격: 10,000원 ~ 30,000원 (본인이 결정)<br />
            → 1건당 <strong style={{ color: "#fbbf24" }}>8,000 ~ 28,000원 수익</strong>
          </div>
          <a href="/partner/apply" style={{ display: "inline-block", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", borderRadius: 20, padding: "12px 28px", fontSize: 14, fontWeight: 900, textDecoration: "none" }}>
            무료로 파트너 시작하기 →
          </a>
        </div>

        {/* 점운 앱 서비스 구성 */}
        <div style={{ background: "rgba(108,64,200,0.2)", padding: "24px", borderRadius: 16, border: "1px solid rgba(139,92,246,0.4)", marginBottom: 28 }}>
          <div style={{ display: "inline-block", background: "#7c3aed", color: "white", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 700, marginBottom: 16 }}>✨ 점운 앱 서비스 구성 (전체 10개)</div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 16, lineHeight: 1.7 }}>파트너가 고객에게 제공하는 점운 앱 전체 구성입니다.<br />파트너는 사주 분석 서비스를 주로 판매하며, 나머지 앱들은 자동으로 연결됩니다.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* 사주 — 핵심 유료 */}
            <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 900, color: "#fbbf24" }}>🔮 점운 사주 — 핵심 유료 상품</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 2 }}>
                오늘의 운세 1회 무료.<br />
                990원: 기본 분석.<br />
                3,900원: 연애·건강·성공·직업·배우자운 등 개별 운세.<br />
                9,900원~: 여러 운세 묶음 패키지.
              </p>
            </div>

            {/* 풀패스 포함 유료 앱 */}
            <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 900, color: "#fcd34d" }}>💎 유료 앱 — 단품 990원 / 4개앱 묶음 5,900원</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 2 }}>
                🌙 점운 꿈해몽 — 꿈 해석·태몽 분석.<br />
                👶 점운 육아일기 — AI 육아 기록·아기일기·타임캡슐.<br />
                🐾 점운 펫운 — 반려동물 운세·궁합·음식 안전도.<br />
                🃏 점운 타로 — AI 타로카드 해석.<br />
                📔 점운 감정일기 — 감정 기록·치유 일기.<br />
                🥗 점운 다이어트 — 오행 체질 식단 추천.<br />
                💰 점운 가계부 — 일기식 재물 기록.
              </p>
            </div>

            {/* 별도 유료 앱 (풀패스 미포함) */}
            <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 900, color: "#fbbf24" }}>💳 별도 유료 앱 (풀패스 미포함)</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 2 }}>
                💼 점운 직운 — AI 직업·부업 추천. 유료.<br />
                🎓 점운 합격 (합격자소서) — AI 사주 기반 취업 전략 분석. 유료.<br />
                📅 대운 · 📆 택일 — 사주 메인에서 별도 결제.
              </p>
            </div>

            {/* 완전 무료 앱 */}
            <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 900, color: "#a5b4fc" }}>🆓 완전 무료 앱 (결제 없음)</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 2 }}>
                💑 점운 궁합 — 오행 궁합 분석·타로 뽑기. 완전 무료.<br />
                🧠 점운 MBTI — 오행 기질 16유형 분석. 완전 무료.<br />
                🍀 점운 행운번호 — 오행 기반 행운번호 6개. 완전 무료.<br />
                ⭐ 점운 별자리 — 12별자리 오늘 운세. 완전 무료.<br />
                🎬 점운 인생이영화라면 — 내 인생 장르·명장면 분석. 완전 무료.<br />
                🏆 점운 이상형월드컵 — 나만의 이상형 찾기. 완전 무료.<br />
                ✨ 점운 추구미 — 내 감성·스타일 유형 분석. 완전 무료.<br />
                💼 점운 직장버티기 — 오늘 직장 생존 점수 측정. 완전 무료.
              </p>
            </div>

            {/* 4개앱 풀패스 */}
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 900, color: "#6ee7b7" }}>🔥 4개앱 30일 풀패스 — ₩5,900</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 2 }}>
                감정일기 · 다이어트 · 가계부 · 육아일기(맘케어).<br />
                30일 동안 4개 앱 전체 이용 가능.
              </p>
            </div>

          </div>
        </div>

        {/* 본문 */}
        <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>

          {/* 1. 파트너란 */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 14 }}>1. 파트너란?</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 600, lineHeight: 2, margin: 0 }}>
              점운의 파트너는 고객에게 직접 사주 분석 서비스를 판매하는 사업가입니다.<br />
              고객에게 받는 가격은 파트너가 자유롭게 정하며,<br />
              점운의 분석 도구를 사용할 때마다 등급별로 할인된 사용료를 점운에 지불합니다.
            </p>
          </section>

          {/* 2. 등급별 혜택 */}
          <section style={{ marginBottom: 32, paddingTop: 24, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 14 }}>2. 등급별 혜택</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                { grade: "무료", fee: "₩0", limit: "월 30건 (연 최대 360건)", disc: "30% 할인", extra: "" },
                { grade: "실버", fee: "₩280,000/년", limit: "월 150건 (연 최대 1,800건)", disc: "45% 할인", extra: "" },
                { grade: "골드", fee: "₩480,000/년", limit: "월 300건 (연 최대 3,600건)", disc: "55% 할인", extra: "" },
                { grade: "다이아", fee: "₩1,980,000/년", limit: "무제한", disc: "70% 할인", extra: "나만의 독립 사주앱 브랜드 운영" },
              ].map(g => (
                <div key={g.grade} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 10, padding: "12px 14px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 900, color: "#c4b5fd" }}>
                    {g.grade === "다이아" ? "💎" : g.grade === "골드" ? "🥇" : g.grade === "실버" ? "🥈" : "🆓"} {g.grade}
                    <span style={{ color: "#fbbf24", fontWeight: 700, marginLeft: 8 }}>{g.fee}</span>
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>
                    {g.limit} · 사용료 {g.disc}
                    {g.extra && <><br /><span style={{ color: "#fbbf24" }}>✨ {g.extra}</span></>}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ color: "#c4b5fd", fontSize: 12, fontWeight: 600, lineHeight: 1.8, margin: "0 0 6px" }}>
              ※ 사용료 할인이란, 분석 1건당 정가에서 등급별로 할인된 가격만 내면 된다는 뜻입니다.<br />
              &nbsp;&nbsp;&nbsp;(예: 다이아 등급은 정가의 30%만 부가세 포함하여 지불)
            </p>
            <p style={{ color: "#c4b5fd", fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.8 }}>
              ※ 다이아 등급은 나만의 도메인 화면에 보일 패키지 가격도 직접 입력해 원하는 대로 바꿀 수 있어요.
            </p>
          </section>

          {/* 3. 사용료 결제 */}
          <section style={{ marginBottom: 32, paddingTop: 24, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 14 }}>3. 사용료 결제 방식</h2>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 600, lineHeight: 2, margin: 0 }}>
              고객 정보를 입력해 분석을 생성하는 즉시,<br />
              등급별 할인이 적용된 사용료가 자동으로 청구됩니다.<br />
              매월 모아서 정산하는 절차 없이,<br />
              분석 생성 시점에 바로 처리됩니다.
            </p>
          </section>

          {/* 4. 신청 방법 */}
          <section style={{ marginBottom: 32, paddingTop: 24, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 14 }}>4. 신청 방법</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 600, lineHeight: 2.2, marginLeft: 0, marginBottom: 0, listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: 4 }}>① 점운 사이트에서 파트너 가입 신청서 작성<br />&nbsp;&nbsp;&nbsp;&nbsp;(이름·상호명·이메일·비밀번호·전화번호)</li>
              <li style={{ marginBottom: 4 }}>② 가입 즉시 계정이 생성되어 바로 로그인 가능</li>
              <li style={{ marginBottom: 4 }}>③ 단, 실버 이상 유료 등급은 계좌이체로 가입비 입금 후<br />&nbsp;&nbsp;&nbsp;&nbsp;점운에서 입금 확인·승인이 완료되어야 분석 생성 가능<br />&nbsp;&nbsp;&nbsp;&nbsp;(승인 전에는 로그인은 되지만 분석 생성은 막혀있음)</li>
              <li>④ 같은 이름으로는 중복 가입 불가<br />&nbsp;&nbsp;&nbsp;&nbsp;등급 변경 시 로그인 후 "등급 업그레이드" 이용</li>
            </ul>
          </section>

          {/* 5. 결과지 발송 방식 */}
          <section style={{ marginBottom: 32, paddingTop: 24, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 14 }}>5. 결과지 공유 및 발송 방식</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 600, lineHeight: 2.2, marginLeft: 0, marginBottom: 16, listStyle: "none", padding: 0 }}>
              <li>• 파트너 대시보드에서 고객 분석 생성 → 결과지 고유 링크 자동 발급</li>
              <li>• 해당 링크를 카카오톡·문자·인스타 DM·이메일로 고객에게 전송</li>
              <li>• 고객은 링크를 열면 바로 결과지 확인 (로그인 불필요)</li>
              <li>• <strong style={{ color: "#fbbf24" }}>무료 등급도 공유 링크 생성·발송 완전 가능</strong> — 등급 제한 없음</li>
              <li>• 결과지에 파트너 상호명이 자동 표시됨 (내 브랜드로 발송)</li>
            </ul>
            <p style={{ color: "#c4b5fd", fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.8 }}>
              상호명 설정, 운영 가이드 등 자세한 안내는<br />
              파트너 로그인 후 "운영 가이드"에서 확인하실 수 있습니다.
            </p>
          </section>

          {/* 6. 파트너 회비 환불정책 */}
          <section style={{ marginBottom: 0, paddingTop: 24, borderTop: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 14 }}>6. 파트너 회비 환불정책</h2>
            <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginBottom: 10 }}>아래 중 하나라도 해당되면 환불 불가:</p>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 600, lineHeight: 2.2, marginLeft: 0, marginBottom: 16, listStyle: "none", padding: 0 }}>
              <li>• 파트너 운영 가이드 확인</li>
              <li>• 온라인 미팅 참석</li>
              <li>• 고객 분석 1건 이상 생성</li>
              <li>• 파트너 카톡방 입장</li>
            </ul>
            <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginBottom: 14 }}>7일 초과 → 무조건 환불 불가</p>
            <div style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 10, padding: "12px 14px" }}>
              <p style={{ color: "#c4b5fd", fontSize: 12, fontWeight: 700, lineHeight: 1.8, margin: 0 }}>
                ⚠️ 분석 1건당 청구되는 사용료를 입금하지 않은 경우,<br />
                가입비 환불 없이 즉시 탈퇴 처리됩니다.
              </p>
            </div>
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
