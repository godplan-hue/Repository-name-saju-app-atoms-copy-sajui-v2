"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const SELECT_CATS = [
  { key: "💰 재물운", icon: "💰", color: "#f59e0b" },
  { key: "💕 연애운", icon: "💕", color: "#ec4899" },
  { key: "💪 건강운", icon: "💪", color: "#10b981" },
  { key: "🎯 성공운", icon: "🎯", color: "#8b5cf6" },
  { key: "✨ 총운",   icon: "✨", color: "#6366f1" },
];

const PLANS = [
  {
    id: "taste",
    icon: "🦢",
    name: "학 코스",
    badge: null,
    desc: "₩990",
    price: 990,
    priceStr: "₩990",
    features: ["AI 심층 분석"],
    highlight: false,
    per: "1회",
  },
  {
    id: "basic",
    icon: "🐯",
    name: "호랑이 코스",
    badge: null,
    desc: "₩2,970",
    price: 2970,
    priceStr: "₩2,970",
    features: ["AI 심층 분석", "재물운+성공운 상세"],
    highlight: false,
    per: "3회",
  },
  {
    id: "popular",
    icon: "🦚",
    name: "봉황 코스",
    badge: "🔥 인기",
    desc: "₩4,950",
    price: 4950,
    priceStr: "₩4,950",
    features: ["AI 심층 분석", "연애운+건강운 상세", "월별+오늘 운세 포함"],
    highlight: true,
    per: "5회",
  },
  {
    id: "vip",
    icon: "🐲",
    name: "용 코스",
    badge: "👑 최고",
    desc: "₩9,990",
    price: 9990,
    priceStr: "₩9,990",
    features: ["AI 심층 분석", "전 분야 사주 분석 + 사업운+총운", "월별+오늘 운세", "결혼운+궁합 분석 포함"],
    highlight: false,
    per: "무제한",
  },
];

