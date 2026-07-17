"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Letter = { id: string; title: string; content: string; writtenDate: string; openDate: string; openAge: string; isLocked: boolean };

const AGE_OPTIONS = [
  { value: "1살", label: "1살 생일에" },
  { value: "3살", label: "3살이 되면" },
  { value: "5살", label: "5살 유치원 입학 전" },
  { value: "7살", label: "초등학교 입학 전" },
  { value: "10살", label: "10살 생일에" },
  { value: "13살", label: "중학교 입학 전" },
  { value: "20살", label: "성인이 되면" },
  { value: "결혼할 때", label: "결혼할 때" },
];

const LETTER_TEMPLATES = [
  { title: "처음 만난 날 ✨", content: `사랑하는 아가에게,\n\n너를 처음 만난 날을 기억해?\n아빠/엄마는 네가 이 세상에 태어난 순간,\n온 세상이 환해지는 것 같았어.\n\n그 작은 손, 그 작은 발...\n처음으로 눈이 마주쳤을 때\n말로 다 표현할 수 없는 감동이 밀려왔어.\n\n지금 이 순간이 영원히 기억에 남길 바라며,\n사랑을 가득 담아.` },
  { title: "100일을 축하해 💕", content: `아가야,\n\n벌써 100일이 지났어!\n네가 태어난 지 100일이 되는 날,\n\n이 100일 동안 얼마나 많이 성장했는지...\n처음엔 눈도 제대로 못 맞추던 네가\n이제는 환하게 웃어줘.\n\n앞으로의 100일도, 1000일도\n엄마/아빠가 함께할게.` },
  { title: "미래의 너에게 ⭐", content: `사랑하는 [이름]에게,\n\n이 편지를 읽고 있는 너는\n얼마나 많이 컸을까?\n\n엄마/아빠는 지금 이 순간,\n네가 어떤 어른이 될지 정말 궁금해.\n\n어떤 꿈을 꾸고 있니?\n어떤 친구들이 생겼니?\n\n어떤 모습이든 너는 우리의 전부야.\n언제나 사랑해.` },
];

function calcOpenDate(openAge: string): string {
  const baby = localStorage.getItem("momcare_baby");
  if (!baby) return "";
  const birth = JSON.parse(baby).birthDate;
  if (!birth) return "";
  const d = new Date(birth);
  const yr = parseInt(openAge) || 0;
  if (openAge === "결혼할 때") return "결혼하는 날";
  d.setFullYear(d.getFullYear() + yr);
  return d.toISOString().slice(0, 10);
}

