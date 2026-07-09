import { db } from "@/lib/firebase";
import type { Metadata } from "next";
import LandingForm from "./LandingForm";

export const dynamic = "force-dynamic";

const COLOR_THEMES: Record<string, { primary: string; secondary: string; bg: string; light: string }> = {
  pink:  { primary: "#ec4899", secondary: "#8b5cf6", bg: "#fdf2f8", light: "rgba(236,72,153,0.1)" },
  gold:  { primary: "#f59e0b", secondary: "#1f2937", bg: "#fffbeb", light: "rgba(245,158,11,0.1)" },
  blue:  { primary: "#2563eb", secondary: "#6366f1", bg: "#eff6ff", light: "rgba(37,99,235,0.1)" },
  green: { primary: "#10b981", secondary: "#0d9488", bg: "#ecfdf5", light: "rgba(16,185,129,0.1)" },
  dark:  { primary: "#7c3aed", secondary: "#4c1d95", bg: "#f5f3ff", light: "rgba(124,58,237,0.1)" },
  red:   { primary: "#dc2626", secondary: "#ea580c", bg: "#fef2f2", light: "rgba(220,38,38,0.1)" },
};

const HERO_IMAGE_URLS: Record<string, string> = {
  stars:  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
  moon:   "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=800&q=80",
  lotus:  "https://images.unsplash.com/photo-1474557157379-8aa74a6ef541?w=800&q=80",
  candle: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80",
  mystic: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&q=80",
};

const PRODUCT_MAP: Record<string, { name: string; icon: string; desc: string; price: number }> = {
  basic:   { name: "기본분석",    icon: "🔮", desc: "사주 원국 + 오늘의 운세",  price: 990  },
  wealth:  { name: "재물운",     icon: "💰", desc: "재물·돈의 흐름 분석",     price: 3900 },
  love:    { name: "연애운",     icon: "💕", desc: "연애·결혼 운세 분석",     price: 3900 },
  health:  { name: "건강운",     icon: "💪", desc: "건강 흐름 분석",          price: 3900 },
  success: { name: "성공운",     icon: "🎯", desc: "직업·커리어 분석",        price: 3900 },
  career:  { name: "직업/사업운", icon: "🏢", desc: "사업·직업 상세 분석",    price: 3900 },
  daewoon: { name: "대운(大運)", icon: "🌌", desc: "10년 운명의 큰 흐름",    price: 2900 },
  yearly:  { name: "올해운세",    icon: "📅", desc: "2026년 전체 흐름 분석",  price: 3900 },
  taegil:  { name: "택일",       icon: "🗓",  desc: "중요한 날 좋은 날 찾기", price: 2900 },
  pkg:     { name: "패키지 특가", icon: "🎁", desc: "5개 운세 묶음 한 번에",  price: 9900 },
};

