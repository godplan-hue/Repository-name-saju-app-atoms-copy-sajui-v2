"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import KakaoShareCouponBanner from "@/app/main-v2/_components/KakaoShareCouponBanner";

const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const MONTH_EMOJI = ["🌱","❄️","🌸","🌿","☀️","🌊","🔥","🌻","🍁","🌙","⭐","🎆"];
const CURRENT_YEAR = new Date().getFullYear();

export default function YearlyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [yearlyText, setYearlyText] = useState("");
  const [monthlyText, setMonthlyText] = useState("");
  const [scores, setScores] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);
  const readChunksRef = useRef<string[]>([]);
  const readIdxRef = useRef(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("v2_saved_profile");
    if (!saved) {
      sessionStorage.setItem("v2_profile_next_url", window.location.href);
      sessionStorage.setItem("v2_from_app", "1");
      document.cookie = "jeomun_from_app=1; path=/; max-age=30";
      window.location.href = "/main-v2/profile";
      return;
    }
    const p = JSON.parse(saved);
    setProfile(p);

    const urlPaid = new URLSearchParams(window.location.search).get("yearlyPaid") === "1";
    const isPaid = sessionStorage.getItem("yearlyPaid") === "1" || urlPaid;
    if (urlPaid) sessionStorage.setItem("yearlyPaid", "1");
    setPaid(isPaid);

    const birth = `${p.birthYear}-${String(p.birthMonth).padStart(2,"0")}-${String(p.birthDay).padStart(2,"0")}`;
    fetchYearly(p.name, birth, p.gender || "여", p.birthHour || "unknown", isPaid);
  }, []);

  const fetchYearly = async (name: string, birth: string, gender: string, birthHour: string, isPaid: boolean) => {
    setLoading(true);
    try {
      const [yearlyRes, monthlyRes] = await Promise.all([
        fetch("/api/v2/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, birth, birthHour, gender, category: "☀️ 올해 운세", planType: "select" }),
        }),
        isPaid ? fetch("/api/v2/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, birth, birthHour, gender, category: "📅 월별운세", planType: "select" }),
        }) : Promise.resolve(null),
      ]);
      const yearlyData = await yearlyRes.json();
      setYearlyText(yearlyData.analysis ?? "");
      setScores(yearlyData.scores ?? null);
      if (monthlyRes) {
        const monthlyData = await monthlyRes.json();
        setMonthlyText(monthlyData.analysis ?? "");
      }
    } catch { } finally {
      setLoading(false);
    }
  };

  const getKoreanVoice = (): Promise<SpeechSynthesisVoice | null> =>
    new Promise(resolve => {
      const pick = (list: SpeechSynthesisVoice[]) => list.find(v => v.lang?.toLowerCase().startsWith("ko")) || null;
      const existing = window.speechSynthesis.getVoices();
      if (existing.length > 0) { resolve(pick(existing)); return; }
      const timer = setTimeout(() => resolve(pick(window.speechSynthesis.getVoices())), 1000);
      window.speechSynthesis.onvoiceschanged = () => { clearTimeout(timer); resolve(pick(window.speechSynthesis.getVoices())); };
    });

  const toggleReadAloud = async () => {
    if (typeof window === "undefined") return;
    if (/KAKAOTALK|kakaoBrowser|KAKAO/i.test(navigator.userAgent)) {
      alert("카카오톡에서 바로 읽기가 되지 않아요.\n\n화면 오른쪽 아래 점 세 개(⋮) 버튼을 누르고\n[다른 브라우저로 열기]를 선택한 다음\n🔊 읽기 버튼을 누르면 읽어주기가 작동해요.");
      return;
    }
    if (/NAVER\(inapp/i.test(navigator.userAgent)) {
      try {
        const isPaidNow = sessionStorage.getItem("yearlyPaid") === "1";
        const copyUrl = isPaidNow
          ? `${window.location.origin}${window.location.pathname}?yearlyPaid=1`
          : window.location.href;
        navigator.clipboard?.writeText(copyUrl);
      } catch {}
      alert("이 링크를 복사해서 크롬 또는 구글 창에 붙여넣으면 읽기가 돼요.");
      return;
    }
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      readChunksRef.current = [];
      readIdxRef.current = 0;
      return;
    }
    const fullText = [yearlyText, paid && monthlyText ? monthlyText : ""].filter(Boolean).join("\n\n");
    if (!fullText.trim()) return;
    readChunksRef.current = fullText.match(/.{1,200}/g) || [fullText];
    readIdxRef.current = 0;
    window.speechSynthesis.cancel();
    const voice = await getKoreanVoice();
    setSpeaking(true);
    readChunksRef.current.forEach((chunk, idx) => {
      const utt = new SpeechSynthesisUtterance(chunk);
      utt.lang = "ko-KR"; utt.rate = 0.95;
      if (voice) utt.voice = voice;
      utt.onerror = () => { setSpeaking(false); };
      if (idx === readChunksRef.current.length - 1) {
        utt.onend = () => { setSpeaking(false); readChunksRef.current = []; readIdxRef.current = 0; };
      }
      window.speechSynthesis.speak(utt);
    });
  };

  const restartReadAloud = () => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    readChunksRef.current = [];
    readIdxRef.current = 0;
    setTimeout(() => toggleReadAloud(), 80);
  };

  // ── 이미지 저장 ──
  const saveImage = async () => {
    if (saving || !cardRef.current) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const el = cardRef.current;
      const prevOv = el.style.overflow;
      el.style.overflow = "visible";
      el.style.maxHeight = "none";
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 80));
      const isMobile = window.innerWidth < 768;
      const fullH = el.scrollHeight + 40;
      const canvas = await html2canvas(el, {
        backgroundColor: "#eff6ff", scale: isMobile ? 2 : 2.5,
        useCORS: true, allowTaint: true, logging: false,
        height: fullH, windowWidth: isMobile ? window.innerWidth : 520, windowHeight: fullH,
      });
      el.style.overflow = prevOv;
      const link = document.createElement("a");
      link.download = `점운_${profile?.name ?? "운세"}_연도별운세.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("이미지 저장에 실패했습니다. 스크린샷을 이용해주세요.");
    } finally {
      setSaving(false);
    }
  };

  // ── 공유 ──
  const shareResult = async () => {
    if (sharing) return;
    setSharing(true);
    let shareUrl = "";
    try {
      const categories = [
        { icon: "☀️", label: "올해 운세", color: "#2563eb", text: yearlyText },
        ...(monthlyText ? [{ icon: "📅", label: "월별운세", color: "#2563eb", text: monthlyText }] : []),
      ].filter(c => c.text && c.text.trim());
      if (categories.length > 0) {
        const res = await fetch("/api/v2/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: profile?.name, categories, tier: "select" }),
        });
        if (res.ok) { const data = await res.json(); shareUrl = `${window.location.origin}/main-v2/share/${data.id}`; }
      }
    } catch { }
    setSharing(false);
    if (!shareUrl) { alert("공유 링크를 만들지 못했어요. 잠시 후 다시 시도해주세요."); return; }
    const title = `📅 ${profile?.name}님의 연도별운세`;
    const desc = `${CURRENT_YEAR}년 올해 운세 + 12개월 로드맵`;
    const kakao = (window as any).Kakao;
    if (kakao && kakao.isInitialized()) {
      kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title, description: `${desc} | 점운 AI사주`,
          imageUrl: "https://i.pinimg.com/1200x/21/92/2c/21922cc59f29ba66e12cc4546e316079.jpg",
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [
          { title: "내 연도별운세 보기", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } },
          { title: "나도 연도별운세 보기", link: { mobileWebUrl: "https://jeomun.com/main-v2", webUrl: "https://jeomun.com/main-v2" } },
        ],
      });
    } else if (navigator.share) {
      navigator.share({ title, text: `${desc} | 점운 AI사주`, url: shareUrl }).catch(() => {});
    } else {
      window.location.href = `kakaotalk://msg/send?text=${encodeURIComponent(shareUrl)}`;
    }
  };

  // ── 보관함 ──
  const saveToHistory = () => {
    if (!profile || !yearlyText) return;
    try {
      const id = `yearly-${profile.name}-${new Date().getFullYear()}`;
      const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
      if (!hist.some((h: any) => h.id === id)) {
        const newItem = {
          id, date: new Date().toISOString(),
          name: profile.name,
          category: `📅 연도별운세 (${new Date().getFullYear()}년)`,
          analysis: [`☀️ 올해 운세\n${yearlyText}`, monthlyText ? `📅 월별운세\n${monthlyText}` : ""].filter(Boolean).join("\n\n"),
          scores, isPaid: true, planType: "yearly", birthYear: profile.birthYear ?? "",
        };
        hist.unshift(newItem);
        localStorage.setItem("v2_history", JSON.stringify(hist.slice(0, 50)));
        // Firebase에도 저장 — 다른 브라우저/기기에서 보관함 로드 가능하게
        try {
          const _phone = (profile.phone || localStorage.getItem("v2_saved_phone") || "").replace(/\D/g, "");
          fetch("/api/v2/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: profile.name, phone: _phone || undefined, item: newItem }),
          }).catch(() => {});
        } catch { }
      }
      setHistorySaved(true);
    } catch { }
  };

  // 점수에서 막대 색 계산
  const scoreColor = (s: number) => s >= 75 ? "#10b981" : s >= 60 ? "#f59e0b" : "#ef4444";

  // 연도 점수 요약
  const totalScore = scores?.total ?? 0;
  const scoreLabel = totalScore >= 75 ? "강한 길운 ✨" : totalScore >= 60 ? "안정적인 흐름 🌿" : "변화가 필요한 시기 🌱";

  return (
    <>
    <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" strategy="afterInteractive"
      onLoad={() => { const k = (window as any).Kakao; if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY); }} />

    {/* 고정 읽기 버튼 */}
    <div style={{ position: "fixed", right: 16, bottom: 80, zIndex: 200, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
      <button onClick={restartReadAloud} title="처음부터 다시 듣기" style={{ padding: "8px 12px", borderRadius: 50, border: "none", background: "rgba(37,99,235,0.15)", color: "#1d4ed8", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>↺ 처음부터 듣기</button>
      <button onClick={toggleReadAloud} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 18px", borderRadius: 50, border: "none", background: speaking ? "linear-gradient(135deg,#ef4444,#f97316)" : "linear-gradient(135deg,#2563eb,#6366f1)", color: "white", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}>
        {speaking ? "⏹ 멈추기" : "🔊 읽어주기"}
      </button>
    </div>

    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0f2fe 100%)",
      color: "#1f2937", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative",
    }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.3)", zIndex: 1, pointerEvents: "none" }} />

      {/* 헤더 */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(37,99,235,0.1)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", color: "#1d4ed8", fontWeight: 900, fontSize: 14, cursor: "pointer" }}>← 점운</button>
        <div style={{ display: "flex", gap: 7 }}>
          <button onClick={toggleReadAloud} style={{ padding: "5px 12px", background: "#eff6ff", color: "#1d4ed8", border: "1px solid rgba(37,99,235,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
            {speaking ? "⏸ 멈추기" : "🔊 읽기"}
          </button>
          <button onClick={restartReadAloud} style={{ padding: "5px 9px", background: "#eff6ff", color: "#1d4ed8", border: "1px solid rgba(37,99,235,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>↺ 처음부터 듣기</button>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 520, margin: "0 auto", padding: "24px 16px 60px" }}>

        {/* 꼭 읽어보세요 버튼 */}
        <button
          onClick={() => setShowGuideModal(true)}
          style={{ display: "block", width: "100%", padding: "13px 16px", marginBottom: 10, background: "#dc2626", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: "pointer", textAlign: "left", boxShadow: "0 2px 10px rgba(220,38,38,0.35)" }}
        >
          📌 꼭 읽어보세요 · 자세히 보기 →
        </button>

        {/* 타이틀 */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>📅</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#1d4ed8", margin: "0 0 6px" }}>연도별운세</h1>
          <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>올해 전체 흐름 + 12개월 로드맵</p>
        </div>

        {/* 쿠폰 배너 */}
        <KakaoShareCouponBanner />
        <div onClick={() => router.push("/share-coupon")} style={{ marginBottom: 16, borderRadius: 16, overflow: "hidden", cursor: "pointer", border: "1.5px solid #fca5a5" }}>
          <div style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📸</span>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>SNS에 글 올리면 990원 쿠폰 10장!</span>
          </div>
          <div style={{ background: "#fef2f2", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 11, color: "#dc2626", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>소개·추천 글 1,000자 이상 + 사진 3장<br />쿠폰 10장 + 꿈해몽 24시간 무료 🎁</p>
            <span style={{ fontSize: 12, fontWeight: 900, color: "#fff", background: "#dc2626", padding: "5px 12px", borderRadius: 20, whiteSpace: "nowrap", marginLeft: 8 }}>받기 →</span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
            <p>운세를 계산하는 중...</p>
          </div>
        ) : (
          <>
            <div ref={cardRef}>
            {/* 운세 점수 요약 */}
            {profile && scores && (
              <div style={{ background: "white", border: "1.5px solid rgba(37,99,235,0.2)", borderRadius: 14, padding: "16px", marginBottom: 20, textAlign: "center", boxShadow: "0 2px 12px rgba(37,99,235,0.08)" }}>
                <p style={{ color: "#6b7280", fontSize: 12, margin: "0 0 8px" }}>{profile.name}님의 {CURRENT_YEAR}년 운세</p>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#2563eb", margin: "0 0 4px" }}>{totalScore}점</div>
                <p style={{ color: "#374151", fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>{scoreLabel}</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {[
                    { label: "재물", score: scores.wealth },
                    { label: "연애", score: scores.love },
                    { label: "건강", score: scores.health },
                    { label: "성공", score: scores.success },
                  ].map(s => (
                    <div key={s.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "8px 14px", minWidth: 70 }}>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{s.label}운</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: scoreColor(s.score) }}>{s.score}점</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 올해 운세 */}
            <div style={{ background: "white", border: "1.5px solid rgba(37,99,235,0.15)", borderRadius: 14, padding: "20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(37,99,235,0.06)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1d4ed8", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                ☀️ {CURRENT_YEAR}년 올해 운세
              </h2>
              {paid ? (
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line", wordBreak: "keep-all" }}>{yearlyText}</p>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
                  <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>결제 후 전체 내용을 확인할 수 있어요</p>
                </div>
              )}
            </div>

            {/* 12개월 로드맵 — 유료 */}
            {paid && monthlyText ? (
              <div style={{ background: "white", border: "1.5px solid rgba(37,99,235,0.15)", borderRadius: 14, padding: "20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(37,99,235,0.06)" }}>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1d4ed8", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}>
                  📅 {CURRENT_YEAR}년 월별 상세 운세
                </h2>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line", wordBreak: "keep-all" }}>{monthlyText}</p>
              </div>
            ) : !paid ? (
              /* 월별 미리보기 — 잠금 */
              <div style={{ background: "white", border: "1.5px solid rgba(37,99,235,0.15)", borderRadius: 14, padding: "20px", marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1d4ed8", margin: "0 0 16px" }}>📅 {CURRENT_YEAR}년 월별 운세 미리보기</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {MONTHS.map((m, i) => (
                    <div key={m} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", filter: "blur(1.5px)", opacity: 0.6 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{MONTH_EMOJI[i]} {m}</div>
                      <div style={{ fontSize: 11, color: "#d1d5db", marginTop: 2 }}>🔒 결제 후 공개</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            </div>

            {/* 저장/공유 — 유료만 */}
            {paid && (
              <>
                <div style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.3)", borderRadius: 10, padding: "8px 12px", marginBottom: 10, fontSize: 11, color: "#4b5563", lineHeight: 1.6 }}>
                  💡 이 화면을 나가면 결과가 사라져요.<br />아래 [보관함] 버튼을 눌러 저장하면 언제든 다시 볼 수 있어요.
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <button onClick={shareResult} disabled={sharing}
                    style={{ flex: 1, padding: "12px 0", background: "linear-gradient(135deg,#2563eb,#6366f1)", color: "white", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 13, cursor: sharing ? "not-allowed" : "pointer" }}>
                    {sharing ? "⏳..." : "📤 공유하기"}
                  </button>
                  <button onClick={saveImage} disabled={saving}
                    style={{ flex: 1, padding: "12px 0", background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.3)", color: "#1d4ed8", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: saving ? "not-allowed" : "pointer" }}>
                    {saving ? "⏳..." : "🖼️ 이미지 저장"}
                  </button>
                  <button onClick={saveToHistory}
                    style={{ flex: 1, padding: "12px 0", background: historySaved ? "rgba(37,99,235,0.15)" : "white", border: historySaved ? "1px solid rgba(37,99,235,0.4)" : "1px solid #e5e7eb", color: historySaved ? "#1d4ed8" : "#6b7280", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    {historySaved ? "✅ 저장됨" : "📚 보관함"}
                  </button>
                </div>
              </>
            )}

            {/* 결제 섹션 */}
            {!paid && (
              <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(99,102,241,0.06))", border: "1.5px solid rgba(37,99,235,0.35)", borderRadius: 18, padding: "24px 20px", textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🔓</div>
                <h3 style={{ color: "#1d4ed8", fontSize: 18, fontWeight: 900, margin: "0 0 8px" }}>올해 운세 전체 + 12개월 로드맵</h3>
                <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.7, margin: "0 0 16px" }}>
                  {CURRENT_YEAR}년 전체 흐름 상세 해설<br />
                  1월~12월 월별 맞춤 운세 완전 공개
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
                  {["☀️ 올해 운세 전체", "📅 12개월 상세", "💡 월별 조언"].map(t => (
                    <span key={t} style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.3)", color: "#2563eb", fontSize: 12, padding: "4px 10px", borderRadius: 20 }}>{t}</span>
                  ))}
                </div>
                <div style={{ color: "#2563eb", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>₩2,900</div>
                <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 16px", textDecoration: "line-through" }}>₩14,900</p>
                <button
                  onClick={() => router.push(`/main-v2/pay?amount=2900&next=${encodeURIComponent("/payment-complete?yearly=1&paid=2900")}`)}
                  style={{ background: "linear-gradient(135deg, #2563eb, #6366f1)", color: "white", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 900, cursor: "pointer", width: "100%", boxShadow: "0 4px 20px rgba(37,99,235,0.3)" }}
                >
                  📅 연도별운세 전체 보기
                </button>
              </div>
            )}

            {paid && (
              <div style={{ textAlign: "center", padding: "16px 0", color: "#6b7280", fontSize: 13 }}>
                ✅ {CURRENT_YEAR}년 연도별운세 해금 완료
              </div>
            )}
          </>
        )}
      </div>
    </main>

    {/* 읽기 안내 모달 */}
    {showGuideModal && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowGuideModal(false)}>
        <div style={{ background: "white", borderRadius: 20, padding: "20px 18px", maxWidth: 360, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
          <p style={{ fontSize: 15, fontWeight: 900, color: "#dc2626", margin: "0 0 14px" }}>📌 꼭 확인하세요!</p>
          <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 900, color: "#dc2626", margin: "0 0 4px" }}>⚠️ 이 화면을 나가면 결과가 사라져요!</p>
            <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.7 }}>탭을 닫거나 나가면 연도별운세가 초기화돼요.<br />화면 캡처로 저장해두세요.</p>
          </div>
          <div style={{ background: "#f5f3ff", border: "1.5px solid #ddd6fe", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 900, color: "#6d28d9", margin: "0 0 4px" }}>🔊 읽어주기 팁</p>
            <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.8 }}>카카오톡에서는 읽기가 안 돼요.<br />⋮ → 다른 브라우저로 열기 → 🔊 읽기를 눌러요.<br />화면이 꺼지면 끊길 수 있어요.<br />설정 → 화면 자동 꺼짐 시간을 늘리세요.</p>
          </div>
          <button onClick={() => setShowGuideModal(false)} style={{ width: "100%", padding: "12px 0", background: "#dc2626", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>확인</button>
        </div>
      </div>
    )}
    </>
  );
}
