"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type EventType = "이사"|"상견례"|"면접"|"개업"|"결혼"|"수술"|"여행"|"계약"|"시험"|"출산"|"재회연락"|"기타";
type Rating = "대길"|"길"|"평"|"흉";
interface TaegilResult {
  date: string; dayOfWeek: string; iljin: string; iljinHanja: string;
  rating: Rating; emoji: string; title: string; reason: string | null;
}

const EVENT_TYPES: { icon: string; label: EventType }[] = [
  { icon: "🏠", label: "이사" }, { icon: "💑", label: "상견례" },
  { icon: "💼", label: "면접" }, { icon: "🏪", label: "개업" },
  { icon: "💍", label: "결혼" }, { icon: "🏥", label: "수술" },
  { icon: "✈️", label: "여행" }, { icon: "📝", label: "계약" },
  { icon: "📚", label: "시험" }, { icon: "👶", label: "출산" },
  { icon: "💌", label: "재회연락" }, { icon: "⭐", label: "기타" },
];

const RATING_STYLE: Record<Rating, { bg: string; text: string; border: string }> = {
  대길: { bg: "#dcfce7", text: "#15803d", border: "#86efac" },
  길:   { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  평:   { bg: "#f3f4f6", text: "#4b5563", border: "#d1d5db" },
  흉:   { bg: "#fee2e2", text: "#dc2626", border: "#fca5a5" },
};

export default function TaegilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [eventType, setEventType] = useState<EventType | "">("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);
  const [results, setResults] = useState<TaegilResult[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const chunksRef = useRef<string[]>([]);
  const chunkIdxRef = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("v2_saved_profile");
    if (!saved) { router.push("/main-v2"); return; }
    setProfile(JSON.parse(saved));

    const paid = sessionStorage.getItem("taegilPaid") === "1";
    if (paid) {
      sessionStorage.removeItem("taegilPaid");
      setIsPaid(true);
      const et = sessionStorage.getItem("taegilEventType") as EventType;
      const dt = JSON.parse(sessionStorage.getItem("taegilDates") || "[]") as string[];
      if (et) setEventType(et);
      if (dt.length > 0) setSelectedDates(dt);
    }
  }, []);

  useEffect(() => {
    if (isPaid && eventType && selectedDates.length > 0 && profile) {
      fetchTaegil(true);
    }
  }, [isPaid, eventType, selectedDates, profile]);

  const toggleDate = (dateStr: string) => {
    setSelectedDates(prev => {
      if (prev.includes(dateStr)) return prev.filter(d => d !== dateStr);
      if (prev.length >= 10) return prev;
      return [...prev, dateStr];
    });
  };

  const isPast = (y: number, m: number, d: number) => {
    const today = new Date(); today.setHours(0,0,0,0);
    return new Date(y, m-1, d) < today;
  };

  const fetchTaegil = async (paid: boolean) => {
    if (!profile || !eventType || selectedDates.length === 0) return;
    setLoading(true);
    try {
      const birth = `${profile.birthYear}-${String(profile.birthMonth).padStart(2,"0")}-${String(profile.birthDay).padStart(2,"0")}`;
      const res = await fetch("/api/v2/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name, birth,
          birthHour: profile.birthHour || "unknown",
          gender: profile.gender || "여",
          category: "택일",
          planType: "taegil",
          eventType, dates: selectedDates, taegilPaid: paid,
        }),
      });
      const data = await res.json();
      setResults(data.results || []);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    } catch { alert("분석 중 오류가 발생했습니다."); }
    finally { setLoading(false); }
  };

  const handlePay = () => {
    if (!eventType) { alert("목적을 먼저 선택해주세요!"); return; }
    if (selectedDates.length === 0) { alert("날짜를 선택해주세요!"); return; }
    sessionStorage.setItem("taegilEventType", eventType);
    sessionStorage.setItem("taegilDates", JSON.stringify(selectedDates));
    const next = encodeURIComponent("/payment-complete?taegil=1&paid=2900");
    router.push(`/main-v2/pay?amount=2900&next=${next}`);
  };

  const stopTts = () => {
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
    setSpeaking(false);
    chunksRef.current = [];
    chunkIdxRef.current = 0;
  };

  const speakNext = () => {
    if (chunkIdxRef.current >= chunksRef.current.length) { setSpeaking(false); return; }
    const utt = new SpeechSynthesisUtterance(chunksRef.current[chunkIdxRef.current]);
    utt.lang = "ko-KR"; utt.rate = 0.95;
    utt.onend = () => { chunkIdxRef.current++; speakNext(); };
    utt.onerror = () => { setSpeaking(false); };
    window.speechSynthesis.speak(utt);
  };

  const handleRead = () => {
    if (!results.length) return;
    if (speaking) { stopTts(); return; }
    const text = results.map(r => {
      const d = new Date(r.date);
      return `${d.getMonth()+1}월 ${d.getDate()}일 ${r.dayOfWeek}요일, ${r.iljin}일. ${r.rating}. ${r.title}. ${r.reason || ""}`;
    }).join(". 다음 날짜. ");
    chunksRef.current = text.match(/.{1,200}/g) || [text];
    chunkIdxRef.current = 0;
    setSpeaking(true);
    speakNext();
  };

  const handleShare = () => {
    if (!results.length) return;
    const best = results.filter(r => r.rating === "대길" || r.rating === "길").slice(0, 3);
    const dateStr = best.length > 0
      ? best.map(r => { const d = new Date(r.date); return `${d.getMonth()+1}/${d.getDate()} ${r.rating}`; }).join(", ")
      : "분석 완료";
    const text = `📅 택일 분석 — ${profile?.name}님의 ${eventType} 좋은 날\n${dateStr}\n\n점운에서 내 좋은 날 찾기 👇\nhttps://jeomun.com/taegil`;
    if (navigator.share) { navigator.share({ title: "택일 — 점운", text, url: "https://jeomun.com/taegil" }); }
    else { navigator.clipboard.writeText(text).then(() => alert("링크가 복사됐어요!")); }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(calYear, calMonth, 0).getDate();
    const firstDay = new Date(calYear, calMonth - 1, 1).getDay();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} />);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calYear}-${String(calMonth).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const selected = selectedDates.includes(dateStr);
      const past = isPast(calYear, calMonth, d);
      const dow = new Date(calYear, calMonth-1, d).getDay();
      cells.push(
        <button key={d} onClick={() => !past && toggleDate(dateStr)} disabled={past}
          style={{ width:"100%", aspectRatio:"1", border: selected ? "2px solid #15803d" : "1px solid #e5e7eb",
            background: selected ? "#dcfce7" : past ? "#f9fafb" : "white", borderRadius: 8,
            fontSize: 13, fontWeight: selected ? 900 : 700, cursor: past ? "not-allowed" : "pointer",
            color: past ? "#d1d5db" : dow===0 ? "#ef4444" : dow===6 ? "#3b82f6" : "#1f2937",
          }}>
          {d}
        </button>
      );
    }
    return cells;
  };

  const canAnalyze = !!eventType && selectedDates.length > 0 && !loading;

  if (!profile) return null;

  return (
    <main style={{ minHeight:"100vh", background:"#f0fdf4", fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      {/* 헤더 */}
      <div style={{ background:"linear-gradient(135deg,#22c55e,#15803d)", padding:"16px 20px 24px", color:"white" }}>
        <button onClick={() => router.push("/main-v2")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.8)", fontSize:14, cursor:"pointer", padding:0, marginBottom:12 }}>← 홈으로</button>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>📅</div>
          <div>
            <h1 style={{ margin:0, fontSize:20, fontWeight:900 }}>택일(擇日)</h1>
            <p style={{ margin:0, fontSize:13, opacity:0.85 }}>{profile.name}님의 좋은 날 분석</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"20px 16px 60px" }}>

        {/* Step 1: 목적 */}
        <div style={{ background:"white", borderRadius:16, padding:"18px 16px", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ margin:"0 0 14px", fontWeight:900, fontSize:15, color:"#1f2937", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ display:"inline-flex", width:24, height:24, borderRadius:"50%", background:"#22c55e", color:"white", fontSize:12, fontWeight:900, alignItems:"center", justifyContent:"center" }}>1</span>
            어떤 목적의 택일인가요?
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            {EVENT_TYPES.map(({ icon, label }) => (
              <button key={label} onClick={() => setEventType(label)}
                style={{ padding:"8px 4px", border: eventType===label ? "2px solid #22c55e" : "1.5px solid #e5e7eb",
                  background: eventType===label ? "#dcfce7" : "white", borderRadius:10,
                  fontSize:11, fontWeight:700, color: eventType===label ? "#15803d" : "#374151",
                  cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <span style={{ fontSize:20 }}>{icon}</span>{label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: 날짜 */}
        <div style={{ background:"white", borderRadius:16, padding:"18px 16px", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ margin:"0 0 4px", fontWeight:900, fontSize:15, color:"#1f2937", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ display:"inline-flex", width:24, height:24, borderRadius:"50%", background:"#22c55e", color:"white", fontSize:12, fontWeight:900, alignItems:"center", justifyContent:"center" }}>2</span>
            후보 날짜를 선택해주세요
          </p>
          <p style={{ margin:"0 0 14px 32px", fontSize:12, color:"#6b7280" }}>최대 10일까지 선택할 수 있어요</p>
          {/* 월 이동 */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:12 }}>
            <button onClick={() => { if (calMonth===1) { setCalMonth(12); setCalYear(y=>y-1); } else setCalMonth(m=>m-1); }}
              style={{ background:"none", border:"1px solid #e5e7eb", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
            <span style={{ fontWeight:900, fontSize:15, color:"#1f2937" }}>{calYear}년 {calMonth}월</span>
            <button onClick={() => { if (calMonth===12) { setCalMonth(1); setCalYear(y=>y+1); } else setCalMonth(m=>m+1); }}
              style={{ background:"none", border:"1px solid #e5e7eb", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
          </div>
          {/* 요일 헤더 */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:4 }}>
            {["일","월","화","수","목","금","토"].map((d,i) => (
              <div key={d} style={{ textAlign:"center", fontSize:11, fontWeight:700, padding:"2px 0",
                color: i===0 ? "#ef4444" : i===6 ? "#3b82f6" : "#6b7280" }}>{d}</div>
            ))}
          </div>
          {/* 날짜 그리드 */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
            {renderCalendar()}
          </div>
          <p style={{ textAlign:"center", fontSize:12, color:"#6b7280", margin:"12px 0 0", fontWeight:700 }}>{selectedDates.length}/10 선택됨</p>
        </div>

        {/* 분석 버튼 */}
        <button onClick={() => canAnalyze && fetchTaegil(false)} disabled={!canAnalyze}
          style={{ width:"100%", padding:"15px 0", marginBottom:16, border:"none", borderRadius:50, fontWeight:900, fontSize:15, cursor: canAnalyze ? "pointer" : "not-allowed",
            background: canAnalyze ? "linear-gradient(135deg,#22c55e,#15803d)" : "#d1d5db",
            color:"white", boxShadow: canAnalyze ? "0 6px 20px rgba(34,197,94,0.35)" : "none" }}>
          {loading ? "분석 중..." : !eventType ? "목적을 먼저 선택해주세요" : selectedDates.length===0 ? "날짜를 선택해주세요" : "📅 무료 미리보기"}
        </button>

        {/* 결과 */}
        {results.length > 0 && (
          <div ref={resultsRef}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <p style={{ margin:0, fontWeight:900, fontSize:16, color:"#1f2937" }}>📊 분석 결과</p>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={handleRead}
                  style={{ padding:"6px 12px", border:"1px solid #22c55e", background: speaking ? "#dcfce7" : "white", color:"#15803d", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  {speaking ? "⏹ 멈추기" : "🔊 읽기"}
                </button>
                <button onClick={handleShare}
                  style={{ padding:"6px 12px", border:"none", background:"#FEE500", color:"#3C1E1E", borderRadius:20, fontSize:12, fontWeight:900, cursor:"pointer" }}>
                  공유
                </button>
              </div>
            </div>

            {results.map(r => {
              const d = new Date(r.date);
              const st = RATING_STYLE[r.rating];
              return (
                <div key={r.date} style={{ background:"white", borderRadius:16, padding:"16px", marginBottom:12,
                  boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:`1.5px solid ${st.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <p style={{ margin:0, fontWeight:900, fontSize:16, color:"#1f2937" }}>{d.getMonth()+1}월 {d.getDate()}일 ({r.dayOfWeek})</p>
                      <p style={{ margin:"2px 0 0", fontSize:12, color:"#6b7280", fontWeight:700 }}>{r.iljinHanja}({r.iljin})일</p>
                    </div>
                    <div style={{ background:st.bg, color:st.text, border:`1px solid ${st.border}`, borderRadius:20, padding:"4px 12px", fontSize:13, fontWeight:900, whiteSpace:"nowrap" }}>
                      {r.emoji} {r.rating}
                    </div>
                  </div>
                  <p style={{ margin:"0 0 8px", fontWeight:800, fontSize:14, color:"#1f2937" }}>{r.title}</p>
                  {r.reason ? (
                    <p style={{ margin:0, fontSize:13, color:"#4b5563", lineHeight:1.7 }}>{r.reason}</p>
                  ) : (
                    <div style={{ background:"#f9fafb", borderRadius:10, padding:"10px 12px", border:"1px dashed #d1d5db" }}>
                      <p style={{ margin:0, fontSize:12, color:"#9ca3af" }}>🔒 자세한 이유는 전체 분석에서 확인해요</p>
                    </div>
                  )}
                </div>
              );
            })}

            {!isPaid && (
              <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", border:"2px solid #86efac", borderRadius:16, padding:"20px 16px", textAlign:"center", marginTop:4 }}>
                <p style={{ margin:"0 0 4px", fontWeight:900, fontSize:18, color:"#15803d" }}>📅 전체 날짜 상세 해설</p>
                <p style={{ margin:"0 0 6px", fontSize:13, color:"#166534", lineHeight:1.7 }}>선택한 {selectedDates.length}일 모두<br/>왜 좋은지, 무엇을 주의해야 하는지 알 수 있어요</p>
                <p style={{ margin:"0 0 16px", fontSize:12, color:"#166534" }}>일진 해설 · 시간대 안내 · 주의사항</p>
                <button onClick={handlePay}
                  style={{ width:"100%", padding:"14px 0", background:"linear-gradient(135deg,#22c55e,#15803d)", color:"white", border:"none", borderRadius:50, fontWeight:900, fontSize:16, cursor:"pointer", boxShadow:"0 6px 20px rgba(34,197,94,0.35)" }}>
                  📅 전체 해설 보기 — ₩2,900
                </button>
                <p style={{ margin:"8px 0 0", fontSize:11, color:"#6b7280" }}>즉시 열람 · SSL 보안 결제</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
