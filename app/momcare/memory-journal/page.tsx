"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Category = { key: string; label: string; emoji: string; color: string };
type Milestone = { id: string; category: string; date: string; title: string; desc: string };

const CATEGORIES: Category[] = [
  { key: "smile", label: "첫 미소", emoji: "😊", color: "#fef3c7" },
  { key: "tooth", label: "첫 이빨", emoji: "🦷", color: "#dbeafe" },
  { key: "walk", label: "첫 걸음마", emoji: "👶", color: "#d1fae5" },
  { key: "word", label: "첫 말", emoji: "💬", color: "#fce7f3" },
  { key: "food", label: "첫 이유식", emoji: "🥣", color: "#fde8d8" },
  { key: "roll", label: "첫 뒤집기", emoji: "🔄", color: "#ede9fe" },
  { key: "sit", label: "혼자 앉기", emoji: "🪑", color: "#ecfdf5" },
  { key: "crawl", label: "기어다니기", emoji: "🐛", color: "#fff7ed" },
  { key: "hair", label: "첫 머리카락", emoji: "✂️", color: "#fdf4ff" },
  { key: "laugh", label: "첫 웃음소리", emoji: "😂", color: "#fef9c3" },
  { key: "birthday", label: "100일", emoji: "🎂", color: "#fce7f3" },
  { key: "other", label: "특별한 순간", emoji: "⭐", color: "#f0f9ff" },
];

