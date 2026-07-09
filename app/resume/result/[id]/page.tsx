"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Result = {
  name: string; field: string; companySize: string; company: string;
  oh: string; score: number; trait: string; ohKeyword: string; ohAdvice: string;
  fieldKeywords: string[]; fieldStrategy: string; interview: string[];
  sizeStrategy: string; createdAt: number;
};

const ohEmoji: Record<string,string> = { 목:"🌿", 화:"🔥", 토:"🌍", 금:"💎", 수:"💧" };
const ohColor: Record<string,string> = { 목:"#22c55e", 화:"#ef4444", 토:"#f59e0b", 금:"#6366f1", 수:"#3b82f6" };

export default function ResumeResultPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/resume/analyze?id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.result) setResult(d.result); else setError("결과를 찾을 수 없어요."); })
      .catch(() => setError("불러오기 실패"))
      .finally(() => setLoading(false));
  }, [id]);

  function share() {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: "나의 합격 전략 분석", url });
    else navigator.clipboard?.writeText(url).then(() => alert("링크가 복사됐어요!"));
  }

  if (loading) return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center text-white">
      <div className="text-center"><div className="text-4xl mb-4 animate-spin">⚙️</div><p>분석 결과를 불러오는 중...</p></div>
    </div>
  );
  if (error || !result) return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center text-white">
      <div className="text-center"><p className="text-red-400 mb-4">{error || "결과 없음"}</p><Link href="/resume/start" className="text-purple-400">← 다시 분석하기</Link></div>
    </div>
  );

  const ohC = ohColor[result.oh] ?? "#a78bfa";
  const ohE = ohEmoji[result.oh] ?? "✨";

  return (
    <div className="relative min-h-screen bg-[#030014] text-[#F5F5F5] antialiased" style={{ fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(124,58,237,0.14),transparent_55%)]" />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">

        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/resume" className="text-purple-400 text-sm">← 합격자소서</Link>
          <button onClick={share} className="bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full">공유하기 📤</button>
        </div>

        {/* 상단 점수 카드 */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#2d1b69] border border-purple-500/30 p-7 mb-5 text-center">
          <div className="text-xs text-gray-400 mb-1">{result.name}님의 합격 가능성 분석</div>
          <div className="text-xs text-gray-500 mb-5">{result.field} · {result.companySize}{result.company ? ` · ${result.company}` : ""}</div>

          {/* 원형 점수 */}
          <div className="relative mx-auto mb-4" style={{ width: 148, height: 148 }}>
            <svg viewBox="0 0 148 148" className="w-full h-full -rotate-90">
              <circle cx="74" cy="74" r="62" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
              <circle cx="74" cy="74" r="62" fill="none" stroke="url(#rg)" strokeWidth="12"
                strokeDasharray={`${(result.score/100)*390} 390`} strokeLinecap="round" />
              <defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{result.score}</span>
              <span className="text-xs text-gray-400">/ 100점</span>
            </div>
          </div>

          <div className="text-lg font-bold text-white mb-1">
            {result.score >= 80 ? "🔥 합격 가능성 매우 높음" : result.score >= 65 ? "✨ 합격 충분히 가능" : result.score >= 50 ? "📈 전략적 준비 필요" : "🛡️ 집중 보완 시기"}
          </div>
          <p className="text-sm text-gray-400">
            {result.score >= 80 ? "지금 바로 지원하세요. 흐름이 좋습니다."
            : result.score >= 65 ? "자소서 전략을 강화하면 충분히 됩니다."
            : result.score >= 50 ? "핵심 경험을 보완하면 가능성이 높아집니다."
            : "지금은 실력을 쌓는 타이밍입니다. 자소서 퀄리티로 운을 뒤집으세요."}
          </p>
        </div>

        {/* 오행 기질 */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-4">
          <div className="flex gap-3 items-center mb-3">
            <span style={{ fontSize: 32 }}>{ohE}</span>
            <div>
              <div className="text-xs font-bold mb-0.5" style={{ color: ohC }}>오행 {result.oh} — {result.trait}</div>
              <div className="text-xs text-gray-400">{result.ohKeyword}</div>
            </div>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{result.ohAdvice}</p>
        </div>

        {/* 직무 핵심 키워드 */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-4">
          <h2 className="text-sm font-black text-purple-400 mb-3">🎯 {result.field} 직무 합격 키워드 TOP 5</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {result.fieldKeywords.map((k: string, i: number) => (
              <span key={i} className="bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs px-3 py-1.5 rounded-full font-bold">{k}</span>
            ))}
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{result.fieldStrategy}</p>
        </div>

        {/* 기업 규모별 전략 */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-4">
          <h2 className="text-sm font-black text-yellow-400 mb-3">🏢 {result.companySize} 합격 전략</h2>
          <p className="text-sm text-gray-300 leading-relaxed">{result.sizeStrategy}</p>
        </div>

        {/* 면접 예상 질문 */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-4">
          <h2 className="text-sm font-black text-green-400 mb-3">💬 면접 예상 질문 TOP 3</h2>
          <div className="space-y-3">
            {result.interview.map((q: string, i: number) => (
              <div key={i} className="flex gap-3">
                <span className="text-green-400 font-black text-sm shrink-0">Q{i+1}.</span>
                <p className="text-sm text-gray-300 leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 택일 연결 */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0f2027] to-[#1a3a1a] border border-green-500/30 p-6 mb-4">
          <h2 className="text-sm font-black text-green-400 mb-2">📅 면접·지원서 제출 최적 날짜는?</h2>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">사주 택일로 합격 에너지가 강한 날짜를 고르면 같은 스펙도 더 유리합니다. 면접 날짜, 원서 제출일을 사주로 골라보세요.</p>
          <Link href="/main-v2/taegil" className="inline-block bg-green-600 text-white text-xs font-bold px-5 py-2.5 rounded-full no-underline">합격 택일 날짜 보기 →</Link>
        </div>

        {/* 사주 연결 */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#2d1b69] border border-purple-500/30 p-6 mb-4">
          <h2 className="text-sm font-black text-purple-400 mb-2">🔮 사주로 더 깊이 확인하기</h2>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">합격 점수는 티저예요. 사주 직업운·대운으로 보면 "올해가 진짜 취업 타이밍인지", "내 천직이 뭔지" 훨씬 정확하게 알 수 있어요.</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/main-v2" className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold px-5 py-2.5 rounded-full no-underline">직업운 사주 보기 →</Link>
            <Link href="/main-v2/daewoon" className="inline-block bg-white/10 border border-white/20 text-white text-xs font-bold px-5 py-2.5 rounded-full no-underline">나의 대운 확인 →</Link>
            <Link href="/haemong" className="inline-block bg-white/10 border border-white/20 text-white text-xs font-bold px-5 py-2.5 rounded-full no-underline">합격 꿈해몽 →</Link>
          </div>
        </div>

        {/* 다시 분석 */}
        <div className="text-center pt-2">
          <Link href="/resume/start" className="text-purple-400 text-sm">다른 직무·기업으로 다시 분석하기</Link>
        </div>
      </div>
    </div>
  );
}
