"use client";

import { useState, useEffect, useRef } from "react";
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
  const [profile, setProfile] = useState<any>(null);
  const [eventType, setEventType] = useState<EventType | "">("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);
  const [results, setResults] = useState<TaegilResult[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthYear, setPartnerBirthYear] = useState("");
  const [partnerBirthMonth, setPartnerBirthMonth] = useState("");
  const [partnerBirthDay, setPartnerBirthDay] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const chunksRef = useRef<string[]>([]);
  const chunkIdxRef = useRef(0);
  const autoFetchedRef = useRef(false);

  useEffect(() => {
    return () => { sessionStorage.removeItem("taegilPaid"); };
  }, []);

  // Router Cache가 이전 결제 상태를 복원할 때 sessionStorage와 불일치 방지
  useEffect(() => {
    const recheck = () => {
      const sessPaid = sessionStorage.getItem("taegilPaid") === "1";
      const urlPaid = new URLSearchParams(window.location.search).get("taegilPaid") === "1";
      if (!sessPaid && !urlPaid) {
        setIsPaid(false);
        setResults([]);
      }
    };
    window.addEventListener("pageshow", recheck);
    window.addEventListener("focus", recheck);
    return () => {
      window.removeEventListener("pageshow", recheck);
      window.removeEventListener("focus", recheck);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("v2_saved_profile");
    if (!saved) { window.location.replace("/main-v2"); return; }
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
    setSelectedDates(prev =>
      prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]
    );
  };

  const selectAllMonth = () => {
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
    window.location.href = `/main-v2/pay?amount=${taegilPrice}&taegil=1&next=${next}`;
  };

  const getKoreanVoice = (): Promise<SpeechSynthesisVoice | null> =>
    new Promise(resolve => {
      const pick = (list: SpeechSynthesisVoice[]) => list.find(v => v.lang?.toLowerCase().startsWith("ko")) || null;
      const existing = window.speechSynthesis.getVoices();
      if (existing.length > 0) { resolve(pick(existing)); return; }
      const timer = setTimeout(() => resolve(pick(window.speechSynthesis.getVoices())), 1000);
      window.speechSynthesis.onvoiceschanged = () => { clearTimeout(timer); resolve(pick(window.speechSynthesis.getVoices())); };
    });

  const stopTts = () => {
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
    setSpeaking(false);
    chunksRef.current = [];
    chunkIdxRef.current = 0;
  };

  const restartReadAloud = () => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    chunksRef.current = [];
    chunkIdxRef.current = 0;
    setTimeout(() => handleRead(), 80);
  };

  const handleRead = async () => {
    if (!results.length) return;
    if (/KAKAOTALK|kakaoBrowser|KAKAO/i.test(navigator.userAgent)) {
      alert("카카오톡 안에서는 읽기가 바로 시작되지 않아요.\n\n화면 오른쪽 아래 점 세 개(⋮) 버튼을 누르고\n[다른 브라우저로 열기]를 선택한 다음\n🔊 읽기 버튼을 누르면 읽어주기가 작동해요.");
      return;
    }
    if (speaking) { stopTts(); return; }
    const text = results.map(r => {
      const d = new Date(r.date);
      return `${d.getMonth()+1}월 ${d.getDate()}일 ${r.dayOfWeek}요일, ${r.iljin}일. ${r.rating}. ${r.title}. ${r.reason || ""}`;
    }).join(". 다음 날짜. ");
    chunksRef.current = text.match(/.{1,200}/g) || [text];
    chunkIdxRef.current = 0;
    window.speechSynthesis.cancel();
    const voice = await getKoreanVoice();
    setSpeaking(true);
    chunksRef.current.forEach((chunk, idx) => {
      const utt = new SpeechSynthesisUtterance(chunk);
      utt.lang = "ko-KR"; utt.rate = 0.95;
      if (voice) utt.voice = voice;
      utt.onerror = () => { setSpeaking(false); };
      if (idx === chunksRef.current.length - 1) {
        utt.onend = () => { setSpeaking(false); chunksRef.current = []; chunkIdxRef.current = 0; };
      }
      window.speechSynthesis.speak(utt);
    });
  };

  const saveToHistory = () => {
    if (!profile || !results.length) return;
    try {
      const id = `taegil-${profile.name}-${eventType}-${Date.now()}`;
      const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
      const newItem = {
        id, date: new Date().toISOString(),
        name: profile.name,
        category: `📅 택일 ${eventType} 분석`,
        analysis: results.map(r => {
          const d = new Date(r.date);
          return `${d.getMonth()+1}월 ${d.getDate()}일 (${r.dayOfWeek}) ${r.rating}\n${r.title}${r.reason ? `\n${r.reason}` : ""}`;
        }).join("\n\n"),
        scores: { total: 75, wealth: 70, love: 70, health: 75, success: 75 },
        isPaid: true, planType: "taegil", birthYear: profile.birthYear ?? "",
      };
      hist.unshift(newItem);
      localStorage.setItem("v2_history", JSON.stringify(hist.slice(0, 50)));
      const name = profile.name;
      if (name) {
        try {
          const _prof = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
          const _phone = (_prof.phone || localStorage.getItem("v2_saved_phone") || "").replace(/\D/g, "");
          fetch("/api/v2/history", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone: _phone || undefined, item: newItem }) }).catch(() => {});
        } catch {
          fetch("/api/v2/history", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, item: newItem }) }).catch(() => {});
        }
      }
      setHistorySaved(true);
    } catch {}
  };

  const handleShare = async () => {
    if (!results.length) return;
    // 결과를 share API에 저장해서 고유 링크 생성
    const categories = results.map(r => {
      const d = new Date(r.date + "T00:00:00");
      return {
        icon: r.emoji,
        label: `${d.getMonth()+1}월 ${d.getDate()}일 (${r.dayOfWeek}) ${r.iljin}`,
        color: r.rating === "대길" ? "#15803d" : r.rating === "길" ? "#1d4ed8" : r.rating === "흉" ? "#dc2626" : "#4b5563",
        text: `${r.rating} — ${r.title}${r.reason ? "\n" + r.reason : ""}`,
      };
    });
    let shareUrl = `${window.location.origin}/main-v2/taegil`;
    try {
      const res = await fetch("/api/v2/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile?.name, categories, tier: "taegil", subtitle: `${eventType} 택일 분석` }),
      });
      if (res.ok) { const data = await res.json(); if (data.id) shareUrl = `${window.location.origin}/main-v2/share/${data.id}`; }
    } catch {}
    const best = results.filter(r => r.rating === "대길" || r.rating === "길").slice(0, 3);
    const dateStr = best.length > 0
      ? best.map(r => { const d = new Date(r.date + "T00:00:00"); return `${d.getMonth()+1}/${d.getDate()} ${r.rating}`; }).join(", ")
      : "분석 완료";
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
          { title: "나도 택일 받기", link: { mobileWebUrl: "https://jeomun.com/main-v2/taegil", webUrl: "https://jeomun.com/main-v2/taegil" } },
        ],
      });
    } else if (navigator.share) {
      navigator.share({ title, text: desc, url: shareUrl });
    } else {
      window.location.href = `kakaotalk://msg/send?text=${encodeURIComponent(shareUrl)}`;
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
        <button onClick={() => { window.location.href = "/main-v2"; }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.8)", fontSize:14, cursor:"pointer", padding:0, marginBottom:12 }}>← 홈으로</button>
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
          <div style={{ background:"#dcfce7", border:"2px solid #22c55e", borderRadius:12, padding:"10px 16px", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ fontSize:18 }}>✅</span>
              <span style={{ fontSize:13, fontWeight:900, color:"#15803d" }}>결제 완료 —<br />날짜를 바꿔서 아래 버튼으로 다시 분석할 수 있어요</span>
            </div>
            <button onClick={() => {
              sessionStorage.removeItem("taegilPaid");
              sessionStorage.removeItem("taegilEventType");
              sessionStorage.removeItem("taegilDates");
              setIsPaid(false);
              setResults([]);
              setSelectedDates([]);
              setEventType("");
            }} style={{ width:"100%", padding:"9px 0", border:"1.5px solid #15803d", borderRadius:8, background:"white", color:"#15803d", fontWeight:800, fontSize:13, cursor:"pointer" }}>
              🔄 다른 목적으로 새로 결제하기
            </button>
          </div>
        )}
        <button onClick={() => {
          if (isPaid) {
            if (selectedDates.length === 0) { alert("날짜를 선택해주세요!"); return; }
            fetchTaegil(true);
          } else {
            handlePay();
          }
        }}
          style={{ width:"100%", padding:"15px 0", marginBottom:16, border:"none", borderRadius:50, fontWeight:900, fontSize:15, cursor: loading ? "not-allowed" : "pointer",
            background: loading ? "#9ca3af" : "linear-gradient(135deg,#22c55e,#15803d)",
            color:"white", boxShadow: "0 6px 20px rgba(34,197,94,0.35)" }}>
          {loading ? "⏳ 분석 중..." : isPaid ? "🔄 날짜 바꿔서 다시 분석하기" : "📅 날짜 분석하기 — ₩2,900"}
        </button>

        {/* 결과 — 결제 완료 시에만 표시 */}
        {results.length > 0 && isPaid && (
          <div ref={resultsRef}>
            {/* 꼭 읽어보세요 버튼 */}
            <button
              onClick={() => setShowGuideModal(true)}
              style={{ display: "block", width: "100%", padding: "13px 16px", marginBottom: 10, background: "#dc2626", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: "pointer", textAlign: "left", boxShadow: "0 2px 10px rgba(220,38,38,0.35)" }}
            >
              📌 꼭 읽어보세요 · 자세히 보기 →
            </button>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <p style={{ margin:0, fontWeight:900, fontSize:16, color:"#1f2937" }}>📊 분석 결과</p>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={restartReadAloud}
                  style={{ padding:"6px 10px", border:"1px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.08)", color:"#7c3aed", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  ↺ 처음부터
                </button>
                <button onClick={handleRead}
                  style={{ padding:"6px 12px", border:"1px solid #22c55e", background: speaking ? "#dcfce7" : "white", color:"#15803d", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  {speaking ? "⏹ 멈추기" : "🔊 읽기"}
                </button>
                <button onClick={handleShare}
                  style={{ padding:"6px 12px", border:"none", background:"#FEE500", color:"#3C1E1E", borderRadius:20, fontSize:12, fontWeight:900, cursor:"pointer" }}>
                  공유
                </button>
                <button onClick={saveToHistory}
                  style={{ padding:"6px 12px", border:"1px solid #6366f1", background: historySaved ? "#e0e7ff" : "white", color:"#4338ca", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  {historySaved ? "✅ 저장됨" : "📋 보관함"}
                </button>
              </div>
            </div>

            {isPaid && (
              <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:10, padding:"10px 14px", marginBottom:12, fontSize:12, color:"#ef4444", fontWeight:700, lineHeight:1.8 }}>
                이 화면을 나가면 결과가 사라져요.<br />위 [공유] 버튼을 눌러 저장하면 언제든 다시 볼 수 있어요.
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

          </div>
        )}
      </div>}
      {/* 고정 읽기 버튼 */}
      {results.length > 0 && (
        <div style={{ position: "fixed", right: 16, bottom: 80, zIndex: 200, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <button onClick={restartReadAloud} title="처음부터 다시 듣기" style={{ padding: "8px 12px", borderRadius: 50, border: "none", background: "rgba(139,92,246,0.15)", color: "#7c3aed", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>↺ 처음부터 듣기</button>
          <button onClick={handleRead} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 18px", borderRadius: 50, border: "none", background: speaking ? "linear-gradient(135deg,#ef4444,#f97316)" : "linear-gradient(135deg,#22c55e,#15803d)", color: "white", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.28)" }}>
            {speaking ? "⏹ 멈추기" : "🔊 읽어주기"}
          </button>
        </div>
      )}

      {/* 읽기 안내 모달 */}
      {showGuideModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowGuideModal(false)}>
          <div style={{ background: "white", borderRadius: 20, padding: "20px 18px", maxWidth: 360, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#dc2626", margin: "0 0 14px" }}>📌 꼭 확인하세요!</p>
            <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#dc2626", margin: "0 0 4px" }}>⚠️ 이 화면을 나가면 결과가 사라져요!</p>
              <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.7 }}>결과를 저장하려면 <strong>[공유]</strong> 버튼을 눌러<br />카카오톡 등에 공유해 두세요.</p>
            </div>
            <div style={{ background: "#f5f3ff", border: "1.5px solid #ddd6fe", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#6d28d9", margin: "0 0 4px" }}>🔊 읽어주기 팁</p>
              <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.8 }}>카카오톡에서는 읽기가 안 돼요.<br />⋮ → 다른 브라우저로 열기 → 🔊 읽기를 눌러요.<br />화면이 꺼지면 끊길 수 있어요.<br />설정 → 화면 자동 꺼짐 시간을 늘리세요.</p>
            </div>
            <button onClick={() => setShowGuideModal(false)} style={{ width: "100%", padding: "12px 0", background: "#dc2626", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>확인</button>
          </div>
        </div>
      )}
      <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" strategy="afterInteractive"
        onLoad={() => { const k = (window as any).Kakao; if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY); }} />
    </main>
  );
}
