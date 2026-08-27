"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

type FreeResult = {
  temperature: number;
  relationType: string;
  statusText: string;
  initiativeLabel: string;
  initiativePercentMine: number;
  topSignalTitle: string;
  topSignalDesc: string;
  simpleAdvice: string;
};

type Item = { no: number; key: string; title: string; score: number | null; state: string; why: string; action: string };

type Result = {
  relationType: string;
  targetNickname: string;
  name?: string;
  phone?: string;
  freeScore: number;
  freeResult: FreeResult;
  paidResult: Item[];
};

function getTempColor(t: number) {
  if (t >= 80) return "#4ade80";
  if (t >= 65) return "#22d3ee";
  if (t >= 50) return "#facc15";
  if (t >= 35) return "#fb923c";
  return "#f87171";
}

function getTodayCount() {
  const now = new Date();
  const seed = (now.getDate() * 31 + now.getMonth() * 7) % 60;
  const h = now.getHours();
  const base = 610;
  if (h >= 6 && h < 12) return base + seed + 30;
  if (h >= 12 && h < 18) return base + seed + 90;
  if (h >= 18 && h < 24) return base + seed + 140;
  return base + seed + 15;
}

export default function GwangyeoradarResultPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [unlockRemain, setUnlockRemain] = useState("");
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    setTodayCount(getTodayCount());
    const checkPaid = (resultPhone?: string) => {
      const unlock = localStorage.getItem("gwangyeoradar_unlock_until");
      if (unlock && Number(unlock) > Date.now()) {
        const _up = localStorage.getItem("gwangyeoradar_unlock_phone") || "";
        const _rp = (resultPhone || "").replace(/\D/g, "");
        setPaid(!_up || !_rp || _up === _rp);
      } else { setPaid(false); }
    };
    checkPaid();
    if (!id) return;
    fetch(`/api/gwangyeoradar/analyze?id=${id}`)
      .then(r => r.json())
      .then(data => { if (data.result) { setResult(data.result); checkPaid(data.result.phone); } setLoading(false); })
      .catch(() => setLoading(false));

    let timerId: ReturnType<typeof setInterval>;
    const updateCountdown = () => {
      const u = localStorage.getItem("gwangyeoradar_unlock_until");
      if (!u) { setPaid(false); setUnlockRemain(""); clearInterval(timerId); return; }
      const ms = Number(u) - Date.now();
      if (ms <= 0) {
        localStorage.removeItem("gwangyeoradar_unlock_until");
        setPaid(false); setUnlockRemain(""); clearInterval(timerId); return;
      }
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setUnlockRemain(h > 0 ? `${h}시간 ${m}분 남음` : `${m}분 ${s}초 남음`);
    };
    timerId = setInterval(updateCountdown, 1000);
    return () => clearInterval(timerId);
  }, [id]);

  const share = () => {
    const url = `https://jeomun.com/gwangyeoradar/result/${id}`;
    const title = "내 관계 결과를 확인했어요";
    const desc = "내 관계에 숨겨진 신호가 있다고 해서 분석해봤는데 생각보다 소름…";
    const kakao = (window as any).Kakao;
    if (kakao?.isInitialized() && kakao?.Share) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: { title, description: desc, imageUrl: "https://images.unsplash.com/photo-1591347887817-173e3d5c4891?w=1200&q=80", link: { mobileWebUrl: url, webUrl: url } },
          buttons: [
            { title: "결과 보기 📡", link: { mobileWebUrl: url, webUrl: url } },
            { title: "나도 해보기 →", link: { mobileWebUrl: "https://jeomun.com/gwangyeoradar", webUrl: "https://jeomun.com/gwangyeoradar" } },
          ],
        });
        return;
      } catch {}
    }
    window.location.href = `kakaotalk://msg/send?text=${encodeURIComponent(title + "\n" + desc + "\n" + url)}`;
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#071019", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
    card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "18px 16px", marginBottom: 14 },
    secTitle: { fontSize: 11.5, fontWeight: 900, color: "#67e8f9", margin: "0 0 8px", letterSpacing: "0.03em" },
    body: { fontSize: 13.5, color: "#d1d5db", lineHeight: 1.75, margin: 0, whiteSpace: "pre-line" as const },
    lockCard: { background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(8,145,178,0.4)", borderRadius: 20, padding: "24px 18px", marginBottom: 16, textAlign: "center" as const },
  };

  if (loading) {
    return (
      <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
          <p style={{ color: "#67e8f9" }}>관계 신호 분석 중...</p>
        </div>
      </div>
    );
  }
  if (!result) {
    return (
      <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <p style={{ color: "#9ca3af", marginBottom: 16 }}>결과를 찾을 수 없어요</p>
          <Link href="/gwangyeoradar" style={{ color: "#67e8f9" }}>새로 분석하기</Link>
        </div>
      </div>
    );
  }

  const f = result.freeResult;
  const tColor = getTempColor(f.temperature);
  const target = result.targetNickname || "그 사람";

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        {/* 헤더 */}
        <div style={{ paddingTop: 32, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/gwangyeoradar" style={{ color: "#67e8f9", fontSize: 13, textDecoration: "none" }}>← 다시 분석하기</Link>
          <button onClick={share} style={{ background: "rgba(8,145,178,0.2)", border: "1px solid rgba(8,145,178,0.5)", borderRadius: 20, padding: "6px 14px", color: "#a5f3fc", fontSize: 12, cursor: "pointer" }}>
            공유하기 📤
          </button>
        </div>

        <p style={{ fontSize: 11, letterSpacing: "0.1em", color: "#67e8f9", fontWeight: 900, margin: "0 0 14px", textAlign: "center" }}>📡 연락통신 · 연락기록통계 결과</p>

        {todayCount > 0 && (
          <div style={{ background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.25)", borderRadius: 12, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📶</span>
            <span style={{ fontSize: 13, color: "#a5f3fc" }}>오늘 <b style={{ color: "#22d3ee" }}>{todayCount.toLocaleString()}명</b>이 관계 신호를 확인했어요</span>
          </div>
        )}

        {/* 메인 온도 카드 (무료 공개) */}
        <div style={{ background: "linear-gradient(135deg,#04222f,#0c3a4d)", border: `2px solid ${tColor}55`, borderRadius: 24, padding: "24px 18px", marginBottom: 16, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 6px", letterSpacing: "0.05em" }}>{target}님과의 관계</p>
          <p style={{ fontSize: 12, color: "#67e8f9", margin: "0 0 16px" }}>{f.relationType} · 관계 온도</p>

          <div style={{ fontSize: 64, fontWeight: 900, color: tColor, lineHeight: 1 }}>{f.temperature}°</div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 8, overflow: "hidden", margin: "16px 0 14px" }}>
            <div style={{ width: `${f.temperature}%`, height: "100%", background: `linear-gradient(90deg,#0891b2,${tColor})`, borderRadius: 99 }} />
          </div>
          <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8, margin: "0 0 16px" }}>{f.statusText}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, textAlign: "left" as const }}>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 12px" }}>
              <p style={{ fontSize: 10.5, color: "#67e8f9", margin: "0 0 4px" }}>연락 주도권</p>
              <p style={{ fontSize: 12.5, color: "#e2e8f0", margin: 0, lineHeight: 1.5 }}>{f.initiativeLabel} (나 {f.initiativePercentMine}%)</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 12px" }}>
              <p style={{ fontSize: 10.5, color: "#67e8f9", margin: "0 0 4px" }}>가장 강한 신호</p>
              <p style={{ fontSize: 12.5, color: "#e2e8f0", margin: 0, lineHeight: 1.5 }}>{f.topSignalTitle}</p>
            </div>
          </div>
        </div>

        <div style={S.card}>
          <p style={S.secTitle}>🧭 가장 눈에 띄는 신호</p>
          <p style={{ ...S.body, marginBottom: 10 }}>{f.topSignalDesc}</p>
          <p style={S.secTitle}>💡 지금 해볼 만한 것</p>
          <p style={S.body}>{f.simpleAdvice}</p>
        </div>

        {/* 공유 버튼 */}
        <button onClick={share} style={{ width: "100%", background: "rgba(8,145,178,0.15)", border: "2px solid rgba(8,145,178,0.4)", borderRadius: 14, padding: "13px", fontSize: 14, fontWeight: 700, color: "#a5f3fc", cursor: "pointer", marginBottom: 16 }}>
          📡 내 관계 온도 {f.temperature}° — 친구에게 공유하기
        </button>

        {/* 잠금 / 27개 정밀 지표 */}
        {!paid ? (
          <div style={S.lockCard}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>🔒</div>
            <p style={{ fontSize: 17, fontWeight: 900, margin: "0 0 8px" }}>나머지 22개 관계 신호가 발견되었습니다</p>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 18px", lineHeight: 1.7 }}>
              연락 패턴 정밀 분석 · 관계 위험 신호<br />
              회복 가능성 · 오해 가능성 · 관계 피로도<br />
              지금 해야 할 행동과 피해야 할 행동까지
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {["📶 연락빈도 변화", "⏱ 답장속도 변화", "⚖️ 관계균형", "🌡 관계피로도", "⚠️ 관계위험신호", "🔁 회복가능성", "🧾 행동 처방전", "🧭 놓친 신호"].map(item => (
                <div key={item} style={{ background: "rgba(8,145,178,0.12)", border: "1px solid rgba(8,145,178,0.25)", borderRadius: 10, padding: "10px 8px", fontSize: 12, color: "#a5f3fc", textAlign: "center" }}>
                  {item}
                </div>
              ))}
            </div>
            <button onClick={() => { window.location.href = `/gwangyeoradar/pay?id=${id}`; }}
              style={{ width: "100%", background: "linear-gradient(135deg,#0891b2,#0ea5e9)", color: "white", border: "none", borderRadius: 18, padding: "15px", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
              ₩990 · 지금 바로 전체 보기 →
            </button>
            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>24시간 이용 가능</p>
          </div>
        ) : (
          <>
            {unlockRemain && (
              <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 10, padding: "8px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>⏱️</span>
                <span style={{ fontSize: 12, color: "#4ade80" }}>이용 가능: <b>{unlockRemain}</b></span>
              </div>
            )}

            <p style={{ fontSize: 13, fontWeight: 900, color: "#67e8f9", margin: "4px 0 12px" }}>📡 연락기록통계 정밀분석 · 27개 지표 전체</p>

            {result.paidResult.map(item => (
              <div key={item.no} style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10 }}>
                  <p style={{ ...S.secTitle, margin: 0 }}>{item.no}. {item.title}</p>
                  {item.score !== null && (
                    <span style={{ flexShrink: 0, fontSize: 15, fontWeight: 900, color: "#22d3ee" }}>{item.score}</span>
                  )}
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: "0 0 8px" }}>{item.state}</p>
                <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "0 0 8px", lineHeight: 1.65 }}>
                  <span style={{ color: "#67e8f9", fontWeight: 700 }}>왜 이렇게 나왔나요? </span>{item.why}
                </p>
                <p style={{ fontSize: 12.5, color: "#d1d5db", margin: 0, lineHeight: 1.65, whiteSpace: "pre-line" }}>
                  <span style={{ color: "#67e8f9", fontWeight: 700 }}>어떻게 하면 좋을까요? </span>{item.action}
                </p>
              </div>
            ))}
          </>
        )}

        {/* 나도 해보기 */}
        <Link href="/gwangyeoradar" style={{ display: "block", textAlign: "center" as const, background: "rgba(8,145,178,0.1)", border: "1.5px solid rgba(8,145,178,0.4)", borderRadius: 16, padding: "14px", color: "#67e8f9", textDecoration: "none", fontSize: 14, fontWeight: 900, marginBottom: 12 }}>
          나도 연락기록통계 해보기 →
        </Link>

        {/* 사주 연결 CTA */}
        <div style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.18),rgba(192,132,252,0.1))", border: "1px solid rgba(192,132,252,0.35)", borderRadius: 18, padding: "20px 18px", marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 900, margin: "0 0 6px", color: "#e9d5ff" }}>💡 연락 패턴만으로는 다 알 수 없어요</p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 16px", lineHeight: 1.6 }}>사주로 보면 이 사람과의 인연·궁합·연애운까지<br />훨씬 깊이 있게 알 수 있어요.</p>
          <Link href="/main-v2" style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius: 14, padding: "13px", color: "white", textDecoration: "none", fontSize: 15, fontWeight: 900, boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
            사주 연애운 완전 분석하기 →
          </Link>
          <p style={{ fontSize: 11, color: "rgba(167,139,250,0.5)", margin: "8px 0 0", textAlign: "center" }}>990원 · 단 1회 결제 · 반복청구 없음</p>
        </div>

        <button onClick={share}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "13px", color: "#a5f3fc", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          📤 결과 공유하기
        </button>

        <p style={{ fontSize: 11, color: "#4b5563", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
          점운 · 탈잉 2년 연속 1위 강사가 설계한 AI 운세<br />누적 수강생 1,000명+
        </p>
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