export default function V2Payment() {
  const router = useRouter();
  const [sel, setSel] = useState("taste");
  const [selectedCats, setSelectedCats] = useState<string[]>(SELECT_CATS.map(c => c.key));
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const p = sessionStorage.getItem("v2_profile");
    if (p) setProfile(JSON.parse(p));
  }, []);

  const plan = PLANS.find(p => p.id === sel)!;

  const pay = async () => {
    if (busy) return;
    setBusy(true);

    // 결제 후 유료 분석 호출 → result 갱신
    try {
      if (profile) {
        // 기존 result에서 category 가져오기
        const prevResult = JSON.parse(sessionStorage.getItem("v2_result") || "null");
        const category = prevResult?.category ?? "✨ 총운";

        const res = await fetch("/api/v2/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profile.name,
            birth: `${profile.birthYear}-${profile.birthMonth}-${profile.birthDay}`,
            birthHour: profile.birthHour,
            gender: profile.gender,
            relationship: profile.relationship,
            category,
            planType: "paid",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const newResult = { ...data, category, profile };
          sessionStorage.setItem("v2_result", JSON.stringify(newResult));
        }
      }

      // 결제 완료 플래그 설정 (v2_paid_cats는 result에서 이미 설정됨, 덮어쓰지 않음)
      sessionStorage.setItem("v2_paid", "1");
      sessionStorage.setItem("v2_plan", sel);

      // 결제 처리 딜레이 (UI 피드백)
      await new Promise(r => setTimeout(r, 1200));

      router.push("/main-v2/result");
    } catch {
      setBusy(false);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🐱 점운</span>
        </button>
        <span style={{ fontWeight: 900, fontSize: 14, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>결제</span>
        <button
          onClick={() => {
            const url = window.location.origin + "/main-v2";
            const text = `🔮 AI 사주 분석\n₩990부터 시작 · 무료 오늘의 운세 포함\n\n${url}`;
            if (navigator.share) navigator.share({ title: "점운 AI 사주", text, url }).catch(() => {});
            else navigator.clipboard.writeText(text).then(() => alert("✅ 링크 복사됨!"));
          }}
          style={{ padding: "5px 12px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}
        >
          📤 공유
        </button>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* 배너 */}
        <div style={{ background: G, borderRadius: 20, padding: "22px 18px", textAlign: "center", marginBottom: 20, color: "white" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔓</div>
          <h1 style={{ fontSize: 17, fontWeight: 900, margin: "0 0 6px" }}>【전체 AI 심층 분석】</h1>
          <p style={{ fontSize: 12, opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            운세를 완전히 해석해드립니다<br />
            ₩990부터 시작 · 이미지 저장&보관함 포함
          </p>
        </div>

        {/* 운세 선택 섹션 */}
        <div style={{ background: "white", borderRadius: 20, padding: "20px 16px", marginBottom: 18, border: "1.5px solid rgba(236,72,153,0.12)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px", textAlign: "center" }}>어떤 운세를 확인할까요?</h2>
          <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: "0 0 16px" }}>
            {selectedCats.length > 0
              ? <><span style={{ color: "#ec4899", fontWeight: 800 }}>{selectedCats.length}개</span> 선택 · <span style={{ color: "#8b5cf6", fontWeight: 800 }}>₩{(selectedCats.length * 990).toLocaleString()}</span></>
              : "운세를 선택하세요"}
          </p>

          {/* 전체 선택 */}
          <button
            onClick={() => setSelectedCats(selectedCats.length === SELECT_CATS.length ? [] : SELECT_CATS.map(c => c.key))}
            style={{ width: "100%", padding: "10px 16px", marginBottom: 12, background: selectedCats.length === SELECT_CATS.length ? "#fdf2f8" : "white", border: `1.5px solid ${selectedCats.length === SELECT_CATS.length ? "#ec4899" : "#e5e7eb"}`, borderRadius: 14, fontWeight: 800, fontSize: 13, color: selectedCats.length === SELECT_CATS.length ? "#ec4899" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <span>✨ 전체 선택</span>
            <span style={{ fontSize: 16 }}>{selectedCats.length === SELECT_CATS.length ? "☑️" : "⬜"}</span>
          </button>

          {/* 개별 운세 카드 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {SELECT_CATS.map(c => {
              const on = selectedCats.includes(c.key);
              return (
                <button key={c.key}
                  onClick={() => setSelectedCats(on ? selectedCats.filter(k => k !== c.key) : [...selectedCats, c.key])}
                  style={{ padding: "14px 16px", border: `1.5px solid ${on ? c.color : "#e5e7eb"}`, borderRadius: 16, background: on ? `${c.color}10` : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{c.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: on ? c.color : "#374151" }}>{c.key.replace(/\S+\s/, "")}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>약 3,500자 심층 분석</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 18 }}>{on ? "✅" : "⬜"}</span>
                </button>
              );
            })}
          </div>

          {/* 운세 선택 결제 버튼 */}
          <button
            onClick={() => {
              if (selectedCats.length === 0) return;
              sessionStorage.setItem("v2_paid_cats", JSON.stringify(selectedCats));
              pay();
            }}
            disabled={selectedCats.length === 0 || busy}
            style={{ width: "100%", padding: "16px 0", background: selectedCats.length > 0 && !busy ? G : "#e5e7eb", color: selectedCats.length > 0 && !busy ? "white" : "#9ca3af", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: selectedCats.length > 0 && !busy ? "pointer" : "not-allowed", boxShadow: selectedCats.length > 0 && !busy ? "0 6px 20px rgba(236,72,153,0.35)" : "none" }}
          >
            {busy ? "⏳ 결제 처리 중..." : selectedCats.length > 0 ? `💎 ${selectedCats.length}개 운세 보기 · ₩${(selectedCats.length * 990).toLocaleString()}` : "운세를 선택하세요"}
          </button>
        </div>

        {/* 코스 목록 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {PLANS.map(p => (
            <div key={p.id} onClick={() => setSel(p.id)}
              style={{ background: "white", borderRadius: 20, padding: "16px 14px", border: sel === p.id ? "2px solid #ec4899" : "1.5px solid rgba(236,72,153,0.12)", cursor: "pointer", position: "relative", boxShadow: sel === p.id ? "0 6px 24px rgba(236,72,153,0.14)" : "0 2px 8px rgba(139,92,246,0.05)", transition: "all 0.15s" }}>

              {p.badge && (
                <div style={{ position: "absolute", top: -9, right: 14, background: G, color: "white", fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 20 }}>{p.badge}</div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                  {/* 라디오 */}
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: sel === p.id ? "6px solid #ec4899" : "2px solid #d1d5db", flexShrink: 0, transition: "all 0.15s" }} />
                  <span style={{ fontSize: 24 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: sel === p.id ? "#ec4899" : "#1a1a2e" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{p.desc}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: sel === p.id ? "#ec4899" : "#1a1a2e" }}>{p.priceStr}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>{p.per}</div>
                </div>
              </div>

              {sel === p.id && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
                  {p.features.map(f => (
                    <span key={f} style={{ fontSize: 10, color: "#8b5cf6", background: "#ede9fe", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>✓ {f}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 결제 버튼 영역 */}
        <div style={{ background: "white", borderRadius: 20, padding: "16px 14px", border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{plan.icon} {plan.name}</span>
            <span style={{ fontSize: 17, fontWeight: 900, color: "#ec4899" }}>{plan.priceStr}</span>
          </div>

          <button onClick={pay} disabled={busy}
            style={{ width: "100%", padding: "15px 0", background: busy ? "#e5e7eb" : G, color: busy ? "#9ca3af" : "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: busy ? "not-allowed" : "pointer", boxShadow: busy ? "none" : "0 6px 20px rgba(236,72,153,0.3)", transition: "all 0.2s" }}>
            {busy ? "⏳ 결제 처리 중..." : `💳 ${plan.priceStr} 결제하기`}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>🔒</span>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>토스페이먼츠로 안전하게 결제</span>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#d1d5db", margin: 0, lineHeight: 1.6 }}>
          결제 즉시 전체 분석 해제 · 이미지 저장 가능
        </p>
      </div>
    </main>
  );
}