async function getLanding(id: string) {
  try {
    const snap = await db.ref(`partners/${id}`).once("value");
    const partner = snap.val();
    return {
      businessName: partner?.businessName || partner?.name || "사주 상담",
      landing: partner?.landing ?? null,
      partnerId: id,
    };
  } catch {
    return {
      businessName: "사주 상담",
      landing: null,
      partnerId: id,
    };
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getLanding(params.id);
  const name = data?.businessName ?? "사주 상담";
  const headline = data?.landing?.headline ?? "나만의 AI 사주 분석";
  return {
    title: `${headline} | ${name}`,
    description: data?.landing?.subtext ?? "AI 사주로 재물운·연애운·건강운을 확인해보세요.",
    openGraph: { title: `${headline} | ${name}`, description: data?.landing?.subtext ?? "AI 사주 분석" },
  };
}

export default async function PartnerLandingPage({ params }: { params: { id: string } }) {
  const data = await getLanding(params.id);

  const { businessName, landing, partnerId } = data;

  const cfg = {
    headline:    landing?.headline    ?? "나만의 AI 사주 분석",
    subtext:     landing?.subtext     ?? "생년월일만 입력하면 AI가 운세를 분석해드려요. 재물운·연애운·건강운·직업운까지 한 번에 확인하세요.",
    ctaText:     landing?.ctaText     ?? "지금 바로 확인하기",
    badge:       landing?.badge       ?? "AI 사주 전문",
    review1:     landing?.review1     ?? "정말 신기하게 맞아요! 올해 이직할 것 같다고 했는데 진짜 이직했어요 🙏",
    review2:     landing?.review2     ?? "연애운이 3월에 온다고 했는데 진짜 좋은 사람 만났어요. 완전 신기해요!",
    review3:     landing?.review3     ?? "사주 처음 봤는데 이렇게 자세히 나오는 줄 몰랐어요. 주변 친구들한테 다 알려줬어요.",
    themeId:     landing?.themeId     ?? "pink",
    heroImageId: landing?.heroImageId ?? "none",
    heroImageUrl: landing?.heroImageUrl ?? "",
    formType:    landing?.formType    ?? "1person",
    promoText:   landing?.promoText   ?? "",
    packages:    (landing?.packages ?? []) as Array<{ id: string; customPrice: number }>,
  };

  const heroImg = cfg.heroImageUrl || HERO_IMAGE_URLS[cfg.heroImageId] || "";
  const theme = COLOR_THEMES[cfg.themeId] ?? COLOR_THEMES.pink;

  return (
    <main style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>

      {/* 프로모션 배너 */}
      {cfg.promoText && (
        <div style={{ background: "linear-gradient(135deg, #dc2626, #ea580c)", color: "white", textAlign: "center", padding: "10px 16px", fontSize: 13, fontWeight: 900 }}>
          🔥 {cfg.promoText}
        </div>
      )}

      {/* 히어로 */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
        backgroundImage: heroImg ? `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url('${heroImg}')` : undefined,
        backgroundSize: "cover", backgroundPosition: "center",
        padding: "60px 20px 52px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", color: "white", fontSize: 12, fontWeight: 900, padding: "4px 14px", borderRadius: 20, marginBottom: 16, border: "1px solid rgba(255,255,255,0.35)" }}>{cfg.badge}</span>
          <p style={{ color: "white", fontSize: 14, fontWeight: 700, margin: "0 0 8px", opacity: 0.9 }}>{businessName}</p>
          <h1 style={{ color: "white", fontSize: "clamp(26px,6vw,40px)", fontWeight: 900, margin: "0 0 14px", lineHeight: 1.25 }}>{cfg.headline}</h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, lineHeight: 1.7, margin: 0, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>{cfg.subtext}</p>
        </div>
      </div>

      {/* 상품 카드 (선택된 경우만) */}
      {cfg.packages.length > 0 && (
        <div style={{ maxWidth: 560, margin: "32px auto 0", padding: "0 20px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, textAlign: "center", margin: "0 0 14px" }}>📦 제공 상품</h2>
          <div style={{ display: "grid", gridTemplateColumns: cfg.packages.length === 1 ? "1fr" : "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            {cfg.packages.map(pkg => {
              const prod = PRODUCT_MAP[pkg.id];
              if (!prod) return null;
              const displayPrice = pkg.customPrice > 0 ? pkg.customPrice : prod.price;
              return (
                <a key={pkg.id} href="#form-section" style={{ display: "block", background: "white", borderRadius: 16, padding: "20px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", textAlign: "center", textDecoration: "none", color: "inherit", border: `2px solid ${theme.light}`, cursor: "pointer" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{prod.icon}</div>
                  <p style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px" }}>{prod.name}</p>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 12px", lineHeight: 1.5 }}>{prod.desc}</p>
                  <div style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, color: "white", borderRadius: 8, padding: "7px 0", fontSize: 14, fontWeight: 900 }}>
                    ₩{displayPrice.toLocaleString()}
                  </div>
                </a>
              );
            })}
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", margin: "10px 0 0" }}>아래 정보를 입력하면 바로 확인할 수 있어요</p>
        </div>
      )}

      {/* 정보 입력 폼 */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px", marginTop: cfg.packages.length > 0 ? 20 : -30, position: "relative", zIndex: 10 }}>
        <LandingForm partnerId={partnerId} ctaText={cfg.ctaText} primary={theme.primary} formType={cfg.formType} />
      </div>

      {/* 특징 3개 */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "⚡", title: "즉시 결과", desc: "생년월일 입력 즉시 AI가 분석 — 기다릴 필요 없어요" },
            { icon: "🔮", title: "정밀 사주 분석", desc: "재물·연애·건강·직업운까지 만세력 기반 AI 분석" },
            { icon: "🔒", title: "개인정보 보호", desc: "입력 정보는 안전하게 암호화되어 분석에만 사용됩니다" },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 3px" }}>{f.title}</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 후기 */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px 0" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 16 }}>💬 실제 이용 후기</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[cfg.review1, cfg.review2, cfg.review3].map((review, i) => (
            <div key={i} style={{ background: "white", borderRadius: 14, padding: "16px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${theme.primary}` }}>
              <p style={{ fontSize: 13, color: "#374151", margin: "0 0 8px", lineHeight: 1.7 }}>❝ {review} ❞</p>
              <div style={{ display: "flex", gap: 2 }}>{"⭐⭐⭐⭐⭐".split("").map((s, j) => <span key={j} style={{ color: "#f59e0b", fontSize: 12 }}>{s}</span>)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 CTA */}
      <div style={{ maxWidth: 560, margin: "32px auto 0", padding: "0 20px" }}>
        <a href="#form-section" style={{ display: "block", background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, color: "white", textAlign: "center", padding: "16px 0", borderRadius: 14, fontSize: 16, fontWeight: 900, textDecoration: "none", boxShadow: `0 6px 20px ${theme.primary}40` }}>
          🔮 {cfg.ctaText}
        </a>
      </div>

      {/* 푸터 */}
      <div style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, margin: "40px 0 0", padding: "32px 20px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, margin: 0 }}>Powered by 점운</p>
      </div>
    </main>
  );
}
