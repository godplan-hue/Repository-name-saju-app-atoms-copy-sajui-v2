"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

type Detail = {
  title: string; icon: string; income: string;
  why: string; howToStart: string[]; platforms: string[]; timeline: string; trap: string;
};
type Result = { name: string; phone?: string; birthYear?: number; recommended: string[]; details: Detail[]; createdAt: number };

const GAN_OH = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];

const OH_DATA: Record<string, { color: string; bg: string; emoji: string; trait: string; jobs: string[]; desc: string }> = {
  목: { color: "#22c55e", bg: "rgba(34,197,94,0.12)", emoji: "🌿", trait: "성장·배움형 천직", jobs: ["교육자", "상담사", "기획자", "콘텐츠크리에이터"], desc: "목 오행은 성장과 발전을 이끄는 기운입니다. 사람을 키우고 아이디어를 자라게 하는 방향에서 가장 빛나며, 강의·콘텐츠·코칭 부업이 천직과 맞닿아 있습니다." },
  화: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", emoji: "🔥", trait: "열정·영향력형 천직", jobs: ["마케터", "강사", "크리에이터", "영업인"], desc: "화 오행은 열정과 빛을 발산하는 기운입니다. 사람들을 움직이고 영향력을 펼치는 방향에서 에너지가 폭발하며, 콘텐츠·강의 부업에서 특히 빛납니다." },
  토: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", emoji: "🌍", trait: "안정·신뢰형 천직", jobs: ["관리자", "컨설턴트", "부동산", "요식업"], desc: "토 오행은 안정과 신뢰를 쌓는 기운입니다. 오래 지속되는 비즈니스에서 최고의 실력을 발휘하며, 컨설팅·유통·부동산 부업과 잘 맞습니다." },
  금: { color: "#6366f1", bg: "rgba(99,102,241,0.12)", emoji: "💎", trait: "정밀·전문형 천직", jobs: ["금융인", "IT개발자", "데이터분석가", "번역가"], desc: "금 오행은 정밀함과 전문성의 기운입니다. 논리적·전문적 분야에서 두각을 나타내며, AI·분석·번역·IT 부업에서 독보적인 강점을 발휘합니다." },
  수: { color: "#3b82f6", bg: "rgba(59,130,246,0.12)", emoji: "💧", trait: "창의·통찰형 천직", jobs: ["작가", "AI전문가", "연구자", "예술가"], desc: "수 오행은 깊은 통찰과 창의력의 기운입니다. 남들이 보지 못하는 것을 보는 능력으로, 글쓰기·AI·번역 부업에서 독보적인 실력을 발휘합니다." },
};

const RANK_BADGE = ["🥇 1순위 추천", "🥈 2순위 추천", "🥉 3순위 추천"];
const RANK_BG = ["rgba(124,58,237,0.22)", "rgba(255,255,255,0.07)", "rgba(255,255,255,0.04)"];
const RANK_BORDER = ["rgba(124,58,237,0.55)", "rgba(255,255,255,0.13)", "rgba(255,255,255,0.08)"];

