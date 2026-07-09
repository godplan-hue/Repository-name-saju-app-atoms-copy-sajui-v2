"use client";

import { useState } from "react";
import Link from "next/link";

function calcHireScore(y: number, m: number, d: number) {
  const gan = ["갑","을","병","정","무","기","경","신","임","계"];
  const gc = gan[Math.abs((y - 4) % 10)];
  const mb = [6,8,10,9,7,5,4,5,9,10,8,6][m-1] ?? 7;
  const gb: {[k:string]:number} = {갑:8,을:6,병:9,정:7,무:5,기:6,경:8,신:7,임:9,계:6};
  const score = Math.min(97, Math.max(42, 55 + (gb[gc]??7) + mb + (d%7)*2));
  const list = [
    {min:80, t:"올해 취업운이 매우 강합니다. 적극적으로 도전하세요!", e:"🔥"},
    {min:70, t:"올해 안에 좋은 결과를 볼 수 있는 흐름입니다.", e:"✨"},
    {min:60, t:"준비가 충분하다면 충분히 합격 가능한 운세입니다.", e:"📈"},
    {min:0,  t:"지금 당장보다는 실력을 쌓는 시기입니다. 하지만 자소서 품질로 운을 뒤집을 수 있어요!", e:"🛡️"},
  ];
  return { score, ...list.find(x => score >= x.min)! };
}

const FAQ = [
  { q: "합격 점수가 정말 96점까지 나와?", a: "생년월일 기반 사주 분석으로 44~97점 범위에서 나옵니다.\n직무·기업규모·생년월일 조합에 따라 달라져요." },
  { q: "기업별로 다르게 분석해줘?", a: "기업규모(대기업·중견·스타트업·공기업)와\n회사명 입력 시 맞춤 전략을 제시해요." },
  { q: "환불이 되나?", a: "결제 후 24시간 이내 미사용 시 100% 환불 가능합니다.\n결과지 열람 후에는 환불이 어려워요." },
];

