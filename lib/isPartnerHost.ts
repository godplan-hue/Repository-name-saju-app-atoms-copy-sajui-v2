// 점운 메인 도메인이 아니면(파트너 서브도메인) 990원 단품 결제·"당신의 변화" 등
// 파트너에게는 안 파는 것으로 정한 부분을 화면에서 숨기는 데 쓰는 공용 판별 함수.
// 로컬 개발(localhost)과 미리보기 배포(*.vercel.app)는 메인으로 취급해서
// 평소 작업/테스트에 영향이 없게 함
export function isPartnerHost(hostname: string): boolean {
  const mainHosts = ["jeomun.com", "www.jeomun.com", "localhost"];
  if (mainHosts.includes(hostname)) return false;
  if (hostname.endsWith(".vercel.app")) return false;
  return hostname.endsWith(".jeomun.com");
}
