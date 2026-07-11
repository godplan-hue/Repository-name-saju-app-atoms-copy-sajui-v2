import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 전화번호 기준으로 중복 제거 — 이름 있는 항목 우선, 둘 다 있으면 최근 항목
// 전화번호 없고 이름이 "익명"인 항목은 연락 불가 → 어드민 뷰에서 제외
function hasName(item: any): boolean {
  return !!(item.name && String(item.name).trim() && item.name !== "익명");
}

function dedupByPhone(items: any[], source: string): any[] {
  const byPhone = new Map<string, any>();
  const noPhone: any[] = [];
  for (const item of items) {
    const phone = item.phone ? String(item.phone).replace(/\D/g, "") : "";
    if (phone.length >= 10) {
      const existing = byPhone.get(phone);
      if (!existing) {
        byPhone.set(phone, { ...item, source });
      } else {
        // 이름 있는 항목 우선 선택, 둘 다 이름 있으면 최신 우선
        const newHasName = hasName(item);
        const exHasName = hasName(existing);
        if (newHasName && !exHasName) {
          byPhone.set(phone, { ...item, source });
        } else if (newHasName === exHasName && (item.createdAt || 0) > (existing.createdAt || 0)) {
          byPhone.set(phone, { ...item, source });
        }
      }
    } else if (hasName(item)) {
      noPhone.push({ ...item, source });
    }
    // 전화번호 없고 이름이 "익명" → 테스트 데이터로 간주, 제외
  }
  return [...byPhone.values(), ...noPhone];
}

export async function GET(request: NextRequest) {
  const adminId = request.headers.get("x-admin-id");
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [freeSnap, careerSnap, resumeSnap, mbtiSnap, lottoSnap] = await Promise.all([
    db.ref("free_leads").orderByChild("createdAt").once("value"),
    db.ref("career_analyses").orderByChild("createdAt").once("value"),
    db.ref("resume_analyses").orderByChild("createdAt").once("value"),
    db.ref("mbti_analyses").orderByChild("createdAt").once("value"),
    db.ref("lotto_analyses").orderByChild("createdAt").once("value"),
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

  // MBTI — mbti_analyses: 전화번호 기준 중복 제거
  const mbtiItems: any[] = [];
  mbtiSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) mbtiItems.push({ id: child.key, name: v.userName || v.name || "", ...v });
  });
  for (const item of dedupByPhone(mbtiItems, "mbti")) leads.push(item);

  // 행운번호 — lotto_analyses: 전화번호 기준 중복 제거
  const lottoItems: any[] = [];
  lottoSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) lottoItems.push({ id: child.key, birthYear: v.birthYear, ...v });
  });
  for (const item of dedupByPhone(lottoItems, "lotto")) leads.push(item);

  // 출처가 달라도 같은 전화번호가 중복될 수 있으므로 (free_leads+career_analyses 동시 저장 등) 최종 전체 중복 제거
  // 이름 있는 항목 우선 선택, 둘 다 이름 있으면 최신 우선
  const finalByPhone = new Map<string, any>();
  const finalNoPhone: any[] = [];
  for (const lead of leads) {
    const p = lead.phone ? String(lead.phone).replace(/\D/g, "") : "";
    if (p.length >= 10) {
      const ex = finalByPhone.get(p);
      if (!ex) {
        finalByPhone.set(p, lead);
      } else {
        const newHasName = hasName(lead);
        const exHasName = hasName(ex);
        if (newHasName && !exHasName) {
          finalByPhone.set(p, lead);
        } else if (newHasName === exHasName && (lead.createdAt || 0) > (ex.createdAt || 0)) {
          finalByPhone.set(p, lead);
        }
      }
    } else {
      finalNoPhone.push(lead);
    }
  }
  const finalLeads = [...finalByPhone.values(), ...finalNoPhone];
  finalLeads.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

  // 이름이 없는 항목은 일반회원 DB(consumerCustomers)에서 같은 전화번호로 이름 조회
  const missingPhones = finalLeads
    .filter((l: any) => !hasName(l) && l.phone)
    .map((l: any) => String(l.phone).replace(/\D/g, ""))
    .filter((p: string) => p.length >= 10);

  if (missingPhones.length > 0) {
    const nameMap: Record<string, string> = {};
    await Promise.all(missingPhones.map(async (phone: string) => {
      const snap = await db.ref("consumerCustomers")
        .orderByChild("phone")
        .equalTo(phone)
        .limitToFirst(1)
        .once("value");
      snap.forEach((child) => {
        const v = child.val();
        if (v?.name) nameMap[phone] = v.name;
      });
    }));
    for (let i = 0; i < finalLeads.length; i++) {
      const lead = finalLeads[i];
      if (!hasName(lead)) {
        const p = lead.phone ? String(lead.phone).replace(/\D/g, "") : "";
        if (p && nameMap[p]) finalLeads[i] = { ...lead, name: nameMap[p] };
      }
    }
  }

  return NextResponse.json({ leads: finalLeads });
}

// 무료DB 전체 삭제 (free_leads + career_analyses + resume_analyses)
export async function DELETE(request: NextRequest) {
  const adminId = request.headers.get("x-admin-id");
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await Promise.all([
    db.ref("free_leads").remove(),
    db.ref("career_analyses").remove(),
    db.ref("resume_analyses").remove(),
  ]);
  return NextResponse.json({ ok: true });
}