const S = {
  wrap: { minHeight:"100vh", background:"#0a0a1a", color:"#f5f5f5", fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif", overflowX:"hidden" as const },
  inner: { maxWidth:480, margin:"0 auto", padding:"0 16px 60px" },
  card: { background:"#111827", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16 as const },
  input: { width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10 as const, padding:"11px 14px", fontSize:13, color:"white", outline:"none", boxSizing:"border-box" as const },
};

export default function ResumePage() {
  const [openFAQ, setOpenFAQ] = useState<number|null>(null);
  const [by, setBy] = useState(""); const [bm, setBm] = useState(""); const [bd, setBd] = useState("");
  const [res, setRes] = useState<{score:number;t:string;e:string}|null>(null);

  function calc() {
    const y=parseInt(by),m=parseInt(bm),d=parseInt(bd);
    if(!y||!m||!d||y<1950||y>2010||m<1||m>12||d<1||d>31){alert("생년월일을 올바르게 입력해주세요");return;}
    setRes(calcHireScore(y,m,d));
  }

  return (
    <div style={S.wrap}>

      {/* 히어로 배너 */}
      <div style={{position:"relative", width:"100%", height:220, overflow:"hidden"}}>
        <img src="https://i.pinimg.com/1200x/38/d4/ba/38d4baf57b92559d9a1afada3a91c22c.jpg" alt="합격자소서" style={{position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover"}} />
        <div style={{position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.82) 40%, rgba(0,0,0,0.1) 100%)"}} />
        <div style={{position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"18px 20px 22px"}}>
          <span style={{display:"inline-block", background:"#7c3aed", color:"white", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700, marginBottom:8, width:"fit-content"}}>🎯 점운 합격</span>
          <h1 style={{fontSize:22, fontWeight:900, color:"white", margin:"0 0 6px", lineHeight:1.2}}>합격 자소서</h1>
          <p style={{fontSize:12, color:"rgba(255,255,255,0.8)", margin:0}}>생년월일 + 직무 입력 → 맞춤 합격 전략 즉시 분석</p>
        </div>
      </div>

      <div style={S.inner}>

        {/* 서브타이틀 */}
        <div style={{textAlign:"center", padding:"16px 0 16px"}}>
          <p style={{fontSize:13, color:"#fbbf24", fontWeight:700, margin:"0 0 4px"}}>생년월일 + 직무 입력 → 5초 분석</p>
          <p style={{fontSize:11, color:"#6b7280", margin:0}}>탈잉 2년 연속 1위 강사 제작 · 크몽 상위 2% 프라임 전문가 검증</p>
        </div>

        {/* 사주 점수 계산기 */}
        <div style={{...S.card, border:"1px solid rgba(124,58,237,0.4)", background:"linear-gradient(135deg,#1a1a2e,#2d1b69)", padding:"18px 16px", marginBottom:14}}>
          <p style={{fontSize:11, color:"#a78bfa", fontWeight:700, margin:"0 0 4px", textAlign:"center"}}>🔮 무료 티저 — 합격운 사주 점수</p>
          <p style={{fontSize:14, fontWeight:900, color:"white", margin:"0 0 14px", textAlign:"center"}}>올해 내 취업·합격 운세는 몇 점?</p>
          {!res ? (
            <div>
              <input value={by} onChange={e=>setBy(e.target.value)} placeholder="출생년도 (예: 1998)" maxLength={4} style={{...S.input, marginBottom:8}} />
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12}}>
                <input value={bm} onChange={e=>setBm(e.target.value)} placeholder="월" maxLength={2} style={S.input} />
                <input value={bd} onChange={e=>setBd(e.target.value)} placeholder="일" maxLength={2} style={S.input} />
              </div>
              <button onClick={calc} style={{width:"100%", background:"linear-gradient(135deg,#7c3aed,#ec4899)", color:"white", border:"none", borderRadius:12, padding:"13px", fontSize:14, fontWeight:700, cursor:"pointer"}}>
                2026년 취업운 점수 보기
              </button>
            </div>
          ) : (
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:36, marginBottom:8}}>{res.e}</div>
              {/* SVG 게이지 */}
              <div style={{position:"relative", width:120, height:120, margin:"0 auto 12px"}}>
                <svg viewBox="0 0 120 120" style={{width:"100%", height:"100%", transform:"rotate(-90deg)"}}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#grad)" strokeWidth="10"
                    strokeDasharray={`${(res.score/100)*314} 314`} strokeLinecap="round" />
                  <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
                </svg>
                <div style={{position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                  <span style={{fontSize:32, fontWeight:900, color:"white", lineHeight:1}}>{res.score}</span>
                  <span style={{fontSize:11, color:"#9ca3af"}}>/ 100점</span>
                </div>
              </div>
              <p style={{fontSize:13, fontWeight:700, color:"white", margin:"0 0 4px"}}>2026년 취업운 <span style={{color:"#a78bfa"}}>{res.score}점</span></p>
              <p style={{fontSize:12, color:"#d1d5db", margin:"0 0 14px", lineHeight:1.6}}>{res.t}</p>
              <div style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 12px", marginBottom:12, textAlign:"left"}}>
                <p style={{fontSize:11, color:"#fbbf24", fontWeight:700, margin:"0 0 4px"}}>⚡ 이 점수는 사주 티저입니다</p>
                <p style={{fontSize:11, color:"#9ca3af", lineHeight:1.6, margin:0}}>자소서 분석 점수와 달리, 이건 2026년 운의 흐름을 보여주는 거예요. 사주 원국(오행, 일주, 대운)까지 보면 정확한 타이밍과 직종을 알 수 있어요.</p>
              </div>
              <div style={{display:"flex", gap:8, justifyContent:"center"}}>
                <Link href="/main-v2" style={{display:"inline-block", background:"linear-gradient(135deg,#7c3aed,#ec4899)", color:"white", fontSize:12, fontWeight:700, padding:"9px 16px", borderRadius:20, textDecoration:"none"}}>정확한 취업운 사주 보기 →</Link>
                <button onClick={()=>setRes(null)} style={{background:"transparent", border:"1px solid rgba(255,255,255,0.2)", color:"#9ca3af", fontSize:12, fontWeight:700, padding:"9px 14px", borderRadius:20, cursor:"pointer"}}>다시 계산</button>
              </div>
            </div>
          )}
        </div>

        {/* 메인 CTA */}
        <Link href="/resume/start" style={{display:"block", background:"white", color:"#1a0a3d", fontSize:15, fontWeight:900, padding:"16px", borderRadius:16, textDecoration:"none", textAlign:"center", marginBottom:6}}>
          🎯 무료로 합격 가능성 분석받기
        </Link>
        <p style={{fontSize:11, color:"#6b7280", textAlign:"center", margin:"0 0 10px"}}>생년월일 + 직무 입력 → 맞춤 전략 즉시 출력</p>
        <div style={{textAlign:"center", marginBottom:20}}>
          <button onClick={()=>{const u="https://jeomun.com/resume";if(navigator.share)navigator.share({title:"🎯 점운 합격",text:"사주로 취업 합격 가능성 분석해봤어요!",url:u});else navigator.clipboard?.writeText(u).then(()=>alert("링크 복사됐어요!"));}} style={{background:"linear-gradient(135deg,#fbbf24,#f59e0b)", color:"#111", border:"none", borderRadius:20, padding:"11px 28px", fontSize:13, fontWeight:900, cursor:"pointer"}}>
            📤 친구에게 공유하기
          </button>
        </div>

        {/* 가격 카드 */}
        <div style={{...S.card, padding:"18px 16px", marginBottom:20}}>
          <p style={{fontSize:14, fontWeight:900, color:"white", margin:"0 0 8px", textAlign:"center"}}>유료 심층 분석 — 사주 서비스 포함</p>
          <div style={{background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.35)", borderRadius:10, padding:"10px 14px", marginBottom:14, textAlign:"center"}}>
            <p style={{fontSize:12, color:"#c4b5fd", fontWeight:700, margin:0}}>🎁 5회 풀코스에 사주 전체 서비스까지 — 따로 사면 훨씬 비싸요</p>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
            {/* 1회 */}
            <div style={{background:"#1f2937", borderRadius:14, padding:"14px 12px", textAlign:"center", border:"1px solid #374151"}}>
              <p style={{fontSize:13, fontWeight:900, color:"white", margin:"0 0 2px"}}>1회 분석</p>
              <p style={{fontSize:10, color:"#fbbf24", fontWeight:700, margin:"0 0 6px"}}>최고 96점</p>
              <p style={{fontSize:22, fontWeight:900, color:"#fde68a", margin:"0 0 4px"}}>9,900원</p>
              <p style={{fontSize:10, color:"#6b7280", margin:"0 0 10px"}}>한 번 써보고 싶을 때</p>
              <div style={{borderTop:"1px solid #374151", paddingTop:8, textAlign:"left"}}>
                {["AI 합격 가능성 점수 분석\n(최고 96점)","직무별 합격 전략","자소서 핵심 키워드 3개","면접 예상 질문 3개","🔮 사주 총운 티저"].map(t=>(
                  <p key={t} style={{fontSize:10, color:"#d1d5db", margin:"0 0 3px", whiteSpace:"pre-line"}}>✅ {t}</p>
                ))}
                {["기업별 인재상 분석","오행 강점 분석","결과 보관·재열람","사주 전체+대운+택일"].map(t=>(
                  <p key={t} style={{fontSize:10, color:"#4b5563", margin:"0 0 3px"}}>✗ {t}</p>
                ))}
              </div>
              <button onClick={()=>alert("결제 시스템 준비 중입니다. 곧 오픈됩니다!")} style={{width:"100%", marginTop:10, background:"#374151", color:"white", border:"none", borderRadius:10, padding:"10px 0", fontSize:12, fontWeight:700, cursor:"pointer"}}>결제하기</button>
            </div>
            {/* 5회 */}
            <div style={{background:"#fbbf24", border:"2px solid #f59e0b", borderRadius:14, padding:"14px 12px", textAlign:"center"}}>
              <span style={{display:"inline-block", background:"#dc2626", color:"white", fontSize:9, fontWeight:900, padding:"3px 10px", borderRadius:20, marginBottom:4}}>🔥 이걸 선택하세요</span>
              <p style={{fontSize:13, fontWeight:900, color:"#111", margin:"0 0 2px"}}>5회 풀코스</p>
              <p style={{fontSize:10, color:"#374151", fontWeight:700, margin:"0 0 6px"}}>최고 98점</p>
              <p style={{fontSize:22, fontWeight:900, color:"#dc2626", margin:"0 0 4px"}}>29,900원</p>
              <p style={{fontSize:10, color:"#374151", margin:"0 0 10px"}}>회당 5,980원</p>
              <div style={{borderTop:"1px solid rgba(0,0,0,0.15)", paddingTop:8, textAlign:"left"}}>
                {[
                  "AI 합격 가능성 점수\n(최고 98점) × 5회",
                  "직무별 맞춤 합격 전략 × 5회",
                  "자소서 핵심 키워드 5개 × 5회",
                  "기업별 인재상 분석 × 5회",
                  "면접 예상 질문 5개 × 5회",
                  "오행으로 보는 나의 강점",
                  "결과 보관 · 언제든 재열람",
                  "🔮 사주 총운+직업운+재물운",
                  "📈 나의 대운(나이대 흐름)",
                  "📅 합격 택일 날짜 1개",
                ].map(t=>(
                  <p key={t} style={{fontSize:10, color:"#111", margin:"0 0 3px", whiteSpace:"pre-line"}}>✅ {t}</p>
                ))}
              </div>
              <button onClick={()=>alert("결제 시스템 준비 중입니다. 곧 오픈됩니다!")} style={{width:"100%", marginTop:10, background:"#dc2626", color:"white", border:"none", borderRadius:10, padding:"10px 0", fontSize:12, fontWeight:900, cursor:"pointer"}}>풀코스 결제하기</button>
            </div>
          </div>
        </div>

        {/* 혹시 이런 고민 */}
        <div style={{marginBottom:20}}>
          <p style={{fontSize:15, fontWeight:900, color:"white", margin:"0 0 12px", textAlign:"center"}}>혹시 이런 고민 있으신가요?</p>
          <div style={{display:"flex", flexDirection:"column", gap:8}}>
            {[
              {icon:"❌", label:"자소서 10번 고쳐도 계속 서류탈락", color:"#a78bfa"},
              {icon:"💸", label:"첨삭받으려면 10~20만원, 너무 비싸", color:"#f9a8d4"},
              {icon:"🔄", label:"내 자소서가 정말 이 정도밖에 안 될까?", color:"#93c5fd"},
            ].map(({icon,label,color})=>(
              <div key={label} style={{...S.card, padding:"14px 16px", display:"flex", alignItems:"center", gap:12}}>
                <span style={{fontSize:22}}>{icon}</span>
                <p style={{fontSize:13, fontWeight:600, color, margin:0}}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 당신이 받게 될 것 */}
        <div style={{marginBottom:20}}>
          <p style={{fontSize:15, fontWeight:900, color:"white", margin:"0 0 12px"}}>당신이 받게 될 것</p>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
            {[
              {label:"합격 가능성 점수 분석 (최고 96점)", color:"#a78bfa"},
              {label:"직무별 맞춤 합격 전략", color:"#93c5fd"},
              {label:"핵심 키워드 3개 제시", color:"#a78bfa"},
              {label:"면접 예상 질문 3개", color:"#93c5fd"},
            ].map(({label,color})=>(
              <div key={label} style={{...S.card, padding:"12px 14px", display:"flex", alignItems:"flex-start", gap:8}}>
                <span style={{color, fontSize:16, flexShrink:0, marginTop:1}}>✅</span>
                <p style={{fontSize:12, fontWeight:600, color:"#f5f5f5", margin:0, lineHeight:1.4}}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{marginBottom:20}}>
          <p style={{fontSize:14, fontWeight:900, color:"#f87171", margin:"0 0 10px"}}>자주 묻는 질문</p>
          {FAQ.map((item,idx)=>(
            <div key={idx} style={{...S.card, marginBottom:6, overflow:"hidden"}}>
              <button onClick={()=>setOpenFAQ(openFAQ===idx?null:idx)} style={{width:"100%", padding:"12px 14px", textAlign:"left", fontSize:13, fontWeight:700, color:"white", background:"transparent", border:"none", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span>{item.q}</span>
                <span style={{color:"#fbbf24", marginLeft:8, flexShrink:0}}>{openFAQ===idx?"−":"+"}</span>
              </button>
              {openFAQ===idx&&(
                <div style={{padding:"10px 14px", background:"#1f2937", borderTop:"1px solid #374151"}}>
                  <p style={{fontSize:12, color:"#9ca3af", margin:0, lineHeight:1.6, whiteSpace:"pre-line"}}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 자소서 쓰다가 이런 생각 */}
        <div style={{marginBottom:20}}>
          <p style={{fontSize:13, fontWeight:900, color:"white", margin:"0 0 10px", textAlign:"center"}}>자소서 쓰다가 이런 생각 드셨죠?</p>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8}}>
            {[
              {icon:"🎯", title:"올해 취업될까?", sub:"취업운 사주 →", href:"/main-v2"},
              {icon:"🌙", title:"합격 꿈 꿨어?", sub:"꿈해몽 풀기 →", href:"/haemong"},
              {icon:"💼", title:"내 천직은?", sub:"직업운 보기 →", href:"/main-v2"},
            ].map(({icon,title,sub,href})=>(
              <Link key={title} href={href} style={{display:"block", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px 10px", textDecoration:"none", textAlign:"center"}}>
                <span style={{fontSize:22}}>{icon}</span>
                <p style={{fontSize:11, fontWeight:700, color:"white", margin:"6px 0 4px", lineHeight:1.3}}>{title}</p>
                <p style={{fontSize:10, color:"#a78bfa", margin:0}}>{sub}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* 최종 CTA */}
        <div style={{...S.card, padding:"24px 16px", textAlign:"center", marginBottom:16}}>
          <p style={{fontSize:16, fontWeight:900, color:"white", margin:"0 0 6px"}}>지금 바로 자소서 분석 받기</p>
          <p style={{fontSize:12, color:"#6b7280", margin:"0 0 16px"}}>결제 후 즉시 분석 · 5초 완성 · 24시간 환불 보장</p>
          <Link href="/resume/start" style={{display:"block", background:"linear-gradient(135deg,#7c3aed,#ec4899)", color:"white", fontSize:14, fontWeight:900, padding:"15px", borderRadius:14, textDecoration:"none"}}>
            지금 분석 시작하기
          </Link>
          <p style={{fontSize:11, color:"#4b5563", margin:"10px 0 0"}}>생년월일 + 직무 입력 → 맞춤 분석 즉시 출력</p>
        </div>

        <div style={{textAlign:"center", paddingBottom:12}}>
          <p style={{fontSize:12, color:"#6b7280", fontWeight:600, margin:"0 0 4px"}}>✅ 24시간 100% 환불 보장</p>
          <p style={{fontSize:11, color:"#374151", margin:0}}>(1회 이용 후 환불 불가)</p>
        </div>

      </div>
    </div>
  );
}