export default function MemoryJournalPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "smile", date: new Date().toISOString().slice(0, 10), title: "", desc: "" });
  const [filterCat, setFilterCat] = useState("all");
  const [unlocked, setUnlocked] = useState(true);

  useEffect(() => {
    const exp = localStorage.getItem("momcare_unlock_until");
    if (!exp || Number(exp) <= Date.now()) setUnlocked(false);
  }, []);

  const [mcUserId, setMcUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("momcare_milestones");
    if (saved) setMilestones(JSON.parse(saved));

    let uid = "";
    try {
      const ph = (JSON.parse(localStorage.getItem("v2_saved_profile") || "{}").phone || localStorage.getItem("v2_saved_phone") || "").replace(/\D/g, "");
      if (ph.length >= 10) uid = `phone_${ph}`;
    } catch {}
    if (!uid) { router.replace("/momcare"); return; }
    setMcUserId(uid);

    fetch(`/api/momcare/save?userId=${uid}&type=milestones`)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.data) && d.data.length > 0) {
          setMilestones(d.data);
          localStorage.setItem("momcare_milestones", JSON.stringify(d.data));
        }
      })
      .catch(() => {});
  }, []);

  if (!unlocked) return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <div style={{ background: "white", borderRadius: 24, padding: "32px 24px", textAlign: "center", maxWidth: 340, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <Link href="/momcare" style={{ display: "block", fontSize: 13, color: "#f97316", textDecoration: "none", marginBottom: 16, textAlign: "left" }}>← 육아일기 홈으로</Link>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 16px" }}>결제 후 30일 이용 가능</h2>
        <Link href="/momcare/pay" style={{ display: "block", background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "white", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 900, textDecoration: "none", marginBottom: 12, textAlign: "center" }}>💳 육아일기 결제하기 (990원·5,900원) →</Link>
        <Link href="/momcare/pay" style={{ display: "block", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 14px", marginBottom: 12, fontSize: 13, color: "#c2410c", fontWeight: 700, lineHeight: 1.5, textDecoration: "none" }}>
          💡 990원 결제 시<br />육아일기 7가지 기능 30일 이용!
        </Link>
        <Link href="/main-v2" style={{ display: "block", background: "linear-gradient(135deg, #f97316, #fb923c)", color: "white", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 900, textDecoration: "none", marginBottom: 12 }}>사주 990원 결제하기 →</Link>
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#166534", fontWeight: 700, lineHeight: 1.8 }}>
          🎁 덤으로 24시간 추가 혜택!<br />🌙 꿈해몽 · 🐱 점냥이상담 · ❓ 360개 질문
        </div>
      </div>
    </div>
  );

  function save(m: Milestone[]) {
    setMilestones(m);
    localStorage.setItem("momcare_milestones", JSON.stringify(m));
    if (mcUserId) {
      fetch("/api/momcare/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: mcUserId, type: "milestones", data: m }),
      }).catch(() => {});
    }
  }

  function addMilestone() {
    if (!form.title) return;
    const cat = CATEGORIES.find(c => c.key === form.category)!;
    const m: Milestone = { id: Date.now().toString(), category: form.category, date: form.date, title: form.title, desc: form.desc };
    save([...milestones, m].sort((a, b) => a.date.localeCompare(b.date)));
    setForm({ ...form, title: "", desc: "" });
    setShowForm(false);
  }

  const filtered = filterCat === "all" ? milestones : milestones.filter(m => m.category === filterCat);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: "#f97316", textDecoration: "none" }}>육아일기</Link>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>📸 소중한 순간 저널</span>
      </nav>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>

        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 4px" }}>소중한 순간 저널</h1>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>첫 미소, 첫 이빨, 첫 걸음마 — 아기의 모든 첫 순간을 기록하세요</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ background: "#f97316", color: "white", border: "none", borderRadius: 14, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {showForm ? "닫기" : "+ 추가"}
          </button>
        </div>

        {/* 추가 폼 */}
        {showForm && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px", marginBottom: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, margin: "0 0 16px" }}>소중한 순간 기록하기</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6 }}>카테고리</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {CATEGORIES.map(c => (
                  <button key={c.key} onClick={() => setForm({ ...form, category: c.key })} style={{ padding: "8px 4px", background: form.category === c.key ? c.color : "#f9fafb", border: form.category === c.key ? `2px solid #f97316` : "2px solid transparent", borderRadius: 10, cursor: "pointer", textAlign: "center", fontSize: 11 }}>
                    <div style={{ fontSize: 20, marginBottom: 2 }}>{c.emoji}</div>
                    <div style={{ color: "#374151", fontWeight: form.category === c.key ? 800 : 400 }}>{c.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>날짜</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>제목 *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="예: 오늘 처음으로 활짝 웃었어요!" style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>메모 (선택)</label>
              <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="그 순간을 자세히 기록해보세요..." rows={3} style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={addMilestone} style={{ width: "100%", background: "#f97316", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>순간 기록하기</button>
          </div>
        )}

        {/* 카테고리 필터 */}
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, paddingBottom: 4, minWidth: "max-content" }}>
            <button onClick={() => setFilterCat("all")} style={{ padding: "6px 14px", background: filterCat === "all" ? "#f97316" : "white", color: filterCat === "all" ? "white" : "#6b7280", border: "none", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>전체 ({milestones.length})</button>
            {CATEGORIES.map(c => {
              const cnt = milestones.filter(m => m.category === c.key).length;
              if (cnt === 0) return null;
              return (
                <button key={c.key} onClick={() => setFilterCat(c.key)} style={{ padding: "6px 14px", background: filterCat === c.key ? "#f97316" : "white", color: filterCat === c.key ? "white" : "#6b7280", border: "none", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{c.emoji} {c.label} ({cnt})</button>
              );
            })}
          </div>
        </div>

        {/* 타임라인 */}
        {filtered.length === 0 ? (
          <div style={{ background: "white", borderRadius: 18, padding: "40px 20px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>📸</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px" }}>아직 기록이 없어요</p>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>+ 추가 버튼을 눌러 아기의 첫 순간을 기록해보세요!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(m => {
              const cat = CATEGORIES.find(c => c.key === m.category) || CATEGORIES[11];
              return (
                <div key={m.id} style={{ background: "white", borderRadius: 18, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: `4px solid #f97316` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1 }}>
                      <div style={{ fontSize: 32, flexShrink: 0 }}>{cat.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, background: cat.color, color: "#374151", borderRadius: 8, padding: "2px 8px", fontWeight: 700 }}>{cat.label}</span>
                          <span style={{ fontSize: 11, color: "#9ca3af" }}>{m.date}</span>
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px" }}>{m.title}</p>
                        {m.desc && <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{m.desc}</p>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => { if (navigator.share) { navigator.share({ title: m.title, text: `${cat.emoji} ${m.title}\n${m.date}\n${m.desc}`, url: window.location.href }); } else { alert("공유 기능은 모바일에서 지원됩니다."); } }} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", fontSize: 14 }}>📤</button>
                      <button onClick={() => save(milestones.filter(x => x.id !== m.id))} style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 18 }}>×</button>
                    </div>
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
