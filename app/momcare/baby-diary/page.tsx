"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Mood = "happy" | "tired" | "grateful" | "worried" | "excited" | "overwhelmed";
type DiaryEntry = { id: string; date: string; title: string; content: string; mood: Mood; weather: string; tags: string[] };

const MOODS: Record<Mood, { emoji: string; label: string; color: string }> = {
  happy:       { emoji: "😊", label: "행복해요",   color: "#fef9c3" },
  tired:       { emoji: "😴", label: "피곤해요",   color: "#dbeafe" },
  grateful:    { emoji: "🥰", label: "감사해요",   color: "#fce7f3" },
  worried:     { emoji: "😟", label: "걱정돼요",   color: "#fde8d8" },
  excited:     { emoji: "🎉", label: "설레요",     color: "#d1fae5" },
  overwhelmed: { emoji: "😵", label: "힘들어요",   color: "#ede9fe" },
};
const WEATHERS = ["☀️ 맑음", "⛅ 흐림", "🌧️ 비", "❄️ 눈", "🌈 청명"];
const PRESET_TAGS = ["#첫경험", "#웃음", "#울음", "#먹방", "#수면", "#외출", "#병원", "#특별한날", "#성장", "#귀여움"];

function todayStr() { return new Date().toISOString().slice(0, 10); }

