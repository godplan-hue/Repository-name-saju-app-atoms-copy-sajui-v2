import { pbkdf2Sync } from "crypto";

// 비밀번호는 평문이 아니라 미리 암호화(salt:hash)된 값으로만 저장 — 코드를
// 보더라도 실제 비밀번호는 알아낼 수 없음
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return check === hash;
}

export const ADMIN_ACCOUNTS = [
  {
    id: "admin1",
    email: "junga6783@gmail.com",
    password: "e04ca527d72b3af8518f262d1260454d:02d4ab989b5d04de245b9e64fea29ff088fb5ecd490a019bd3951c78477812cdaffc2a61a76a4d7ba403bd40cfba72cee3234dd2135312efd8bbd8891e5c882e",
    name: "관리자",
  },
];
