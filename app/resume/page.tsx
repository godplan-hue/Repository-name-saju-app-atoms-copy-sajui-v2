"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, FileX, Flame, HelpCircle, RotateCcw } from "lucide-react";

// 간단한 결정론적 합격운 점수 계산 (사주 천간 기반 티저)
function calcHireScore(year: number, month: number, day: number): { score: number; comment: string; emoji: string } {
  // 천간 (연도 기반)
  const gan = ["갑","을","병","정","무","기","경","신","임","계"];
  const ganIdx = (year - 4) % 10;
  const ganChar = gan[Math.abs(ganIdx)];
  // 지지 (연도 기반)
  const ji = ["자","축","인","묘","진","사","오","미","신","유","술","해"];
  const jiIdx = (year - 4) % 12;

  // 월별 가중치 (봄=취업 시즌 강)
  const monthBonus = [6, 8, 10, 9, 7, 5, 4, 5, 9, 10, 8, 6][month - 1] ?? 7;
  // 일자별 변동
  const dayVariance = (day % 7) * 2;
  // 천간별 특성
  const ganBonus: { [k: string]: number } = { 갑: 8, 을: 6, 병: 9, 정: 7, 무: 5, 기: 6, 경: 8, 신: 7, 임: 9, 계: 6 };
  const base = 55 + (ganBonus[ganChar] ?? 7) + monthBonus + dayVariance;
  const score = Math.min(97, Math.max(42, base));

  const comments: { min: number; comment: string; emoji: string }[] = [
    { min: 80, comment: "올해 취업운이 매우 강합니다. 적극적으로 도전하세요!", emoji: "🔥" },
    { min: 70, comment: "올해 안에 좋은 결과를 볼 수 있는 흐름입니다.", emoji: "✨" },
    { min: 60, comment: "준비가 충분하다면 충분히 합격 가능한 운세입니다.", emoji: "📈" },
    { min: 0, comment: "지금 당장보다는 실력을 쌓는 시기입니다. 하지만 자소서 품질로 운을 뒤집을 수 있어요!", emoji: "🛡️" },
  ];
  const c = comments.find(x => score >= x.min)!;
  return { score, comment: c.comment, emoji: c.emoji };
}

const glassCard =
  "rounded-2xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-all duration-300";

const faqItems = [
  { q: "합격서 1회 분석하면 정말 96점이 나와?", a: "네, 실제 AI 분석으로 0-100점 사이의 점수를 받습니다. 1회는 기본 분석(85점), 5회는 심화 분석(94점), 15회는 극강 분석(96점)입니다." },
  { q: "기업별로 다르게 분석해줘?", a: "네! 삼성, LG, SK, 현대, 카카오, 네이버 등 기업별 인재상을 분석하고 맞춤형 수정안을 제시합니다." },
  { q: "환불이 되나?", a: "네, 24시간 100% 환불 보장됩니다. 다만 1회 이용 후에는 환불이 불가능합니다." },
  { q: "구독이 자동 갱신되나?", a: "네, 월 구독과 연 구독은 자동 갱신됩니다. 언제든 취소할 수 있습니다." },
];

