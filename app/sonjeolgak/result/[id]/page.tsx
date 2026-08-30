"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function getTodayCount(base: number) {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
  const lcg = ((seed * 1103515245 + 12345) & 0x7fffffff) >>> 0;
  const hour = new Date().getHours();
  const block = hour < 8 ? 0 : hour < 16 ? 1 : 2;
  return (base + (lcg % 140) + block * (200 + (lcg % 90))).toLocaleString();
}

type Result = {
  name: string; part: string; partLabel: string; score: number; phone?: string;
  typeName: string; typeEmoji: string; typeColor: string; tagline: string;
  description: string; advice: string;
  bestMatch: string; bestMatchEmoji: string; bestMatchDetail?: string;
  worstMatch: string; worstMatchEmoji: string;
  worstMatchTop3?: { type: string; emoji: string; reason: string }[];
  worstMatchIntro?: string;
  rank: number;
  pastPattern?: string;
  warningSigns?: string[];
  recoveryTip?: string;
  futureForecast?: string;
  actionPlan?: string[];
  darkSide?: string;
  breakupStyle?: string;
  celebTwin?: { name: string; reason: string };
};

export default function SonjeolgakResultPage() {
  const params = useParams();
  const id = params?.id as string;
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [todayCount, setTodayCount] = useState("0");
  const [copied, setCopied] = useState(false);
  const [unlockRemain, setUnlockRemain] = useState("");

  useEffect(() => {
    setTodayCount(getTodayCount(640));

    if (id === "inline") {
      try {
        const raw = sessionStorage.getItem("sonjeolgak_inline_result");
        if (raw) setResult(JSON.parse(raw));
      } catch {}
      setLoading(false);
      return;
    }

    fetch(`/api/sonjeolgak/analyze?id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.result) setResult(d.result); })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!result) return;
    try {
      const until = Number(localStorage.getItem(`sonjeolgak_unlock_until_${result.part}`) || 0);
      const savedPhone = (localStorage.getItem(`sonjeolgak_unlock_phone_${result.part}`) || "").replace(/\D/g, "");
      const resultPhone = (result.phone || "").replace(/\D/g, "");
      if (until > Date.now() && (!savedPhone || !resultPhone || savedPhone === resultPhone)) {
        setPaid(true);
      }
    } catch {}
  }, [result]);

  useEffect(() => {
    if (!paid || !result) return;
    const tick = () => {
      try {
        const until = Number(localStorage.getItem(`sonjeolgak_unlock_until_${result.part}`) || 0);
        const remain = until - Date.now();
        if (remain <= 0) { setPaid(false); setUnlockRemain(""); return; }
        const h = Math.floor(remain / 3600000);
        const m = Math.floor((remain % 3600000) / 60000);
        const s = Math.floor((remain % 60000) / 1000);
        setUnlockRemain(h > 0 ? `${h}시간 ${m}분 남음` : `${m}분 ${s}초 남음`);
      } catch {}
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [paid, result]);

  const handleShare = () => {
    if (!result) return;
    const url = typeof window !== "undefined" ? window.location.href.split("?")[0] : "https://jeomun.com/sonjeolgak";
    const kakao = (window as any).Kakao;
    if (kakao?.isInitialized?.() && kakao?.Share) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: `나의 ${result.partLabel} 손절각은 "${result.typeName}"! 🐱`,
            description: `${result.score}점 — ${result.tagline}. 점운에서 테스트해봐!`,
            imageUrl: "https://i.pinimg.com/736x/a2/e3/2a/a2e32abeae3320baec01b62d54e44751.jpg",
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [
            { title: "결과 보러가기", link: { mobileWebUrl: url, webUrl: url } },
            { title: "나도 해보기 →", link: { mobileWebUrl: "https://jeomun.com/sonjeolgak", webUrl: "https://jeomun.com/sonjeolgak" } },
          ],
        });
        return;
      } catch {}
    }
    const text = `나의 ${result.partLabel} 손절각은 "${result.typeName}"!\n${result.score}점 — ${result.tagline}\n\n점운에서 테스트 → jeomun.com/sonjeolgak`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#0a0015", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
  };

  if (loading) {
    return (
      <div style={S.wrap}><div style={{ ...S.inner, textAlign: "center", paddingTop: 100 }}>
        <div style={{ fontSize: 44 }}>🐱</div>
        <p style={{ color: "#a78bfa" }}>결과 불러오는 중...</p>
      </div></div>
    );
  }

  if (!result) {
    return (
      <div style={S.wrap}><div style={{ ...S.inner, textAlign: "center", paddingTop: 100 }}>
        <p style={{ color: "#9ca3af" }}>결과를 찾을 수 없어요.</p>
        <Link href="/sonjeolgak" style={{ color: "#a78bfa" }}>다시 테스트하기 →</Link>
      </div></div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={{ paddingTop: 28, textAlign: "center", marginBottom: 18 }}>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>{result.partLabel} 손절각 결과</p>
          <h1 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>{result.name}님의 손절각 지수</h1>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${result.typeColor}22, #1a0030)`, border: `1.5px solid ${result.typeColor}55`, borderRadius: 24, padding: "32px 20px", textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 64, marginBottom: 10 }}>{result.typeEmoji}</div>
          <p style={{ fontSize: 22, fontWeight: 900, margin: "0 0 6px", color: result.typeColor }}>{result.typeName}</p>
          <p style={{ fontSize: 13, color: "#d8b4fe", margin: "0 0 16px" }}>{result.tagline}</p>
          <div style={{ fontSize: 40, fontWeight: 900, color: "white" }}>{result.score}<span style={{ fontSize: 16, color: "#9ca3af" }}>점</span></div>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "4px 0 0" }}>상위 {result.rank}%의 손절각을 가지고 있어요</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "18px 18px", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 900, margin: "0 0 8px", color: "#e9d5ff" }}>🐾 이런 성향이에요</p>
          <p style={{ fontSize: 13.5, color: "#e5e7eb", lineHeight: 1.7, margin: 0 }}>{result.description}</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "18px 18px", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 900, margin: "0 0 8px", color: "#e9d5ff" }}>💡 이렇게 해보세요</p>
          <p style={{ fontSize: 13.5, color: "#e5e7eb", lineHeight: 1.7, margin: 0 }}>{result.advice}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 16, padding: "14px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "#4ade80", margin: "0 0 6px", fontWeight: 900 }}>궁합 좋은 유형</p>
            <div style={{ fontSize: 26 }}>{result.bestMatchEmoji}</div>
            <p style={{ fontSize: 12.5, fontWeight: 700, margin: 0 }}>{result.bestMatch}</p>
          </div>
          <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 16, padding: "14px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "#f87171", margin: "0 0 6px", fontWeight: 900 }}>부딪히는 유형</p>
            <div style={{ fontSize: 26 }}>{result.worstMatchEmoji}</div>
            <p style={{ fontSize: 12.5, fontWeight: 700, margin: 0 }}>{result.worstMatch}</p>
          </div>
        </div>

        <button onClick={handleShare} style={{ width: "100%", background: copied ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg,#a78bfa,#7c3aed)", border: copied ? "1.5px solid #22c55e" : "none", borderRadius: 16, padding: "15px", color: "white", fontSize: 14.5, fontWeight: 900, cursor: "pointer", marginBottom: 12, boxShadow: copied ? "none" : "0 4px 20px rgba(124,58,237,0.4)" }}>
          {copied ? "✅ 복사됐어요!" : "📤 친구에게 공유하기"}
        </button>

        {paid && unlockRemain && (
          <div style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 12, padding: "9px 14px", textAlign: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: "#f9a8d4", fontWeight: 700 }}>⏱️ 심층 분석 이용 가능: {unlockRemain}</span>
          </div>
        )}

        {paid ? (
          <>
            {result.pastPattern && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 10px", color: "#60a5fa" }}>🕰️ 과거 패턴 분석</p>
                <p style={{ fontSize: 13.5, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{result.pastPattern}</p>
              </div>
            )}

            {result.warningSigns && result.warningSigns.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 10px", color: "#f87171" }}>🚨 위험 신호 3가지</p>
                {result.warningSigns.map((w, i) => (
                  <p key={i} style={{ fontSize: 13.5, color: "#d1d5db", lineHeight: 1.9, margin: "0 0 6px" }}>• {w}</p>
                ))}
              </div>
            )}

            {result.recoveryTip && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 10px", color: "#4ade80" }}>🩹 회복 팁</p>
                <p style={{ fontSize: 13.5, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{result.recoveryTip}</p>
              </div>
            )}

            {result.futureForecast && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 10px", color: "#a78bfa" }}>🔮 앞으로의 관계운</p>
                <p style={{ fontSize: 13.5, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{result.futureForecast}</p>
              </div>
            )}

            {result.actionPlan && result.actionPlan.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 10px", color: "#fbbf24" }}>✅ 액션플랜 3단계</p>
                {result.actionPlan.map((a, i) => (
                  <p key={i} style={{ fontSize: 13.5, color: "#d1d5db", lineHeight: 1.9, margin: "0 0 6px" }}>{i + 1}. {a}</p>
                ))}
              </div>
            )}

            {result.darkSide && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 10px", color: "#f87171" }}>🌑 숨겨진 어두운 면</p>
                <p style={{ fontSize: 13.5, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{result.darkSide}</p>
              </div>
            )}

            {result.breakupStyle && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 10px", color: "#ec4899" }}>💔 이별·손절 스타일</p>
                <p style={{ fontSize: 13.5, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{result.breakupStyle}</p>
              </div>
            )}

            {result.celebTwin && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 10px", color: "#22d3ee" }}>⭐ 나와 닮은 유명인</p>
                <p style={{ fontSize: 17, fontWeight: 900, margin: "0 0 8px", color: "white" }}>{result.celebTwin.name}</p>
                <p style={{ fontSize: 13.5, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{result.celebTwin.reason}</p>
              </div>
            )}

            {result.bestMatchDetail && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 10px", color: "#34d399" }}>💚 {result.bestMatch}과(와) 잘 맞는 이유</p>
                <p style={{ fontSize: 13.5, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{result.bestMatchDetail}</p>
              </div>
            )}

            {result.worstMatchTop3 && result.worstMatchTop3.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 10px", color: "#fb923c" }}>⚠️ 부딪히는 유형 TOP3</p>
                {result.worstMatchIntro && (
                  <p style={{ fontSize: 12.5, color: "#9ca3af", lineHeight: 1.7, margin: "0 0 14px" }}>{result.worstMatchIntro}</p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {result.worstMatchTop3.map((w, i) => (
                    <div key={i} style={{ background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.25)", borderRadius: 14, padding: "14px 14px" }}>
                      <p style={{ fontSize: 12, fontWeight: 900, margin: "0 0 6px", color: "#fdba74" }}>{i + 1}위 · {w.emoji} {w.type}</p>
                      <p style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.8, margin: 0 }}>{w.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.18),rgba(236,72,153,0.12))", border: "1.5px solid rgba(236,72,153,0.4)", borderRadius: 20, padding: "22px 18px", marginBottom: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 12px", textAlign: "center" }}>🔒 {result.typeName}의 심층 분석 10가지</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
              {[
                "🕰️ 과거 패턴 분석",
                "🚨 위험 신호 3가지",
                "🩹 회복 팁",
                "🔮 앞으로의 관계운",
                "✅ 액션플랜 3단계",
                "🌑 숨겨진 어두운 면",
                "💔 이별·손절 스타일",
                "⭐ 나와 닮은 유명인",
                "💚 궁합 좋은 이유 상세",
                "⚠️ 부딪히는 유형 TOP3",
              ].map(item => (
                <div key={item} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "9px 12px", fontSize: 12.5, color: "#e9d5ff" }}>{item}</div>
              ))}
            </div>
            <p style={{ fontSize: 11.5, color: "#a78bfa", margin: "0 0 14px", textAlign: "center" }}>결제 후 24시간 열람 가능합니다</p>
            <button onClick={() => { window.location.href = `/sonjeolgak/pay?part=${result.part}&rid=${id}`; }}
              style={{ width: "100%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", border: "none", borderRadius: 16, padding: "14px", fontSize: 14.5, fontWeight: 900, cursor: "pointer" }}>
              ₩990으로 심층 분석 전체 열기 →
            </button>
          </div>
        )}

        <Link href="/sonjeolgak" style={{ display: "block", textAlign: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: "14px", color: "#e5e7eb", fontSize: 13.5, fontWeight: 700, textDecoration: "none", marginBottom: 12 }}>
          🐾 나도 손절각 해보기 (무료) →
        </Link>

        <a href="/main-v2" style={{ display: "block", textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "12px", color: "#9ca3af", fontSize: 12.5, textDecoration: "none", marginBottom: 20 }}>
          🔮 이 관계, 사주로도 궁금하다면 → 점운 사주 990원
        </a>

        <div style={{ background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.15)", borderRadius: 12, padding: "10px 16px", marginBottom: 20, textAlign: "center" }}>
          <span style={{ fontSize: 12, color: "#f9a8d4" }}>오늘 <b style={{ color: "#ec4899" }}>{todayCount}명</b>이 손절각을 확인했어요</span>
        </div>

        <div style={{ maxWidth: 380, margin: "0 auto", padding: "20px 18px", borderRadius: 20, background: "#0a0020", border: "1px solid rgba(255,255,255,0.15)" }}>
          <p style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700, margin: "0 0 10px" }}>© 2026 점운 · Powered by 점운</p>
          <div style={{ color: "#94a3b8", fontSize: 10.5, lineHeight: 1.9, marginBottom: 14 }}>
            <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신</p>
            <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
            <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
            <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38,<br />7층 7017호(대치동)</p>
            <p style={{ margin: 0 }}>대표전화 010-2106-2689 · 유선 031-585-7255</p>
            <p style={{ margin: "4px 0 0", color: "#f87171", fontWeight: 900, fontSize: 11 }}>※ 전화 문의는 받지 않습니다.<br />카카오톡으로 문의해 주세요.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 12 }}>
            <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "7px 18px", background: "#FEE500", color: "#1a1a1a", borderRadius: 20, textDecoration: "none", fontWeight: 900, fontSize: 12 }}>💬 카카오톡 문의</a>
            <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ display: "inline-block", padding: "7px 18px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, color: "#e2e8f0", textDecoration: "none", fontWeight: 700, fontSize: 12 }}>📧 이메일 문의</a>
          </div>
          <div style={{ fontSize: 11, display: "flex", justifyContent: "center", gap: 12 }}>
            <Link href="/terms" style={{ color: "#6b7280", textDecoration: "none" }}>이용약관</Link>
            <Link href="/privacy" style={{ color: "#6b7280", textDecoration: "none" }}>개인정보처리방침</Link>
            <Link href="/refund" style={{ color: "#6b7280", textDecoration: "none" }}>환불정책</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
