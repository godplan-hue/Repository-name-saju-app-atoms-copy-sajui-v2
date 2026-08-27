"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function getTodayCount() {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
  const lcg = ((seed * 1664525 + 1013904223) & 0xffffffff) >>> 0;
  const base = 520 + (lcg % 260);
  const block = new Date().getHours() < 8 ? 0 : new Date().getHours() < 16 ? 1 : 2;
  return (base + (block >= 1 ? 380 + (lcg % 180) : 0) + (block >= 2 ? 420 + ((lcg >> 4) % 260) : 0)).toLocaleString();
}

type PartKey = "friend" | "love" | "ex" | "some" | "work" | "family" | "travel";

const PARTS: { key: PartKey; label: string; emoji: string; free: boolean; desc: string }[] = [
  { key: "friend", label: "우정 손절각", emoji: "👭", free: true, desc: "이 친구, 계속 봐야 할까?" },
  { key: "love", label: "연애 손절각", emoji: "💑", free: true, desc: "지금 연애, 이어갈까 끊을까" },
  { key: "ex", label: "전애인 손절각", emoji: "💔", free: true, desc: "전 애인, 진짜 정리했나?" },
  { key: "some", label: "썸·바람 손절각", emoji: "🌫️", free: true, desc: "애매한 관계, 정리할 타이밍" },
  { key: "work", label: "직장 손절각", emoji: "💼", free: true, desc: "동료·상사와의 거리두기" },
  { key: "family", label: "가족 손절각", emoji: "🏠", free: true, desc: "가족과도 선이 필요할 때" },
  { key: "travel", label: "여행 손절각", emoji: "✈️", free: true, desc: "그 사람과 다시 여행 갈까?" },
];

type Q = { q: string; a: string; b: string; aVal: number; bVal: number };

