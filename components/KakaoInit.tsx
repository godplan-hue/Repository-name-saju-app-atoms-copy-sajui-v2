"use client";
import Script from "next/script";

export default function KakaoInit() {
  return (
    <Script
      id="kakao-sdk"
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        const k = (window as any).Kakao;
        if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }}
    />
  );
}
