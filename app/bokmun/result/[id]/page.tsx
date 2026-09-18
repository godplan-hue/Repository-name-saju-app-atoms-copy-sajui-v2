"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const ZODIAC_HANJA: Record<string, string> = {
  쥐: "子", 소: "丑", 호랑이: "寅", 토끼: "卯", 용: "辰", 뱀: "巳",
  말: "午", 양: "未", 원숭이: "申", 닭: "酉", 개: "戌", 돼지: "亥",
};

interface BokmunResult {
  id: string;
  name?: string;
  birthYear: number;
  birthMonth?: number | null;
  birthDay?: number | null;
  zodiac: string;
  emoji: string;
  color: string;
  title: string;
  incantation: string;
  meaning: string;
  caution: string;
}

export default function BokmunResultPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<BokmunResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shared, setShared] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/bokmun/analyze?id=${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const saveImage = async () => {
    if (saving || !cardRef.current || !data) return;
    const isKakaoTalk = /KAKAOTALK/i.test(navigator.userAgent);
    if (isKakaoTalk) {
      alert("카카오톡에서는 이미지 저장이 안 돼요.\n우측 상단 [···] 메뉴에서 '다른 브라우저로 열기'를 선택한 뒤 다시 저장해주세요.");
      return;
    }
    setSaving(true);
    const el = cardRef.current;
    const sparkle = el.querySelector<HTMLElement>(".bokmun-sparkle");
    const prevElAnim = el.style.animation;
    const prevElShadow = el.style.boxShadow;
    const prevElOverflow = el.style.overflow;
    const prevSparkleAnim = sparkle?.style.animation || "";
    const prevSparkleOpacity = sparkle?.style.opacity || "";
    const hexToRgba = (hex: string, alpha: number) => {
      const h = hex.replace("#", "");
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    };
    const freeze = () => {
      el.style.animation = "none";
      el.style.boxShadow = `0 0 28px ${hexToRgba(data.color, 0.4)}`;
      el.style.overflow = "visible";
      if (sparkle) { sparkle.style.animation = "none"; sparkle.style.opacity = "1"; }
    };
    const unfreeze = () => {
      el.style.animation = prevElAnim;
      el.style.boxShadow = prevElShadow;
      el.style.overflow = prevElOverflow;
      if (sparkle) { sparkle.style.animation = prevSparkleAnim; sparkle.style.opacity = prevSparkleOpacity; }
    };
    try {
      const html2canvas = (await import("html2canvas")).default;
      const isIOSDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      await document.fonts.ready;
      freeze();
      const PAD = 40;
      const canvas = await html2canvas(el, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        x: -PAD,
        y: -PAD,
        width: el.offsetWidth + PAD * 2,
        height: el.offsetHeight + PAD * 2,
      });
      unfreeze();
      if (isIOSDevice) {
        const w = window.open(canvas.toDataURL("image/png"), "_blank");
        if (w) {
          setTimeout(() => alert("열린 이미지를 길게 눌러 [사진에 추가]를 선택하면 저장돼요!"), 800);
        }
        setSaving(false);
        return;
      }
      canvas.toBlob(blob => {
        if (!blob) { setSaving(false); return; }
        const filename = `점운_${data?.zodiac || "부적"}띠_복문.png`;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = filename;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        if (window.innerWidth < 768) setTimeout(() => alert("✅ 사진 앱(갤러리)에 저장됐어요!"), 0);
        setSaving(false);
      }, "image/png");
    } catch (e) {
      unfreeze();
      console.error(e);
      alert("이미지 저장에 실패했습니다. 화면을 직접 캡처해주세요.");
      setSaving(false);
    }
  };

  const handleShare = () => {
    if (!data) return;
    const url = typeof window !== "undefined" ? window.location.href.split("?")[0] : "https://jeomun.com/bokmun";
    const kakao = (window as any).Kakao;
    if (kakao?.isInitialized() && kakao?.Share) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: `🧧 ${data.zodiac}띠 전용 부적 — ${data.title}`,
            description: `내 띠 전용 부적, 점운에서 무료로 받아봐!`,
            imageUrl: "https://i.pinimg.com/736x/bc/72/81/bc7281694d741c357b826a29c17023b3.jpg",
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [
            { title: "내 부적 보기 🧧", link: { mobileWebUrl: url, webUrl: url } },
            { title: "나도 받아보기 →", link: { mobileWebUrl: "https://jeomun.com/bokmun", webUrl: "https://jeomun.com/bokmun" } },
          ],
        });
        return;
      } catch {}
    }
    const text = `🧧 ${data.zodiac}띠 전용 부적 — ${data.title}\n점운에서 무료로 확인 👉 ${url}`;
    navigator.clipboard?.writeText(text);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#1a0a05", color: "#F5F1E8", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    section: { maxWidth: 440, margin: "0 auto", padding: "0 20px" },
    card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "20px 18px", marginBottom: 16 },
  };

  if (loading) {
    return (
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: 52, animation: "spin 1s linear infinite", marginBottom: 20 }}>🧧</div>
        <p style={{ color: "#fbbf24", fontSize: 16, fontWeight: 700 }}>부적 불러오는 중...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#f87171" }}>결과를 불러올 수 없습니다.</p>
        <Link href="/bokmun" style={{ color: "#fbbf24", marginTop: 12 }}>다시 받기</Link>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Song+Myung&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px ${data.color}44;} 50%{box-shadow:0 0 40px ${data.color}88;} }
        @keyframes twinkle { 0%,100%{opacity:0.3;} 50%{opacity:1;} }
        .bokmun-sparkle {
          position:absolute; inset:0; border-radius:24px; pointer-events:none; overflow:hidden;
          background-image:
            radial-gradient(circle, rgba(255,230,150,0.9) 1px, transparent 1.5px),
            radial-gradient(circle, rgba(255,215,0,0.7) 1px, transparent 1.5px),
            radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1.5px);
          background-size: 48px 48px, 72px 72px, 36px 36px;
          background-position: 0 0, 24px 36px, 12px 8px;
          animation: twinkle 2.6s ease-in-out infinite;
        }
        .bokmun-gold-text {
          color: #f2c14e;
          text-shadow: 1px 1px 0 rgba(120,72,0,0.7), 2px 2px 3px rgba(0,0,0,0.6), 0 0 16px rgba(255,215,0,0.5);
        }
      `}</style>

      <div style={{ background: "linear-gradient(180deg,#2d0f08 0%,#1a0a05 100%)", paddingBottom: 20 }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "28px 20px 0" }}>
          <Link href="/bokmun" style={{ color: "#fbbf24", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 20 }}>← 다시 받기</Link>

          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-block", background: `${data.color}22`, border: `1.5px solid ${data.color}66`, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, color: data.color, marginBottom: 16 }}>
              {data.emoji} {data.name ? `${data.name}님의 ` : ""}{data.zodiac}띠 전용 부적
            </div>

            {/* 부적 카드 (캡처 대상) */}
            <div ref={cardRef} style={{
              background: "radial-gradient(circle at 50% 30%,#241206 0%,#140a04 60%,#0c0603 100%)",
              border: `2px solid ${data.color}`,
              borderRadius: 24,
              padding: "32px 24px",
              animation: "fadeUp 0.6s ease, glow 3s ease-in-out infinite",
              position: "relative" as const,
              overflow: "hidden",
            }}>
              <div className="bokmun-sparkle" />
              <div style={{ position: "absolute", top: 14, left: 14, fontSize: 18, color: `${data.color}aa` }}>◆</div>
              <div style={{ position: "absolute", top: 14, right: 14, fontSize: 18, color: `${data.color}aa` }}>◆</div>
              <div style={{ position: "absolute", bottom: 14, left: 14, fontSize: 18, color: `${data.color}aa` }}>◆</div>
              <div style={{ position: "absolute", bottom: 14, right: 14, fontSize: 18, color: `${data.color}aa` }}>◆</div>

              <div style={{ fontSize: 28, marginBottom: 4, position: "relative" as const }}>🪙</div>

              <div style={{ position: "relative" as const, display: "inline-block", margin: "0 auto 14px" }}>
                <div className="bokmun-gold-text" style={{
                  fontFamily: "'Song Myung', serif",
                  writingMode: "vertical-rl" as const,
                  fontSize: 44,
                  fontWeight: 900,
                  letterSpacing: 6,
                  lineHeight: 1.25,
                  padding: "4px 6px",
                }}>
                  {ZODIAC_HANJA[data.zodiac] || data.zodiac}招福
                </div>
                <div style={{
                  position: "absolute" as const, bottom: -8, right: -10, width: 30, height: 30,
                  background: "linear-gradient(135deg,#b91c1c,#7f1d1d)", color: "#fde68a",
                  fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.5)", fontFamily: "'Song Myung', serif",
                  transform: "rotate(-8deg)", border: "1px solid rgba(255,215,0,0.5)",
                }}>福</div>
              </div>

              <div style={{ fontSize: 48, marginBottom: 10, position: "relative" as const }}>{data.emoji}</div>
              <p className="bokmun-gold-text" style={{ fontSize: 21, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.4, position: "relative" as const }}>
                {data.title}
              </p>
              <p style={{ fontSize: 14, color: "#f5d9a8", fontStyle: "italic", margin: "0 0 18px", lineHeight: 1.6, position: "relative" as const }}>
                &ldquo;{data.incantation}&rdquo;
              </p>
              <div style={{ height: 1, background: `${data.color}44`, margin: "0 0 18px", position: "relative" as const }} />
              <p style={{ fontSize: 13, color: "#e5d5c0", lineHeight: 1.8, margin: 0, textAlign: "left" as const, position: "relative" as const }}>
                {data.meaning}
              </p>
              <p style={{ fontSize: 11, color: "rgba(245,241,232,0.4)", marginTop: 18, marginBottom: 0, position: "relative" as const }}>
                점운 · jeomun.com
              </p>
            </div>

            {/* 주의사항 — 작은 글씨로 부적 바로 아래 */}
            <p style={{ fontSize: 11.5, color: "rgba(245,241,232,0.55)", lineHeight: 1.6, margin: "12px 4px 0", textAlign: "left" as const }}>
              ⚠️ {data.caution}
            </p>
          </div>
        </div>
      </div>

      <div style={S.section}>
        {/* 1. 저장 버튼 */}
        <div style={{ ...S.card, textAlign: "center" as const, marginTop: 20, borderColor: `${data.color}44`, background: `${data.color}11` }}>
          <button onClick={saveImage} disabled={saving} style={{
            width: "100%", background: saving ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#fbbf24,#d97706)",
            color: "#1a0a05", border: "none", borderRadius: 16, padding: "14px", fontSize: 15, fontWeight: 900,
            cursor: saving ? "default" : "pointer",
          }}>
            {saving ? "저장 중..." : "🖼️ 부적 이미지 저장하기"}
          </button>
        </div>

        {/* 2. 공유 */}
        <button onClick={handleShare} style={{
          width: "100%", background: "rgba(251,191,36,0.12)", border: "1.5px solid rgba(251,191,36,0.4)",
          color: "#fbbf24", borderRadius: 16, padding: "15px", fontSize: 15, fontWeight: 700, cursor: "pointer",
          marginBottom: 16,
        }}>
          {shared ? "✅ 복사됐어요!" : "📤 친구에게 공유하기"}
        </button>

        {/* 3. 사주 CTA — 판매는 하나만 */}
        <div style={{ background: "linear-gradient(135deg,rgba(220,38,38,0.18),rgba(139,92,246,0.12))", border: "1px solid rgba(220,38,38,0.35)", borderRadius: 20, padding: "22px 18px", textAlign: "center" as const, marginBottom: 20 }}>
          <p style={{ fontWeight: 900, fontSize: 15, color: "#fde68a", margin: "0 0 6px" }}>
            🔮 부적은 기운을 담을 뿐,<br />열쇠는 사주에 있습니다
          </p>
          <p style={{ fontSize: 13, color: "#e5d5c0", lineHeight: 1.6, margin: "0 0 16px" }}>
            이 부적의 기운이 실제로 언제, 어떻게 열리는지는<br />
            내 사주를 봐야 정확히 알 수 있어요.<br />
            <strong style={{ color: "#fbbf24" }}>모르고 지나치면 그만큼 손해예요.</strong>
          </p>
          <Link href="/main-v2" style={{
            display: "block", background: "linear-gradient(135deg,#dc2626,#991b1b)",
            color: "#fef3c7", textDecoration: "none", borderRadius: 16, padding: "14px",
            fontSize: 15, fontWeight: 900, boxShadow: "0 4px 16px rgba(220,38,38,0.4)", border: "1px solid #fbbf24",
          }}>
            지금 990원으로 내 사주 확인하기 →
          </Link>
          <p style={{ fontSize: 11, color: "rgba(251,191,36,0.6)", margin: "8px 0 0" }}>990원 · 단 1회 결제 · 반복청구 없음</p>
        </div>

        {/* 4. 점운 앱 전체보기 — 맨 아래, 작게 */}
        <p style={{ textAlign: "center" as const, marginBottom: 40 }}>
          <Link href="/apps" style={{ fontSize: 12.5, color: "rgba(251,191,36,0.6)", textDecoration: "none" }}>
            점운 앱 20개 보기 →
          </Link>
        </p>
      </div>
    </div>
  );
}
