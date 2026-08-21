import { createHmac, timingSafeEqual } from "crypto";
import { ADMIN_ACCOUNTS } from "./adminAccounts";

// 관리자 비밀번호 해시값을 토큰 서명키로 재사용 — 클라이언트에는 절대 노출되지
// 않는 서버 전용 값이라 별도 비밀키를 새로 관리할 필요 없이 바로 서명키로 쓸 수 있음
const SECRET = ADMIN_ACCOUNTS[0].password;
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30일

export function createAdminToken(adminId: string): string {
  const expires = Date.now() + TOKEN_TTL_MS;
  const payload = `${adminId}.${expires}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

// 로그인 때 발급한 서명이 있어야만 관리자 ID를 인정 — 헤더 값만 흉내 내는 요청은 통과 못 함
export function verifyAdminToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(".");
    if (parts.length !== 3) return null;
    const [adminId, expiresStr, sig] = parts;
    const expected = createHmac("sha256", SECRET).update(`${adminId}.${expiresStr}`).digest("hex");
    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return null;
    if (Date.now() > Number(expiresStr)) return null;
    if (!ADMIN_ACCOUNTS.some((a) => a.id === adminId)) return null;
    return adminId;
  } catch {
    return null;
  }
}