const QUESTION_SETS: Record<PartKey, Q[]> = {
  friend: [
    { q: "단톡방에서 친구가 내 뒷담화를 한 걸 알았을 때", a: "바로 손절, 다신 안 봐", b: "그래도 얼굴 보고 얘기는 해봐야지", aVal: 90, bVal: 20 },
    { q: "친구가 돈을 빌려가고 계속 안 갚을 때", a: "이 관계 여기까지, 손절이다", b: "친구 사이에 돈 얘기 꺼내기 불편해서 넘어간다", aVal: 85, bVal: 15 },
    { q: "약속을 반복해서 늦거나 펑크내는 친구, 나는?", a: "세 번째부턴 연락 안 한다", b: "그래도 이유가 있겠지 하고 넘어간다", aVal: 80, bVal: 25 },
    { q: "친구가 SNS에서 나만 빼고 노는 사진을 자주 올릴 때", a: "굳이 티 안 내고 조용히 멀어진다", b: "서운하지만 내가 예민한가 싶어 참는다", aVal: 70, bVal: 30 },
    { q: "10년지기 친구가 갑자기 연락을 끊었다", a: "나도 딱히 연락 안 하고 정리한다", b: "무슨 일 있나 걱정돼서 계속 연락해본다", aVal: 75, bVal: 10 },
    { q: "친구 모임에서 나만 은근히 소외되는 느낌이 들 때", a: "내가 먼저 발길을 끊는다", b: "내가 더 노력해서 끼어들어야지", aVal: 78, bVal: 20 },
    { q: "친구가 내 험담을 SNS에 은근히 올린 걸 발견했다", a: "캡처해두고 손절 확정", b: "오해일 수도 있으니 직접 물어본다", aVal: 95, bVal: 35 },
    { q: "가치관이 너무 달라서 대화만 하면 싸우는 친구", a: "안 맞으면 안 보는 게 서로 편하다", b: "그래도 오래된 정 때문에 계속 만난다", aVal: 65, bVal: 18 },
    { q: "힘들 때 연락하면 항상 바쁘다고 피하는 친구", a: "나도 이제 그 친구한테 연락 안 한다", b: "바쁘겠거니 하고 이해하려 한다", aVal: 72, bVal: 22 },
    { q: "친구가 내 경조사에 안 왔는데 나는 다 챙겼을 때", a: "이제 나도 안 챙긴다, 기브앤테이크", b: "사정이 있었겠지, 계속 챙긴다", aVal: 68, bVal: 12 },
  ],
  love: [
    { q: "연인이 거짓말한 게 들통났을 때", a: "신뢰 깨지면 끝이다", b: "이유를 들어보고 다시 믿어보려 한다", aVal: 88, bVal: 15 },
    { q: "연인이 내 기념일을 계속 까먹을 때", a: "관심 없다는 뜻, 미련 없이 정리", b: "바빠서 그런거겠지, 서운해도 참는다", aVal: 75, bVal: 10 },
    { q: "권태기가 왔을 때 나는?", a: "설렘이 없으면 굳이 이어갈 이유가 없다", b: "다 겪는 시기니 노력해서 극복한다", aVal: 70, bVal: 18 },
    { q: "싸운 후 연인이 먼저 연락 안 할 때", a: "나도 안 한다, 먼저 굽히는 사람이 지는 거", b: "내가 먼저 연락해서 푼다", aVal: 65, bVal: 12 },
    { q: "연인이 다른 이성과 연락을 자주 하는 걸 알았을 때", a: "설명 필요 없다, 바로 헤어진다", b: "오해일 수 있으니 대화로 풀어본다", aVal: 92, bVal: 30 },
    { q: "연인이 나를 위해 아무것도 바뀌려 하지 않을 때", a: "안 맞는 사람이면 놓아준다", b: "기다리면 언젠가 바뀔 거라 믿는다", aVal: 72, bVal: 14 },
    { q: "주변 친구들이 다 이 사람 아니라고 말릴 때", a: "주변 말도 무시 못하지, 다시 생각해본다", b: "내 눈에 콩깍지 씌었어도 내가 선택한 사람", aVal: 60, bVal: 20 },
    { q: "연인이 힘든 시기에 나를 짐짝 취급할 때", a: "더는 못 참는다, 나도 소중하니까", b: "힘드니까 그런거겠지 이해한다", aVal: 85, bVal: 16 },
    { q: "미래에 대한 그림이 너무 다르다는 걸 느꼈을 때", a: "방향이 다르면 일찍 정리하는 게 맞다", b: "맞춰갈 수 있을 거라 믿고 노력한다", aVal: 68, bVal: 22 },
    { q: "연인이 잠수를 자주 탈 때", a: "몇 번 봐주고 그 다음엔 끝이다", b: "무슨 사정이 있나 걱정하며 기다린다", aVal: 78, bVal: 14 },
  ],
  ex: [
    { q: "헤어진 후 전애인 SNS를 확인하는 빈도는?", a: "확인 안 한지 오래, 관심 없음", b: "솔직히 아직도 종종 들어가본다", aVal: 90, bVal: 10 },
    { q: "전애인이 연락 와서 안부를 물을 때", a: "차단하거나 무시한다", b: "그래도 반가워서 답장은 한다", aVal: 85, bVal: 15 },
    { q: "전애인의 새 연애 소식을 들었을 때", a: "이제 진짜 남이니 아무 감정 없다", b: "묘하게 신경 쓰이고 마음이 복잡하다", aVal: 80, bVal: 12 },
    { q: "헤어지고 나서 전애인 물건이 아직 집에 있다면?", a: "바로 정리해서 버리거나 돌려준다", b: "버리기 애매해서 그냥 둔다", aVal: 75, bVal: 20 },
    { q: "전애인이 다시 만나자고 연락이 온다면?", a: "단호하게 거절, 이미 끝난 인연", b: "흔들려서 고민하게 된다", aVal: 88, bVal: 8 },
    { q: "공통 친구 모임에 전애인도 온다고 할 때", a: "불편하면 그냥 안 나간다", b: "어색해도 얼굴 보고 지낼 수 있다", aVal: 65, bVal: 25 },
    { q: "전애인 생일이 되면 나는?", a: "이제 기억도 안 난다", b: "까먹으려 해도 자꾸 생각난다", aVal: 78, bVal: 14 },
    { q: "전애인이 나에 대해 안 좋게 얘기하고 다닌다는 걸 알았을 때", a: "똑같이 반응할 가치도 없다, 무시", b: "억울해서 해명하고 싶어진다", aVal: 82, bVal: 28 },
    { q: "이별 후 감정 정리에 걸리는 시간은?", a: "짧고 굵게, 금방 툭툭 털어낸다", b: "꽤 오래 걸리는 편이다", aVal: 72, bVal: 10 },
    { q: "전애인과 다시 친구로 지낼 수 있냐고 묻는다면?", a: "불가능, 인연은 거기까지", b: "시간이 지나면 친구로도 가능할 것 같다", aVal: 70, bVal: 22 },
  ],
  some: [
    { q: "썸 타던 상대가 갑자기 연락이 뜸해질 때", a: "바로 감 잡고 마음 접는다", b: "이유가 있겠지 하고 좀 더 기다린다", aVal: 85, bVal: 15 },
    { q: "상대가 나 말고 다른 사람이랑도 썸을 타는 것 같을 때", a: "확인할 필요도 없이 정리한다", b: "확실해질 때까지 지켜본다", aVal: 90, bVal: 20 },
    { q: "밀당이 너무 심하고 애매한 상대라면?", a: "피곤해서 내가 먼저 정리한다", b: "밀당도 재미로 즐기며 계속 만난다", aVal: 78, bVal: 25 },
    { q: "상대가 애매한 연락만 하고 확답을 안 줄 때", a: "명확하지 않으면 시간 낭비, 손절", b: "좋아하는 것 같으니 좀 더 지켜본다", aVal: 82, bVal: 18 },
    { q: "바람 피운 정황을 포착했을 때", a: "두말할 것 없이 바로 끝", b: "믿고 싶어서 변명을 들어본다", aVal: 98, bVal: 5 },
    { q: "상대가 나를 '보험'처럼 대하는 느낌이 들 때", a: "눈치채는 순간 바로 발 뺀다", b: "내가 더 잘하면 진심이 될 거라 생각한다", aVal: 80, bVal: 12 },
    { q: "애매한 관계가 몇 달째 진전이 없을 때", a: "결단을 못 내리면 내가 먼저 끝낸다", b: "언젠가는 사귀게 될 거라 믿는다", aVal: 75, bVal: 16 },
    { q: "상대의 진심이 의심될 때 나의 대처는?", a: "의심되면 이미 끝난 것, 정리한다", b: "직접 물어보고 확인하려 한다", aVal: 73, bVal: 30 },
    { q: "내가 더 좋아하는 게 느껴지는 짝사랑 같은 썸이라면?", a: "자존심 상해서 먼저 정리한다", b: "내 마음이니까 계속 표현해본다", aVal: 77, bVal: 22 },
    { q: "양다리 걸치는 걸 알고도 상대가 사과할 때", a: "사과해도 이미 신뢰는 끝났다", b: "진심으로 사과하면 다시 믿어본다", aVal: 92, bVal: 10 },
  ],
  work: [
    { q: "상사가 부당한 업무를 계속 떠넘길 때", a: "선을 확실히 긋고 거절한다", b: "관계 생각해서 일단 받아준다", aVal: 80, bVal: 20 },
    { q: "동료가 내 성과를 가로챌 때", a: "공식적으로 문제 제기하고 거리 둔다", b: "다음엔 조심하되 크게 문제 안 삼는다", aVal: 85, bVal: 25 },
    { q: "뒷담화하는 동료 무리를 알게 됐을 때", a: "그 무리와 바로 거리를 둔다", b: "내색 안 하고 적당히 어울린다", aVal: 75, bVal: 30 },
    { q: "퇴사한 동료와의 관계는 보통?", a: "일로 만난 사이, 퇴사하면 정리된다", b: "친했던 사람들과는 계속 연락한다", aVal: 78, bVal: 18 },
    { q: "상사가 사적인 시간까지 침범할 때(퇴근 후 연락 등)", a: "명확히 선 긋고 응답 안 한다", b: "눈치 보여서 어쩔 수 없이 응답한다", aVal: 82, bVal: 15 },
    { q: "회식·사내 모임 참여에 대한 내 태도는?", a: "필수 아니면 최대한 빠진다", b: "관계 유지 위해 웬만하면 참여한다", aVal: 65, bVal: 20 },
    { q: "팀원이 반복적으로 민폐를 끼칠 때", a: "거리 두고 최소한만 협업한다", b: "그래도 팀이니까 계속 도와준다", aVal: 70, bVal: 22 },
    { q: "업무 외 사적인 부탁을 계속 하는 동료가 있다면?", a: "확실히 거절하고 선을 긋는다", b: "거절 못해서 계속 들어준다", aVal: 76, bVal: 14 },
    { q: "승진·평가에서 부당한 대우를 받았다고 느낄 때", a: "미련 없이 이직을 준비한다", b: "조금 더 지켜보며 버텨본다", aVal: 72, bVal: 28 },
    { q: "나를 이용만 하는 인맥이라는 걸 깨달았을 때", a: "바로 인맥 정리, 시간 아깝다", b: "그래도 인맥이니 유지해둔다", aVal: 84, bVal: 18 },
  ],
  family: [
    { q: "가족이 계속 선을 넘는 잔소리·간섭을 할 때", a: "거리 두고 물리적으로 떨어져 지낸다", b: "가족이니까 참고 맞춰준다", aVal: 65, bVal: 10 },
    { q: "명절·가족모임에서 상처되는 말을 반복해서 들을 때", a: "참석을 줄이거나 최소화한다", b: "그래도 얼굴은 계속 비춘다", aVal: 60, bVal: 15 },
    { q: "형제·자매가 돈 문제로 계속 부담을 줄 때", a: "단호하게 선을 긋고 거절한다", b: "가족이라 거절이 어려워 들어준다", aVal: 70, bVal: 12 },
    { q: "가족 중 한 명이 정서적으로 나를 지치게 할 때", a: "연락 빈도를 스스로 줄인다", b: "가족이니까 계속 다 받아준다", aVal: 58, bVal: 8 },
    { q: "부모님이 내 인생 결정에 지나치게 간섭할 때", a: "내 삶은 내가 결정한다고 선언한다", b: "부모님 뜻을 최대한 따르려 한다", aVal: 62, bVal: 14 },
    { q: "가족 모임에서 나만 늘 희생하는 역할일 때", a: "이제는 나도 거절할 줄 안다", b: "막내·장남이니까 그냥 감수한다", aVal: 55, bVal: 10 },
    { q: "연락 안 해도 그만인 먼 친척이 무리한 부탁을 할 때", a: "단호히 거절하고 거리를 둔다", b: "어른이니까 어쩔 수 없이 들어준다", aVal: 68, bVal: 16 },
    { q: "가족의 기대에 못 미친다는 말을 반복해서 들을 때", a: "기대에 맞추기보다 내 길을 간다", b: "인정받고 싶어서 계속 맞추려 한다", aVal: 60, bVal: 12 },
    { q: "가족 간 갈등이 반복될 때 내 대처는?", a: "근본적으로 거리를 두는 게 답이라 생각한다", b: "그래도 화해하고 풀어야 한다고 생각한다", aVal: 57, bVal: 18 },
    { q: "가족이라도 나를 존중 안 하는 관계라면?", a: "혈연이어도 손절이 필요할 때가 있다", b: "그래도 가족은 못 끊는 인연이다", aVal: 66, bVal: 6 },
  ],
  travel: [
    { q: "동행자가 계획 없이 매번 나한테만 결정을 미룰 때", a: "다음 여행부터는 같이 안 간다", b: "내가 원래 계획 짜는 거 좋아해서 괜찮다", aVal: 80, bVal: 25 },
    { q: "동행자가 돈 계산을 애매하게 넘어갈 때", a: "이번 여행 끝나면 손절, 다신 안 감", b: "몇 만원인데 그냥 넘어간다", aVal: 85, bVal: 20 },
    { q: "여행 중 동행자의 숨겨진 본모습을 봤을 때", a: "여행 끝나자마자 거리를 둔다", b: "사람 다 그럴 수 있지 이해한다", aVal: 82, bVal: 18 },
    { q: "동행자가 약속시간을 계속 안 지켜서 일정이 꼬일 때", a: "다음 여행 계획엔 넣지 않는다", b: "성격이려니 하고 맞춰준다", aVal: 75, bVal: 22 },
    { q: "동행자와 취향이 너무 안 맞아 매번 부딪힐 때", a: "둘이 여행 다니는 건 여기까지", b: "그래도 추억이 있으니 또 가본다", aVal: 78, bVal: 24 },
    { q: "여행 중 다툰 뒤 상대의 태도가 계속 거슬릴 때", a: "여행지에서 이미 마음이 떠난다", b: "여행 끝나면 자연스레 풀릴 거라 생각한다", aVal: 88, bVal: 15 },
    { q: "동행자가 SNS 사진용으로만 나를 이용하는 느낌일 때", a: "불쾌해서 다음부턴 함께 안 간다", b: "그런갑다 하고 넘어간다", aVal: 72, bVal: 28 },
    { q: "장거리 여행에서 동행자의 컨디션 난이도가 너무 높을 때", a: "체력적으로 힘들어서 관계도 재고하게 된다", b: "힘들어도 끝까지 케어해준다", aVal: 68, bVal: 16 },
    { q: "여행 후에도 계속 연락하고 지낼 사이인가?", a: "여행은 여행, 일상 연락은 잘 안 한다", b: "여행 메이트는 소중해서 계속 연락한다", aVal: 70, bVal: 14 },
    { q: "다시 이 사람과 여행 갈 생각이 있는지?", a: "한 번으로 충분, 다시는 안 간다", b: "다음에 또 가고 싶다", aVal: 90, bVal: 10 },
  ],
};

