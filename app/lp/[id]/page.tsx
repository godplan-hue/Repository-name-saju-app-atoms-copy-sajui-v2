import { db } from "@/lib/firebase";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const COLOR_THEMES: Record<string, { primary: string; secondary: string; bg: string; light: string }> = {
  pink:  { primary: "#ec4899", secondary: "#8b5cf6", bg: "#fdf2f8", light: "rgba(236,72,153,0.1)" },
  gold:  { primary: "#f59e0b", secondary: "#1f2937", bg: "#fffbeb", light: "rgba(245,158,11,0.1)" },
  blue:  { primary: "#2563eb", secondary: "#6366f1", bg: "#eff6ff", light: "rgba(37,99,235,0.1)" },
  green: { primary: "#10b981", secondary: "#0d9488", bg: "#ecfdf5", light: "rgba(16,185,129,0.1)" },
};

async function getLanding(id: string) {
  const snap = await db.ref(`partners/${id}`).once("value");
  const partner = snap.val();
  if (!partner) return null;
  return { businessName: partner.businessName || partner.name || "사주 상담", landing: partner.landing ?? null, partnerId: id };
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
  if (!data) notFound();

  const { businessName, landing, partnerId } = data;
  const cfg = {
    headline:  landing?.headline  ?? "나만의 AI 사주 분석",
    subtext:   landing?.subtext   ?? "생년월일만 입력하면 AI가 운세를 분석해드려요. 재물운·연애운·건강운·직업운까지 한 번에 확인하세요.",
    ctaText:   landing?.ctaText   ?? "지금 바로 확인하기",
    badge:     landing?.badge     ?? "AI 사주 전문",
    review1:   landing?.review1   ?? "정말 신기하게 맞아요! 올해 이직할 것 같다고 했는데 진짜 이직했어요 🙏",
    review2:   landing?.review2   ?? "연애운이 3월에 온다고 했는데 진짜 좋은 사람 만났어요. 완전 신기해요!",
    review3:   landing?.review3   ?? "사주 처음 봤는데 이렇게 자세히 나오는 줄 몰랐어요. 주변 친구들한테 다 알려줬어요.",
    themeId:   landing?.themeId   ?? "pink",
  };

  const theme = COLOR_THEMES[cfg.themeId as string] ?? COLOR_THEMES.pink;
  const ctaHref = `/main-v2?ref=${partnerId}`;

  return (
    <main style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>

      {/* 히어로 */}
      <div style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, padding: "60px 20px 52px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", color: "white", fontSize: 12, fontWeight: 900, padding: "4px 14px", borderRadius: 20, marginBottom: 16, border: "1px solid rgba(255,255,255,0.35)" }}>{cfg.badge}</span>
          <p style={{ color: "white", fontSize: 14, fontWeight: 700, margin: "0 0 8px", opacity: 0.9 }}>{businessName}</p>
          <h1 style={{ color: "white", fontSize: "clamp(26px,6vw,40px)", fontWeight: 900, margin: "0 0 14px", lineHeight: 1.25 }}>{cfg.headline}</h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, lineHeight: 1.7, margin: "0 0 28px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>{cfg.subtext}</p>
          <Link href={ctaHref} style={{ display: "inline-block", padding: "15px 36px", background: "white", color: theme.primary, borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 24px rgba(0,0,0,0.2)" }}>
            🔮 {cfg.ctaText}
          </Link>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 10 }}>무료 오늘의 운세로 먼저 체험해보세요</p>
        </div>
      </div>

      {/* 특징 3개 */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "⚡", title: "즉시 결과", desc: "생년월일 입력 즉시 AI가 분석 — 기다릴 필요 없어요" },
            { icon: "🔮", title: "정밀 사주 분석", desc: "재물·연애·건강·직업운까지 만세력 기반 AI 분석" },
            { icon: "💰", title: "990원부터", desc: "무료 맛보기 후 원하는 운세만 골라 확인 가능" },
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
      <div style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, margin: "40px 0 0", padding: "44px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>{cfg.headline}</p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 24px" }}>무료로 먼저 체험하고 마음에 들면 결제하세요</p>
        <Link href={ctaHref} style={{ display: "inline-block", padding: "15px 44px", background: "white", color: theme.primary, borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          🔮 {cfg.ctaText}
        </Link>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 24 }}>Powered by 점운</p>
      </div>
    </main>
  );
}
