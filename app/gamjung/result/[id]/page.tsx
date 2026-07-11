"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface GResult {
  name: string;
  moodScore: number;
  moodLabel: string;
  moodEmoji: string;
  activities: string[];
  memo: string;
  oh: string;
  ohEmoji: string;
  ohKeyword: string;
  ohBg: string;
  ohMessages: string[];
  ohTips: string[];
  createdAt: number;
}

const ACT_MAP: Record<string, { label: string; emoji: string }> = {
  sleep:    { label: "수면",        emoji: "💤" },
  exercise: { label: "운동",        emoji: "🏃" },
  food:     { label: "맛있는 음식", emoji: "🍽️" },
  reading:  { label: "독서",        emoji: "📚" },
  friends:  { label: "친구",        emoji: "👫" },
  family:   { label: "가족",        emoji: "👨‍👩‍👧" },
  date:     { label: "데이트",      emoji: "💑" },
  alone:    { label: "혼자 시간",   emoji: "🧘" },
  work:     { label: "일·업무",     emoji: "💼" },
  study:    { label: "공부",        emoji: "📖" },
  creative: { label: "창작·취미",   emoji: "🎨" },
  shopping: { label: "쇼핑",        emoji: "🛍️" },
  travel:   { label: "나들이",      emoji: "🚶" },
  movie:    { label: "영화·TV",     emoji: "📺" },
  music:    { label: "음악",        emoji: "🎵" },
};

const MOOD_COLORS: Record<number, string> = {
  5: "#fbbf24", 4: "#4ade80", 3: "#93c5fd", 2: "#a78bfa", 1: "#f87171",
};

export default function GamjungResultPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [result, setResult] = useState<GResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    // sessionStorage에 캐시된 결과 먼저 확인 (폼에서 방금 넘어온 경우)
    try {
      const cached = sessionStorage.getItem(`gamjung_result_${id}`);
      if (cached) {
        setResult(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch {}
    // 캐시 없으면 API 조회 (직접 URL 접근 등)
    fetch(`/api/gamjung/analyze?id=${id}`)
      .then(r => r.json())
      .then(data => { if (data.result) setResult(data.result); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // result 로드 완료 시 기록 저장 — early return 전에 위치해야 Rules of Hooks 준수
  useEffect(() => {
    if (!result || !id) return;
    try {
      const h = JSON.parse(localStorage.getItem("gamjung_history") || "[]");
      if (!h.some((e: {id: string}) => e.id === id)) {
        h.unshift({ id, moodLabel: result.moodLabel, moodEmoji: result.moodEmoji, createdAt: result.createdAt });
        localStorage.setItem("gamjung_history", JSON.stringify(h.slice(0, 50)));
      }
    } catch {}
  }, [result, id]);

  const share = useCallback(() => {
    if (!result) return;
    const text = `오늘 기분: ${result.moodLabel} ${result.moodEmoji}\n오행 에너지: ${result.oh}(${result.ohEmoji}) — ${result.ohKeyword}\n\n${result.ohMessages[0]}\n\n✨ 점운 감정일기 — jeomun.com/gamjung`;
    if (navigator.share) navigator.share({ title: "점운 감정일기", text });
    else { navigator.clipboard.writeText(text); alert("클립보드에 복사됐어요 😊"); }
  }, [result]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f1a14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#4ade80", fontSize: 16 }}>감정 분석 중... 🌿</p>
    </div>
  );

  if (!result) return (
    <div style={{ minHeight: "100vh", background: "#0f1a14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#f87171" }}>결과를 불러올 수 없어요.</p>
    </div>
  );

  const moodColor = MOOD_COLORS[result.moodScore] || "#4ade80";

  return (
    <div style={{ minHeight: "100vh", background: "#0f1a14", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ paddingTop: 32, marginBottom: 24 }}>
          <Link href="/gamjung" style={{ color: "#4ade80", fontSize: 13, textDecoration: "none" }}>← 다시 기록하기</Link>
        </div>

        {/* 오늘 기분 */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 80, marginBottom: 8 }}>{result.moodEmoji}</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px", color: moodColor }}>
            오늘 기분: {result.moodLabel}
          </h2>
          {result.name && <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>{result.name}님의 감정일기</p>}
          <p style={{ fontSize: 12, color: "#4b5563", margin: "8px 0 0" }}>
            {new Date(result.createdAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })}
          </p>
        </div>

        {/* 오행 에너지 카드 */}
        <div style={{ background: result.ohBg, borderRadius: 20, padding: "24px 20px", marginBottom: 20, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: "0 0 6px" }}>오늘의 오행 에너지</p>
          <div style={{ fontSize: 48, marginBottom: 6 }}>{result.ohEmoji}</div>
          <h3 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 4px" }}>{result.oh}(五行)</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0 }}>{result.ohKeyword}</p>
        </div>

        {/* 활동 태그 */}
        {result.activities?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 10 }}>오늘 한 활동</p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {result.activities.map(key => {
                const act = ACT_MAP[key];
                return act ? (
                  <span key={key} style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 20, padding: "6px 12px", fontSize: 13, color: "#86efac" }}>
                    {act.emoji} {act.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* 오행 분석 */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "20px 18px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#4ade80", margin: "0 0 12px" }}>🌿 오행 감정 분석</p>
          {result.ohMessages.map((msg, i) => (
            <p key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "#e5e7eb", margin: i < result.ohMessages.length - 1 ? "0 0 10px" : 0 }}>{msg}</p>
          ))}
        </div>

        {/* 오늘 추천 */}
        <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 18, padding: "20px 18px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#4ade80", margin: "0 0 14px" }}>💡 오늘 해보세요</p>
          {result.ohTips.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < result.ohTips.length - 1 ? 12 : 0 }}>
              <span style={{ fontSize: 14, flexShrink: 0, color: "#4ade80", marginTop: 1 }}>→</span>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: "#e5e7eb", margin: 0 }}>{tip}</p>
            </div>
          ))}
        </div>

        {/* 메모 */}
        {result.memo && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 6px" }}>📝 오늘의 한마디</p>
            <p style={{ fontSize: 14, color: "#d1d5db", margin: 0, fontStyle: "italic", lineHeight: 1.6 }}>"{result.memo}"</p>
          </div>
        )}

        {/* 공유 + 다시 기록 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <button onClick={share} style={{ flex: 1, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 14, padding: "13px", color: "#4ade80", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            공유하기 📤
          </button>
          <button onClick={() => router.push("/gamjung")} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "13px", color: "#9ca3af", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            다시 기록하기 🔄
          </button>
        </div>

        {/* 사주 CTA */}
        <div style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(192,132,252,0.1))", border: "1px solid rgba(192,132,252,0.3)", borderRadius: 20, padding: "22px 20px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#c084fc", fontWeight: 700, margin: "0 0 6px" }}>🔮 감정 뒤에 숨겨진 사주 흐름</p>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.5, margin: "0 0 8px" }}>
            오늘 기분이 유독 좋거나 나쁜 이유가 있을 수도 있어요.<br />
            사주로 지금 내 운의 흐름을 확인해보세요.
          </p>

          <Link href="/main-v2" style={{ display: "block", background: "linear-gradient(135deg,#7c3aed,#c084fc)", color: "white", textDecoration: "none", borderRadius: 16, padding: "13px 20px", fontWeight: 900, fontSize: 14, boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
            990원으로 사주 + 점운 전체 입장 →
          </Link>
          <p style={{ fontSize: 11, color: "rgba(192,132,252,0.45)", margin: "8px 0 0" }}>단 1회 결제 · 반복청구 없음</p>
        </div>
      </div>
    </div>
  );
}