const PART_MAP: Record<PartKey, { label: string; emoji: string; free: boolean; desc: string }> =
  Object.fromEntries(PARTS.map(p => [p.key, p])) as any;

export default function SonjeolgakPage() {
  const count = getTodayCount();
  const [step, setStep] = useState<"intro" | "form" | "quiz">("intro");
  const [part, setPart] = useState<PartKey | null>(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScores, setQuizScores] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hpField, setHpField] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
      if (p.name) setName(p.name);
      if (p.phone) setPhone(p.phone);
      if (p.email) setEmail(p.email);
    } catch {}
    try {
      const u = localStorage.getItem("sonjeolgak_unlock_until");
      if (u && Number(u) > Date.now()) setPaid(true);
    } catch {}
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("unlocked") === "1") {
      setPaid(true);
    }
  }, []);

  const S = {
    wrap: { minHeight: "100vh", background: "#0a0015", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const },
    label: { fontSize: 12, color: "#9ca3af", marginBottom: 6, display: "block" as const },
    row: { marginBottom: 14 },
    btn: { width: "100%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", border: "none", borderRadius: 22, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer" },
  };

  const selectPart = (key: PartKey) => {
    setPart(key);
    setStep("form");
  };

  const goToQuiz = () => {
    if (hpField) return; // 봇 감지 — 조용히 무시
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 입력해주세요."); return; }
    if (!agreed) { setError("개인정보 수집 동의를 체크해주세요."); return; }
    setError("");
    setQuizIdx(0);
    setQuizScores([]);
    setStep("quiz");
  };

  const pickAnswer = (val: number) => {
    if (!part) return;
    const questions = QUESTION_SETS[part];
    const next = [...quizScores, val];
    if (next.length < questions.length) {
      setQuizScores(next);
      setQuizIdx(quizIdx + 1);
      return;
    }
    setQuizScores(next);
    const avg = Math.round(next.reduce((a, b) => a + b, 0) / next.length);
    analyze(avg);
  };

  const analyze = async (score: number) => {
    if (!part) return;
    const cleanPhone = phone.replace(/\D/g, "");
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/sonjeolgak/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, name: name || "익명", email, marketing: marketingAgreed, part, score }),
      });
      const data = await res.json();
      if (data.id) {
        try {
          const sp = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
          localStorage.setItem("v2_saved_profile", JSON.stringify({ ...sp, name: name || sp.name, phone: cleanPhone || sp.phone, email: email || sp.email }));
        } catch {}
        window.location.href = `/sonjeolgak/result/${data.id}`;
      } else if (data.result) {
        sessionStorage.setItem("sonjeolgak_inline_result", JSON.stringify(data.result));
        window.location.href = `/sonjeolgak/result/inline`;
      } else {
        setError("분석 중 오류가 발생했어요. 다시 시도해주세요.");
      }
    } catch { setError("분석 중 오류가 발생했어요. 다시 시도해주세요."); }
    finally { setLoading(false); }
  };

  const footer = (
    <div style={{ maxWidth: 380, margin: "0 auto", padding: "20px 18px", borderRadius: 20, background: "#0a0020", border: "1px solid rgba(255,255,255,0.15)" }}>
      <p style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700, margin: "0 0 10px" }}>© 2026 점운 · Powered by 점운</p>
      <div style={{ color: "#94a3b8", fontSize: 10.5, lineHeight: 1.9, marginBottom: 14 }}>
        <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신</p>
        <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
        <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
        <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38,<br />7층 7017호(대치동)</p>
        <p style={{ margin: 0 }}>대표전화 010-2106-2689 · 유선 031-585-7255</p>
        <p style={{ margin: "4px 0 0", color: "#f87171", fontWeight: 900, fontSize: 11 }}>※ 전화 문의는 받지 않습니다.<br />카카오톡으로 문의해 주세요.</p>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 12 }}>
        <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "7px 18px", background: "#FEE500", color: "#1a1a1a", borderRadius: 20, textDecoration: "none", fontWeight: 900, fontSize: 12 }}>💬 카카오톡 문의</a>
        <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ display: "inline-block", padding: "7px 18px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, color: "#e2e8f0", textDecoration: "none", fontWeight: 700, fontSize: 12 }}>📧 이메일 문의</a>
      </div>
      <div style={{ fontSize: 11, display: "flex", justifyContent: "center", gap: 12 }}>
        <Link href="/terms" style={{ color: "#6b7280", textDecoration: "none" }}>이용약관</Link>
        <Link href="/privacy" style={{ color: "#6b7280", textDecoration: "none" }}>개인정보처리방침</Link>
        <Link href="/refund" style={{ color: "#6b7280", textDecoration: "none" }}>환불정책</Link>
      </div>
    </div>
  );

  // ---------- 인트로 ----------
  if (step === "intro") {
    return (
      <div style={S.wrap}>
        <div style={S.inner}>
          <div style={{ paddingTop: 40, textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 56, marginBottom: 10 }}>😼🗡️</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px" }}>점운 손절각</h1>
            <p style={{ fontSize: 14, color: "#c4b5fd", margin: 0, lineHeight: 1.6 }}>
              그 관계, 계속 이어갈까요 끊을까요?<br />질문에 답하면 당신의 손절각 지수가 나와요
            </p>
          </div>

          <div style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)", borderRadius: 12, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            <span style={{ fontSize: 16 }}>🔥</span>
            <span style={{ fontSize: 13, color: "#f9a8d4" }}>오늘 <b style={{ color: "#ec4899" }}>{count}명</b>이 손절각을 확인했어요</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {PARTS.map(p => (
              <button key={p.key} onClick={() => selectPart(p.key)}
                style={{
                  position: "relative", textAlign: "left", cursor: "pointer",
                  background: "linear-gradient(135deg,rgba(124,58,237,0.18),rgba(236,72,153,0.12))",
                  border: "1.5px solid rgba(236,72,153,0.4)",
                  borderRadius: 16, padding: "16px 14px",
                }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{p.emoji}</div>
                <p style={{ fontSize: 14, fontWeight: 900, margin: "0 0 4px", color: "white" }}>{p.label}</p>
                <p style={{ fontSize: 11, color: "#d8b4fe", margin: 0, lineHeight: 1.4 }}>{p.desc}</p>
                <span style={{ display: "inline-block", marginTop: 8, fontSize: 10, fontWeight: 900, color: "#4ade80", background: "rgba(74,222,128,0.12)", borderRadius: 8, padding: "2px 8px" }}>무료 테스트</span>
              </button>
            ))}
          </div>

          {!paid && (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "16px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 900, margin: "0 0 6px" }}>💡 7개 파트 전부 무료로 테스트 가능</p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, lineHeight: 1.6 }}>
                손절각 지수·타입은 전부 무료로 확인하고,<br />심층 분석 10가지는 990원 한 번이면 24시간 전체 열람돼요.
              </p>
            </div>
          )}

          {footer}
        </div>
      </div>
    );
  }

  // ---------- 정보입력 폼 ----------
  if (step === "form" && part) {
    const p = PART_MAP[part];
    return (
      <div style={S.wrap}>
        <div style={S.inner}>
          <div style={{ paddingTop: 32, marginBottom: 20 }}>
            <button onClick={() => setStep("intro")} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 13, cursor: "pointer", padding: 0 }}>← 파트 다시 선택</button>
          </div>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>{p.emoji}</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>{p.label}</h2>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>{p.desc}</p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "20px 18px", marginBottom: 16 }}>
            <div style={S.row}><label style={S.label}>이름 또는 별명 (선택)</label><input style={S.input} placeholder="닉네임" value={name} onChange={e => setName(e.target.value)} /></div>
            <div style={S.row}><label style={S.label}>전화번호 ★ 필수</label><input style={S.input} placeholder="01012345678" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} inputMode="numeric" /></div>
            <input type="text" name="website" value={hpField} onChange={e => setHpField(e.target.value)} style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} tabIndex={-1} autoComplete="off" />
            <div onClick={() => setAgreed(v => !v)} style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", userSelect: "none" as const, marginTop: 6 }}>
              <span style={{ fontSize: 18, color: agreed ? "#4ade80" : "#9ca3af", lineHeight: 1 }}>{agreed ? "✅" : "⬜"}</span>
              <span style={{ fontSize: 12, color: agreed ? "#4ade80" : "rgba(255,255,255,0.6)" }}>(필수) 개인정보 수집·이용에 동의합니다.</span>
            </div>
            <div onClick={() => setMarketingAgreed(v => !v)} style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", userSelect: "none" as const, marginTop: 8 }}>
              <span style={{ fontSize: 18, color: marketingAgreed ? "#4ade80" : "#9ca3af", lineHeight: 1 }}>{marketingAgreed ? "✅" : "⬜"}</span>
              <span style={{ fontSize: 12, color: marketingAgreed ? "#4ade80" : "rgba(255,255,255,0.6)" }}>(선택) 마케팅 정보 수신에 동의합니다.</span>
            </div>
          </div>

          {error && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>}

          <button onClick={goToQuiz} style={S.btn}>손절각 테스트 시작하기 →</button>
        </div>
      </div>
    );
  }

  // ---------- 퀴즈 ----------
  if (step === "quiz" && part) {
    const questions = QUESTION_SETS[part];
    const q = questions[quizIdx];
    const progress = Math.round(((quizIdx) / questions.length) * 100);
    return (
      <div style={S.wrap}>
        <div style={S.inner}>
          <div style={{ paddingTop: 32, marginBottom: 20 }}>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#7c3aed,#ec4899)", borderRadius: 99, transition: "width 0.3s" }} />
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, textAlign: "right" }}>{quizIdx + 1} / {questions.length}</p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>🐱</div>
              <p style={{ color: "#a78bfa" }}>손절각 지수 계산 중...</p>
            </div>
          ) : (
            <>
              <div style={{ background: "linear-gradient(135deg,#1a0030,#2d0a4e)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, padding: "26px 20px", marginBottom: 20, textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "white", margin: 0, lineHeight: 1.6 }}>{q.q}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button onClick={() => pickAnswer(q.aVal)} style={{ textAlign: "left", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: "16px 18px", color: "#F5F5F5", fontSize: 14, cursor: "pointer", lineHeight: 1.5 }}>A. {q.a}</button>
                <button onClick={() => pickAnswer(q.bVal)} style={{ textAlign: "left", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: "16px 18px", color: "#F5F5F5", fontSize: 14, cursor: "pointer", lineHeight: 1.5 }}>B. {q.b}</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
