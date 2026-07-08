"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

type EventType = "이사"|"상견례"|"면접"|"개업"|"결혼"|"수술"|"여행"|"계약"|"시험"|"출산"|"재회연락";
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
  { icon: "💌", label: "재회연락" },
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
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthYear, setPartnerBirthYear] = useState("");
  const [partnerBirthMonth, setPartnerBirthMonth] = useState("");
  const [partnerBirthDay, setPartnerBirthDay] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const chunksRef = useRef<string[]>([]);
  const chunkIdxRef = useRef(0);
  const autoFetchedRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("v2_saved_profile");
    if (!saved) { router.push("/main-v2"); return; }
    setProfile(JSON.parse(saved));

    const urlParams = new URLSearchParams(window.location.search);
    const urlPaid = urlParams.get("taegilPaid") === "1";
    const sessPaid = sessionStorage.getItem("taegilPaid") === "1";

    if (urlPaid || sessPaid) {
      // sessionStorage에만 저장 (탭 닫거나 나가면 초기화 → 재결제 필요)
      if (urlPaid) {
        sessionStorage.setItem("taegilPaid", "1");
      }
      setIsPaid(true);
      const et = sessionStorage.getItem("taegilEventType") as EventType;
      const dtStr = sessionStorage.getItem("taegilDates");
      const dt = JSON.parse(dtStr || "[]") as string[];
      if (et) setEventType(et);
      if (dt.length > 0) setSelectedDates(dt);
    }
  }, []);

  useEffect(() => {
    if (isPaid && eventType && selectedDates.length > 0 && profile && !autoFetchedRef.current) {
      autoFetchedRef.current = true;
      fetchTaegil(true);
    }
  }, [isPaid, eventType, selectedDates, profile]);

  const toggleDate = (dateStr: string) => {
    if (isPaid) return;
    setSelectedDates(prev =>
      prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]
    );
  };

  const selectAllMonth = () => {
    if (isPaid) return;
    const daysInMonth = new Date(calYear, calMonth, 0).getDate();
    const all: string[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calYear}-${String(calMonth).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      if (!isPast(calYear, calMonth, d)) all.push(dateStr);
    }
    setSelectedDates(all);
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
      const partnerBirth = (eventType === "결혼" && partnerBirthYear && partnerBirthMonth && partnerBirthDay)
        ? `${partnerBirthYear}-${String(partnerBirthMonth).padStart(2,"0")}-${String(partnerBirthDay).padStart(2,"0")}`
        : null;
      const res = await fetch("/api/v2/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name, birth,
          birthHour: profile.birthHour || "unknown",
          gender: profile.gender || "여",
          category: "택일",
          planType: "taegil",
          eventType,
          dates: selectedDates, taegilPaid: paid,
          partnerName: partnerName || null,
          partnerBirth,
        }),
      });
      const data = await res.json();
      setResults(data.results || []);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    } catch { alert("분석 중 오류가 발생했습니다."); }
    finally { setLoading(false); }
  };

  const taegilPrice = 2900; // 날짜 수에 관계없이 고정 ₩2,900

  const handlePay = () => {
    if (!eventType) { alert("목적을 먼저 선택해주세요!"); return; }
    if (eventType === "결혼" && (!partnerName.trim() || !partnerBirthYear || !partnerBirthMonth || !partnerBirthDay)) {
      alert("결혼 택일은 상대방 정보를 입력해주세요!"); return;
    }
    if (selectedDates.length === 0) { alert("날짜를 선택해주세요!"); return; }
    sessionStorage.setItem("taegilEventType", eventType);
    sessionStorage.setItem("taegilDates", JSON.stringify(selectedDates));
    const next = encodeURIComponent(`/main-v2/taegil`);
    router.push(`/main-v2/pay?amount=${taegilPrice}&taegil=1&next=${next}`);
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
    const shareUrl = "https://jeomun.com/main-v2/taegil";
    const title = `📅 ${profile?.name}님의 ${eventType} 택일 분석`;
    const desc = `좋은 날: ${dateStr} | 점운 AI 사주`;
    const kakao = (window as any).Kakao;
    if (kakao && kakao.isInitialized()) {
      kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title, description: desc,
          imageUrl: "https://i.pinimg.com/1200x/21/92/2c/21922cc59f29ba66e12cc4546e316079.jpg",
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [
          { title: "택일 결과 보기", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } },
          { title: "나도 택일 받기", link: { mobileWebUrl: "https://jeomun.com/main-v2", webUrl: "https://jeomun.com/main-v2" } },
        ],
      });
    } else if (navigator.share) {
      navigator.share({ title, text: desc, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => alert("링크가 복사됐어요! 카카오톡에 붙여넣기 하세요."));
    }
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

  return (
    <main style={{ minHeight:"100vh", background:"#f0fdf4", fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      {/* 헤더 — 항상 즉시 렌더링 (LCP 개선) */}
      <div style={{ background:"linear-gradient(135deg,#22c55e,#15803d)", padding:"16px 20px 24px", color:"white" }}>
        <button onClick={() => router.push("/main-v2")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.8)", fontSize:14, cursor:"pointer", padding:0, marginBottom:12 }}>← 홈으로</button>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>📅</div>
          <div>
            <h1 style={{ margin:0, fontSize:20, fontWeight:900 }}>택일(擇日)</h1>
            <p style={{ margin:0, fontSize:13, opacity:0.85 }}>{profile ? `${profile.name}님의 좋은 날 분석` : "좋은 날 분석"}</p>
          </div>
        </div>
      </div>

      {profile && <div style={{ maxWidth:480, margin:"0 auto", padding:"20px 16px 60px" }}>

        {/* 기능 안내 */}
        {!isPaid && (
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#15803d", background:"#dcfce7", borderRadius:20, padding:"4px 12px", border:"1px solid #86efac" }}>📅 날짜 무제한 검색</span>
            <span style={{ fontSize:12, fontWeight:700, color:"#1d4ed8", background:"#dbeafe", borderRadius:20, padding:"4px 12px", border:"1px solid #93c5fd" }}>💰 목적별 ₩2,900 고정</span>
            <span style={{ fontSize:12, fontWeight:700, color:"#7c3aed", background:"#ede9fe", borderRadius:20, padding:"4px 12px", border:"1px solid #c4b5fd" }}>⚡ 즉시 결과 확인</span>
          </div>
        )}

        {/* Step 1: 목적 */}
        <div style={{ background:"white", borderRadius:16, padding:"18px 16px", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ margin:"0 0 14px", fontWeight:900, fontSize:15, color:"#1f2937", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ display:"inline-flex", width:24, height:24, borderRadius:"50%", background:"#22c55e", color:"white", fontSize:12, fontWeight:900, alignItems:"center", justifyContent:"center" }}>1</span>
            어떤 목적의 택일인가요?
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            {EVENT_TYPES.map(({ icon, label }) => (
              <button key={label} onClick={() => !isPaid && setEventType(label)}
                style={{ padding:"8px 4px", border: eventType===label ? "2px solid #22c55e" : "1.5px solid #e5e7eb",
                  background: eventType===label ? "#dcfce7" : "white", borderRadius:10,
                  fontSize:11, fontWeight:700, color: eventType===label ? "#15803d" : "#374151",
                  cursor: isPaid ? "default" : "pointer",
                  opacity: isPaid && eventType !== label ? 0.4 : 1,
                  display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <span style={{ fontSize:20 }}>{icon}</span>{label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: 결혼 시 상대방 정보 */}
        {eventType === "결혼" && (
          <div style={{ background:"white", borderRadius:16, padding:"18px 16px", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:"2px solid #fce7f3" }}>
            <p style={{ margin:"0 0 14px", fontWeight:900, fontSize:15, color:"#be185d", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ display:"inline-flex", width:24, height:24, borderRadius:"50%", background:"#ec4899", color:"white", fontSize:12, fontWeight:900, alignItems:"center", justifyContent:"center" }}>2</span>
              💍 상대방 정보를 입력해주세요
            </p>
            <p style={{ fontSize:12, color:"#6b7280", margin:"0 0 14px 32px" }}>두 사람 모두에게 좋은 날을 찾아드려요</p>
            <div style={{ marginBottom:10 }}>
              <label style={{ fontSize:12, fontWeight:800, color:"#6b7280", display:"block", marginBottom:5 }}>상대방 이름</label>
              <input type="text" value={partnerName} onChange={e => setPartnerName(e.target.value)} placeholder="홍길동"
                style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #e5e7eb", fontSize:14, outline:"none", boxSizing:"border-box" }} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:800, color:"#6b7280", display:"block", marginBottom:5 }}>상대방 생년월일</label>
              <div style={{ display:"flex", gap:6 }}>
                <input type="number" value={partnerBirthYear} onChange={e => setPartnerBirthYear(e.target.value)} placeholder="1990"
                  style={{ flex:2, padding:"10px 8px", borderRadius:10, border:"1.5px solid #e5e7eb", fontSize:14, outline:"none" }} />
                <select value={partnerBirthMonth} onChange={e => setPartnerBirthMonth(e.target.value)}
                  style={{ flex:1, padding:"10px 4px", borderRadius:10, border:"1.5px solid #e5e7eb", fontSize:14, outline:"none" }}>
                  <option value="">월</option>
                  {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}월</option>)}
                </select>
                <select value={partnerBirthDay} onChange={e => setPartnerBirthDay(e.target.value)}
                  style={{ flex:1, padding:"10px 4px", borderRadius:10, border:"1.5px solid #e5e7eb", fontSize:14, outline:"none" }}>
                  <option value="">일</option>
                  {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}일</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3(결혼) or Step 2(기타): 날짜 */}
        <div style={{ background:"white", borderRadius:16, padding:"18px 16px", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
            <p style={{ margin:0, fontWeight:900, fontSize:15, color:"#1f2937", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ display:"inline-flex", width:24, height:24, borderRadius:"50%", background:"#22c55e", color:"white", fontSize:12, fontWeight:900, alignItems:"center", justifyContent:"center" }}>{eventType === "결혼" ? "3" : "2"}</span>
              후보 날짜를 선택해주세요
            </p>
            {!isPaid && (
              <button onClick={selectedDates.length > 0 ? () => setSelectedDates([]) : selectAllMonth}
                style={{ fontSize:11, fontWeight:700, color:"#15803d", background:"#dcfce7", border:"1px solid #86efac", borderRadius:8, padding:"4px 10px", cursor:"pointer" }}>
                {selectedDates.length > 0 ? "전체 해제" : "이달 전체 선택"}
              </button>
            )}
          </div>
          <p style={{ margin:"0 0 14px 32px", fontSize:12, color:"#6b7280" }}>날짜를 무제한 선택할 수 있어요 · ₩2,900 고정</p>
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
          <p style={{ textAlign:"center", fontSize:12, color:"#6b7280", margin:"12px 0 0", fontWeight:700 }}>{selectedDates.length}일 선택됨</p>
        </div>

        {/* 분석 버튼 */}
        {isPaid && (
          <div style={{ background:"#dcfce7", border:"2px solid #22c55e", borderRadius:12, padding:"10px 16px", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:18 }}>✅</span>
              <span style={{ fontSize:13, fontWeight:900, color:"#15803d" }}>결제 완료 — 전체 해설 표시 중</span>
            </div>
            <button onClick={() => canAnalyze && fetchTaegil(true)}
              style={{ fontSize:12, fontWeight:700, color:"#15803d", background:"white", border:"1px solid #22c55e", borderRadius:8, padding:"6px 12px", cursor: canAnalyze ? "pointer" : "not-allowed" }}>
              🔄 다시 분석하기
            </button>
          </div>
        )}
        <button onClick={() => {
          sessionStorage.removeItem("taegilPaid");
          sessionStorage.removeItem("taegilEventType");
          sessionStorage.removeItem("taegilDates");
          setIsPaid(false);
          setEventType("");
          setSelectedDates([]);
          setResults([]);
          autoFetchedRef.current = false;
        }}
          style={{ width:"100%", padding:"15px 0", marginBottom:16, border:"none", borderRadius:50, fontWeight:900, fontSize:15, cursor:"pointer",
            background: "linear-gradient(135deg,#22c55e,#15803d)",
            color:"white", boxShadow: "0 6px 20px rgba(34,197,94,0.35)" }}>
          🔄 새로 분석하기
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

            {isPaid && (
              <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:10, padding:"10px 14px", marginBottom:12, fontSize:12, color:"#ef4444", fontWeight:700, lineHeight:1.8 }}>
                ⚠️ 이 화면을 벗어나면 결과가 사라져요.<br />지금 바로 공유하거나 캡처해두세요.
              </div>
            )}

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
                <p style={{ margin:"0 0 6px", fontSize:13, color:"#166534", lineHeight:1.7 }}>선택한 {selectedDates.length}일 전체<br/>일진 해설 · 시간대 안내 · 주의사항 · 팁</p>
                <p style={{ margin:"0 0 12px", fontSize:11, color:"#15803d", fontWeight:700 }}>
                  날짜 수 관계없이 ₩2,900 고정
                </p>
                <button onClick={handlePay}
                  style={{ width:"100%", padding:"14px 0", background:"linear-gradient(135deg,#22c55e,#15803d)", color:"white", border:"none", borderRadius:50, fontWeight:900, fontSize:16, cursor:"pointer", boxShadow:"0 6px 20px rgba(34,197,94,0.35)" }}>
                  📅 전체 해설 보기 — ₩{taegilPrice.toLocaleString()}
                </button>
                <p style={{ margin:"8px 0 0", fontSize:11, color:"#6b7280" }}>즉시 열람 · SSL 보안 결제</p>
              </div>
            )}
          </div>
        )}
      </div>}
      <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" strategy="afterInteractive"
        onLoad={() => { const k = (window as any).Kakao; if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY); }} />
    </main>
  );
}