export default function ResumePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState("07:00:00:00");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [hireResult, setHireResult] = useState<{ score: number; comment: string; emoji: string } | null>(null);

  function calcScore() {
    const y = parseInt(birthYear); const m = parseInt(birthMonth); const d = parseInt(birthDay);
    if (!y || !m || !d || y < 1950 || y > 2010 || m < 1 || m > 12 || d < 1 || d > 31) {
      alert("생년월일을 올바르게 입력해주세요 (예: 1998 / 3 / 15)"); return;
    }
    setHireResult(calcHireScore(y, m, d));
  }

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const days = Math.floor(now.getTime() / 86400000);
      const end = new Date((Math.floor(days / 7) * 7 + 7) * 86400000);
      const diff = end.getTime() - now.getTime();
      if (diff > 0) {
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${String(d).padStart(2,"0")}:${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
      }
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030014] text-[#F5F5F5] antialiased">
      {/* 배경 */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(124,58,237,0.14),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_60%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_15%_75%,rgba(236,72,153,0.07),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* 뱃지 */}
        <div className="pt-6 pb-2 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-purple-600/80 px-4 py-2 text-xs font-bold text-white">
            <Flame className="size-3.5 text-yellow-300" />
            합격서 — AI 자소서 분석
          </span>
        </div>

        {/* 히어로 */}
        <section className="py-14 text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4 text-white">합격 자소서</h1>
          <p className="text-lg text-gray-300 leading-relaxed mb-2">자소서 붙여넣으면<br />AI가 5초 만에 분석하고</p>
          <p className="text-lg font-bold text-yellow-400">합격 가능성을 높이는<br />맞춤 수정안까지 제시합니다</p>
          <div className="mt-8 space-y-1 text-gray-400 text-sm">
            <p>탈잉 2년 연속 1위 강사 제작</p>
            <p>크몽 상위 2% 프라임 전문가 검증</p>
            <p>수천 건의 합격 자소서로 학습한 AI</p>
          </div>
        </section>

        {/* 🔮 합격운 사주 점수 계산기 */}
        <section className="mb-10">
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#1a1a2e] to-[#2d1b69] p-6 md:p-8">
            <div className="text-center mb-6">
              <span className="inline-block bg-purple-600/60 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-3">🔮 무료 티저 — 합격운 사주 점수</span>
              <h2 className="text-xl font-bold text-white mb-2">올해 내 취업·합격 운세는 몇 점?</h2>
              <p className="text-sm text-gray-400">생년월일로 보는 2026년 취업운 점수</p>
            </div>

            {!hireResult ? (
              <div>
                <div className="flex gap-2 mb-4">
                  <input
                    value={birthYear} onChange={e => setBirthYear(e.target.value)}
                    placeholder="출생년도 (예: 1998)" maxLength={4}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-400"
                  />
                </div>
                <div className="flex gap-2 mb-5">
                  <input
                    value={birthMonth} onChange={e => setBirthMonth(e.target.value)}
                    placeholder="월 (예: 3)" maxLength={2}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-400"
                  />
                  <input
                    value={birthDay} onChange={e => setBirthDay(e.target.value)}
                    placeholder="일 (예: 15)" maxLength={2}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-400"
                  />
                </div>
                <button
                  onClick={calcScore}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3.5 rounded-xl text-base hover:opacity-90 transition"
                >
                  2026년 취업운 점수 보기
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-3">{hireResult.emoji}</div>
                <div className="relative mx-auto mb-4" style={{ width: 140, height: 140 }}>
                  <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                    <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                    <circle cx="70" cy="70" r="58" fill="none" stroke="url(#grad)" strokeWidth="12"
                      strokeDasharray={`${(hireResult.score / 100) * 364} 364`} strokeLinecap="round" />
                    <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white">{hireResult.score}</span>
                    <span className="text-xs text-gray-400">/ 100점</span>
                  </div>
                </div>
                <p className="text-white font-bold text-lg mb-1">2026년 취업운 <span className="text-purple-400">{hireResult.score}점</span></p>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">{hireResult.comment}</p>
                <div className="rounded-xl bg-white/8 border border-white/15 p-4 mb-4 text-left">
                  <p className="text-xs text-yellow-400 font-bold mb-1">⚡ 이 점수는 사주 티저입니다</p>
                  <p className="text-xs text-gray-400 leading-relaxed">자소서 분석 점수와 달리, 이건 2026년 운의 흐름을 보여주는 거예요. 사주 원국(오행, 일주, 대운)까지 보면 정확한 타이밍과 직종을 알 수 있어요.</p>
                </div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link href="/main-v2" className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold px-6 py-3 rounded-full no-underline">
                    정확한 취업운 사주 보기 →
                  </Link>
                  <button onClick={() => setHireResult(null)} className="bg-transparent border border-white/20 text-gray-400 text-sm font-bold px-5 py-3 rounded-full cursor-pointer">
                    다시 계산
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 무료 분석 시작 CTA */}
        <section className="mb-6 text-center">
          <Link
            href="/resume/start"
            className="inline-block w-full max-w-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-black py-5 rounded-2xl shadow-lg shadow-purple-900/30 no-underline"
          >
            🎯 무료로 합격 가능성 분석받기
          </Link>
          <p className="text-xs text-gray-500 mt-2">생년월일 + 직무 입력 → 맞춤 전략 즉시 출력</p>
        </section>

        {/* 가격 카드 */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-6 md:p-8">
            <p className="text-center text-lg font-bold mb-2">유료 심층 분석 — 사주 서비스 포함</p>
            <div className="bg-black/50 rounded-lg p-3 mb-6 border border-yellow-400 text-center">
              <p className="text-yellow-300 font-bold text-sm">🎁 5회 풀코스에 사주 전체 서비스까지 — 따로 사면 훨씬 비싸요</p>
            </div>
            <p className="text-center text-white font-bold mb-1">특가 기한: 7일</p>
            <div className="text-center mb-5 font-mono text-yellow-300 text-2xl font-bold">{timeLeft}</div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* 1회 단품 */}
              <div className="bg-gray-800 rounded-lg p-5 text-center border border-gray-600">
                <p className="font-bold text-white mb-1">1회 분석</p>
                <p className="text-xs text-yellow-400 font-bold mb-1">입문 · 합격률 최고 96점</p>
                <p className="text-gray-500 text-sm line-through">원가: 20,000원</p>
                <p className="text-3xl font-black text-yellow-300 my-2">9,900원</p>
                <p className="text-xs text-gray-400 mb-4">한 번 써보고 싶을 때</p>
                <div className="text-left text-xs text-gray-300 space-y-1 border-t border-gray-700 pt-3">
                  {[
                    "AI 합격 가능성 점수 (최고 96점)",
                    "직무별 합격 전략",
                    "자소서 핵심 키워드 3개",
                    "면접 예상 질문 3개",
                    "🔮 사주 총운 티저",
                  ].map(t=><p key={t}>✅ {t}</p>)}
                  {["기업별 인재상 분석","오행 강점 분석","결과 보관·재열람","사주 전체+대운+택일"].map(t=><p key={t} className="text-gray-600">✗ {t}</p>)}
                </div>
                <button onClick={() => alert("결제 시스템 준비 중입니다. 곧 오픈됩니다!")} className="w-full mt-4 bg-gray-600 text-white font-black py-3 rounded-lg text-sm cursor-pointer border-none">결제하기</button>
              </div>

              {/* 5회 풀코스 — 추천 */}
              <div className="bg-yellow-400 rounded-lg p-5 text-center border-4 border-yellow-300">
                <div className="inline-block bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full mb-2">🔥 이걸 선택하세요</div>
                <p className="font-bold text-black mb-1">5회 풀코스</p>
                <p className="text-xs text-gray-700 font-bold mb-1">모든 기능 · 합격률 최고 98점</p>
                <p className="text-gray-600 text-sm line-through">원가: 99,000원</p>
                <p className="text-3xl font-black text-red-600 my-2">29,900원</p>
                <p className="text-xs text-gray-700 mb-4">회당 5,980원 · 70% 할인</p>
                <div className="text-left text-xs text-gray-700 space-y-1 border-t border-yellow-500 pt-3">
                  {[
                    "AI 합격 가능성 점수 (최고 98점) × 5회",
                    "직무별 맞춤 합격 전략 × 5회",
                    "자소서 핵심 키워드 5개 × 5회",
                    "기업별 인재상 분석 × 5회",
                    "면접 예상 질문 5개 × 5회",
                    "오행으로 보는 나의 강점",
                    "결과 보관 · 언제든 재열람",
                    "🔮 사주 총운+직업운+재물운",
                    "📈 나의 대운(나이대 흐름)",
                    "📅 합격 택일 날짜 1개",
                  ].map(t=><p key={t}>✅ {t}</p>)}
                </div>
                <button onClick={() => alert("결제 시스템 준비 중입니다. 곧 오픈됩니다!")} className="w-full mt-4 bg-red-600 text-white font-black py-3 rounded-lg text-sm cursor-pointer border-none">풀코스 결제하기</button>
              </div>
            </div>
          </div>
        </section>

        {/* 문제 공감 */}
        <section className="py-8">
          <h2 className="text-center text-2xl font-bold text-white mb-6">혹시 이런 고민 있으신가요?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { Icon: FileX, label: "자소서 10번 고쳐도 계속 서류탈락", cls: "text-purple-300 bg-purple-500/10 border-purple-400/20" },
              { Icon: HelpCircle, label: "첨삭받으려면 10-20만원, 너무 비싸", cls: "text-pink-300 bg-pink-500/10 border-pink-400/20" },
              { Icon: RotateCcw, label: "내 자소서가 정말 이 정도밖에 안 될까?", cls: "text-blue-300 bg-blue-500/10 border-blue-400/20" },
            ].map(({ Icon, label, cls }) => (
              <div key={label} className={`${glassCard} p-6`}>
                <div className={`flex size-10 items-center justify-center rounded-xl border ${cls}`}>
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <p className="mt-4 text-sm font-semibold text-[#F5F5F5]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 혜택 */}
        <section className="py-8">
          <h2 className="text-2xl font-bold text-white mb-5">당신이 받게 될 것</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "AI 자소서 분석 + 점수 명시", tone: "purple" },
              { label: "기업별 맞춤 수정안 제시", tone: "pink" },
              { label: "면접 예상 질문 자동 생성", tone: "blue" },
              { label: "합격 사례 비교 분석", tone: "purple" },
            ].map(({ label, tone }) => (
              <li key={label} className={`${glassCard} flex items-center gap-4 p-5`}>
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${
                  tone==="purple"?"border-purple-400/20 bg-purple-500/15 text-purple-200":
                  tone==="pink"?"border-pink-400/20 bg-pink-500/15 text-pink-200":
                  "border-blue-400/20 bg-blue-500/15 text-blue-200"}`}>
                  <Check className="size-4" strokeWidth={2.5} />
                </span>
                <span className="text-sm font-semibold text-[#F5F5F5]">{label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="py-8">
          <p className="text-lg font-bold text-red-400 mb-4">자주 묻는 질문</p>
          <div className="space-y-2">
            {faqItems.map((item, idx) => (
              <div key={idx} className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ===idx ? null : idx)}
                  className="w-full p-4 text-left text-sm font-semibold hover:bg-gray-800 transition flex justify-between items-center"
                >
                  <span>{item.q}</span>
                  <span className="text-yellow-400 ml-4">{openFAQ===idx ? "−" : "+"}</span>
                </button>
                {openFAQ===idx && (
                  <div className="p-4 bg-gray-800 border-t border-gray-700">
                    <p className="text-gray-300 text-sm">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 🔮 사주/꿈해몽 연결 — 취준생의 마음속 궁금증 */}
        <section className="py-8">
          <div className="rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#2d1b69] border border-white/10 p-8">
            <div className="text-center mb-7">
              <span className="inline-block bg-purple-600/80 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-3">점운 × 합격서 연계</span>
              <h2 className="text-xl font-bold text-white mb-2">자소서 쓰다가 이런 생각 드셨죠?</h2>
              <p className="text-sm text-gray-400">취준생들이 가장 많이 찾는 사주·꿈해몽 질문</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {/* 올해 합격 사주 */}
              <div className="bg-white/8 border border-white/15 rounded-xl p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-white mb-2">올해 취업이 될까요?</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">올해 직업운·성공운이 어떤지 사주로 확인해보세요. 지금 이직해야 할 타이밍인지, 더 준비해야 할 시기인지 알 수 있어요.</p>
                <a href="/main-v2" className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold px-5 py-2.5 rounded-full no-underline">
                  취업운 사주 보러가기 →
                </a>
              </div>
              {/* 합격 꿈 꿈해몽 */}
              <div className="bg-white/8 border border-white/15 rounded-xl p-6">
                <div className="text-3xl mb-3">🌙</div>
                <h3 className="font-bold text-white mb-2">어젯밤 꿈이 합격 꿈?</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">시험장 꿈, 합격 발표 꿈, 하늘을 나는 꿈 — 취업을 앞두고 꾸는 꿈들이 무슨 의미인지 꿈해몽 AI가 풀어드려요.</p>
                <a href="/haemong" className="inline-block bg-white/15 border border-white/30 text-white text-xs font-bold px-5 py-2.5 rounded-full no-underline">
                  합격 꿈해몽 풀기 →
                </a>
              </div>
              {/* 내 적성 직업 */}
              <div className="bg-white/8 border border-white/15 rounded-xl p-6">
                <div className="text-3xl mb-3">💼</div>
                <h3 className="font-bold text-white mb-2">내 사주에 맞는 직업은?</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">사주 오행으로 보는 천직(天職). 내가 타고난 재능과 가장 잘 맞는 직업군이 따로 있어요. 방향을 잃었다면 사주로 먼저 확인해보세요.</p>
                <a href="/main-v2" className="inline-block bg-white/15 border border-white/30 text-white text-xs font-bold px-5 py-2.5 rounded-full no-underline">
                  직업운 사주 보러가기 →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8">
          <div className={`${glassCard} px-6 py-10 text-center`}>
            <h2 className="text-2xl font-bold text-white mb-2">지금 바로 자소서 분석 받기</h2>
            <p className="text-sm text-gray-400 mb-6">결제 후 즉시 분석 · 5초 완성 · 24시간 환불 보장</p>
            <button
              onClick={() => alert("서비스 준비 중입니다. 곧 오픈됩니다!")}
              className="w-full max-w-sm bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 rounded-full text-base font-bold text-white shadow-lg shadow-purple-900/30 hover:from-purple-400 hover:to-pink-400 transition-all"
            >
              지금 시작하기 — 특가 할인 받기
            </button>
            <p className="mt-3 text-xs text-gray-500">오늘만 무료 1회 제공 · 이후 유료 전환</p>
          </div>
        </section>

        {/* 타이머 */}
        <div className="text-center py-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl mb-6">
          <p className="font-bold text-white">할인 기간 남은 시간</p>
          <p className="text-4xl font-bold mt-2 font-mono text-white">{timeLeft}</p>
        </div>

        {/* 환불 */}
        <div className="text-center pb-12 text-gray-400">
          <p className="font-semibold">✅ 24시간 100% 환불 보장</p>
          <p className="text-xs mt-1 text-gray-500">(1회 이용 후 환불 불가)</p>
        </div>

      </div>
    </div>
  );
}
