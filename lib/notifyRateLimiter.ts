// 알림톡(솔라피) 발송 남용 방지용 — 메모리에만 저장되는 단순한 횟수 제한.
// 솔라피는 발송 건당 과금되므로, 같은 전화번호로 짧은 시간에 계속 호출되면
// 과금이 눈덩이처럼 불어날 수 있어 전화번호 기준으로 발송 횟수를 제한함.
const sends = new Map<string, number[]>();

const MAX_SENDS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1시간

export function checkNotifyRateLimit(phone: string): { allowed: boolean } {
  const now = Date.now();
  const history = (sends.get(phone) ?? []).filter((t) => now - t < WINDOW_MS);
  sends.set(phone, history);
  return { allowed: history.length < MAX_SENDS };
}

export function recordNotifySend(phone: string) {
  const now = Date.now();
  const history = (sends.get(phone) ?? []).filter((t) => now - t < WINDOW_MS);
  history.push(now);
  sends.set(phone, history);
}
