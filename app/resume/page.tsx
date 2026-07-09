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
    {min:80, t:"올해 적극적으로 도전하세요!", e:"🔥"},
    {min:70, t:"올해 안에 좋은 결과를 볼 수 있어요.", e:"✨"},
    {min:60, t:"준비가 충분하면 합격 가능한 운세예요.", e:"📈"},
    {min:0,  t:"자소서 품질로 운을 뒤집을 수 있어요!", e:"🛡️"},
  ];
  return { score, ...list.find(x => score >= x.min)! };
}

const FAQ = [
  { q: "합격 점수가 96점까지 나와?", a: "생년월일 기반 사주 분석으로 44~97점 범위에서 나옵니다. 직무·기업규모·생년월일 조합에 따라 달라져요." },
  { q: "기업별로 다르게 분석돼?", a: "기업규모(대기업·중견·스타트업·공기업)와 회사명 입력 시 맞춤 전략을 제시해요." },
  { q: "환불 가능?", a: "결제 후 24시간 이내 미사용 시 100% 환불. 결과지 열람 후 환불 불가." },
];

const S = {
  wrap: { minHeight:"100vh", background:"#0a0a1a", color:"#f5f5f5", fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif", overflowX:"hidden" as const },
  inner: { maxWidth:480, margin:"0 auto", padding:"0 16px 60px" },
  card: { background:"#111827", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16 as const },
  input: { width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10 as const, padding:"11px 14px", fontSize:13, color:"white", outline:"none", boxSizing:"border-box" as const },
};

export default function ResumePage() {
  const [openFAQ, setOpenFAQ] = useState<number|null>(null);
  const [showMore, setShowMore] = useState(false);
  const [by, setBy] = useState(""); const [bm, setBm] = useState(""); const [bd, setBd] = useState("");
  const [res, setRes] = useState<{score:number;t:string;e:string}|null>(null);

  function calc() {
    const y=parseInt(by),m=parseInt(bm),d=parseInt(bd);
    if(!y||!m||!d||y<1950||y>2010||m<1||m>12||d<1||d>31){alert("생년월일을 올바르게 입력해주세요");return;}
    setRes(calcHireScore(y,m,d));
  }

  return (
    <div style={S.wrap}>
      <div style={S.inner}>

        {/* 헤더 */}
        <div style={{textAlign:"center", padding:"24px 0 20px"}}>
          <span style={{display:"inline-block", background:"#7c3aed", color:"white", borderRadius:20, padding:"5px 16px", fontSize:11, fontWeight:700, marginBottom:12}}>🎯 점운 합격 — 사주 합격 분석</span>
          <h1 style={{fontSize:28, fontWeight:900, color:"white", margin:"0 0 8px", lineHeight:1.2}}>합격 자소서</h1>
          <p style={{fontSize:13, color:"#fbbf24", fontWeight:700, margin:"0 0 6px"}}>생년월일 + 직무 입력 → 5초 분석</p>
          <p style={{fontSize:11, color:"#6b7280", margin:0}}>탈잉 2년 연속 1위 강사 제작 · 크몽 상위 2% 프라임 전문가 검증</p>
        </div>

        {/* 사주 점수 계산기 */}
        <div style={{...S.card, border:"1px solid rgba(124,58,237,0.4)", background:"linear-gradient(135deg,#1a1a2e,#2d1b69)", padding:"18px 16px", marginBottom:14}}>
          <p style={{fontSize:11, color:"#a78bfa", fontWeight:700, margin:"0 0 4px", textAlign:"center"}}>🔮 무료 티저</p>
          <p style={{fontSize:14, fontWeight:900, color:"white", margin:"0 0 14px", textAlign:"center"}}>올해 취업운 몇 점?</p>
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
              <div style={{fontSize:40, marginBottom:8}}>{res.e}</div>
              <p style={{fontSize:40, fontWeight:900, color:"white", margin:"0 0 4px"}}>{res.score}<span style={{fontSize:14, color:"#9ca3af"}}>점</span></p>
              <p style={{fontSize:12, color:"#d1d5db", margin:"0 0 14px", lineHeight:1.6}}>{res.t}</p>
              <div style={{display:"flex", gap:8, justifyContent:"center"}}>
                <Link href="/main-v2" style={{display:"inline-block", background:"linear-gradient(135deg,#7c3aed,#ec4899)", color:"white", fontSize:12, fontWeight:700, padding:"9px 16px", borderRadius:20, textDecoration:"none"}}>취업운 사주 보기 →</Link>
                <button onClick={()=>setRes(null)} style={{background:"transparent", border:"1px solid rgba(255,255,255,0.2)", color:"#9ca3af", fontSize:12, fontWeight:700, padding:"9px 14px", borderRadius:20, cursor:"pointer"}}>다시 계산</button>
              </div>
            </div>
          )}
        </div>

        {/* 메인 CTA */}
        <Link href="/resume/start" style={{display:"block", background:"linear-gradient(135deg,#7c3aed,#ec4899)", color:"white", fontSize:16, fontWeight:900, padding:"16px", borderRadius:16, textDecoration:"none", textAlign:"center", marginBottom:6}}>
          🎯 무료로 합격 가능성 분석받기
        </Link>
        <p style={{fontSize:11, color:"#6b7280", textAlign:"center", margin:"0 0 20px"}}>생년월일 + 직무 입력 → 맞춤 전략 즉시 출력</p>

        {/* 가격 카드 — 2열 */}
        <div style={{marginBottom:20}}>
          <p style={{fontSize:13, fontWeight:900, color:"white", margin:"0 0 10px"}}>유료 심층 분석</p>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
            {/* 1회 */}
            <div style={{...S.card, padding:"14px 12px", textAlign:"center"}}>
              <p style={{fontSize:12, fontWeight:900, color:"white", margin:"0 0 2px"}}>1회 분석</p>
              <p style={{fontSize:10, color:"#fbbf24", margin:"0 0 6px"}}>최고 96점</p>
              <p style={{fontSize:22, fontWeight:900, color:"#fde68a", margin:"0 0 6px"}}>9,900원</p>
              <p style={{fontSize:10, color:"#6b7280", margin:"0 0 10px"}}>한 번 써보고 싶을 때</p>
              <div style={{borderTop:"1px solid #1f2937", paddingTop:8, textAlign:"left"}}>
                {["점수 분석","직무 전략","키워드 3개","면접 질문 3개","사주 티저"].map(t=>(
                  <p key={t} style={{fontSize:10, color:"#d1d5db", margin:"0 0 3px"}}>✅ {t}</p>
                ))}
              </div>
              <button onClick={()=>alert("결제 시스템 준비 중입니다. 곧 오픈됩니다!")} style={{width:"100%", marginTop:10, background:"#374151", color:"white", border:"none", borderRadius:10, padding:"10px 0", fontSize:12, fontWeight:700, cursor:"pointer"}}>결제하기</button>
            </div>
            {/* 5회 */}
            <div style={{background:"#fbbf24", border:"2px solid #f59e0b", borderRadius:16, padding:"14px 12px", textAlign:"center"}}>
              <span style={{display:"inline-block", background:"#dc2626", color:"white", fontSize:9, fontWeight:900, padding:"3px 10px", borderRadius:20, marginBottom:4}}>🔥 추천</span>
              <p style={{fontSize:12, fontWeight:900, color:"#111", margin:"0 0 2px"}}>5회 풀코스</p>
              <p style={{fontSize:10, color:"#374151", margin:"0 0 6px"}}>최고 98점</p>
              <p style={{fontSize:22, fontWeight:900, color:"#dc2626", margin:"0 0 6px"}}>29,900원</p>
              <p style={{fontSize:10, color:"#374151", margin:"0 0 10px"}}>회당 5,980원</p>
              <div style={{borderTop:"1px solid rgba(0,0,0,0.15)", paddingTop:8, textAlign:"left"}}>
                {["전략×5회","키워드 5개×5회","인재상 분석","면접 질문×5회","사주+대운+택일"].map(t=>(
                  <p key={t} style={{fontSize:10, color:"#111", margin:"0 0 3px"}}>✅ {t}</p>
                ))}
              </div>
              <button onClick={()=>alert("결제 시스템 준비 중입니다. 곧 오픈됩니다!")} style={{width:"100%", marginTop:10, background:"#dc2626", color:"white", border:"none", borderRadius:10, padding:"10px 0", fontSize:12, fontWeight:900, cursor:"pointer"}}>풀코스 결제</button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{marginBottom:16}}>
          <p style={{fontSize:13, fontWeight:900, color:"#f87171", margin:"0 0 8px"}}>자주 묻는 질문</p>
          {FAQ.map((item,idx)=>(
            <div key={idx} style={{...S.card, marginBottom:6, overflow:"hidden"}}>
              <button onClick={()=>setOpenFAQ(openFAQ===idx?null:idx)} style={{width:"100%", padding:"12px 14px", textAlign:"left", fontSize:12, fontWeight:700, color:"white", background:"transparent", border:"none", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span>{item.q}</span>
                <span style={{color:"#fbbf24", marginLeft:8, flexShrink:0}}>{openFAQ===idx?"−":"+"}</span>
              </button>
              {openFAQ===idx&&(
                <div style={{padding:"10px 14px", background:"#1f2937", borderTop:"1px solid #374151"}}>
                  <p style={{fontSize:12, color:"#9ca3af", margin:0, lineHeight:1.6}}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        <button onClick={()=>setShowMore(!showMore)} style={{width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px", fontSize:12, color:"#9ca3af", fontWeight:700, cursor:"pointer", marginBottom:showMore?14:0}}>
          {showMore?"▲ 접기":"▼ 더보기 (사주 연결)"}
        </button>

        {/* 숨겨진 섹션 — 사주 연계 */}
        {showMore&&(
          <div style={{background:"linear-gradient(135deg,#1a1a2e,#2d1b69)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"16px", marginBottom:14}}>
            <p style={{fontSize:12, fontWeight:900, color:"white", margin:"0 0 12px", textAlign:"center"}}>자소서 쓰다가 이런 생각 드셨죠?</p>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
              <Link href="/main-v2" style={{display:"block", background:"rgba(255,255,255,0.06)", borderRadius:12, padding:"12px", textDecoration:"none"}}>
                <span style={{fontSize:20}}>🎯</span>
                <p style={{fontSize:11, fontWeight:700, color:"white", margin:"6px 0 2px"}}>올해 취업될까?</p>
                <p style={{fontSize:10, color:"#a78bfa", margin:0}}>취업운 사주 →</p>
              </Link>
              <Link href="/haemong" style={{display:"block", background:"rgba(255,255,255,0.06)", borderRadius:12, padding:"12px", textDecoration:"none"}}>
                <span style={{fontSize:20}}>🌙</span>
                <p style={{fontSize:11, fontWeight:700, color:"white", margin:"6px 0 2px"}}>합격 꿈 꿨어?</p>
                <p style={{fontSize:10, color:"#a78bfa", margin:0}}>꿈해몽 풀기 →</p>
              </Link>
              <Link href="/main-v2" style={{display:"block", background:"rgba(255,255,255,0.06)", borderRadius:12, padding:"12px", textDecoration:"none", gridColumn:"1 / -1"}}>
                <span style={{fontSize:20}}>💼</span>
                <p style={{fontSize:11, fontWeight:700, color:"white", margin:"6px 0 2px"}}>내 사주에 맞는 직업은?</p>
                <p style={{fontSize:10, color:"#a78bfa", margin:0}}>직업운 사주 보러가기 →</p>
              </Link>
            </div>
          </div>
        )}

        {/* 공유 + 환불 */}
        <div style={{textAlign:"center", paddingTop:4}}>
          <button onClick={()=>{const u="https://jeomun.com/resume";if(navigator.share)navigator.share({title:"🎯 점운 합격",text:"사주로 취업 합격 가능성 분석해봤어요!",url:u});else navigator.clipboard?.writeText(u).then(()=>alert("링크 복사됐어요!"));}} style={{background:"linear-gradient(135deg,#fbbf24,#f59e0b)", color:"#111", border:"none", borderRadius:20, padding:"11px 28px", fontSize:13, fontWeight:900, cursor:"pointer", marginBottom:14}}>
            📤 친구에게 공유하기
          </button>
          <p style={{fontSize:11, color:"#4b5563", margin:0}}>✅ 24시간 100% 환불 보장 · 1회 이용 후 환불 불가</p>
        </div>

      </div>
    </div>
  );
}
