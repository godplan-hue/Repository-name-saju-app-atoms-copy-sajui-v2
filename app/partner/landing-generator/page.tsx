"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const COLOR_THEMES = [
  { id: "pink",  label: "핑크·보라",   primary: "#ec4899", secondary: "#8b5cf6", bg: "#fdf2f8" },
  { id: "gold",  label: "골드·블랙",   primary: "#f59e0b", secondary: "#1f2937", bg: "#fffbeb" },
  { id: "blue",  label: "블루·인디고",  primary: "#2563eb", secondary: "#6366f1", bg: "#eff6ff" },
  { id: "green", label: "그린·에메",   primary: "#10b981", secondary: "#0d9488", bg: "#ecfdf5" },
  { id: "dark",  label: "다크·신비",   primary: "#7c3aed", secondary: "#4c1d95", bg: "#f5f3ff" },
  { id: "red",   label: "레드·열정",   primary: "#dc2626", secondary: "#ea580c", bg: "#fef2f2" },
];

const HERO_IMAGES = [
  { id: "none",   label: "없음",   url: "" },
  { id: "stars",  label: "별자리", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80" },
  { id: "moon",   label: "달빛",   url: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=800&q=80" },
  { id: "lotus",  label: "연꽃",   url: "https://images.unsplash.com/photo-1474557157379-8aa74a6ef541?w=800&q=80" },
  { id: "candle", label: "촛불",   url: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80" },
  { id: "mystic", label: "신비",   url: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&q=80" },
];

const JEOMUN_PRODUCTS = [
  { id: "wealth",  name: "재물운",     icon: "💰", desc: "재물·돈의 흐름 분석",     price: 7900 },
  { id: "love",    name: "연애운",     icon: "💕", desc: "연애·결혼 운세 분석",     price: 7900 },
  { id: "health",  name: "건강운",     icon: "💪", desc: "건강 흐름 분석",          price: 7900 },
  { id: "success", name: "성공운",     icon: "🎯", desc: "직업·커리어 분석",        price: 7900 },
  { id: "yearly",  name: "총운",       icon: "📅", desc: "2026년 전체 흐름 분석",   price: 7900 },
  { id: "daewoon", name: "대운(大運)", icon: "🌌", desc: "10년 운명의 큰 흐름",    price: 2900 },
  { id: "taegil",  name: "택일",       icon: "🗓",  desc: "중요한 날 좋은 날 찾기", price: 2900 },
  { id: "pkg",     name: "패키지 특가", icon: "🎁", desc: "5개 운세 묶음 한 번에",  price: 9900 },
];

interface PkgItem { id: string; customPrice: number; }

const DEFAULT_FORM = {
  headline: "나만의 AI 사주 분석",
  subtext: "생년월일만 입력하면 AI가 운세를 분석해드려요. 재물운·연애운·건강운·직업운까지 한 번에 확인하세요.",
  ctaText: "지금 바로 확인하기",
  badge: "AI 사주 전문",
  review1: "정말 신기하게 맞아요! 올해 이직할 것 같다고 했는데 진짜 이직했어요 🙏",
  review2: "연애운이 3월에 온다고 했는데 진짜 좋은 사람 만났어요. 완전 신기해요!",
  review3: "사주 처음 봤는데 이렇게 자세히 나오는 줄 몰랐어요. 주변 친구들한테 다 알려줬어요.",
  themeId: "pink",
  heroImageId: "none",
  heroImageUrl: "",
  formType: "1person",
  promoText: "",
  packages: [] as PkgItem[],
};

export default function LandingGenerator() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState("");
  const [tier, setTier] = useState("free");
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("partnerId");
    if (!id) { router.push("/partner/login"); return; }
    setPartnerId(id);
    fetch(`/api/partner/landing?partnerId=${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.tier) setTier(d.tier);
        if (d.landing) setForm({ ...DEFAULT_FORM, ...d.landing, packages: d.landing.packages ?? [] });
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/partner/landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, landing: form }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`저장 실패: ${err.error || res.status}\n파트너 ID: ${partnerId}\n다시 로그인 후 시도해주세요.`);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { alert("저장 실패. 다시 시도해주세요."); }
    finally { setSaving(false); }
  };

  const toggleProduct = (productId: string) => {
    const isSelected = form.packages.some(p => p.id === productId);
    if (isSelected) {
      setForm(f => ({ ...f, packages: f.packages.filter(p => p.id !== productId) }));
    } else if (form.packages.length < 3) {
      setForm(f => ({ ...f, packages: [...f.packages, { id: productId, customPrice: 0 }] }));
    }
  };

  const updateCustomPrice = (productId: string, price: number) => {
    setForm(f => ({ ...f, packages: f.packages.map(p => p.id === productId ? { ...p, customPrice: price } : p) }));
  };

  const landingUrl = `https://jeomun.com/lp/${partnerId}`;
  const isDiamond = tier === "diamond";

  const inputStyle = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4, display: "block" as const };
  const sectionStyle = { background: "white", borderRadius: 14, padding: "18px", marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", padding: "20px 16px 60px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => router.push("/partner/guide")} style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "#7c3aed", padding: "8px 14px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>← 가이드</button>
          <h1 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: 0 }}>🎨 랜딩페이지 생성기</h1>
          {isDiamond && (
            <span style={{ background: "linear-gradient(135deg,#f59e0b,#92400e)", color: "white", fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 20 }}>💎 다이아</span>
          )}
        </div>

        {/* 공유 URL */}
        <div style={sectionStyle}>
          <p style={labelStyle}>내 랜딩페이지 주소</p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <code style={{ flex: 1, background: "#f9fafb", padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#374151", wordBreak: "break-all", border: "1px solid #e5e7eb" }}>{landingUrl}</code>
            <button
              onClick={() => navigator.clipboard.writeText(landingUrl).then(() => alert("복사됐어요!")).catch(() => alert(landingUrl))}
              style={{ padding: "8px 14px", background: "#8b5cf6", color: "white", border: "none", borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}
            >복사</button>
          </div>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "8px 0 0" }}>SNS·카카오톡 등에 공유하면 고객이 바로 접속할 수 있어요.</p>
        </div>

        {/* ── 색상 테마 ── */}
        <div style={sectionStyle}>
          <p style={labelStyle}>색상 테마</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {COLOR_THEMES.map(t => (
              <button key={t.id} onClick={() => setForm(f => ({ ...f, themeId: t.id }))}
                style={{ padding: "7px 14px", background: form.themeId === t.id ? `linear-gradient(135deg, ${t.primary}, ${t.secondary})` : "#f3f4f6", color: form.themeId === t.id ? "white" : "#374151", border: "none", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 히어로 이미지 ── */}
        <div style={sectionStyle}>
          <p style={labelStyle}>상단 배경 이미지</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {HERO_IMAGES.map(img => (
              <button key={img.id} onClick={() => setForm(f => ({ ...f, heroImageId: img.id, heroImageUrl: "" }))}
                style={{ padding: 0, border: `2px solid ${form.heroImageId === img.id && !form.heroImageUrl ? "#8b5cf6" : "#e5e7eb"}`, borderRadius: 10, overflow: "hidden", cursor: "pointer", background: "none", position: "relative", aspectRatio: "16/9" }}>
                {img.url ? (
                  <img src={img.url} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#9ca3af", fontWeight: 700 }}>없음</div>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.45)", color: "white", fontSize: 10, fontWeight: 700, textAlign: "center", padding: "3px 0" }}>{img.label}</div>
                {form.heroImageId === img.id && !form.heroImageUrl && (
                  <div style={{ position: "absolute", top: 4, right: 4, background: "#8b5cf6", color: "white", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>✓</div>
                )}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={{ ...labelStyle, marginBottom: 4 }}>또는 내 이미지 URL 직접 입력</label>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 6px" }}>imgbb.com 등에 올린 이미지 URL 붙여넣기 → 프리셋 대신 사용됩니다.</p>
            <input
              value={form.heroImageUrl}
              onChange={e => setForm(f => ({ ...f, heroImageUrl: e.target.value }))}
              style={inputStyle}
              placeholder="https://i.ibb.co/예시이미지.jpg"
            />
            {form.heroImageUrl && (
              <div style={{ marginTop: 8, position: "relative" }}>
                <img
                  src={form.heroImageUrl} alt="미리보기"
                  style={{ width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 8 }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <button onClick={() => setForm(f => ({ ...f, heroImageUrl: "" }))}
                  style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.55)", color: "white", border: "none", borderRadius: "50%", width: 24, height: 24, fontSize: 13, cursor: "pointer", fontWeight: 900, lineHeight: "24px" }}>
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── 폼 유형 ── */}
        <div style={sectionStyle}>
          <p style={labelStyle}>고객 정보 입력 폼 유형</p>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { id: "1person", label: "👤 1인 운세",  desc: "이름·생년월일·성별 1명 입력" },
              { id: "2person", label: "👥 2인 궁합",  desc: "나 + 상대방 정보 각각 입력" },
            ].map(opt => (
              <button key={opt.id} onClick={() => setForm(f => ({ ...f, formType: opt.id }))}
                style={{ flex: 1, padding: "12px 10px", borderRadius: 10, border: `2px solid ${form.formType === opt.id ? "#8b5cf6" : "#e5e7eb"}`, background: form.formType === opt.id ? "#ede9fe" : "white", color: form.formType === opt.id ? "#7c3aed" : "#374151", fontWeight: 800, fontSize: 12, cursor: "pointer", textAlign: "center" as const }}>
                <div>{opt.label}</div>
                <div style={{ fontSize: 10, fontWeight: 400, color: form.formType === opt.id ? "#7c3aed" : "#9ca3af", marginTop: 3 }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── 프로모션 배너 ── */}
        <div style={sectionStyle}>
          <p style={labelStyle}>🔥 프로모션 배너 문구 <span style={{ fontWeight: 400, color: "#9ca3af" }}>(선택)</span></p>
          <input
            value={form.promoText}
            onChange={e => setForm(f => ({ ...f, promoText: e.target.value }))}
            style={inputStyle}
            placeholder="예: 지금만 특가! 선착순 100명 한정 30% 할인"
            maxLength={50}
          />
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "4px 0 0" }}>입력 시 페이지 상단에 빨간 배너로 표시됩니다. 비워두면 표시 안 됨.</p>
        </div>

        {/* ── 상품 선택 ── */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px" }}>🛍 노출할 상품 선택 (최대 3개)</h2>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 14px" }}>
            체크한 상품이 랜딩페이지에 카드로 표시됩니다.
            {isDiamond && " 💎 다이아는 가격을 직접 설정할 수 있어요."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {JEOMUN_PRODUCTS.map(prod => {
              const isSelected = form.packages.some(p => p.id === prod.id);
              const pkgItem = form.packages.find(p => p.id === prod.id);
              const canAdd = !isSelected && form.packages.length < 3;
              const displayPrice = (isDiamond && pkgItem?.customPrice) ? pkgItem.customPrice : prod.price;
              return (
                <div key={prod.id} style={{ border: `1.5px solid ${isSelected ? "#8b5cf6" : "#e5e7eb"}`, borderRadius: 10, padding: "12px 14px", background: isSelected ? "#faf5ff" : "white", opacity: (!isSelected && !canAdd) ? 0.45 : 1, transition: "opacity 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                      type="checkbox" checked={isSelected}
                      onChange={() => toggleProduct(prod.id)}
                      disabled={!isSelected && !canAdd}
                      style={{ accentColor: "#8b5cf6", width: 16, height: 16, cursor: "pointer", flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{prod.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#1a1a2e", margin: "0 0 2px" }}>{prod.name}</p>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{prod.desc}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 900, color: isSelected ? "#7c3aed" : "#6b7280" }}>
                      ₩{displayPrice.toLocaleString()}
                    </span>
                  </div>
                  {isSelected && isDiamond && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #e9d5ff" }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", display: "block", marginBottom: 4 }}>💎 내 브랜드 가격 설정 (0이면 점운 기본가)</label>
                      <input
                        type="number" value={pkgItem?.customPrice || ""}
                        onChange={e => updateCustomPrice(prod.id, Number(e.target.value))}
                        placeholder={`${prod.price.toLocaleString()} (기본가)`}
                        style={{ ...inputStyle, fontSize: 13 }}
                        min={0}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 텍스트 편집 ── */}
        <div style={{ ...sectionStyle, display: "flex", flexDirection: "column", gap: 14 }}>
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

        {/* ── 후기 편집 ── */}
        <div style={{ ...sectionStyle, display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", margin: 0 }}>💬 고객 후기 (3개)</h2>
          {[{ key: "review1", label: "후기 1" }, { key: "review2", label: "후기 2" }, { key: "review3", label: "후기 3" }].map(r => (
            <div key={r.key}>
              <label style={labelStyle}>{r.label}</label>
              <textarea
                value={form[r.key as keyof typeof form] as string}
                onChange={e => setForm(f => ({ ...f, [r.key]: e.target.value }))}
                style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
                placeholder="고객 후기를 입력하세요"
                maxLength={80}
              />
            </div>
          ))}
        </div>

        {/* ── 저장 + 미리보기 ── */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleSave} disabled={saving}
            style={{ flex: 1, padding: "14px 0", background: saving ? "#9ca3af" : "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "white", border: "none", borderRadius: 12, fontWeight: 900, fontSize: 15, cursor: saving ? "not-allowed" : "pointer" }}
          >{saved ? "✅ 저장 완료!" : saving ? "저장 중..." : "💾 저장하기"}</button>
          <button
            onClick={() => window.open(`/lp/${partnerId}`, "_blank")}
            style={{ flex: 1, padding: "14px 0", background: "white", color: "#7c3aed", border: "1.5px solid rgba(139,92,246,0.4)", borderRadius: 12, fontWeight: 900, fontSize: 15, cursor: "pointer" }}
          >👁 미리보기</button>
        </div>
        {partnerId && (
          <div style={{ marginTop: 12, background: "#f5f3ff", borderRadius: 10, padding: "10px 14px" }}>
            <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 4px", fontWeight: 700 }}>📎 내 랜딩페이지 주소 (저장 후 공유하세요)</p>
            <p style={{ fontSize: 12, color: "#6d28d9", fontWeight: 800, margin: 0, wordBreak: "break-all" }}>jeomun.com/lp/{partnerId}</p>
          </div>
        )}
      </div>
    </main>
  );
}
