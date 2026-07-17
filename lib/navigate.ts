// 같은 탭 이동 — 카카오톡 인앱브라우저 검정화면 방지 (window.open _blank 금지)
export function nav(url: string) {
  if (typeof window === "undefined") return;
  window.location.href = url;
}
