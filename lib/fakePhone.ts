export function isFakePhone(phone?: string | null): boolean {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return false;
  return digits === "01012345678" || /^010(\d)\1{7}$/.test(digits);
}
