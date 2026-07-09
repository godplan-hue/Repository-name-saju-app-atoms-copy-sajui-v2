"use client";

import { useState } from "react";
import Link from "next/link";

type CareerType = { id: string; icon: string; title: string; desc: string; income: string; difficulty: string; ohaeng: string[]; tags: string[] };

const CAREER_TYPES: CareerType[] = [
  { id: "content", icon: "📱", title: "SNS 콘텐츠 크리에이터", desc: "인스타그램·유튜브·틱톡에서 내 이야기를 콘텐츠로 만들어 광고비·협찬·구독자 수익을 냅니다.", income: "월 10만~500만원", difficulty: "중", ohaeng: ["화", "목"], tags: ["#재택가능", "#초보가능", "#스마트폰하나로"] },
  { id: "lecture", icon: "🎓", title: "온라인 강의 / 코칭", desc: "탈잉·클래스101·크몽에 내가 잘하는 것을 강의로 올려요. 1개 강의가 수년간 수익을 냅니다.", income: "월 50만~1,000만원", difficulty: "중상", ohaeng: ["목", "화"], tags: ["#탈잉", "#크몽", "#무재고"] },
  { id: "shop", icon: "🛍️", title: "스마트스토어 / 구매대행", desc: "네이버 스마트스토어, 해외 구매대행. 물건을 직접 만들지 않아도 됩니다.", income: "월 30만~300만원", difficulty: "중", ohaeng: ["금", "토"], tags: ["#재고없는구매대행", "#자동화가능"] },
  { id: "translate", icon: "🌏", title: "번역·통역 프리랜서", desc: "영어·일어·중국어 등 언어 능력으로 문서 번역, 화상 통역, 자막 번역 서비스를 제공해요.", income: "월 30만~200만원", difficulty: "하", ohaeng: ["수", "금"], tags: ["#언어능력활용", "#시간자유"] },
  { id: "writing", icon: "✍️", title: "글쓰기 / 카피라이터", desc: "블로그·마케팅 문구·보도자료 등 글을 써주는 서비스. AI 시대에도 사람 감성 글은 강세입니다.", income: "월 20만~150만원", difficulty: "하", ohaeng: ["수", "목"], tags: ["#재택가능", "#초보가능"] },
  { id: "consulting", icon: "💼", title: "1대1 컨설팅 / 멘토링", desc: "내 경험을 직접 전수해주는 컨설팅. 크몽 상위 2%처럼 경력이 곧 상품이 됩니다.", income: "월 100만~500만원", difficulty: "상", ohaeng: ["토", "금"], tags: ["#크몽", "#경력활용", "#고단가"] },
  { id: "design", icon: "🎨", title: "디자인 / 영상 편집", desc: "로고, 썸네일, 쇼츠 편집 등 시각 콘텐츠 제작. Canva·캡컷으로도 충분히 시작 가능해요.", income: "월 30만~300만원", difficulty: "중", ohaeng: ["화", "금"], tags: ["#포트폴리오구축", "#크몽·탈잉"] },
  { id: "realestate", icon: "🏠", title: "부동산 투자 / 임대", desc: "소자본으로 시작하는 지식산업센터, 경매, 갭투자. 공부가 먼저이지만 레버리지가 가장 큽니다.", income: "월 50만~무한대", difficulty: "상", ohaeng: ["토", "금"], tags: ["#레버리지", "#장기수익"] },
  { id: "food", icon: "🍱", title: "배달·밀키트 창업", desc: "집에서 만드는 도시락·반찬·베이킹 제품을 배달의민족, 인스타그램으로 판매합니다.", income: "월 50만~200만원", difficulty: "중", ohaeng: ["토", "화"], tags: ["#요리잘하면OK", "#동네장사"] },
  { id: "ai", icon: "🤖", title: "AI 자동화 대행", desc: "ChatGPT·Claude로 업무 자동화, 콘텐츠 생성, 챗봇 제작을 의뢰받아 작업해요. 지금 가장 뜨는 부업입니다.", income: "월 50만~500만원", difficulty: "중", ohaeng: ["수", "목"], tags: ["#미래직업", "#AI툴활용", "#고성장"] },
];

