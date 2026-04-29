'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState('07:00:00:00');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
      const cycleNumber = Math.floor(daysSinceEpoch / 7);
      const cycleStartDate = new Date((cycleNumber * 7) * (1000 * 60 * 60 * 24));
      const cycleEndDate = new Date(cycleStartDate.getTime() + (7 * 24 * 60 * 60 * 1000));
      const diff = cycleEndDate.getTime() - now.getTime();
      
      if (diff > 0) {
        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft(`${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const faqItems = [
    {
      q: "합격서 1회 분석하면 정말 96점이 나와?",
      a: "네, 실제 AI 분석으로 0-100점 사이의 점수를 받습니다. 1회는 기본 분석(85점), 5회는 심화 분석(94점), 15회는 극강 분석(96점)입니다."
    },
    {
      q: "기업별로 다르게 분석해줘?",
      a: "네! 삼성, LG, SK, 현대, 카카오, 네이버 등 기업별 인재상을 분석하고 맞춤형 수정안을 제시합니다."
    },
    {
      q: "환불이 되나?",
      a: "네, 24시간 100% 환불 보장됩니다. 다만 1회 이용 후에는 환불이 불가능합니다."
    },
    {
      q: "구독이 자동 갱신되나?",
      a: "네, 월 구독과 연 구독은 자동 갱신됩니다. 언제든 취소할 수 있습니다."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <div className="pt-6 pb-4 text-center">
        <span className="bg-purple-600 px-4 py-2 rounded-full text-xs font-bold">합격서</span>
      </div>

      {/* 메인 헤드라인 */}
      <div className="text-center mt-10 px-6 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">합격 자소서</h1>
        <h2 className="text-lg md:text-xl text-gray-300 leading-relaxed mb-3">자소서 붙여넣으면<br />AI가 5초 만에 분석하고</h2>
        <p className="text-base md:text-lg font-bold text-yellow-400 leading-relaxed">합격 가능성을 높이는<br />맞춤 수정안까지 제시합니다</p>
      </div>

      {/* 신뢰 배지 */}
      <div className="text-center mt-6 px-6 space-y-1">
        <p className="text-lg text-gray-300">🏆 탈잉 2년 연속 1위 강사 제작</p>
        <p className="text-lg text-gray-300">⭐ 크몽 2% 프라임 전문가 검증</p>
        <p className="text-lg text-gray-300">📊 수천 건의 합격 자소서로 학습한 AI</p>
      </div>

      {/* 특가 할인 박스 (메인!) */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-8 mx-6 mt-12 max-w-5xl mx-auto">
        <p className="text-center text-lg font-bold mb-3">🔥 특가 기한: 7일</p>
        
        {/* 이 비결을 아는 사람은... */}
        <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-6 border border-blue-400">
          <p className="text-center text-blue-400 font-bold text-sm">💡 이 비결을 아는 사람은 지금 이 순간에도 합격하고 있습니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* 1회 */}
          <div className="bg-red-700 rounded-lg p-6 text-center">
            <p className="font-bold text-white mb-2">1회 분석</p>
            <p className="text-xs text-gray-200 mb-3">합격률 85점</p>
            <p className="text-gray-300 text-sm line-through mb-1">원가: 20,000원</p>
            <p className="text-4xl font-bold text-yellow-300">14,900원</p>
            <p className="text-sm text-gray-200 mt-2">(25% 할인)</p>
            <div className="mt-4 text-left text-xs text-gray-200 space-y-1 border-t border-red-600 pt-3">
              <p>✅ AI 자소서 분석</p>
              <p>✅ 점수 명시 (85점)</p>
              <p>✅ Before/After 비교</p>
              <p>✅ 피드백 3가지</p>
              <p>✅ 기업별 인재상 분석</p>
              <p>✅ 표절/GPT 탐지</p>
              <p>✅ 최적화 팁 3개</p>
              <p>✅ 면접 질문 3개</p>
            </div>
          </div>

          {/* 5회 */}
          <div className="bg-yellow-400 rounded-lg p-6 text-center border-4 border-yellow-500">
            <p className="font-bold text-black mb-2">5회 분석</p>
            <p className="text-xs text-gray-700 mb-3">합격률 94점</p>
            <p className="text-gray-600 text-sm line-through mb-1">원가: 100,000원</p>
            <p className="text-4xl font-bold text-red-600">39,900원</p>
            <p className="text-sm text-gray-700 mt-2">(60% 할인)</p>
            <div className="mt-4 text-left text-xs text-gray-700 space-y-1 border-t border-yellow-500 pt-3">
              <p>✅ AI 자소서 분석</p>
              <p>✅ 점수 명시 (94점)</p>
              <p>✅ Before/After 비교</p>
              <p>✅ 피드백 3가지</p>
              <p>✅ 기업별 인재상 분석</p>
              <p>✅ 표절/GPT 탐지</p>
              <p>✅ 최적화 팁 5개</p>
              <p>✅ 면접 질문 5개</p>
              <p>✅ 합격 사례 5개</p>
            </div>
          </div>

          {/* 15회 */}
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <p className="font-bold text-white mb-2">15회 분석</p>
            <p className="text-xs text-yellow-400 mb-3 font-bold">★ 제일 저렴 ★</p>
            <p className="text-xs text-gray-300 mb-3">합격률 96점</p>
            <p className="text-gray-400 text-sm line-through mb-1">원가: 330,000원</p>
            <p className="text-4xl font-bold text-red-500">99,000원</p>
            <p className="text-sm text-gray-400 mt-2">(70% 할인)</p>
            <div className="mt-4 text-left text-xs text-gray-300 space-y-1 border-t border-gray-700 pt-3">
              <p>✅ AI 자소서 분석</p>
              <p>✅ 점수 명시 (96점)</p>
              <p>✅ Before/After 비교</p>
              <p>✅ 피드백 무제한</p>
              <p>✅ 기업별 인재상 분석</p>
              <p>✅ 표절/GPT 탐지</p>
              <p>✅ 최적화 팁 무제한</p>
              <p>✅ 면접 질문 무제한</p>
              <p>✅ 합격 사례 무제한</p>
              <p>✅ 경쟁 자소서 분석 무제한</p>
            </div>
          </div>
        </div>

        {/* 구독 플랜 */}
        <div className="border-t border-white border-opacity-20 pt-6">
          <p className="text-center text-xl font-bold text-yellow-300 mb-4">💎 구독 플랜</p>
          <div className="grid md:grid-cols-3 gap-3">
            {/* 월 구독 */}
            <div className="bg-black bg-opacity-30 p-4 rounded">
              <p className="font-semibold text-white text-lg mb-2">월 구독</p>
              <p className="text-gray-400 text-sm line-through mb-1">원가: 월 60,000원</p>
              <p className="text-yellow-300 font-bold text-2xl">39,900원/월</p>
              <p className="text-xs text-red-500 font-semibold mt-2">(33% 할인)</p>
              <div className="mt-4 text-left text-xs text-gray-300 space-y-1 border-t border-gray-700 pt-3">
                <p>✅ 무제한 자소서 분석</p>
                <p>✅ 점수 명시 (95점+)</p>
                <p>✅ Before/After 비교</p>
                <p>✅ 피드백 5가지</p>
                <p>✅ 기업별 인재상 분석</p>
                <p>✅ 표절/GPT 탐지</p>
                <p>✅ 최적화 팁 월 10개</p>
                <p>✅ 면접 질문 월 10개</p>
                <p>✅ 합격 사례 월 10개</p>
                <p>❌ 경쟁 자소서 분석</p>
              </div>
            </div>

            {/* 연 구독 */}
            <div className="bg-black bg-opacity-30 p-4 rounded border-2 border-red-500">
              <p className="font-semibold text-white text-lg mb-2">연 구독</p>
              <p className="text-red-500 font-bold text-sm mb-1">⭐ 추천</p>
              <p className="text-gray-400 text-sm line-through mb-1">원가: 연 720,000원</p>
              <p className="text-red-500 font-bold text-2xl">287,000원/년</p>
              <p className="text-xs text-red-500 font-semibold mt-2">(60% 할인)</p>
              <p className="text-xs text-gray-300 mt-2">점수 명시 (96점+)</p>
              <div className="mt-4 text-left text-xs text-yellow-200 space-y-1 border-t border-red-500 pt-3">
                <p>✅ 무제한 자소서 분석</p>
                <p>✅ 점수 명시 (96점+)</p>
                <p>✅ Before/After 비교</p>
                <p>✅ 피드백 무제한</p>
                <p>✅ 기업별 인재상 분석</p>
                <p>✅ 표절/GPT 탐지</p>
                <p className="font-bold">✅ 최적화 팁 무제한</p>
                <p className="font-bold">✅ 면접 질문 무제한</p>
                <p className="font-bold">✅ 합격 사례 무제한</p>
                <p className="font-bold">✅ 경쟁 자소서 분석 무제한</p>
              </div>
            </div>

            {/* 평생 구독 */}
            <div className="bg-black bg-opacity-30 p-4 rounded border-2 border-red-500">
              <p className="font-semibold text-red-500 text-lg mb-2">평생 구독</p>
              <p className="text-green-400 font-bold text-sm mb-1">★★ 강력추천 ★★</p>
              <p className="text-green-400 font-bold text-sm mb-3">
                VIP<br />프리미엄
              </p>
              <p className="text-gray-400 text-sm line-through mb-1">원가: 1,000,000원</p>
              <p className="text-yellow-300 font-bold text-2xl">499,000원</p>
              <p className="text-xs text-red-500 font-semibold mt-2">(50% 할인)</p>
              <p className="text-xs text-gray-300 mt-2">최고 등급 (98점)</p>
              <div className="mt-4 text-left text-xs text-gray-300 space-y-1 border-t border-gray-700 pt-3">
                <p>✅ 무제한 자소서 분석</p>
                <p>✅ 점수 명시 (98점)</p>
                <p>✅ Before/After 비교</p>
                <p>✅ 피드백 무제한</p>
                <p>✅ 기업별 인재상 분석</p>
                <p>✅ 표절/GPT 탐지</p>
                <p>✅ 최적화 팁 무제한</p>
                <p>✅ 면접 질문 무제한</p>
                <p>✅ 합격 사례 무제한</p>
                <p>✅ 경쟁 자소서 분석 무제한</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 서비스 특징 */}
      <div className="mt-10 px-6 max-w-5xl mx-auto bg-blue-900 bg-opacity-30 rounded-xl p-6">
        <p className="text-lg font-bold text-blue-300 mb-4">✨ 서비스 특징</p>
        <div className="grid md:grid-cols-2 gap-3">
          <p className="text-gray-300">✅ 점수로 보는 합격률 (85→94→96→98점)</p>
          <p className="text-gray-300">✅ 기업별 맞춤 분석 (삼성, LG, SK 등)</p>
          <p className="text-gray-300">✅ Before/After 명확 제시</p>
          <p className="text-gray-300">✅ 표절/GPT 생성 여부 탐지</p>
          <p className="text-gray-300">✅ 면접 예상 질문 생성 (맞춤형)</p>
          <p className="text-gray-300">✅ 합격 자소서 사례 제공</p>
          <p className="text-gray-300">✅ 경쟁 자소서 분석 (상위 상품)</p>
          <p className="text-gray-300">✅ 기업별 최적화 팁 (전략)</p>
          <p className="text-gray-300">✅ 5초 빠른 분석 (AI 자동)</p>
          <p className="text-gray-300">✅ 24시간 환불 보장</p>
        </div>
      </div>

      {/* 우리의 차별점 */}
      <div className="mt-10 px-6 max-w-5xl mx-auto bg-purple-900 bg-opacity-40 rounded-xl p-6">
        <p className="text-lg font-bold text-purple-300 mb-4">🌟 합격서만의 특별한 것</p>
        <div className="space-y-2">
          <p className="text-gray-300">✅ 투명한 가격 공개 (원가→할인가 명시)</p>
          <p className="text-gray-300">✅ 합격률 점수 명시 (의견 아닌 실제 점수)</p>
          <p className="text-gray-300">✅ 한국 기업 채용 문화 특화 반영</p>
          <p className="text-gray-300">✅ 초고속 피드백 (5초 완성)</p>
          <p className="text-gray-300">✅ 실제 합격자 데이터 기반 (수천 건 학습)</p>
          <p className="text-gray-300">✅ 투명한 환불 정책 (24시간 100%)</p>
        </div>
      </div>

      {/* 이 비결을 아는 사람들은 */}
      <div className="mt-10 px-6 max-w-5xl mx-auto bg-gradient-to-r from-green-900 to-emerald-900 rounded-xl p-6">
        <p className="text-lg font-bold text-green-300 mb-4">💚 이 비결을 아는 사람들은</p>
        <div className="space-y-2">
          <p className="text-gray-200">✓ 서류에서 떨어지지 않습니다</p>
          <p className="text-gray-200">✓ 면접에 자신감 있게 들어갑니다</p>
          <p className="text-gray-200">✓ 면접관에게 강한 인상을 남깁니다</p>
          <p className="text-gray-200">✓ 최종 합격 확률이 3배 높아집니다</p>
        </div>
      </div>

      {/* 모르는 사람들의 문제 */}
      <div className="mt-10 px-6 max-w-5xl mx-auto">
        <p className="text-center text-white font-bold text-lg mb-4">반면, 이것을 모르는 사람들은...</p>
        <div className="space-y-3">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition">
            <p className="font-bold text-lg text-yellow-400">"자소서 10번 고쳐도 계속 서류탈락"</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition">
            <p className="font-bold text-lg text-yellow-400">"첨삭받으려면 10-20만원, 너무 비싸"</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition">
            <p className="font-bold text-lg text-yellow-400">"내 자소서가 정말 이 정도밖에 안 될까?"</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10 px-6 max-w-5xl mx-auto mb-8">
        <p className="text-lg font-bold text-red-500 mb-4">❓ 자주 묻는 질문</p>
        <div className="space-y-2">
          {faqItems.map((item, idx) => (
            <div key={idx} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                className="w-full p-4 text-left font-semibold hover:bg-gray-800 transition flex justify-between items-center"
              >
                <span>{item.q}</span>
                <span className="text-yellow-400">{openFAQ === idx ? '−' : '+'}</span>
              </button>
              {openFAQ === idx && (
                <div className="p-4 bg-gray-800 border-t border-gray-700">
                  <p className="text-gray-300">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA 버튼 */}
      <div className="text-center px-6 max-w-5xl mx-auto mb-8">
        <button
          onClick={() => router.push('/analyze')}
          className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-yellow-300 font-bold py-4 px-8 rounded-lg text-lg transition duration-200 transform hover:scale-105 cursor-pointer"
        >
          지금 시작하기 - 특가 할인 받기
        </button>
      </div>

      {/* 타이머 */}
      <div className="text-center px-6 py-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg mx-6 max-w-5xl mx-auto mb-8">
        <p className="font-bold text-lg">할인 기간 남은 시간</p>
        <p className="text-4xl font-bold mt-3 font-mono">{timeLeft}</p>
      </div>

      {/* 환불 보장 */}
      <div className="text-center px-6 pb-12 text-gray-400">
        <p className="text-lg font-semibold">✅ 24시간 100% 환불 보장</p>
        <p className="text-sm mt-2 text-gray-500">(1회 이용 후 환불 불가)</p>
      </div>
    </div>
  );
}