"use client";

import { useState, useEffect } from "react";
import { Check, FileX, Flame, HelpCircle, RotateCcw } from "lucide-react";

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

        {/* 가격 카드 */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-6 md:p-8">
            <p className="text-center text-lg font-bold mb-3">특가 기한: 7일</p>
            <div className="bg-black/50 rounded-lg p-3 mb-6 border border-blue-400 text-center">
              <p className="text-blue-400 font-bold text-sm">이 비결을 아는 사람은 지금 이 순간에도 합격하고 있습니다</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {/* 1회 */}
              <div className="bg-red-700 rounded-lg p-5 text-center">
                <p className="font-bold text-white mb-1">1회 분석</p>
                <p className="text-xs text-gray-200 mb-3">합격률 85점</p>
                <p className="text-gray-300 text-sm line-through">원가: 20,000원</p>
                <p className="text-3xl font-bold text-yellow-300 my-1">14,900원</p>
                <p className="text-xs text-gray-200 mb-3">(25% 할인)</p>
                <div className="text-left text-xs text-gray-200 space-y-1 border-t border-red-600 pt-3">
                  {["AI 자소서 분석","점수 명시 (85점)","Before/After 비교","피드백 3가지","기업별 인재상 분석","표절/GPT 탐지","최적화 팁 3개","면접 질문 3개"].map(t=><p key={t}>✅ {t}</p>)}
                </div>
              </div>

              {/* 5회 — 추천 */}
              <div className="bg-yellow-400 rounded-lg p-5 text-center border-4 border-yellow-500">
                <p className="font-bold text-black mb-1">5회 분석</p>
                <p className="text-xs text-gray-700 mb-3">합격률 94점</p>
                <p className="text-gray-600 text-sm line-through">원가: 100,000원</p>
                <p className="text-3xl font-bold text-red-600 my-1">39,900원</p>
                <p className="text-xs text-gray-700 mb-3">(60% 할인)</p>
                <div className="text-left text-xs text-gray-700 space-y-1 border-t border-yellow-500 pt-3">
                  {["AI 자소서 분석","점수 명시 (94점)","Before/After 비교","피드백 3가지","기업별 인재상 분석","표절/GPT 탐지","최적화 팁 5개","면접 질문 5개","합격 사례 5개"].map(t=><p key={t}>✅ {t}</p>)}
                </div>
              </div>

              {/* 15회 */}
              <div className="bg-gray-900 rounded-lg p-5 text-center">
                <p className="font-bold text-white mb-1">15회 분석</p>
                <p className="text-xs text-yellow-400 font-bold mb-1">★ 제일 저렴 ★</p>
                <p className="text-xs text-gray-300 mb-2">합격률 96점</p>
                <p className="text-gray-400 text-sm line-through">원가: 330,000원</p>
                <p className="text-3xl font-bold text-red-500 my-1">99,000원</p>
                <p className="text-xs text-gray-400 mb-3">(70% 할인)</p>
                <div className="text-left text-xs text-gray-300 space-y-1 border-t border-gray-700 pt-3">
                  {["AI 자소서 분석","점수 명시 (96점)","Before/After 비교","피드백 무제한","기업별 인재상 분석","표절/GPT 탐지","최적화 팁 무제한","면접 질문 무제한","합격 사례 무제한","경쟁 자소서 분석 무제한"].map(t=><p key={t}>✅ {t}</p>)}
                </div>
              </div>
            </div>

            {/* 구독 플랜 */}
            <div className="border-t border-white/20 pt-6">
              <p className="text-center text-lg font-bold text-yellow-300 mb-4">구독 플랜</p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="font-semibold text-white text-base mb-1">월 구독</p>
                  <p className="text-gray-400 text-xs line-through">원가: 월 60,000원</p>
                  <p className="text-yellow-300 font-bold text-xl mt-1">39,900원/월</p>
                  <p className="text-xs text-red-400 mt-1 mb-3">(33% 할인)</p>
                  <div className="text-xs text-gray-300 space-y-1 border-t border-gray-700 pt-3">
                    {["무제한 자소서 분석","점수 명시 (95점+)","기업별 인재상 분석","피드백 5가지"].map(t=><p key={t}>✅ {t}</p>)}
                  </div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border-2 border-red-500">
                  <p className="font-semibold text-white text-base mb-1">연 구독 <span className="text-red-400 text-xs">추천</span></p>
                  <p className="text-gray-400 text-xs line-through">원가: 720,000원</p>
                  <p className="text-red-400 font-bold text-xl mt-1">287,000원/년</p>
                  <p className="text-xs text-red-400 mt-1 mb-3">(60% 할인)</p>
                  <div className="text-xs text-yellow-200 space-y-1 border-t border-red-500 pt-3">
                    {["무제한 자소서 분석","점수 명시 (96점+)","피드백 무제한","경쟁 자소서 분석 무제한"].map(t=><p key={t}>✅ {t}</p>)}
                  </div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border-2 border-yellow-500">
                  <p className="font-semibold text-red-400 text-base mb-1">평생 구독</p>
                  <p className="text-green-400 text-xs font-bold mb-2">★★ 강력추천 VIP ★★</p>
                  <p className="text-gray-400 text-xs line-through">원가: 1,000,000원</p>
                  <p className="text-yellow-300 font-bold text-xl mt-1">499,000원</p>
                  <p className="text-xs text-red-400 mt-1 mb-3">(50% 할인)</p>
                  <div className="text-xs text-gray-300 space-y-1 border-t border-gray-700 pt-3">
                    {["무제한 자소서 분석","점수 명시 (98점)","모든 기능 무제한"].map(t=><p key={t}>✅ {t}</p>)}
                  </div>
                </div>
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