const QUIZ = [
  { q: "평일 저녁·주말에 부업에 쓸 수 있는 시간은?", options: ["하루 1시간 미만", "하루 1~2시간", "하루 3시간 이상", "퇴사하고 전업으로"] },
  { q: "지금 당장 가장 자신있는 게 뭔가요?", options: ["말하기·가르치기", "글쓰기·기획", "손기술·요리·만들기", "분석·계산·조사"] },
  { q: "수익이 나오는 시기, 어느 쪽을 선호하나요?", options: ["빠르게 소액(1~2달 안에)", "3~6달 기다려도 큰 수익", "잘 모르겠어요"] },
  { q: "지금 하는 일(혹은 경력)은?", options: ["직장인", "주부/육아중", "프리랜서/자영업", "취준생/학생"] },
];

export default function CareerAIPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [answers, setAnswers] = useState<number[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [recommended, setRecommended] = useState<CareerType[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  function answer(idx: number) {
    const next = [...answers, idx];
    if (qIdx < QUIZ.length - 1) {
      setAnswers(next);
      setQIdx(qIdx + 1);
    } else {
      // 추천 로직
      const ans = next;
      const timeAvail = ans[0]; // 0=1h미만, 1=1~2h, 2=3h이상, 3=전업
      const skill = ans[1]; // 0=말/가르치기, 1=글/기획, 2=손기술, 3=분석
      const speed = ans[2]; // 0=빠른소액, 1=장기큰수익, 2=모름
      const career = ans[3]; // 0=직장인, 1=주부, 2=프리랜서, 3=취준생

      let scores: {[k:string]: number} = {};
      CAREER_TYPES.forEach(c => { scores[c.id] = 0; });

      // 시간
      if (timeAvail === 0) { scores["writing"] += 2; scores["translate"] += 2; scores["ai"] += 1; }
      if (timeAvail === 1) { scores["content"] += 2; scores["design"] += 2; scores["shop"] += 1; }
      if (timeAvail >= 2) { scores["lecture"] += 2; scores["consulting"] += 2; scores["realestate"] += 1; }

      // 강점
      if (skill === 0) { scores["lecture"] += 3; scores["consulting"] += 3; scores["content"] += 2; }
      if (skill === 1) { scores["writing"] += 3; scores["ai"] += 2; scores["content"] += 2; }
      if (skill === 2) { scores["food"] += 3; scores["design"] += 2; scores["shop"] += 2; }
      if (skill === 3) { scores["realestate"] += 3; scores["translate"] += 2; scores["consulting"] += 2; }

      // 수익 속도
      if (speed === 0) { scores["writing"] += 2; scores["translate"] += 2; scores["food"] += 2; }
      if (speed === 1) { scores["realestate"] += 3; scores["lecture"] += 2; scores["consulting"] += 2; }

      // 직업
      if (career === 1) { scores["food"] += 2; scores["shop"] += 1; scores["content"] += 1; } // 주부
      if (career === 3) { scores["translate"] += 1; scores["writing"] += 1; scores["ai"] += 2; } // 취준생

      const sorted = CAREER_TYPES.slice().sort((a, b) => (scores[b.id]||0) - (scores[a.id]||0));
      setRecommended(sorted.slice(0, 3));
      setStep("result");
    }
  }

  function restart() { setStep("intro"); setAnswers([]); setQIdx(0); setRecommended([]); }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "white" }}>
      {/* 배경 그라데이션 */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 60%)" }} />

      {/* 네비 */}
      <nav style={{ position: "relative", zIndex: 10, borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 900, color: "#a78bfa", textDecoration: "none" }}>점운</Link>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>💼 AI 부업·진로 추천</span>
        <Link href="/main-v2" style={{ background: "rgba(124,58,237,0.4)", color: "white", borderRadius: 20, padding: "8px 16px", fontSize: 12, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(124,58,237,0.5)" }}>사주 보러가기</Link>
      </nav>

      <div style={{ position: "relative", zIndex: 5, maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>

        {/* INTRO */}
        {step === "intro" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ display: "inline-block", background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.5)", color: "#a78bfa", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
                AI 부업·진로 추천 × 사주 연계
              </div>
              <h1 style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.3, marginBottom: 12 }}>
                나에게 맞는 부업이<br /><span style={{ color: "#a78bfa" }}>따로 있습니다</span>
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 8 }}>
                사업·이직·부업으로 고민 중이신가요?<br />
                4가지 질문으로 당신에게 맞는 부업 유형 3개를 추천드려요
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 28px" }}>
                추천 후 사주로 더 깊이 확인할 수 있어요
              </p>
              <button onClick={() => setStep("quiz")} style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", color: "white", border: "none", borderRadius: 28, padding: "16px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 24px rgba(124,58,237,0.4)" }}>
                부업 추천받기 (4문항)
              </button>
            </div>

            {/* 고민별 사주 연결 */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "28px 24px", marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 6px", color: "#a78bfa" }}>이런 고민, 사주로 먼저 확인해보세요</h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 18px" }}>방향을 잡기 전 타이밍을 아는 게 가장 중요합니다</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { q: "이직해도 될까, 아직 때가 아닐까?", link: "/main-v2", label: "이직운 확인하기", icon: "🔄" },
                  { q: "부업·사업 시작하기 좋은 해인가?", link: "/main-v2", label: "재물·사업운 보기", icon: "💰" },
                  { q: "내 성공운이 언제 제일 강한가?", link: "/main-v2/daewoon", label: "대운 확인하기", icon: "📈" },
                  { q: "어젯밤 꿈이 사업 꿈인가?", link: "/haemong", label: "꿈해몽 풀기", icon: "🌙" },
                ].map(item => (
                  <div key={item.q} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div>
                      <span style={{ fontSize: 16, marginRight: 8 }}>{item.icon}</span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{item.q}</span>
                    </div>
                    <Link href={item.link} style={{ background: "rgba(124,58,237,0.4)", color: "#a78bfa", borderRadius: 14, padding: "6px 14px", fontSize: 11, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(124,58,237,0.4)", whiteSpace: "nowrap", marginLeft: 8 }}>
                      {item.label} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔥 파트너 부업 — 0원 투자 */}
            <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", border: "2px solid rgba(124,58,237,0.5)", borderRadius: 22, padding: "28px 22px", marginBottom: 28 }}>
              <div style={{ display: "inline-block", background: "#dc2626", color: "white", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 700, marginBottom: 12 }}>🔥 지금 가장 빠른 부업</div>
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.3 }}>
                <span style={{ color: "#a78bfa" }}>돈 한 푼 안 들이고</span><br />부업 시작하는 법
              </h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: "0 0 20px", lineHeight: 1.8 }}>
                재고 없음 · 초기 투자 0원 · 결제·분석·고객관리 전부 자동<br />
                <strong style={{ color: "white" }}>내 카카오·인스타·블로그</strong>로 AI 사주 서비스를 홍보하고<br />수익만 가져가는 구조
              </p>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 16px", marginBottom: 18 }}>
                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    { icon: "✅", text: "가입비 없음 — 무료로 파트너 등록" },
                    { icon: "✅", text: "내 브랜드 이름으로 AI 사주 서비스 운영" },
                    { icon: "✅", text: "결제·사주분석·고객관리 — 점운 시스템이 자동 처리" },
                    { icon: "✅", text: "SNS·카카오·블로그에 링크만 공유하면 끝" },
                    { icon: "✅", text: "월 10만~100만원 실질 수익 가능" },
                  ].map(item => (
                    <div key={item.text} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                      <span>{item.icon}</span><span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 14px" }}>
                실제로 탈잉 강사·블로거·인플루언서들이 부업으로 운영 중인 방식입니다
              </p>
              <Link href="/partner" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #ec4899)", color: "white", borderRadius: 22, padding: "13px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>
                점운 파트너 무료 신청하기 →
              </Link>
            </div>

            {/* 전체 부업 목록 */}
            <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 14 }}>10가지 추천 부업 유형</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CAREER_TYPES.map(c => (
                <div key={c.id} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden" }}>
                  <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} style={{ width: "100%", background: "none", border: "none", padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "white" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 28 }}>{c.icon}</span>
                      <div style={{ textAlign: "left" }}>
                        <p style={{ fontSize: 14, fontWeight: 800, margin: "0 0 2px" }}>{c.title}</p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: 0 }}>{c.income}</p>
                      </div>
                    </div>
                    <span style={{ color: "#a78bfa", fontSize: 18 }}>{expanded === c.id ? "−" : "+"}</span>
                  </button>
                  {expanded === c.id && (
                    <div style={{ padding: "0 18px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "12px 0 10px" }}>{c.desc}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                        {c.tags.map(t => <span key={t} style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", borderRadius: 10, padding: "3px 10px", fontSize: 11 }}>{t}</span>)}
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0 }}>💫 사주 오행: {c.ohaeng.join("·")} 기운이 강한 분께 잘 맞아요</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* QUIZ */}
        {step === "quiz" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>질문 {qIdx + 1} / {QUIZ.length}</div>
            <div style={{ background: "rgba(124,58,237,0.2)", borderRadius: 24, padding: "6px", marginBottom: 20, height: 6, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)", height: "100%", borderRadius: 24, width: `${((qIdx+1)/QUIZ.length)*100}%`, transition: "width 0.3s" }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 28, lineHeight: 1.5 }}>{QUIZ[qIdx].q}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {QUIZ[qIdx].options.map((opt, i) => (
                <button key={i} onClick={() => answer(i)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: "16px 20px", fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>추천 부업 TOP 3</h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 24px" }}>당신에게 가장 잘 맞는 부업 유형이에요</p>
            </div>

            {recommended.map((c, i) => (
              <div key={c.id} style={{ background: i === 0 ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.06)", border: i === 0 ? "2px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "24px 20px", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 40 }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      {i === 0 && <span style={{ background: "#7c3aed", color: "white", fontSize: 10, fontWeight: 700, borderRadius: 8, padding: "2px 8px" }}>1순위 추천</span>}
                      <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>{c.title}</h3>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "0 0 8px" }}>{c.income} · 난이도 {c.difficulty}</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 10px" }}>{c.desc}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {c.tags.map(t => <span key={t} style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", borderRadius: 10, padding: "3px 10px", fontSize: 11 }}>{t}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 파트너 부업 카드 */}
            <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", border: "2px solid rgba(124,58,237,0.5)", borderRadius: 20, padding: "22px 20px", marginBottom: 14 }}>
              <div style={{ display: "inline-block", background: "#dc2626", color: "white", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, marginBottom: 10 }}>🔥 이것도 강력 추천</div>
              <h3 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 6px" }}>돈 한 푼 안 들이고 부업 시작</h3>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "0 0 14px", lineHeight: 1.7 }}>점운 파트너가 되면 내 SNS·카카오로 AI 사주 서비스를 판매하고 수익을 가져갑니다. 재고 없음 · 투자 0원 · 시스템 자동화</p>
              <Link href="/partner" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #ec4899)", color: "white", borderRadius: 20, padding: "10px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                파트너 무료 신청 →
              </Link>
            </div>

            {/* 사주 연결 */}
            <div style={{ background: "linear-gradient(135deg, #1a1a2e, #2d1b69)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 22, padding: "28px 22px", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 6px", color: "#a78bfa" }}>이 추천을 사주로 검증해보세요</h3>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "0 0 18px", lineHeight: 1.7 }}>
                부업 추천은 현재 답변 기준이에요. 사주 오행·대운으로 보면<br />
                "지금이 시작할 타이밍인지", "어떤 분야가 천직인지" 더 정확하게 알 수 있어요.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href="/main-v2" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #ec4899)", color: "white", borderRadius: 20, padding: "11px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                  직업·재물운 사주 보기 →
                </Link>
                <Link href="/main-v2/daewoon" style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", color: "white", borderRadius: 20, padding: "11px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
                  나의 대운(큰흐름) 보기 →
                </Link>
                <Link href="/haemong" style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", color: "white", borderRadius: 20, padding: "11px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
                  부업 관련 꿈해몽 →
                </Link>
              </div>
            </div>

            <button onClick={restart} style={{ width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: "13px", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
              다시 추천받기
            </button>
          </>
        )}

        {/* 하단 푸터 연결 */}
        <div style={{ marginTop: 48, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 28, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/main-v2" style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textDecoration: "none" }}>사주 보러가기</Link>
          <Link href="/haemong" style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textDecoration: "none" }}>꿈해몽</Link>
          <Link href="/momcare" style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textDecoration: "none" }}>맘케어</Link>
          <Link href="/resume" style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textDecoration: "none" }}>합격자소서</Link>
        </div>
      </div>
    </div>
  );
}