export default function BabyDiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [mode, setMode] = useState<"list" | "write" | "view">("list");
  const [viewEntry, setViewEntry] = useState<DiaryEntry | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<DiaryEntry>({ id: "", date: todayStr(), title: "", content: "", mood: "happy", weather: "☀️ 맑음", tags: [] });
  const [unlocked, setUnlocked] = useState(true);
  const [mcUserId, setMcUserId] = useState("");
  const [hasPhone, setHasPhone] = useState(true);

  useEffect(() => {
    const exp = localStorage.getItem("momcare_unlock_until");
    if (!exp || Number(exp) <= Date.now()) setUnlocked(false);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("momcare_diary");
    if (saved) setEntries(JSON.parse(saved));

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

    fetch(`/api/momcare/save?userId=${uid}&type=diary`)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.data) && d.data.length > 0) {
          setEntries(d.data);
          localStorage.setItem("momcare_diary", JSON.stringify(d.data));
        }
      })
      .catch(() => {});
  }, []);

  function save(e: DiaryEntry[]) {
    setEntries(e);
    localStorage.setItem("momcare_diary", JSON.stringify(e));
    if (mcUserId) {
      fetch("/api/momcare/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: mcUserId, type: "diary", data: e }),
      }).catch(() => {});
    }
  }


  function openNew() {
    setForm({ id: "", date: todayStr(), title: "", content: "", mood: "happy", weather: "☀️ 맑음", tags: [] });
    setMode("write");
  }

  function submit() {
    if (!form.content.trim()) return;
    const entry: DiaryEntry = { ...form, id: form.id || Date.now().toString(), title: form.title || `${form.date} 일기` };
    const exists = entries.find(e => e.id === entry.id);
    if (exists) {
      save(entries.map(e => e.id === entry.id ? entry : e).sort((a, b) => b.date.localeCompare(a.date)));
    } else {
      save([entry, ...entries].sort((a, b) => b.date.localeCompare(a.date)));
    }
    setMode("list");
  }

  function toggleTag(tag: string) {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));
  }

  const filtered = entries.filter(e =>
    search === "" || e.title.includes(search) || e.content.includes(search) || e.tags.some(t => t.includes(search))
  );

  // ── 뷰 모드 ──────────────────────────────────────────────
  if (mode === "view" && viewEntry) {
    const m = MOODS[viewEntry.mood];
    return (
      <div style={{ minHeight: "100vh", background: m.color, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
        <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => setMode("list")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>←</button>
          <span style={{ fontWeight: 700, fontSize: 15 }}>일기 읽기</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={() => { setForm({ ...viewEntry }); setMode("write"); }} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: 700 }}>수정</button>
            <button onClick={() => { save(entries.filter(e => e.id !== viewEntry.id)); setMode("list"); }} style={{ background: "#fca5a5", color: "white", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: 700 }}>삭제</button>
          </div>
        </nav>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "28px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 28 }}>{m.emoji}</span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{viewEntry.date}</span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{viewEntry.weather}</span>
              <span style={{ fontSize: 12, background: m.color, color: "#374151", borderRadius: 8, padding: "2px 8px", fontWeight: 700 }}>{m.label}</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", margin: "0 0 20px", lineHeight: 1.3 }}>{viewEntry.title}</h1>
            <div style={{ fontSize: 15, color: "#374151", lineHeight: 2, whiteSpace: "pre-wrap", minHeight: 120 }}>{viewEntry.content}</div>
            {viewEntry.tags.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 20 }}>
                {viewEntry.tags.map(t => <span key={t} style={{ fontSize: 12, background: "#f3f4f6", color: "#6b7280", borderRadius: 8, padding: "3px 10px" }}>{t}</span>)}
              </div>
            )}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
              <button onClick={() => { const text = `${viewEntry.date} 육아일기\n\n${viewEntry.title}\n\n${viewEntry.content}\n\n${viewEntry.tags.join(" ")}`; if (navigator.share) { navigator.share({ title: viewEntry.title, text }); } else { navigator.clipboard?.writeText(text).then(() => alert("클립보드에 복사됐어요!")); } }} style={{ flex: 1, background: "#f97316", color: "white", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>공유하기 📤</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 쓰기 모드 ──────────────────────────────────────────────
  if (mode === "write") {
    if (!unlocked) return (
      <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
          <p style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>새 일기를 쓰려면 재활성화가 필요해요</p>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.6 }}>기존 일기는 목록에서 계속 읽을 수 있어요</p>
          <a href="/main-v2/pay?amount=990" style={{ display: "block", background: "linear-gradient(135deg, #f97316, #fb923c)", color: "white", padding: "14px", borderRadius: 14, fontSize: 15, fontWeight: 900, textDecoration: "none", marginBottom: 12 }}>사주 990원으로 30일 재활성화 →</a>
          <button onClick={() => setMode("list")} style={{ background: "none", border: "none", color: "#9ca3af", fontSize: 13, cursor: "pointer" }}>← 목록으로 돌아가기</button>
        </div>
      </div>
    );
    return (
      <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
        <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", gap: 12, alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
          <button onClick={() => setMode("list")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>←</button>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{form.id ? "일기 수정" : "새 일기 쓰기"}</span>
          <button onClick={submit} style={{ marginLeft: "auto", background: "#f97316", color: "white", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>저장</button>
        </nav>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px" }}>
          {/* 날짜 + 날씨 */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", background: "white", color: "#1a1a2e", minWidth: 140 }} />
            <select value={form.weather} onChange={e => setForm(f => ({ ...f, weather: e.target.value }))} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", background: "white", color: "#1a1a2e" }}>
              {WEATHERS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          {/* 기분 선택 */}
          <div style={{ background: "white", borderRadius: 14, padding: "16px", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 10px", fontWeight: 700 }}>오늘 기분은?</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {(Object.entries(MOODS) as [Mood, typeof MOODS[Mood]][]).map(([k, v]) => (
                <button key={k} onClick={() => setForm(f => ({ ...f, mood: k }))} style={{ padding: "10px 6px", background: form.mood === k ? v.color : "#f9fafb", border: form.mood === k ? "2px solid #f97316" : "2px solid transparent", borderRadius: 12, cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 22 }}>{v.emoji}</div>
                  <div style={{ fontSize: 11, color: "#374151", fontWeight: form.mood === k ? 800 : 400, marginTop: 2 }}>{v.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="제목을 입력하세요 (비워두면 날짜로 자동 저장)" style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 16px", fontSize: 16, fontWeight: 700, outline: "none", background: "white", color: "#1a1a2e", boxSizing: "border-box", marginBottom: 12 }} />

          {/* 본문 */}
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder={`오늘 ${form.weather} 날씨였어요.\n\n아기와 어떤 하루를 보냈나요? 자유롭게 기록해보세요.\n\n예: 오늘 처음으로 아기가 엄마 눈을 바라보며 웃었어요. 그 눈빛이 너무 예뻐서 눈물이 날 것 같았어요...`} rows={12} style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 16px", fontSize: 15, lineHeight: 1.8, outline: "none", resize: "none", background: "white", color: "#1a1a2e", boxSizing: "border-box", marginBottom: 14 }} />

          {/* 태그 */}
          <div style={{ background: "white", borderRadius: 14, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 10px", fontWeight: 700 }}>태그 선택 (복수 선택 가능)</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PRESET_TAGS.map(t => (
                <button key={t} onClick={() => toggleTag(t)} style={{ padding: "6px 12px", background: form.tags.includes(t) ? "#f97316" : "#f3f4f6", color: form.tags.includes(t) ? "white" : "#6b7280", border: "none", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 목록 모드 ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: "#f97316", textDecoration: "none" }}>맘케어</Link>
        <span style={{ fontSize: 14, fontWeight: 700 }}>📔 베이비 다이어리</span>
        {unlocked ? (
          <button onClick={openNew} style={{ background: "#f97316", color: "white", border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ 쓰기</button>
        ) : (
          <a href="/main-v2/pay?amount=990" style={{ background: "#fed7aa", color: "#c2410c", border: "none", borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>🔒 재활성화</a>
        )}
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px" }}>
        {/* 전화번호 미등록 안내 */}
        {!hasPhone && (
          <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
            ⚠️ 사주 앱에서 전화번호를 등록하면 모든 기기에서 일기를 영구 보관해요.<br />
            <a href="/main-v2" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>전화번호 등록하러 가기 →</a>
          </div>
        )}

        {/* 만료 배너 */}
        {!unlocked && (
          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 900, color: "#c2410c", margin: "0 0 6px" }}>⏰ 30일 이용권이 만료됐어요</p>
            <p style={{ fontSize: 12, color: "#78350f", margin: "0 0 10px", lineHeight: 1.6 }}>기존 일기는 계속 읽을 수 있어요. 새 일기를 쓰려면 재활성화해주세요.</p>
            <a href="/main-v2/pay?amount=990" style={{ display: "inline-block", background: "linear-gradient(135deg, #f97316, #fb923c)", color: "white", fontSize: 13, fontWeight: 900, padding: "10px 20px", borderRadius: 14, textDecoration: "none" }}>사주 990원으로 30일 재활성화 →</a>
          </div>
        )}

        {/* 검색 */}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="일기 검색..." style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 16px", fontSize: 14, outline: "none", background: "white", color: "#1a1a2e", boxSizing: "border-box", marginBottom: 20 }} />

        {/* 통계 */}
        {entries.length > 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {[{ label: "총 일기", value: `${entries.length}편` }, { label: "이번달", value: `${entries.filter(e => e.date.startsWith(new Date().toISOString().slice(0,7))).length}편` }].map(s => (
              <div key={s.label} style={{ flex: 1, background: "white", borderRadius: 12, padding: "12px 16px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: 20, fontWeight: 900, color: "#f97316", margin: "0 0 2px" }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* 일기 목록 */}
        {filtered.length === 0 ? (
          <div style={{ background: "white", borderRadius: 20, padding: "48px 24px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>📔</div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px" }}>아직 일기가 없어요</p>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 24px" }}>오늘 아기와의 소중한 하루를 기록해보세요</p>
            <button onClick={openNew} style={{ background: "#f97316", color: "white", border: "none", borderRadius: 14, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>첫 일기 쓰기</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(e => {
              const m = MOODS[e.mood];
              return (
                <div key={e.id} onClick={() => { setViewEntry(e); setMode("view"); }} style={{ background: "white", borderRadius: 18, padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", cursor: "pointer", borderLeft: "4px solid #f97316" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 20 }}>{m.emoji}</span>
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>{e.date}</span>
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>{e.weather}</span>
                        <span style={{ fontSize: 11, background: m.color, color: "#374151", borderRadius: 6, padding: "1px 7px", fontWeight: 700 }}>{m.label}</span>
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" }}>{e.title}</p>
                      <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 8px", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{e.content}</p>
                      {e.tags.length > 0 && (
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {e.tags.map(t => <span key={t} style={{ fontSize: 11, background: "#f3f4f6", color: "#9ca3af", borderRadius: 6, padding: "1px 6px" }}>{t}</span>)}
                        </div>
                      )}
                    </div>
                    <span style={{ color: "#d1d5db", fontSize: 18, marginLeft: 8 }}>›</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
