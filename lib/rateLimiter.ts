// 로그인 무한 시도 방지용 — 메모리에만 저장되는 단순한 잠금 장치.
// 같은 이메일로 일정 횟수 이상 틀리면 일정 시간 동안 로그인 시도 자체를 막음.
const attempts = new Map<string, { count: number; lockedUntil: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15분

export function checkRateLimit(key: string): { allowed: boolean; remainingMinutes?: number } {
  const entry = attempts.get(key);
  if (!entry || entry.lockedUntil <= Date.now()) return { allowed: true };
  return { allowed: false, remainingMinutes: Math.ceil((entry.lockedUntil - Date.now()) / 60000) };
}

export function recordFailedAttempt(key: string) {
  const entry = attempts.get(key) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
    entry.count = 0;
  }
  attempts.set(key, entry);
}

export function clearAttempts(key: string) {
  attempts.delete(key);
}