export default function JigunResultPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockRemain, setUnlockRemain] = useState("");

  useEffect(() => {
    if (!id) return;
    // 결제 직후 URL param으로 즉시 열기 + localStorage 설정
    if (new URLSearchParams(window.location.search).get("paid") === "1") {
      localStorage.setItem("jigun_unlock_until", String(Date.now() + 24*60*60*1000));
    }

    fetch(`/api/career/analyze?id=${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.result) {
          setResult(d.result);
        } else {
          setErr("결과를 찾을 수 없어요.");
        }
      })
      .catch(() => setErr("불러오기 실패"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    const update = () => {
      const u = localStorage.getItem("jigun_unlock_until");
      if (!u) { setIsUnlocked(false); setUnlockRemain(""); return; }
      const ms = Number(u) - Date.now();
      if (ms <= 0) { localStorage.removeItem("jigun_unlock_until"); setIsUnlocked(false); setUnlockRemain(""); return; }
      const _up = localStorage.getItem("jigun_unlock_phone")||""; const _rp=(result?.phone||"").replace(/\D/g,""); if(_up&&_rp&&_up!==_rp){setIsUnlocked(false);setUnlockRemain("");return;}
      setIsUnlocked(true);
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setUnlockRemain(h > 0 ? `${h}시간 ${m}분 남음` : `${m}분 ${s}초 남음`);
    };
    update();
    timerId = setInterval(update, 1000);
    return () => clearInterval(timerId);
  }, [result]);

  function share() {
    const url = window.location.href.split("?")[0];
    const kakao = (window as any).Kakao;
    if (kakao?.isInitialized() && kakao?.Share) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "💼 직운 — 내 부업 추천 결과",
            description: "사주 오행으로 찾은 나만의 부업 TOP3! 점운에서 무료로 확인해봐!",
            imageUrl: "https://i.pinimg.com/1200x/d2/bb/fc/d2bbfc234fc1e0e5eedf218d4cf9bfe4.jpg",
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [
            { title: "내 부업 결과 보기 💼", link: { mobileWebUrl: url, webUrl: url } },
            { title: "나도 해보기 →", link: { mobileWebUrl: "https://jeomun.com/jigun", webUrl: "https://jeomun.com/jigun" } },
          ],
        });
        return;
      } catch {}
    }
    navigator.clipboard?.writeText(url);
    alert("링크가 복사됐어요!");
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#030014", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 12, animation: "spin 1s linear infinite" }}>💼</div>
        <p style={{ color: "rgba(255,255,255,0.6)" }}>분석 중...</p>
      </div>
    </div>
  );

  if (err || !result) return (
    <div style={{ minHeight: "100vh", background: "#030014", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#ef4444", marginBottom: 12 }}>{err || "결과 없음"}</p>
        <Link href="/jigun" style={{ color: "#a78bfa", textDecoration: "none" }}>← 다시 하기</Link>
      </div>
    </div>
  );

  const by = result.birthYear;
  const oh = by ? GAN_OH[Math.abs((by - 4) % 10)] : null;
  const ohInfo = oh ? OH_DATA[oh] : null;

  return (
    <div style={{ minHeight: "100vh", background: "#030014", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color: "white", wordBreak: "keep-all" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 85% 55% at 50% -8%,rgba(124,58,237,0.14),transparent 55%)" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 520, margin: "0 auto", padding: "0 20px 48px" }}>

        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
          <Link href="/jigun" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>← 직운</Link>
          <button onClick={share} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            공유하기 📤
          </button>
        </div>

        {/* 타이틀 */}
        <div style={{ textAlign: "center", padding: "16px 0 24px" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>{result.name}님의 직운 분석 결과</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 6px" }}>추천 부업 TOP 3</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>지금 바로 시작할 수 있는 맞춤 부업이에요</p>
        </div>

        {/* 오행 천직 배너 */}
        {ohInfo && (
          <div style={{ background: ohInfo.bg, border: `1px solid ${ohInfo.color}40`, borderRadius: 20, padding: "22px 20px", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ fontSize: 36 }}>{ohInfo.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: ohInfo.color, fontWeight: 700, marginBottom: 4 }}>
                  ✨ 사주 오행 · {by}년생 · {oh}(木火土金水) 기운
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>{ohInfo.trait}</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 10px" }}>{ohInfo.desc}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ohInfo.jobs.map(j => (
                    <span key={j} style={{ background: `${ohInfo.color}22`, color: ohInfo.color, borderRadius: 10, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{j}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 잠금 해제 타이머 */}
        {isUnlocked && unlockRemain && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 99, padding: "6px 14px", fontSize: 12, color: "#4ade80", fontWeight: 700, marginBottom: 14 }}>
            ✅ 잠금해제 · {unlockRemain}
          </div>
        )}

        {/* 부업 TOP 3 */}
        {result.details.map((d, i) => {
          const isLocked = !isUnlocked && i > 0;
          return (
            <div key={i} style={{ position: "relative", marginBottom: 14 }}>
              <div style={{
                background: RANK_BG[i], border: `2px solid ${RANK_BORDER[i]}`, borderRadius: 22, padding: "24px 20px",
                filter: isLocked ? "blur(4px)" : "none",
                userSelect: isLocked ? "none" : "auto",
                pointerEvents: isLocked ? "none" : "auto",
              }}>
                {/* 헤더 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 36 }}>{d.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700, marginBottom: 2 }}>{RANK_BADGE[i]}</div>
                      <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>{d.title}</h2>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#22c55e" }}>{d.income}</div>
                  </div>
                </div>

                {/* 왜 맞는지 */}
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: 0 }}>{d.why}</p>
                </div>

                {/* 시작 방법 */}
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", margin: "0 0 8px" }}>🚀 지금 당장 시작하는 3단계</p>
                  {d.howToStart.slice(0, 3).map((s, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ background: "rgba(124,58,237,0.5)", color: "white", borderRadius: 6, padding: "2px 7px", fontSize: 11, fontWeight: 900, minWidth: 20, textAlign: "center", flexShrink: 0 }}>{j + 1}</span>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.65 }}>{s}</p>
                    </div>
                  ))}
                </div>

                {/* 플랫폼 */}
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 6px", fontWeight: 700 }}>주요 플랫폼</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {d.platforms.map(p => (
                      <span key={p} style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)", borderRadius: 10, padding: "3px 10px", fontSize: 11 }}>{p}</span>
                    ))}
                  </div>
                </div>

                {/* 주의사항 */}
                <div style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
                  <p style={{ fontSize: 11, color: "rgba(234,179,8,0.85)", margin: 0, whiteSpace: "pre-line" }}>⚠️ 함정 주의: {d.trap}</p>
                </div>

                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>📅 예상 타임라인: {d.timeline}</p>
              </div>

              {/* 잠금 오버레이 */}
              {isLocked && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 22, background: "rgba(3,0,20,0.7)", backdropFilter: "blur(2px)" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
                  <p style={{ fontSize: 14, fontWeight: 900, color: "white", margin: "0 0 4px", textAlign: "center" }}>{RANK_BADGE[i]} 잠금</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "0 0 14px", textAlign: "center" }}>990원 결제 후 24시간 전체 열람 가능</p>
                  <a href={`/jigun/pay?id=${id}`} style={{ display: "inline-block", background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", borderRadius: 20, padding: "10px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                    ₩990 결제하고 전체 보기 →
                  </a>
                </div>
              )}
            </div>
          );
        })}

        {/* 파트너 카드 */}
        <div style={{ background: "linear-gradient(135deg,#0f172a,#1e1b4b)", border: "2px solid rgba(124,58,237,0.5)", borderRadius: 22, padding: "24px 20px", marginBottom: 14 }}>
          <div style={{ display: "inline-block", background: "#dc2626", color: "white", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, marginBottom: 10 }}>🔥 투자 0원 즉시 시작 가능</div>
          <h3 style={{ fontSize: 17, fontWeight: 900, margin: "0 0 8px" }}>점운 파트너 — 내 SNS로 AI 사주 판매</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 16px", lineHeight: 1.75 }}>
            재고 없음 · 초기 투자 0원 · 결제·분석·고객관리 모두 자동<br />
            내 카카오·인스타 링크 공유만 하면 수익이 납니다
          </p>
          <Link href="/partner" target="_blank" style={{ display: "inline-block", background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", borderRadius: 22, padding: "12px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            파트너 무료 신청하기 →
          </Link>
        </div>

        {/* 사주 더 깊이 */}
        <div style={{ background: "linear-gradient(135deg,#1a1a2e,#2d1b69)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 22, padding: "24px 20px", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: "#a78bfa", margin: "0 0 6px" }}>🔮 사주로 더 정확하게 확인하기</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 16px", lineHeight: 1.75 }}>
            "지금이 이직·창업 타이밍인지",<br />
            "올해가 재물운이 강한 해인지"<br />
            사주 직업운·대운으로 훨씬 정확하게 알 수 있어요
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/main-v2" target="_blank" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", borderRadius: 20, padding: "10px 20px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              직업·재물운 사주 보기 →
            </Link>
            <Link href="/main-v2/daewoon" target="_blank" style={{ background: "rgba(255,255,255,0.1)", color: "white", borderRadius: 20, padding: "10px 20px", fontSize: 13, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              나의 대운 확인 →
            </Link>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/jigun" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>다시 추천받기 →</Link>
        </div>
      </div>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const k = (window as any).Kakao;
          if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }}
      />
    </div>
  );
}
