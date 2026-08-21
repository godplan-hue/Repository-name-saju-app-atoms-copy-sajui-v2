"use client";

import { useRouter } from "next/navigation";

export default function Refund() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", background: "#fdf6ec", color: "#4a4038", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", maxWidth: 900, margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => router.push("/main-v2")} style={{ background: "rgba(124,58,237,0.12)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.4)", padding: "10px 16px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
          <h1 style={{ color: "#7c3aed", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>환불정책</h1>
          <p style={{ color: "#999999", fontSize: 12 }}>시행일: 2026년 5월 16일 | 최종 수정일: 2026년 7월 15일</p>
        </div>

        {/* 내용 */}
        <div style={{ background: "rgba(124,58,237,0.05)", padding: 30, borderRadius: 12, border: "1px solid rgba(124,58,237,0.18)" }}>

          {/* 서문 */}
          <section style={{ marginBottom: 30, padding: 16, background: "rgba(251,191,36,0.1)", borderRadius: 8, border: "1px solid rgba(251,191,36,0.35)" }}>
            <p style={{ color: "#d97706", fontSize: 14, fontWeight: 900, margin: 0 }}>⚠️ 중요: 본 환불정책은 「전자상거래 등에서의 소비자보호에 관한 법률」을 기준으로 합니다.</p>
          </section>

          {/* 0. 서비스별 결제 안내 */}
          <section style={{ marginBottom: 30, padding: 16, background: "rgba(139,92,246,0.15)", borderRadius: 8, border: "1px solid rgba(139,92,246,0.4)" }}>
            <h2 style={{ color: "#7c3aed", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>서비스별 결제 안내</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* 사주 */}
              <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.35)", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 900, color: "#7c3aed" }}>🔮 점운 사주 — 핵심 유료 상품</p>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.62)", lineHeight: 1.9 }}>
                  오늘의 운세 1회 무료.<br />
                  990원: 기본 분석.<br />
                  3,900원: 연애·건강·성공·직업·배우자운 등 개별 운세.<br />
                  9,900원~: 여러 운세 묶음 패키지.
                </p>
              </div>

              {/* 풀패스 포함 유료 앱 */}
              <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.35)", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 900, color: "#6d28d9" }}>💎 유료 앱 — 단품 990원 / 4개앱 묶음 5,900원</p>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.62)", lineHeight: 1.9 }}>
                  🌙 꿈해몽 — 꿈 해석·태몽 분석.<br />
                  👶 육아일기 — AI 육아 기록·아기일기·타임캡슐.<br />
                  🐾 펫운 — 반려동물 운세·궁합·음식 안전도.<br />
                  🃏 타로 — AI 타로카드 해석.<br />
                  📔 감정일기 — 감정 기록·치유 일기.<br />
                  🥗 다이어트 — 오행 체질 식단 추천.<br />
                  💰 가계부 — 일기식 재물 기록.
                </p>
              </div>

              {/* 별도 유료 앱 (풀패스 미포함) */}
              <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 900, color: "#b45309" }}>💳 별도 유료 앱 (풀패스 미포함)</p>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.62)", lineHeight: 1.9 }}>
                  💼 직운 — AI 직업·부업 추천. 유료.<br />
                  🎓 합격자소서 — AI 사주 기반 취업 전략 분석. 유료.<br />
                  📅 대운 · 📆 택일 — 사주 메인에서 별도 결제.
                </p>
              </div>

              {/* 완전 무료 앱 */}
              <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 900, color: "#047857" }}>🆓 완전 무료 앱 (결제 없음)</p>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.62)", lineHeight: 1.9 }}>
                  💑 궁합 — 오행 궁합 분석·타로 뽑기.<br />
                  🧠 MBTI — 오행 기질 16유형 분석.<br />
                  🍀 행운번호 — 오행 기반 행운번호 6개.<br />
                  ⭐ 별자리 — 12별자리 오늘 운세.<br />
                  🎬 인생이영화라면 — 내 인생 장르·명장면 분석.<br />
                  🏆 이상형월드컵 — 나만의 이상형 찾기.<br />
                  ✨ 추구미 — 내 감성·스타일 유형 분석.<br />
                  💼 직장버티기 — 오늘 직장 생존 점수 측정.
                </p>
              </div>

              {/* 풀패스 */}
              <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 900, color: "#047857" }}>🔥 4개앱 30일 풀패스 — ₩5,900</p>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.62)", lineHeight: 1.9 }}>
                  감정일기 · 다이어트 · 가계부 · 육아일기(맘케어).<br />
                  30일 동안 4개 앱 전체 이용 가능.
                </p>
              </div>

            </div>
          </section>

          {/* 1. 기본 원칙 */}
          <section style={{ marginBottom: 30, padding: 16, background: "rgba(251,191,36,0.08)", borderRadius: 8, border: "1px solid rgba(251,191,36,0.3)" }}>
            <h2 style={{ color: "#7c3aed", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>1. 기본 원칙</h2>
            <p style={{ color: "#4a4038", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>점운의 사주·합격자소서 분석 결과는 디지털 콘텐츠입니다.<br/>고객이 결과를 열람하면 서비스 이용이 완료됩니다.</p>
            <p style={{ color: "#f97316", fontSize: 14, fontWeight: 900, lineHeight: 1.8, margin: 0 }}>⚠️ AI 분석 결과가 화면에 표시된 이후에는 디지털 콘텐츠 특성상 <span style={{ textDecoration: "underline" }}>어떠한 사유로도 환불이 불가</span>합니다.</p>
          </section>

          {/* 2. 환불 가능 조건 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(124,58,237,0.18)" }}>
            <h2 style={{ color: "#7c3aed", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>2. 환불 가능 조건 (7일 이내)</h2>
            <p style={{ color: "#4a4038", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>다음의 경우 결제수단과 동일한 방법으로 환불 또는 1회 재분석을 선택할 수 있습니다:</p>
            <ul style={{ color: "#4a4038", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 16, listStyle: "none", padding: 0 }}>
              <li>• 심각한 기술 오류로 인한 분석 실패</li>
              <li>• 명백한 오타 또는 문법 오류</li>
              <li>• 내용 누락 또는 손상</li>
              <li>• 회사 시스템 오류로 인한 결함</li>
            </ul>
            <p style={{ color: "#059669", fontSize: 14, fontWeight: 900, marginBottom: 12 }}>담당자 검토 후 오류가 확인되면:</p>
            <ul style={{ color: "#4a4038", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12, listStyle: "none", padding: 0 }}>
              <li>• A) 결제수단과 동일한 방법으로 환불 (100%)</li>
              <li>• B) 1회 재분석 제공</li>
              <li>• (고객이 선택)</li>
            </ul>
          </section>

          {/* 3. 환불 불가능한 경우 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(124,58,237,0.18)" }}>
            <h2 style={{ color: "#7c3aed", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>3. 환불 불가능한 경우</h2>
            <ul style={{ color: "#4a4038", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, listStyle: "none", padding: 0 }}>
              <li>• <span style={{ color: "#f97316", fontWeight: 900 }}>단순 변심에 의한 환불 불가</span></li>
              <li>• 분석 결과의 내용에 만족하지 않음</li>
              <li>• 고객의 실수로 인한 결제</li>
              <li>• 기대치와 다른 결과</li>
              <li>• 7일 초과 후 요청</li>
            </ul>
          </section>

          {/* 4. 환불 신청 방법 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(124,58,237,0.18)" }}>
            <h2 style={{ color: "#7c3aed", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>4. 환불 신청 방법</h2>
            <ul style={{ color: "#4a4038", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12, listStyle: "none", padding: 0 }}>
              <li>• 이메일: info@jeomun.com</li>
              <li>• 필수 정보: 주문번호, 결제 수단, 오류 내용 상세 설명</li>
            </ul>
            <p style={{ color: "#4a4038", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 12 }}>처리 과정:</p>
            <ul style={{ color: "#4a4038", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 12, listStyle: "none", padding: 0 }}>
              <li>• 담당자 검토: 3~5일</li>
              <li>• 처리: 3~7일 이내 (환불) 또는 즉시 (재분석)</li>
            </ul>
          </section>

          {/* 5. 7일 초과 */}
          <section style={{ marginBottom: 30, paddingTop: 20, borderTop: "1px solid rgba(124,58,237,0.18)" }}>
            <h2 style={{ color: "#7c3aed", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>5. 7일 초과</h2>
            <p style={{ color: "#f97316", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginBottom: 0 }}>환불 불가능합니다.</p>
          </section>

          {/* 파트너 회비 환불정책은 파트너정책 페이지로 이동 */}
          <section style={{ marginBottom: 0, paddingTop: 20, borderTop: "1px solid rgba(124,58,237,0.18)" }}>
            <p style={{ color: "#7c3aed", fontSize: 12, fontWeight: 600, margin: 0 }}>※ 파트너 회비 환불정책은 <a href="/partner-policy" style={{ color: "#7c3aed" }}>파트너 정책</a> 페이지에서 확인하실 수 있습니다.</p>
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
