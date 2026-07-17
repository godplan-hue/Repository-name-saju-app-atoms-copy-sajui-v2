"use client";

import Script from "next/script";

interface Props {
  url?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  label?: string;
  style?: React.CSSProperties;
}

export default function KakaoShareButton({
  url,
  title = "🔮 점운 AI 분석 결과",
  description = "점운에서 AI 분석을 해봤어요! 나도 한번 해봐 → jeomun.com",
  imageUrl = "https://i.pinimg.com/1200x/21/92/2c/21922cc59f29ba66e12cc4546e316079.jpg",
  label = "💬 카카오로 공유하기",
  style,
}: Props) {
  function share() {
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href.split("?")[0] : "https://jeomun.com");
    const kakao = (window as any).Kakao;
    if (kakao?.isInitialized() && kakao?.Share) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title,
            description,
            imageUrl,
            link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
          },
          buttons: [
            { title: "결과 보러가기 🔮", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } },
            { title: "나도 해보기", link: { mobileWebUrl: "https://jeomun.com", webUrl: "https://jeomun.com" } },
          ],
        });
        return;
      } catch {}
    }
    // 카카오 SDK 미준비 시 클립보드 복사
    if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(shareUrl);
      alert("링크가 복사됐어요! 카카오톡에 붙여넣기 하세요 💬");
    }
  }

  return (
    <>
      <button
        onClick={share}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "#FEE500",
          color: "#1a1a2e",
          border: "none",
          borderRadius: 20,
          padding: "10px 20px",
          fontSize: 13,
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(254,229,0,0.5)",
          ...style,
        }}
      >
        {label}
      </button>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const k = (window as any).Kakao;
          if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }}
      />
    </>
  );
}
