"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type TabKey = "sleep" | "feeding" | "diaper" | "pumping" | "mood";
type Log = { id: string; type: TabKey; label: string; detail: string; time: string };
type MoodKey = "happy" | "calm" | "fussy" | "crying" | "sick";

const MOODS: Record<MoodKey, string> = { happy: "😊 기분 좋음", calm: "😌 차분함", fussy: "😤 칭얼거림", crying: "😭 울음", sick: "🤒 몸 불편함" };

function now() { return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }); }
function todayKey() { return new Date().toISOString().slice(0, 10); }
function fmtSec(s: number) { const m = Math.floor(s / 60); const sec = s % 60; return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`; }

export default function DailyTrackerPage() {
  const [tab, setTab] = useState<TabKey>("sleep");
  const [logs, setLogs] = useState<Log[]>([]);
  const [sleepRunning, setSleepRunning] = useState(false);
  const [sleepSec, setSleepSec] = useState(0);
  const [feedType, setFeedType] = useState<"left" | "right" | "both" | "bottle">("both");
  const [feedAmount, setFeedAmount] = useState("");
  const [diaperType, setDiaperType] = useState<"wet" | "dirty" | "both">("wet");
  const [pumpSide, setPumpSide] = useState<"left" | "right" | "both">("both");
  const [pumpAmount, setPumpAmount] = useState("");
  const [mood, setMood] = useState<MoodKey>("happy");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [mcUserId, setMcUserId] = useState("");
  const [unlocked, setUnlocked] = useState(true);

  useEffect(() => {
    const exp = localStorage.getItem("momcare_unlock_until");
    if (!exp || Number(exp) <= Date.now()) setUnlocked(false);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(`momcare_logs_${todayKey()}`);
    if (saved) setLogs(JSON.parse(saved));

    let uid = "";
    try {
      const profile = localStorage.getItem("v2_saved_profile");
      if (profile) { const p = JSON.parse(profile); if (p.phone) uid = `phone_${p.phone.replace(/\D/g, "")}`; }
    } catch {}
    if (!uid) {
      let devId = localStorage.getItem("momcare_device_id");
      if (!devId) { devId = Date.now().toString(36) + Math.random().toString(36).slice(2); localStorage.setItem("momcare_device_id", devId); }
      uid = `device_${devId}`;
    }
    setMcUserId(uid);

    const todayType = `logs_${todayKey()}`;
    fetch(`/api/momcare/save?userId=${uid}&type=${todayType}`)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.data) && d.data.length > 0) {
          setLogs(d.data);
          localStorage.setItem(`momcare_logs_${todayKey()}`, JSON.stringify(d.data));
        }
      })
      .catch(() => {});
  }, []);

  function saveLogs(l: Log[]) {
    setLogs(l);
    localStorage.setItem(`momcare_logs_${todayKey()}`, JSON.stringify(l));
    if (mcUserId) {
      fetch("/api/momcare/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: mcUserId, type: `logs_${todayKey()}`, data: l }),
      }).catch(() => {});
    }
  }

  function addLog(type: TabKey, label: string, detail: string) {
    const newLog: Log = { id: Date.now().toString(), type, label, detail, time: now() };
    saveLogs([newLog, ...logs].slice(0, 50));
  }

  useEffect(() => {
    if (sleepRunning) {
      timerRef.current = setInterval(() => setSleepSec(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [sleepRunning]);

  function toggleSleep() {
    if (!sleepRunning) {
      setSleepRunning(true);
    } else {
      setSleepRunning(false);
      if (sleepSec > 0) {
        addLog("sleep", "수면", `${fmtSec(sleepSec)} 동안 수면`);
        setSleepSec(0);
      }
    }
  }

  const todayLogs = logs;

  const TABS: { key: TabKey; label: string; emoji: string }[] = [
    { key: "sleep", label: "수면", emoji: "🌙" },
    { key: "feeding", label: "수유", emoji: "🍼" },
    { key: "diaper", label: "기저귀", emoji: "👶" },
    { key: "pumping", label: "유축", emoji: "💧" },
    { key: "mood", label: "기분", emoji: "😊" },
  ];

  if (!unlocked) return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <div style={{ background: "white", borderRadius: 24, padding: "40px 28px", textAlign: "center", maxWidth: 340, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px" }}>결제 후 30일 이용 가능</h2>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.6 }}>사주 990원 결제하면<br />맘케어 7가지 기능을 30일 이용할 수 있어요</p>
        <Link href="/main-v2/pay?amount=990" style={{ display: "block", background: "linear-gradient(135deg, #f97316, #fb923c)", color: "white", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 900, textDecoration: "none", marginBottom: 10 }}>사주 990원 결제하기 →</Link>
        <Link href="/main-v2" style={{ display: "block", background: "linear-gradient(135deg, #0284c7, #0891b2)", color: "white", borderRadius: 14, padding: "12px", fontSize: 14, fontWeight: 800, textDecoration: "none", marginBottom: 12 }}>사주앱 메인으로</Link>
        <Link href="/momcare" style={{ display: "block", fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>← 맘케어 홈으로</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: "#f97316", textDecoration: "none" }}>맘케어</Link>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>🍼 일일 트래커</span>
      </nav>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>오늘 {new Date().toLocaleDateString("ko-KR")} 기록</p>

        {/* 탭 */}
        <div style={{ display: "flex", gap: 6, background: "white", borderRadius: 14, padding: "6px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, background: tab === t.key ? "#f97316" : "transparent", color: tab === t.key ? "white" : "#6b7280", border: "none", borderRadius: 10, padding: "8px 4px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
              <div>{t.emoji}</div>
              <div>{t.label}</div>
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div style={{ background: "white", borderRadius: 18, padding: "24px 20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          {tab === "sleep" && (
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 8px", color: "#1a1a2e" }}>수면 타이머</h3>
              <div style={{ background: "#f0f9ff", borderRadius: 10, padding: "10px 14px", marginBottom: 20, textAlign: "left" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#374151", lineHeight: 1.7 }}>
                  🌙 <strong>잠들기 전 ▶ 누르기</strong><br />
                  ☀️ <strong>일어나면 ⏹ 누르기</strong> → 수면 시간 자동 저장
                </p>
              </div>
              <div style={{ fontSize: 56, fontWeight: 900, fontFamily: "monospace", color: "#1a1a2e", margin: "0 0 24px" }}>{fmtSec(sleepSec)}</div>
              <button onClick={toggleSleep} style={{ width: 80, height: 80, borderRadius: "50%", background: sleepRunning ? "#fca5a5" : "#10b981", color: "white", border: "none", fontSize: 28, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                {sleepRunning ? "⏹" : "▶"}
              </button>
              <p style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: sleepRunning ? "#f97316" : "#9ca3af" }}>
                {sleepRunning ? "수면 중... ⏹ 누르면 자동 저장됩니다" : "▶ 눌러서 시작"}
              </p>
            </div>
          )}

          {tab === "feeding" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 16px" }}>수유 기록</h3>
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px" }}>수유 방식</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ key: "left", label: "왼쪽" }, { key: "right", label: "오른쪽" }, { key: "both", label: "양쪽" }, { key: "bottle", label: "분유/이유식" }].map(o => (
                    <button key={o.key} onClick={() => setFeedType(o.key as typeof feedType)} style={{ flex: 1, padding: "8px 4px", background: feedType === o.key ? "#f97316" : "#f3f4f6", color: feedType === o.key ? "white" : "#374151", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{o.label}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 6px" }}>수유량 (ml, 선택)</p>
                <input type="number" value={feedAmount} onChange={e => setFeedAmount(e.target.value)} placeholder="예: 120" style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <button onClick={() => { addLog("feeding", "수유", `${feedType === "left" ? "왼쪽" : feedType === "right" ? "오른쪽" : feedType === "both" ? "양쪽" : "분유/이유식"}${feedAmount ? ` ${feedAmount}ml` : ""}`); setFeedAmount(""); }} style={{ width: "100%", background: "#f97316", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>기록하기</button>
            </div>
          )}

          {tab === "diaper" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 16px" }}>기저귀 교체</h3>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                {[{ key: "wet", label: "💧 소변", desc: "젖은 기저귀" }, { key: "dirty", label: "💩 대변", desc: "더러운 기저귀" }, { key: "both", label: "🌊 복합", desc: "소변 + 대변" }].map(o => (
                  <button key={o.key} onClick={() => setDiaperType(o.key as typeof diaperType)} style={{ flex: 1, padding: "14px 8px", background: diaperType === o.key ? "#dbeafe" : "#f9fafb", border: diaperType === o.key ? "2px solid #3b82f6" : "2px solid transparent", borderRadius: 12, cursor: "pointer", textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{o.label.split(" ")[0]}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{o.label.split(" ")[1]}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{o.desc}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => { addLog("diaper", "기저귀", diaperType === "wet" ? "소변" : diaperType === "dirty" ? "대변" : "소변+대변"); }} style={{ width: "100%", background: "#3b82f6", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>기록하기</button>
            </div>
          )}

          {tab === "pumping" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 16px" }}>유축 기록</h3>
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px" }}>유축 부위</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ key: "left", label: "왼쪽" }, { key: "right", label: "오른쪽" }, { key: "both", label: "양쪽" }].map(o => (
                    <button key={o.key} onClick={() => setPumpSide(o.key as typeof pumpSide)} style={{ flex: 1, padding: "10px", background: pumpSide === o.key ? "#8b5cf6" : "#f3f4f6", color: pumpSide === o.key ? "white" : "#374151", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{o.label}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 6px" }}>유축량 (ml)</p>
                <input type="number" value={pumpAmount} onChange={e => setPumpAmount(e.target.value)} placeholder="예: 80" style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <button onClick={() => { addLog("pumping", "유축", `${pumpSide === "left" ? "왼쪽" : pumpSide === "right" ? "오른쪽" : "양쪽"}${pumpAmount ? ` ${pumpAmount}ml` : ""}`); setPumpAmount(""); }} style={{ width: "100%", background: "#8b5cf6", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>기록하기</button>
            </div>
          )}

          {tab === "mood" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 16px" }}>기분 기록</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {(Object.entries(MOODS) as [MoodKey, string][]).map(([k, v]) => (
                  <button key={k} onClick={() => setMood(k)} style={{ padding: "14px 10px", background: mood === k ? "#fef3c7" : "#f9fafb", border: mood === k ? "2px solid #f59e0b" : "2px solid transparent", borderRadius: 12, cursor: "pointer", fontSize: 22, textAlign: "center" }}>
                    <div>{v.split(" ")[0]}</div>
                    <div style={{ fontSize: 12, color: "#374151", fontWeight: 600, marginTop: 4 }}>{v.split(" ").slice(1).join(" ")}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => { addLog("mood", "기분", MOODS[mood]); }} style={{ width: "100%", background: "#f59e0b", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>기록하기</button>
            </div>
          )}
        </div>

        {/* 오늘 기록 */}
        <div style={{ background: "white", borderRadius: 18, padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900 }}>오늘의 기록 ({todayLogs.length}건)</h3>
            {todayLogs.length > 0 && <button onClick={() => saveLogs([])} style={{ fontSize: 11, color: "#fca5a5", background: "none", border: "none", cursor: "pointer" }}>전체 삭제</button>}
          </div>
          {todayLogs.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: "20px 0" }}>오늘 기록이 없습니다. 첫 기록을 남겨보세요!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {todayLogs.map(log => (
                <div key={log.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#f9fafb", borderRadius: 10 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{log.label}</span>
                    <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>{log.detail}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>{log.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