export default function TimeCapsulePage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [mode, setMode] = useState<"list" | "write" | "view" | "unlock">("list");
  const [momcareUnlocked, setMomcareUnlocked] = useState(true);
  const [momcareExpired, setMomcareExpired] = useState(false);
  const [selected, setSelected] = useState<Letter | null>(null);
  const [form, setForm] = useState({ title: "", content: "", openAge: "10살", useTemplate: -1 });
  const [unlockConfirm, setUnlockConfirm] = useState(false);

  useEffect(() => {
    const exp = localStorage.getItem("momcare_unlock_until");
    if (!exp) { setMomcareUnlocked(false); }
    else if (Number(exp) <= Date.now()) { setMomcareUnlocked(false); setMomcareExpired(true); }
  }, []);

  const [mcUserId, setMcUserId] = useState("");
  const [hasPhone, setHasPhone] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("momcare_capsule");
    if (saved) setLetters(JSON.parse(saved));

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

    fetch(`/api/momcare/save?userId=${uid}&type=capsule`)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.data) && d.data.length > 0) {
          setLetters(d.data);
          localStorage.setItem("momcare_capsule", JSON.stringify(d.data));
        }
      })
      .catch(() => {});
  }, []);

  function save(l: Letter[]) {
    setLetters(l);
    localStorage.setItem("momcare_capsule", JSON.stringify(l));
    if (mcUserId) {
      fetch("/api/momcare/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: mcUserId, type: "capsule", data: l }),
      }).catch(() => {});
    }
  }


  function submit() {
    if (!form.content.trim()) return;
    const openDate = calcOpenDate(form.openAge);
    const letter: Letter = {
      id: Date.now().toString(),
      title: form.title || `${form.openAge}에 여는 편지`,
      content: form.content,
      writtenDate: new Date().toISOString().slice(0, 10),
      openDate,
      openAge: form.openAge,
      isLocked: true,
    };
    save([letter, ...letters]);
    setMode("list");
    setForm({ title: "", content: "", openAge: "10살", useTemplate: -1 });
  }

  function canOpen(letter: Letter): boolean {
    if (!letter.isLocked) return true;
    if (letter.openAge === "결혼할 때") return false;
    if (!letter.openDate) return false;
    return new Date() >= new Date(letter.openDate);
  }

  function openLetter(letter: Letter) {
    if (canOpen(letter)) {
      save(letters.map(l => l.id === letter.id ? { ...l, isLocked: false } : l));
      setSelected({ ...letter, isLocked: false });
      setMode("view");
    } else {
      setSelected(letter);
      setMode("unlock");
    }
  }

  // ── 편지 보기 ──────────────────────────────────────────────
  if (mode === "view" && selected) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fde8d8, #fce7f3)", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
        <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => setMode("list")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>←</button>
          <span style={{ fontWeight: 700, fontSize: 15 }}>타임캡슐 편지</span>
        </nav>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "36px 28px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>💌</div>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>{selected.writtenDate} 에 쓴 편지</p>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: 0 }}>{selected.title}</h2>
            </div>
            <div style={{ background: "#fffbf5", borderRadius: 14, padding: "24px 20px", marginBottom: 24 }}>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 2, whiteSpace: "pre-wrap", margin: 0 }}>{selected.content}</p>
            </div>
            <button onClick={() => { const text = `💌 타임캡슐 편지\n${selected.title}\n\n${selected.content}`; if (navigator.share) { navigator.share({ title: selected.title, text }); } else { navigator.clipboard?.writeText(text).then(() => alert("클립보드에 복사됐어요!")); } }} style={{ width: "100%", background: "#f97316", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>편지 공유하기 💌</button>
          </div>
        </div>
      </div>
    );
  }

  // ── 잠긴 편지 ──────────────────────────────────────────────
  if (mode === "unlock" && selected) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", display: "flex", flexDirection: "column" }}>
        <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => setMode("list")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>←</button>
        </nav>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "40px 28px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>{selected.title}</h2>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 6px" }}>{selected.openAge}에 열 수 있는 편지예요</p>
            {selected.openDate && <p style={{ fontSize: 13, color: "#f97316", fontWeight: 700, margin: "0 0 24px" }}>열 수 있는 날: {selected.openDate}</p>}
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>아직 열 수 없는 편지예요.<br />지금 미리 열어볼까요?</p>
            {!unlockConfirm ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={() => setUnlockConfirm(true)} style={{ background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>미리 열어보기</button>
                <button onClick={() => setMode("list")} style={{ background: "#f97316", color: "white", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>나중에 열기</button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 13, color: "#ef4444", margin: "0 0 16px" }}>정말 지금 열어볼까요? 한 번 열면 잠금이 해제돼요.</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setUnlockConfirm(false)} style={{ flex: 1, background: "#f3f4f6", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>취소</button>
                  <button onClick={() => { save(letters.map(l => l.id === selected.id ? { ...l, isLocked: false } : l)); setSelected({ ...selected, isLocked: false }); setMode("view"); }} style={{ flex: 1, background: "#ef4444", color: "white", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>열기</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 쓰기 모드 ──────────────────────────────────────────────
  if (mode === "write") {
    if (!momcareUnlocked) return (
      <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
          <p style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>새 편지를 쓰려면 재활성화가 필요해요</p>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.6 }}>기존 편지는 목록에서 계속 읽을 수 있어요</p>
          <a href="/momcare/pay" style={{ display: "block", background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "white", padding: "14px", borderRadius: 14, fontSize: 15, fontWeight: 900, textDecoration: "none", marginBottom: 10, textAlign: "center" }}>💳 맘케어 결제하기 (990원·4,900원) →</a>
          <button onClick={() => setMode("list")} style={{ background: "none", border: "none", color: "#9ca3af", fontSize: 13, cursor: "pointer" }}>← 목록으로 돌아가기</button>
        </div>
      </div>
    );
    return (
      <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
        <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", gap: 12, alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
          <button onClick={() => setMode("list")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>←</button>
          <span style={{ fontWeight: 700, fontSize: 15 }}>편지 쓰기</span>
          <button onClick={submit} style={{ marginLeft: "auto", background: "#f97316", color: "white", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>봉인하기 🔒</button>
        </nav>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px" }}>
          {/* 템플릿 */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px", fontWeight: 700 }}>템플릿으로 시작하기</p>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {LETTER_TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => { setForm(f => ({ ...f, title: t.title, content: t.content, useTemplate: i })); }} style={{ flexShrink: 0, padding: "8px 14px", background: form.useTemplate === i ? "#f97316" : "white", color: form.useTemplate === i ? "white" : "#374151", border: "1px solid #e5e7eb", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{t.title}</button>
              ))}
            </div>
          </div>

          {/* 열 시기 */}
          <div style={{ background: "white", borderRadius: 14, padding: "16px", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 10px", fontWeight: 700 }}>언제 열까요?</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {AGE_OPTIONS.map(o => (
                <button key={o.value} onClick={() => setForm(f => ({ ...f, openAge: o.value }))} style={{ padding: "10px", background: form.openAge === o.value ? "#fde8d8" : "#f9fafb", border: form.openAge === o.value ? "2px solid #f97316" : "2px solid transparent", borderRadius: 10, fontSize: 13, fontWeight: form.openAge === o.value ? 800 : 400, color: "#374151", cursor: "pointer", textAlign: "left" }}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="편지 제목 (선택)" style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 16px", fontSize: 16, fontWeight: 700, outline: "none", background: "white", color: "#1a1a2e", boxSizing: "border-box", marginBottom: 12 }} />
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder={"아이에게 전하고 싶은 말을 자유롭게 써보세요.\n\n지금 이 순간의 감정, 아이가 보여주는 작은 변화들, 그리고 앞으로의 바람들..."} rows={14} style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 16px", fontSize: 15, lineHeight: 1.8, outline: "none", resize: "none", background: "white", color: "#1a1a2e", boxSizing: "border-box" }} />
        </div>
      </div>
    );
  }

  // ── 목록 ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: "#f97316", textDecoration: "none" }}>맘케어</Link>
        <span style={{ fontSize: 14, fontWeight: 700 }}>💌 타임캡슐 편지</span>
        {momcareUnlocked ? (
          <button onClick={() => setMode("write")} style={{ background: "#f97316", color: "white", border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ 편지 쓰기</button>
        ) : (
          <a href="/momcare/pay" style={{ background: "#fed7aa", color: "#c2410c", borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>{momcareExpired ? "🔒 재활성화" : "🔒 결제하기"}</a>
        )}
      </nav>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px" }}>
        {!hasPhone && (
          <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
            ⚠️ 사주 앱에서 전화번호를 등록하면 모든 기기에서 편지를 영구 보관해요.<br />
            <a href="/main-v2" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>전화번호 등록하러 가기 →</a>
          </div>
        )}
        {/* 잠금 배너 */}
        {!momcareUnlocked && (
          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 900, color: "#c2410c", margin: "0 0 6px" }}>{momcareExpired ? "⏰ 30일 이용권이 만료됐어요" : "🔒 결제 후 새 편지를 쓸 수 있어요"}</p>
            <p style={{ fontSize: 12, color: "#78350f", margin: "0 0 10px", lineHeight: 1.6 }}>{momcareExpired ? "기존 편지는 계속 읽을 수 있어요. 새 편지를 쓰려면 재활성화해주세요." : "맘케어 결제하면 30일 이용 가능해요."}</p>
            <a href="/momcare/pay" style={{ display: "block", background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "white", fontSize: 13, fontWeight: 900, padding: "10px 20px", borderRadius: 14, textDecoration: "none", textAlign: "center" }}>💳 맘케어 결제하기 (990원·4,900원) →</a>
          </div>
        )}

        <div style={{ background: "linear-gradient(135deg, #fde8d8, #fce7f3)", borderRadius: 18, padding: "24px", marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>💌</div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px" }}>미래의 아이에게 편지를</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>지금 이 순간의 사랑을 타임캡슐에 담아<br />아이가 크면 함께 열어보세요</p>
        </div>

        {letters.length === 0 ? (
          <div style={{ background: "white", borderRadius: 20, padding: "48px 24px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>✉️</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px" }}>첫 편지를 써보세요</p>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 24px" }}>아이가 10살, 20살이 됐을 때 열어볼<br />특별한 편지를 지금 남겨두세요</p>
            <button onClick={() => setMode("write")} style={{ background: "#f97316", color: "white", border: "none", borderRadius: 14, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>첫 편지 쓰기</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {letters.map(l => (
              <div key={l.id} style={{ background: "white", borderRadius: 18, padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1, cursor: "pointer" }} onClick={() => openLetter(l)}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 22 }}>{canOpen(l) ? "💌" : "🔒"}</span>
                      <span style={{ fontSize: 11, background: canOpen(l) ? "#d1fae5" : "#fde8d8", color: canOpen(l) ? "#059669" : "#f97316", borderRadius: 8, padding: "2px 8px", fontWeight: 700 }}>{canOpen(l) ? "지금 열 수 있어요!" : `${l.openAge}에 열기`}</span>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px" }}>{l.title}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{l.writtenDate} 작성{l.openDate && ` · ${l.openDate} 개봉`}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                    <button onClick={() => save(letters.filter(x => x.id !== l.id))} style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 18 }}>×</button>
                    <span onClick={() => openLetter(l)} style={{ color: "#d1d5db", fontSize: 18, cursor: "pointer" }}>›</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 32, background: "linear-gradient(135deg, #fde8d8, #ede9fe)", borderRadius: 18, padding: "20px", textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#7c3aed", margin: "0 0 4px" }}>아이의 미래가 더 궁금하다면?</p>
          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 14px" }}>사주로 보는 우리 아이 미래운 · 성공운</p>
          <Link href="/main-v2" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #ec4899)", color: "white", borderRadius: 20, padding: "10px 24px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            아이 사주 보러가기 (990원) →
          </Link>
        </div>
      </div>
    </div>
  );
}
