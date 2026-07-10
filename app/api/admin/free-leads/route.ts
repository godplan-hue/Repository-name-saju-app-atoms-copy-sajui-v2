import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 전화번호 기준으로 중복 제거 — 같은 번호는 가장 최근 항목 1개만 유지
// 전화번호 없고 이름이 "익명"인 항목은 연락 불가 → 어드민 뷰에서 제외
function dedupByPhone(items: any[], source: string): any[] {
  const byPhone = new Map<string, any>();
  const noPhone: any[] = [];
  for (const item of items) {
    const phone = item.phone ? String(item.phone).replace(/\D/g, "") : "";
    if (phone.length >= 10) {
      const existing = byPhone.get(phone);
      if (!existing || (item.createdAt || 0) > (existing.createdAt || 0)) {
        byPhone.set(phone, { ...item, source });
      }
    } else if (item.name && item.name !== "익명") {
      noPhone.push({ ...item, source });
    }
    // 전화번호 없고 이름이 "익명" → 테스트 데이터로 간주, 제외
  }
  return [...byPhone.values(), ...noPhone];
}

export async function GET(request: NextRequest) {
  const adminId = request.headers.get("x-admin-id");
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [freeSnap, careerSnap, resumeSnap] = await Promise.all([
    db.ref("free_leads").orderByChild("createdAt").once("value"),
    db.ref("career_analyses").orderByChild("createdAt").once("value"),
    db.ref("resume_analyses").orderByChild("createdAt").once("value"),
  ]);

  const leads: any[] = [];

  // 재물운무료 — free_leads는 이미 전화번호 키로 중복 방지됨
  freeSnap.forEach(child => {
    leads.push({ id: child.key, ...child.val() });
  });

  // 직운 — career_analyses: 전화번호 기준 중복 제거
  const careerItems: any[] = [];
  careerSnap.forEach(child => {
    const v = child.val();
    if (v) careerItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(careerItems, "jigun")) leads.push(item);

  // 합격자소서 — resume_analyses: 전화번호 기준 중복 제거
  const resumeItems: any[] = [];
  resumeSnap.forEach(child => {
    const v = child.val();
    if (v) resumeItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(resumeItems, "resume")) leads.push(item);

  leads.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

  return NextResponse.json({ leads });
}
