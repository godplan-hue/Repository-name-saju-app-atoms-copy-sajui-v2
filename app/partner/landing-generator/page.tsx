"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const COLOR_THEMES = [
  { id: "pink",   label: "핑크·보라",  primary: "#ec4899", secondary: "#8b5cf6", bg: "#fdf2f8" },
  { id: "gold",   label: "골드·블랙",  primary: "#f59e0b", secondary: "#1f2937", bg: "#fffbeb" },
  { id: "blue",   label: "블루·인디고", primary: "#2563eb", secondary: "#6366f1", bg: "#eff6ff" },
  { id: "green",  label: "그린·에메",  primary: "#10b981", secondary: "#0d9488", bg: "#ecfdf5" },
];

const DEFAULT_FORM = {
  headline: "나만의 AI 사주 분석",
  subtext: "생년월일만 입력하면 AI가 운세를 분석해드려요. 재물운·연애운·건강운·직업운까지 한 번에 확인하세요.",
  ctaText: "지금 바로 확인하기",
  badge: "AI 사주 전문",
  review1: "정말 신기하게 맞아요! 올해 이직할 것 같다고 했는데 진짜 이직했어요 🙏",
  review2: "연애운이 3월에 온다고 했는데 진짜 좋은 사람 만났어요. 완전 신기해요!",
  review3: "사주 처음 봤는데 이렇게 자세히 나오는 줄 몰랐어요. 주변 친구들한테 다 알려줬어요.",
  themeId: "pink",
};

export default function LandingGenerator() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState("");
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("partnerId");
    if (!id) { router.push("/partner/login"); return; }
    setPartnerId(id);
    fetch(`/api/partner/landing?partnerId=${id}`)
      .then(r => r.json())
      .then(d => { if (d.landing) setForm({ ...DEFAULT_FORM, ...d.landing }); })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/partner/landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, landing: form }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { alert("저장 실패. 다시 시도해주세요."); }
    finally { setSaving(false); }
  };

  const landingUrl = `https://jeomun.com/lp/${partnerId}`;
  const theme = COLOR_THEMES.find(t => t.id === form.themeId) ?? COLOR_THEMES[0];

  const inputStyle = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4, display: "block" as const };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", padding: "20px 16px 60px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => router.push("/partner/guide")} style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "#7c3aed", padding: "8px 14px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>← 가이드</button>
          <h1 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: 0 }}>🎨 랜딩페이지 생성기</h1>
        </div>

        {/* 공유 URL */}
        <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", margin: "0 0 8px" }}>내 랜딩페이지 주소</p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <code style={{ flex: 1, background: "#f9fafb", padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#374151", wordBreak: "break-all", border: "1px solid #e5e7eb" }}>
              {landingUrl}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(landingUrl).then(() => alert("복사됐어요!")).catch(() => alert(landingUrl))}
              style={{ padding: "8px 14px", background: "#8b5cf6", color: "white", border: "none", borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}
            >복사</button>
          </div>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "8px 0 0" }}>이 링크를 SNS·카카오톡 등에 공유하면 고객이 바로 접속할 수 있어요.</p>
        </div>

        {/* 색상 테마 */}
        <div style={{ background: "white", borderRadius: 14, padding: "18px", marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <p style={labelStyle}>색상 테마</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {COLOR_THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setForm(f => ({ ...f, themeId: t.id }))}
                style={{ padding: "8px 16px", background: form.themeId === t.id ? `linear-gradient(135deg, ${t.primary}, ${t.secondary})` : "#f3f4f6", color: form.themeId === t.id ? "white" : "#374151", border: "none", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
              >{t.label}</button>
            ))}
          </div>
        </div>

        {/* 텍스트 편집 */}
        <div style={{ background: "white", borderRadius: 14, padding: "18px", marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", margin: 0 }}>✏️ 텍스트 편집</h2>

          <div>
            <label style={labelStyle}>뱃지 문구 (상단 작은 태그)</label>
            <input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} style={inputStyle} placeholder="예: AI 사주 전문" maxLength={20} />
          </div>
          <div>
            <label style={labelStyle}>메인 헤드라인</label>
            <input value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} style={inputStyle} placeholder="예: 나만의 AI 사주 분석" maxLength={30} />
          </div>
          <div>
            <label style={labelStyle}>서브 설명</label>
            <textarea value={form.subtext} onChange={e => setForm(f => ({ ...f, subtext: e.target.value }))} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="서비스 설명을 입력하세요" maxLength={120} />
          </div>
          <div>
            <label style={labelStyle}>버튼 문구</label>
            <input value={form.ctaText} onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))} style={inputStyle} placeholder="예: 지금 바로 확인하기" maxLength={20} />
          </div>
        </div>

        {/* 후기 편집 */}
        <div style={{ background: "white", borderRadius: 14, padding: "18px", marginBottom: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", margin: 0 }}>💬 고객 후기 (3개)</h2>
          {[
            { key: "review1", label: "후기 1" },
            { key: "review2", label: "후기 2" },
            { key: "review3", label: "후기 3" },
          ].map(r => (
            <div key={r.key}>
              <label style={labelStyle}>{r.label}</label>
              <textarea
                value={form[r.key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [r.key]: e.target.value }))}
                style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
                placeholder="고객 후기를 입력하세요"
                maxLength={80}
              />
            </div>
          ))}
        </div>

        {/* 저장 + 미리보기 */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ flex: 1, padding: "14px 0", background: saving ? "#9ca3af" : "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "white", border: "none", borderRadius: 12, fontWeight: 900, fontSize: 15, cursor: saving ? "not-allowed" : "pointer" }}
          >{saved ? "✅ 저장 완료!" : saving ? "저장 중..." : "💾 저장하기"}</button>
          <button
            onClick={() => window.open(`/lp/${partnerId}`, "_blank")}
            style={{ flex: 1, padding: "14px 0", background: "white", color: "#7c3aed", border: "1.5px solid rgba(139,92,246,0.4)", borderRadius: 12, fontWeight: 900, fontSize: 15, cursor: "pointer" }}
          >👁 미리보기</button>
        </div>
      </div>
    </main>
  );
}
