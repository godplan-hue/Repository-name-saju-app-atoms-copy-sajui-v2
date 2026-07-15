"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type WordEntry = { id: string; babyWord: string; realWord: string; date: string; story: string; age: string };

const EXAMPLES = [
  { babyWord: "마마", realWord: "엄마", story: "처음으로 한 말!" },
  { babyWord: "빠빠", realWord: "아빠", story: "아빠가 들어오자마자 외쳤어요" },
  { babyWord: "멍멍이", realWord: "강아지", story: "산책하다가 처음 봤을 때" },
  { babyWord: "뚜뚜", realWord: "자동차", story: "차가 지나갈 때마다 외쳐요" },
  { babyWord: "냠냠", realWord: "밥/음식", story: "먹고 싶을 때 배 두드리면서" },
];

export default function BabyWordsPage() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [form, setForm] = useState({ babyWord: "", realWord: "", date: new Date().toISOString().slice(0,10), story: "", age: "" });
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [unlocked, setUnlocked] = useState(true);
  const [expired, setExpired] = useState(false);
  const [mcUserId, setMcUserId] = useState("");
  const [hasPhone, setHasPhone] = useState(true);

  useEffect(() => {
    const exp = localStorage.getItem("momcare_unlock_until");
    if (!exp) { setUnlocked(false); }
    else if (Number(exp) <= Date.now()) { setUnlocked(false); setExpired(true); }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("momcare_words");
    if (saved) setWords(JSON.parse(saved));
    // 아기 나이 계산
    const baby = localStorage.getItem("momcare_baby");
    if (baby) {
      const b = JSON.parse(baby);
      if (b.birthDate) {
        const diff = new Date().getTime() - new Date(b.birthDate).getTime();
        const months = Math.floor(diff / (30.44 * 24 * 60 * 60 * 1000));
        setForm(f => ({ ...f, age: `생후 ${months}개월` }));
      }
    }

    let uid = "";
    try {
      const profile = localStorage.getItem("v2_saved_profile");
      if (profile) {
        const p = JSON.parse(profile);
        if (p.phone) { uid = `phone_${p.phone.replace(/\D/g, "")}`; setHasPhone(true); }
      }
    } catch {}
    if (!uid) {
      setHasPhone(false);
      let devId = localStorage.getItem("momcare_device_id");
      if (!devId) { devId = Date.now().toString(36) + Math.random().toString(36).slice(2); localStorage.setItem("momcare_device_id", devId); }
      uid = `device_${devId}`;
    }
    setMcUserId(uid);

    fetch(`/api/momcare/save?userId=${uid}&type=words`)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.data) && d.data.length > 0) {
          setWords(d.data);
          localStorage.setItem("momcare_words", JSON.stringify(d.data));
        }
      })
      .catch(() => {});
  }, []);

  function save(w: WordEntry[]) {
    setWords(w);
    localStorage.setItem("momcare_words", JSON.stringify(w));
    if (mcUserId) {
      fetch("/api/momcare/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: mcUserId, type: "words", data: w }),
      }).catch(() => {});
    }
  }

  function addWord() {
    if (!form.babyWord.trim()) return;
    const w: WordEntry = { id: Date.now().toString(), ...form };
    save([w, ...words]);
    setForm(f => ({ ...f, babyWord: "", realWord: "", story: "" }));
    setShowForm(false);
  }

  const filtered = words.filter(w =>
    search === "" || w.babyWord.includes(search) || w.realWord.includes(search) || w.story.includes(search)
  );

  function share() {
    if (words.length === 0) { alert("기록된 단어가 없어요!"); return; }
    const text = `🗣️ 우리 아기 말 사전 (${words.length}단어)\n\n` + words.slice(0, 5).map(w => `"${w.babyWord}" = ${w.realWord}${w.story ? ` (${w.story})` : ""}`).join("\n");
    if (navigator.share) { navigator.share({ title: "우리 아기 말 사전", text }); }
    else { navigator.clipboard?.writeText(text).then(() => alert("클립보드에 복사됐어요!")); }
  }


  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: "#f97316", textDecoration: "none" }}>맘케어</Link>
        <span style={{ fontSize: 14, fontWeight: 700 }}>🗣️ 아기 말 사전</span>
        {unlocked ? (
          <button onClick={() => setShowForm(!showForm)} style={{ background: "#f97316", color: "white", border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ 추가</button>
        ) : (
          <a href="/main-v2/pay?amount=990" style={{ background: "#fed7aa", color: "#c2410c", borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>{expired ? "🔒 재활성화" : "🔒 결제하기"}</a>
        )}
      </nav>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
        {/* 전화번호 미등록 안내 */}
        {!hasPhone && (
          <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
            ⚠️ 사주 앱에서 전화번호를 등록하면 모든 기기에서 말 사전을 영구 보관해요.<br />
            <a href="/main-v2" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>전화번호 등록하러 가기 →</a>
          </div>
        )}

        {/* 잠금 배너 */}
        {!unlocked && (
          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 900, color: "#c2410c", margin: "0 0 6px" }}>{expired ? "⏰ 30일 이용권이 만료됐어요" : "🔒 결제 후 새 단어를 추가할 수 있어요"}</p>
            <p style={{ fontSize: 12, color: "#78350f", margin: "0 0 10px", lineHeight: 1.6 }}>{expired ? "기존 단어는 계속 볼 수 있어요. 새 단어를 추가하려면 재활성화해주세요." : "사주 990원 결제하면 맘케어 30일 이용 가능해요."}</p>
            <a href="/main-v2/pay?amount=990" style={{ display: "inline-block", background: "linear-gradient(135deg, #f97316, #fb923c)", color: "white", fontSize: 13, fontWeight: 900, padding: "10px 20px", borderRadius: 14, textDecoration: "none" }}>{expired ? "사주 990원으로 30일 재활성화 →" : "사주 990원 결제하기 →"}</a>
          </div>
        )}

        {/* 안내 */}
        <div style={{ background: "linear-gradient(135deg, #fce7f3, #dbeafe)", borderRadius: 18, padding: "20px 24px", marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🗣️</div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px" }}>아기 말 사전</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 12px" }}>아기만의 귀여운 언어를 사전처럼 기록해요<br />나중에 보면 정말 보물이 될 거예요</p>
          <button onClick={share} style={{ background: "white", color: "#f97316", border: "2px solid #f97316", borderRadius: 20, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>사전 공유하기 📤</button>
        </div>

        {/* 추가 폼 — 잠금 시 표시 안 함 */}
        {showForm && unlocked && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px", marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, margin: "0 0 14px" }}>새 단어 추가</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 11, color: "#f97316", fontWeight: 700, display: "block", marginBottom: 4 }}>아기가 하는 말 *</label>
                <input value={form.babyWord} onChange={e => setForm(f => ({ ...f, babyWord: e.target.value }))} placeholder='예: "마마"' style={{ width: "100%", border: "2px solid #f97316", borderRadius: 10, padding: "10px 12px", fontSize: 16, fontWeight: 700, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, display: "block", marginBottom: 4 }}>진짜 의미</label>
                <input value={form.realWord} onChange={e => setForm(f => ({ ...f, realWord: e.target.value }))} placeholder='예: "엄마"' style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, display: "block", marginBottom: 4 }}>처음 한 날</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, display: "block", marginBottom: 4 }}>아기 나이</label>
                <input value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="생후 8개월" style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, display: "block", marginBottom: 4 }}>에피소드 (선택)</label>
              <input value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))} placeholder="언제 처음 이 말을 했나요? 어떤 상황이었나요?" style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={addWord} style={{ width: "100%", background: "#f97316", color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>사전에 추가하기</button>
          </div>
        )}

        {/* 예시 단어들 (빈 상태일 때만) */}
        {words.length === 0 && !showForm && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px", marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", margin: "0 0 12px" }}>예시 단어들</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {EXAMPLES.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 12px", background: "#f9fafb", borderRadius: 10 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#f97316", minWidth: 60 }}>"{e.babyWord}"</span>
                  <span style={{ color: "#9ca3af", fontSize: 14 }}>→</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", flex: 1 }}>{e.realWord}</span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{e.story}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowForm(true)} style={{ width: "100%", marginTop: 16, background: "#f97316", color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>우리 아기 첫 단어 기록하기</button>
          </div>
        )}

        {/* 검색 */}
        {words.length > 0 && (
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="단어 검색..." style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 16px", fontSize: 14, outline: "none", background: "white", boxSizing: "border-box", marginBottom: 12 }} />
        )}

        {/* 단어 목록 */}
        {filtered.length > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 700 }}>총 {words.length}개 단어</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(w => (
                <div key={w.id} style={{ background: "white", borderRadius: 16, padding: "18px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: "#f97316" }}>"{w.babyWord}"</span>
                      {w.realWord && <><span style={{ color: "#9ca3af" }}>→</span><span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{w.realWord}</span></>}
                    </div>
                    {w.story && <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 4px", lineHeight: 1.5 }}>{w.story}</p>}
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>{w.date}</span>
                      {w.age && <span style={{ fontSize: 11, color: "#9ca3af" }}>· {w.age}</span>}
                    </div>
                  </div>
                  <button onClick={() => save(words.filter(x => x.id !== w.id))} style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 18, marginLeft: 8 }}>×</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 사주/꿈해몽 연결 배너 */}
        <div style={{ marginTop: 32, background: "linear-gradient(135deg, #fde8d8, #ede9fe)", borderRadius: 18, padding: "20px", textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#7c3aed", margin: "0 0 4px" }}>우리 아이의 언어 재능이 궁금하다면?</p>
          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 14px" }}>사주로 보는 우리 아이 성공운 · 재능운</p>
          <Link href="/main-v2" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #ec4899)", color: "white", borderRadius: 20, padding: "10px 24px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            아이 사주 보러가기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
