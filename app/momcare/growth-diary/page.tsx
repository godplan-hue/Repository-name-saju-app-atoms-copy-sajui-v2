"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Measurement = { id: string; date: string; weight: number | null; height: number | null; head: number | null };
type ActiveTab = "weight" | "height" | "head";

function getPercentile(weight: number, ageMonths: number): string {
  // WHO 참고값 (체중 kg, 0~36개월 남아 기준 p50 근사)
  const p50 = [3.3,4.5,5.6,6.4,7.0,7.5,7.9,8.3,8.6,8.9,9.2,9.4,9.6,9.9,10.1,10.3,10.5,10.7,10.9,11.1,11.3,11.5,11.7,11.9,12.1,12.2,12.4,12.6,12.7,12.9,13.0,13.2,13.3,13.5,13.6,13.8,13.9];
  const ref = p50[Math.min(ageMonths, 36)] || 13.9;
  const ratio = weight / ref;
  if (ratio >= 1.15) return "상위 5%";
  if (ratio >= 1.05) return "상위 25%";
  if (ratio >= 0.95) return "상위 50%";
  if (ratio >= 0.85) return "상위 75%";
  return "하위 25%";
}

export default function GrowthDiaryPage() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("weight");
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), weight: "", height: "", head: "" });
  const [babyBirth, setBabyBirth] = useState("");
  const [unlocked, setUnlocked] = useState(true);
  const [mcUserId, setMcUserId] = useState("");

  useEffect(() => {
    const exp = localStorage.getItem("momcare_unlock_until");
    if (!exp || Number(exp) <= Date.now()) setUnlocked(false);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("momcare_measurements");
    if (saved) setMeasurements(JSON.parse(saved));
    const baby = localStorage.getItem("momcare_baby");
    if (baby) setBabyBirth(JSON.parse(baby).birthDate || "");

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

    fetch(`/api/momcare/save?userId=${uid}&type=measurements`)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.data) && d.data.length > 0) {
          setMeasurements(d.data);
          localStorage.setItem("momcare_measurements", JSON.stringify(d.data));
        }
      })
      .catch(() => {});
  }, []);

  function save(m: Measurement[]) {
    setMeasurements(m);
    localStorage.setItem("momcare_measurements", JSON.stringify(m));
    if (mcUserId) {
      fetch("/api/momcare/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: mcUserId, type: "measurements", data: m }),
      }).catch(() => {});
    }
  }

  function addMeasurement() {
    if (!form.weight && !form.height && !form.head) return;
    const m: Measurement = {
      id: Date.now().toString(),
      date: form.date,
      weight: form.weight ? parseFloat(form.weight) : null,
      height: form.height ? parseFloat(form.height) : null,
      head: form.head ? parseFloat(form.head) : null,
    };
    save([m, ...measurements].sort((a, b) => b.date.localeCompare(a.date)));
    setForm({ ...form, weight: "", height: "", head: "" });
  }

  function getAgeMonths(date: string) {
    if (!babyBirth) return null;
    const diff = new Date(date).getTime() - new Date(babyBirth).getTime();
    return Math.floor(diff / (30.44 * 24 * 60 * 60 * 1000));
  }

  if (!unlocked) return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <div style={{ background: "white", borderRadius: 24, padding: "40px 28px", textAlign: "center", maxWidth: 340, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px" }}>사주 분석 후 30일 무료</h2>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>점운에서 사주를 보면<br />맘케어 전체 기능을 30일 무료로 이용해요</p>
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: "#c2410c", fontWeight: 700, lineHeight: 1.5 }}>
          💡 990원 사주 결제 시<br />육아일기·타임캡슐·말사전 30일 무료!
        </div>
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "#166534", fontWeight: 700, lineHeight: 1.8 }}>
          🎁 결제하면 하루 무료도 드려요!<br />🌙 꿈해몽 · 🐱 복냥이상담 · ❓ 360개 질문
        </div>
        <Link href="/main-v2" style={{ display: "block", background: "linear-gradient(135deg, #f97316, #fb923c)", color: "white", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 900, textDecoration: "none", marginBottom: 12 }}>점운 사주 보러 가기 →</Link>
        <Link href="/momcare" style={{ display: "block", fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>← 맘케어 홈으로</Link>
      </div>
    </div>
  );

  const latestWithData = measurements.find(m => m.weight || m.height || m.head);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: "#f97316", textDecoration: "none" }}>맘케어</Link>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>📏 성장 일기</span>
      </nav>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>

        {/* 최근 측정 요약 */}
        {latestWithData && (
          <div style={{ background: "linear-gradient(135deg, #dbeafe, #bfdbfe)", borderRadius: 18, padding: "20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 12, color: "#3b82f6", fontWeight: 700, margin: "0 0 10px" }}>최근 측정 기록</p>
            <div style={{ display: "flex", gap: 20 }}>
              {latestWithData.weight && <div><p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#1a1a2e" }}>{latestWithData.weight}kg</p><p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7280" }}>몸무게</p></div>}
              {latestWithData.height && <div><p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#1a1a2e" }}>{latestWithData.height}cm</p><p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7280" }}>키</p></div>}
              {latestWithData.head && <div><p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#1a1a2e" }}>{latestWithData.head}cm</p><p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7280" }}>머리둘레</p></div>}
            </div>
            {latestWithData.weight && (() => {
              const ageM = getAgeMonths(latestWithData.date);
              if (ageM !== null && ageM >= 0) {
                const pct = getPercentile(latestWithData.weight, ageM);
                return <p style={{ margin: "10px 0 0", fontSize: 12, color: "#3b82f6", fontWeight: 700 }}>WHO 기준 체중 {pct} (생후 {ageM}개월 기준)</p>;
              }
              return null;
            })()}
          </div>
        )}

        {/* 측정 추가 */}
        <div style={{ background: "white", borderRadius: 18, padding: "20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 16px" }}>측정값 추가</h3>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>측정일</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>몸무게 (kg)</label>
              <input type="number" step="0.1" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="7.5" style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 8px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>키 (cm)</label>
              <input type="number" step="0.1" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} placeholder="68.5" style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 8px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>머리둘레 (cm)</label>
              <input type="number" step="0.1" value={form.head} onChange={e => setForm({ ...form, head: e.target.value })} placeholder="43.0" style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 8px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <button onClick={addMeasurement} style={{ width: "100%", background: "#10b981", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>측정값 저장하기</button>
        </div>

        {/* 탭별 차트 */}
        {measurements.length > 0 && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {[{ key: "weight" as ActiveTab, label: "몸무게" }, { key: "height" as ActiveTab, label: "키" }, { key: "head" as ActiveTab, label: "머리둘레" }].map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ flex: 1, padding: "8px", background: activeTab === t.key ? "#dbeafe" : "#f3f4f6", border: activeTab === t.key ? "2px solid #3b82f6" : "2px solid transparent", borderRadius: 10, fontSize: 13, fontWeight: 700, color: activeTab === t.key ? "#3b82f6" : "#6b7280", cursor: "pointer" }}>{t.label}</button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {measurements.filter(m => m[activeTab] !== null).slice(0, 10).map((m, i) => {
                const val = m[activeTab]!;
                const unit = activeTab === "weight" ? "kg" : "cm";
                const allVals = measurements.filter(x => x[activeTab] !== null).map(x => x[activeTab]!);
                const max = Math.max(...allVals);
                const barPct = (val / max) * 100;
                return (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "#6b7280", width: 80, flexShrink: 0 }}>{m.date}</span>
                    <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 6, height: 20, overflow: "hidden" }}>
                      <div style={{ width: `${barPct}%`, height: "100%", background: "#3b82f6", borderRadius: 6, transition: "width 0.3s" }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, width: 60, textAlign: "right", flexShrink: 0, color: "#1a1a2e" }}>{val}{unit}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 기록 테이블 */}
        <div style={{ background: "white", borderRadius: 18, padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 900, margin: "0 0 14px", color: "#111" }}>전체 기록</h3>
          {measurements.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: "20px 0" }}>아직 기록이 없습니다. 첫 측정값을 입력해보세요!</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, color: "#1a1a2e" }}>
                <thead><tr style={{ background: "#f9fafb" }}>
                  <th style={{ padding: "8px 10px", textAlign: "left", color: "#6b7280", fontWeight: 700 }}>날짜</th>
                  <th style={{ padding: "8px 10px", textAlign: "center", color: "#6b7280", fontWeight: 700 }}>몸무게</th>
                  <th style={{ padding: "8px 10px", textAlign: "center", color: "#6b7280", fontWeight: 700 }}>키</th>
                  <th style={{ padding: "8px 10px", textAlign: "center", color: "#6b7280", fontWeight: 700 }}>머리둘레</th>
                  <th style={{ padding: "8px 4px", textAlign: "center", color: "#6b7280", fontWeight: 700 }}></th>
                </tr></thead>
                <tbody>
                  {measurements.map(m => (
                    <tr key={m.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "10px 10px", color: "#1a1a2e" }}>{m.date}</td>
                      <td style={{ padding: "10px", textAlign: "center", color: "#1a1a2e" }}>{m.weight ? `${m.weight}kg` : "—"}</td>
                      <td style={{ padding: "10px", textAlign: "center", color: "#1a1a2e" }}>{m.height ? `${m.height}cm` : "—"}</td>
                      <td style={{ padding: "10px", textAlign: "center", color: "#1a1a2e" }}>{m.head ? `${m.head}cm` : "—"}</td>
                      <td style={{ padding: "10px 4px", textAlign: "center" }}>
                        <button onClick={() => save(measurements.filter(x => x.id !== m.id))} style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 16 }}>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
