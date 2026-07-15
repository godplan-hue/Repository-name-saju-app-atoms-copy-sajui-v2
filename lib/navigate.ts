// 카카오톡 인앱브라우저: 새 탭(_blank) — 뒤로가기 시 결과지 초기화 버그 방지
// 일반 브라우저(Chrome 등): location.href — 검정 화면 없이 바로 이동
export function nav(url: string) {
  if (typeof window === "undefined") return;
  if (/KAKAOTALK/i.test(navigator.userAgent)) {
    window.open(url, "_blank");
  } else {
    window.location.href = url;
  }
}
