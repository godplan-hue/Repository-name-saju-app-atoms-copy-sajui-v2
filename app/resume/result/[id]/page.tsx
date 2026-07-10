"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Result = {
  name: string; field: string; companySize: string; company: string;
  oh: string; score: number; trait: string; ohKeyword: string; ohAdvice: string;
  fieldKeywords: string[]; fieldStrategy: string; interview: string[];
  sizeStrategy: string; createdAt: number; paid?: boolean;
};

const ohEmoji: Record<string,string> = { 목:"🌿", 화:"🔥", 토:"🌍", 금:"💎", 수:"💧" };
const ohColor: Record<string,string> = { 목:"#22c55e", 화:"#ef4444", 토:"#f59e0b", 금:"#6366f1", 수:"#3b82f6" };

const S = {
  wrap: { minHeight:"100vh", background:"#030014", color:"#F5F5F5", fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif", wordBreak:"keep-all" as const },
  inner: { maxWidth:480, margin:"0 auto", padding:"32px 16px 60px" },
  card: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:18, padding:"20px 18px", marginBottom:14 },
};

export default function ResumeResultPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (!id) return;
    // 사주 실결제(price > 0) 또는 Firebase paid:true 시 잠금 해제
    // 무료쿠폰은 price를 설정하지 않으므로 제외됨
    const sajuPaid = localStorage.getItem("v2_paid") === "1" && Number(localStorage.getItem("price") || 0) > 0;
    if (sajuPaid) setIsUnlocked(true);

    fetch(`/api/resume/analyze?id=${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.result) {
          setResult(d.result);
          if (d.result.paid === true) setIsUnlocked(true);
        } else {
          setError("결과를 찾을 수 없어요.");
        }
      })
      .catch(() => setError("불러오기 실패"))
      .finally(() => setLoading(false));
  }, [id]);

  function share() {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: "나의 합격 전략 분석", url });
    else navigator.clipboard?.writeText(url).then(() => alert("링크가 복사됐어요!"));
  }

  if (loading) return (
    <div style={{...S.wrap, display:"flex", alignItems:"center", justifyContent:"center"}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:40, marginBottom:16}}>⚙️</div><p>분석 결과를 불러오는 중...</p></div>
    </div>
  );
  if (error || !result) return (
    <div style={{...S.wrap, display:"flex", alignItems:"center", justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <p style={{color:"#f87171", marginBottom:16}}>{error || "결과 없음"}</p>
        <Link href="/resume/start" style={{color:"#a78bfa", textDecoration:"none"}}>← 다시 분석하기</Link>
      </div>
    </div>
  );

  const ohC = ohColor[result.oh] ?? "#a78bfa";
  const ohE = ohEmoji[result.oh] ?? "✨";
  const scoreLabel = result.score >= 80 ? "🔥 합격 가능성 매우 높음"
    : result.score >= 65 ? "✨ 합격 충분히 가능"
    : result.score >= 50 ? "📈 전략적 준비 필요" : "🛡️ 집중 보완 시기";
  const scoreDesc = result.score >= 80 ? "지금 바로 지원하세요. 흐름이 좋습니다."
    : result.score >= 65 ? "자소서 전략을 강화하면 충분히 됩니다."
    : result.score >= 50 ? "핵심 경험을 보완하면 가능성이 높아집니다."
    : "지금은 실력을 쌓는 타이밍입니다. 자소서 퀄리티로 운을 뒤집으세요.";

  return (
    <div style={S.wrap}>
      <div style={S.inner}>

        {/* 헤더 */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
          <Link href="/resume" style={{color:"#a78bfa", fontSize:13, textDecoration:"none"}}>← 합격자소서</Link>
          <button onClick={share} style={{background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", color:"white", fontSize:12, fontWeight:700, padding:"8px 16px", borderRadius:20, cursor:"pointer"}}>공유하기 📤</button>
        </div>

        {/* 점수 카드 — 항상 공개 (무료 티저) */}
        <div style={{background:"linear-gradient(135deg,#1a1a2e,#2d1b69)", border:"1px solid rgba(124,58,237,0.3)", borderRadius:20, padding:"24px 20px", marginBottom:14, textAlign:"center"}}>
          <p style={{fontSize:12, color:"#9ca3af", margin:"0 0 4px"}}>{result.name}님의 합격 가능성 분석</p>
          <p style={{fontSize:11, color:"#6b7280", margin:"0 0 20px"}}>{result.field} · {result.companySize}{result.company ? ` · ${result.company}` : ""}</p>

          {/* SVG 게이지 */}
          <div style={{position:"relative", width:148, height:148, margin:"0 auto 16px"}}>
            <svg viewBox="0 0 148 148" style={{width:"100%", height:"100%", transform:"rotate(-90deg)"}}>
              <circle cx="74" cy="74" r="62" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
              <circle cx="74" cy="74" r="62" fill="none" stroke="url(#rg)" strokeWidth="12"
                strokeDasharray={`${(result.score/100)*390} 390`} strokeLinecap="round" />
              <defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
            </svg>
            <div style={{position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
              <span style={{fontSize:44, fontWeight:900, color:"white", lineHeight:1}}>{result.score}</span>
              <span style={{fontSize:11, color:"#9ca3af"}}>/ 100점</span>
            </div>
          </div>

          <p style={{fontSize:16, fontWeight:700, color:"white", margin:"0 0 6px"}}>{scoreLabel}</p>
          <p style={{fontSize:13, color:"#9ca3af", margin:0, lineHeight:1.6}}>{scoreDesc}</p>
        </div>

        {/* 잠금 안내 (미결제 시) */}
        {!isUnlocked && (
          <div style={{background:"linear-gradient(135deg,#2d1b69,#1a0535)", border:"2px solid rgba(124,58,237,0.6)", borderRadius:20, padding:"24px 20px", marginBottom:14, textAlign:"center"}}>
            <div style={{fontSize:36, marginBottom:10}}>🔒</div>
            <p style={{fontSize:16, fontWeight:900, color:"white", margin:"0 0 8px"}}>전체 합격 전략 분석</p>
            <p style={{fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.75, margin:"0 0 6px"}}>
              오행 기질 · 직무 키워드 TOP 5 · 기업 규모별 전략<br />
              면접 예상 질문 TOP 3 · 합격 에너지 분석
            </p>
            <p style={{fontSize:12, color:"#a78bfa", margin:"0 0 18px"}}>결제 후 바로 열람 가능합니다</p>
            <Link href="/resume" style={{display:"inline-block", background:"linear-gradient(135deg,#7c3aed,#ec4899)", color:"white", borderRadius:22, padding:"13px 28px", fontSize:14, fontWeight:900, textDecoration:"none"}}>
              ₩9,900으로 전체 분석 보기 →
            </Link>
          </div>
        )}

        {/* 분석 카드들 — 결제 후 공개 */}
        {isUnlocked && (
          <>
            {/* 오행 기질 */}
            <div style={S.card}>
              <div style={{display:"flex", gap:12, alignItems:"center", marginBottom:10}}>
                <span style={{fontSize:30}}>{ohE}</span>
                <div>
                  <p style={{fontSize:12, fontWeight:700, color:ohC, margin:"0 0 2px"}}>오행 {result.oh} — {result.trait}</p>
                  <p style={{fontSize:11, color:"#6b7280", margin:0}}>{result.ohKeyword}</p>
                </div>
              </div>
              <p style={{fontSize:13, color:"#d1d5db", lineHeight:1.7, margin:0}}>{result.ohAdvice}</p>
            </div>

            {/* 직무 핵심 키워드 */}
            <div style={S.card}>
              <p style={{fontSize:13, fontWeight:900, color:"#a78bfa", margin:"0 0 12px"}}>🎯 {result.field} 직무 합격 키워드 TOP 5</p>
              <div style={{display:"flex", flexWrap:"wrap", gap:6, marginBottom:12}}>
                {result.fieldKeywords.map((k:string, i:number) => (
                  <span key={i} style={{background:"rgba(124,58,237,0.25)", border:"1px solid rgba(124,58,237,0.4)", color:"#c4b5fd", fontSize:11, padding:"5px 12px", borderRadius:20, fontWeight:700}}>{k}</span>
                ))}
              </div>
              <p style={{fontSize:13, color:"#d1d5db", lineHeight:1.7, margin:0}}>{result.fieldStrategy}</p>
            </div>

            {/* 기업 규모별 전략 */}
            <div style={S.card}>
              <p style={{fontSize:13, fontWeight:900, color:"#fbbf24", margin:"0 0 10px"}}>🏢 {result.companySize} 합격 전략</p>
              <p style={{fontSize:13, color:"#d1d5db", lineHeight:1.7, margin:0}}>{result.sizeStrategy}</p>
            </div>

            {/* 면접 예상 질문 */}
            <div style={S.card}>
              <p style={{fontSize:13, fontWeight:900, color:"#4ade80", margin:"0 0 12px"}}>💬 면접 예상 질문 TOP 3</p>
              <div style={{display:"flex", flexDirection:"column", gap:12}}>
                {result.interview.map((q:string, i:number) => (
                  <div key={i} style={{display:"flex", gap:10}}>
                    <span style={{color:"#4ade80", fontWeight:900, fontSize:13, flexShrink:0}}>Q{i+1}.</span>
                    <p style={{fontSize:13, color:"#d1d5db", lineHeight:1.7, margin:0}}>{q}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 택일 연결 */}
        <div style={{background:"linear-gradient(135deg,#0f2027,#1a3a1a)", border:"1px solid rgba(74,222,128,0.3)", borderRadius:18, padding:"20px 18px", marginBottom:14}}>
          <p style={{fontSize:13, fontWeight:900, color:"#4ade80", margin:"0 0 8px"}}>📅 면접·지원서 제출 최적 날짜는?</p>
          <p style={{fontSize:12, color:"#9ca3af", lineHeight:1.7, margin:"0 0 14px"}}>사주 택일로 합격 에너지가 강한 날짜를 고르면 같은 스펙도 더 유리합니다. 면접 날짜, 원서 제출일을 사주로 골라보세요.</p>
          <Link href="/main-v2/taegil" style={{display:"inline-block", background:"#16a34a", color:"white", fontSize:12, fontWeight:700, padding:"10px 20px", borderRadius:20, textDecoration:"none"}}>합격 택일 날짜 보기 →</Link>
        </div>

        {/* 사주 연결 */}
        <div style={{background:"linear-gradient(135deg,#1a1a2e,#2d1b69)", border:"1px solid rgba(124,58,237,0.3)", borderRadius:18, padding:"20px 18px", marginBottom:14}}>
          <p style={{fontSize:13, fontWeight:900, color:"#a78bfa", margin:"0 0 8px"}}>🔮 사주로 더 깊이 확인하기</p>
          <p style={{fontSize:12, color:"#9ca3af", lineHeight:1.7, margin:"0 0 14px"}}>합격 점수는 티저예요. 사주 직업운·대운으로 보면 "올해가 진짜 취업 타이밍인지", "내 천직이 뭔지" 훨씬 정확하게 알 수 있어요.</p>
          <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
            <Link href="/main-v2" style={{display:"inline-block", background:"linear-gradient(135deg,#7c3aed,#ec4899)", color:"white", fontSize:12, fontWeight:700, padding:"10px 18px", borderRadius:20, textDecoration:"none"}}>직업운 사주 보기 →</Link>
            <Link href="/main-v2/daewoon" style={{display:"inline-block", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", color:"white", fontSize:12, fontWeight:700, padding:"10px 16px", borderRadius:20, textDecoration:"none"}}>나의 대운 확인 →</Link>
            <Link href="/haemong" style={{display:"inline-block", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", color:"white", fontSize:12, fontWeight:700, padding:"10px 16px", borderRadius:20, textDecoration:"none"}}>합격 꿈해몽 →</Link>
          </div>
        </div>

        {/* 다시 분석 */}
        <div style={{textAlign:"center", paddingTop:8}}>
          <Link href="/resume/start" style={{color:"#a78bfa", fontSize:13, textDecoration:"none"}}>다른 직무·기업으로 다시 분석하기</Link>
        </div>

      </div>
    </div>
  );
}
