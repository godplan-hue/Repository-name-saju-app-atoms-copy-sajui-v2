"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import KakaoShareCouponBanner from "@/app/main-v2/_components/KakaoShareCouponBanner";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

interface SharedCategory {
  icon: string;
  label: string;
  color: string;
  text: string;
  badge?: string;
  isHeader?: boolean;
}

interface SharedEntry {
  name: string;
  scores?: { total?: number; wealth?: number; love?: number; health?: number; success?: number };
  luckyColor?: string;
  luckyNumber?: number;
  luckyDirection?: string;
  categories: SharedCategory[];
  businessName?: string;
  tier?: string;
  birthYear?: string;
  subtitle?: string;
}

function Bar({ label, score, color }: { label: string; score: number; color: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), 300); return () => clearTimeout(t); }, [score]);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 900, color }}>{score}점</span>
      </div>
      <div style={{ height: 7, background: "#f3e8ff", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: G, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function ScoreCircle({ score, size = 130 }: { score: number; size?: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 300);
    return () => clearTimeout(t);
  }, [score]);
  const dash = (animated / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="white" strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dasharray 1.2s ease" }} />
      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="20" fontWeight="900">{animated}</text>
      <text x="50" y="60" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="700">/ 100</text>
    </svg>
  );
}

export default function KakaoShareClient({ id }: { id: string }) {
  const router = useRouter();
  const [entry, setEntry] = useState<SharedEntry | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/v2/share?id=${encodeURIComponent(id)}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setEntry(data.entry))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <main style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af", marginBottom: 16 }}>결과를 찾을 수 없어요.</p>
          <button onClick={() => router.push("/main-v2")} style={{ padding: "12px 28px", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>
            🔮 내 운세 보러 가기
          </button>
        </div>
      </main>
    );
  }

  if (!entry) return null;

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <header style={{ minHeight: 52, padding: "8px 16px", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)" }}>
        <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🐱 {entry.businessName || "점운"}</span>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* 쿠폰 배너 1 */}
        {!entry.businessName && <KakaoShareCouponBanner />}

        {/* 쿠폰 배너 2 */}
        {!entry.businessName && (
          <div onClick={() => router.push("/share-coupon")} style={{ marginBottom: 16, borderRadius: 16, overflow: "hidden", cursor: "pointer", border: "1.5px solid #fca5a5" }}>
            <div style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>📸</span>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>SNS에 글 올리면 990원 쿠폰 10장!</span>
            </div>
            <div style={{ background: "#fef2f2", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 11, color: "#dc2626", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>소개·추천 글 1,000자 이상 + 사진 3장<br />쿠폰 10장 + 꿈해몽 24시간 무료 🎁</p>
              <span style={{ fontSize: 12, fontWeight: 900, color: "#fff", background: "#dc2626", padding: "5px 12px", borderRadius: 20, whiteSpace: "nowrap", marginLeft: 8 }}>받기 →</span>
            </div>
          </div>
        )}

        {/* 점수 요약 카드 */}
        <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, overflow: "hidden" }}>
          <div style={{ background: entry.tier === "package" ? "#eab308" : G, color: entry.tier === "package" ? "#3a2a00" : "white", textAlign: "center", borderRadius: "22px 22px 0 0" }}>
            <p style={{ fontSize: 15, fontWeight: 900, margin: 0, padding: "14px 20px 0", letterSpacing: "-0.3px" }}>🔮 {entry.businessName || "점운"} · AI 사주 분석</p>
            <div style={{ padding: "14px 20px 24px" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🔮</div>
              <h1 style={{ fontSize: 15, fontWeight: 900, margin: "0 0 12px", opacity: 0.9 }}>{entry.name}님의 운세 분석</h1>
              <ScoreCircle score={entry.scores?.total ?? 0} size={130} />
              <p style={{ fontSize: 12, opacity: 0.75, margin: "8px 0 0", fontWeight: 600 }}>총운 점수</p>
            </div>
          </div>
          {(entry.luckyColor || entry.luckyNumber || entry.luckyDirection) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "16px 18px" }}>
              <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>행운 색</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{entry.luckyColor}</div>
              </div>
              <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>행운 숫자</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{entry.luckyNumber}</div>
              </div>
              <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>행운 방향</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{entry.luckyDirection}</div>
              </div>
            </div>
          )}
        </div>

        {/* 분야별 점수 막대 */}
        {entry.scores && (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, padding: "18px 18px 8px" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", marginBottom: 14 }}>📊 분야별 운세 점수</div>
            {[
              { label: "🌟 오늘의 운세", key: "total",   color: "#f59e0b" },
              { label: "💰 재물운",      key: "wealth",  color: "#f59e0b" },
              { label: "💕 연애운",      key: "love",    color: "#ec4899" },
              { label: "💪 건강운",      key: "health",  color: "#10b981" },
              { label: "🎯 성공운",      key: "success", color: "#8b5cf6" },
              { label: "✨ 총운",        key: "total",   color: "#6366f1" },
            ].filter(b => (entry.scores as any)[b.key] != null).map(b => (
              <Bar key={b.label} label={b.label} score={(entry.scores as any)[b.key]} color={b.color} />
            ))}
          </div>
        )}

        {/* 사주팔자 맛보기 */}
        {entry.birthYear && (() => {
          const zodiacList = ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"];
          const ohArr = ["목","목","화","화","토","토","금","금","수","수"];
          const ohEmoji: Record<string,string> = { "목":"🌳","화":"🔥","토":"⛰️","금":"⚪","수":"💧" };
          const ohHanja: Record<string,string> = { "목":"木","화":"火","토":"土","금":"金","수":"水" };
          const y = Number(entry.birthYear);
          const z = zodiacList[((y - 4) % 12 + 12) % 12];
          const oh = ohArr[((y - 4) % 10 + 10) % 10];
          return (
            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, overflow: "hidden" }}>
              <div style={{ background: G, color: "white", padding: "10px 16px", fontSize: 13, fontWeight: 900 }}>🔮 {entry.name}님의 사주팔자 맛보기</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "14px 16px" }}>
                <div style={{ background: BG, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, marginBottom: 3 }}>🐉</div>
                  <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>띠</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e" }}>{z}띠</div>
                </div>
                <div style={{ background: BG, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, marginBottom: 3 }}>{ohEmoji[oh]}</div>
                  <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>오행</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e" }}>{oh}({ohHanja[oh]})</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 카테고리별 카드 */}
        {entry.categories.map((cat, i) => {
          if (cat.isHeader) {
            return (
              <div key={i} style={{ background: cat.color || "#ec4899", borderRadius: 18, padding: "18px 20px", marginBottom: 6, marginTop: i > 0 ? 24 : 0, boxShadow: `0 4px 18px ${cat.color || "#ec4899"}55` }}>
                <p style={{ fontSize: 20, fontWeight: 900, color: "white", margin: "0 0 5px" }}>{cat.label}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600, margin: 0 }}>{cat.text}</p>
              </div>
            );
          }
          const isPackageBadge = cat.badge === "📦 패키지";
          return (
            <div key={i} style={isPackageBadge
              ? { background: "#fdf6e3", borderRadius: 24, border: "1.5px solid rgba(217,180,80,0.45)", marginBottom: 12, boxShadow: "0 2px 14px rgba(217,180,80,0.12)" }
              : { background: "white", borderRadius: 24, border: `1.5px solid ${cat.color}44`, marginBottom: 12 }}>
              <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: isPackageBadge ? "1px solid rgba(217,180,80,0.18)" : "1px solid rgba(236,72,153,0.07)", background: isPackageBadge ? "linear-gradient(90deg, rgba(217,180,80,0.10), transparent)" : "transparent" }}>
                <span style={{ fontSize: 22 }}>{cat.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{cat.label}</span>
                {cat.badge && (
                  <span style={{ fontSize: 10, background: isPackageBadge ? "linear-gradient(135deg, #c026d3, #9333ea)" : G, color: "white", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>{cat.badge}</span>
                )}
              </div>
              <div style={{ padding: "14px 18px 20px" }}>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }}>
                  {cat.text}
                </p>
              </div>
            </div>
          );
        })}

        {/* 나도 무료 사주 받아보기 버튼 */}
        {!entry.businessName && (
          <button onClick={() => window.open("/main-v2", "_blank")}
            style={{ width: "100%", padding: "16px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
            🔮 나도 무료 사주 받아보기
          </button>
        )}

      </div>
    </main>
  );
}
