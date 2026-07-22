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

  const [freeSnap, careerSnap, resumeSnap, mbtiSnap, lottoSnap, gunghapSnap, petunSnap, tarotSnap, zodiacSnap, gamjungSnap, dietSnap, budgetSnap, tossSnap] = await Promise.all([
    db.ref("free_leads").orderByChild("createdAt").once("value"),
    db.ref("career_analyses").orderByChild("createdAt").once("value"),
    db.ref("resume_analyses").orderByChild("createdAt").once("value"),
    db.ref("mbti_analyses").orderByChild("createdAt").once("value"),
    db.ref("lotto_analyses").orderByChild("createdAt").once("value"),
    db.ref("gunghap_analyses").orderByChild("createdAt").once("value"),
    db.ref("petun_analyses").orderByChild("createdAt").once("value"),
    db.ref("tarot_analyses").orderByChild("createdAt").once("value"),
    db.ref("zodiac_analyses").orderByChild("createdAt").once("value"),
    db.ref("gamjung_analyses").orderByChild("createdAt").once("value"),
    db.ref("diet_leads").orderByChild("createdAt").once("value"),
    db.ref("budget_leads").orderByChild("createdAt").once("value"),
    db.ref("free_leads/toss").orderByChild("createdAt").once("value"),
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
    if (v && v.phone) mbtiItems.push({ id: child.key, ...v, name: v.userName || "" });
  });
  for (const item of dedupByPhone(mbtiItems, "mbti")) leads.push(item);

  // 행운번호 — lotto_analyses: 전화번호 기준 중복 제거
  const lottoItems: any[] = [];
  lottoSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) lottoItems.push({ id: child.key, birthYear: v.birthYear, ...v });
  });
  for (const item of dedupByPhone(lottoItems, "lotto")) leads.push(item);

  // 궁합 — gunghap_analyses
  const gunghapItems: any[] = [];
  gunghapSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) gunghapItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(gunghapItems, "gunghap")) leads.push(item);

  // 펫운 — petun_analyses
  const petunItems: any[] = [];
  petunSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) petunItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(petunItems, "petun")) leads.push(item);

  // 타로 — tarot_analyses
  const tarotItems: any[] = [];
  tarotSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) tarotItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(tarotItems, "tarot")) leads.push(item);

  // 별자리 — zodiac_analyses
  const zodiacItems: any[] = [];
  zodiacSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) zodiacItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(zodiacItems, "zodiac")) leads.push(item);

  // 감정일기 — gamjung_analyses
  const gamjungItems: any[] = [];
  gamjungSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) gamjungItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(gamjungItems, "gamjung")) leads.push(item);

  // 다이어트 — diet_leads
  const dietItems: any[] = [];
  dietSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) dietItems.push({ id: child.key, birthYear: v.birthYear, ...v });
  });
  for (const item of dedupByPhone(dietItems, "diet")) leads.push(item);

  // 가계부 — budget_leads
  const budgetItems: any[] = [];
  budgetSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) budgetItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(budgetItems, "budget")) leads.push(item);

  // 토스앱 — free_leads/toss (source 필드 그대로 유지: toss-mbti, toss-gamjung 등)
  const tossItems: any[] = [];
  tossSnap.forEach(child => {
    const v = child.val();
    if (v) tossItems.push({ id: child.key, ...v });
  });
  for (const item of tossItems) leads.push(item);

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
      const withDash = phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      // 숫자 형식과 대시 형식 둘 다 조회 (저장 형식 불일치 대응)
      let snap = await db.ref("consumerCustomers").orderByChild("phone").equalTo(phone).limitToFirst(1).once("value");
      if (!snap.exists()) snap = await db.ref("consumerCustomers").orderByChild("phone").equalTo(withDash).limitToFirst(1).once("value");
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

// 무료DB 전체 삭제 (모든 무료앱 경로)
export async function DELETE(request: NextRequest) {
  const adminId = request.headers.get("x-admin-id");
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await Promise.all([
    db.ref("free_leads").remove(),
    db.ref("career_analyses").remove(),
    db.ref("resume_analyses").remove(),
    db.ref("mbti_analyses").remove(),
    db.ref("lotto_analyses").remove(),
    db.ref("gunghap_analyses").remove(),
    db.ref("petun_analyses").remove(),
    db.ref("gamjung_analyses").remove(),
    db.ref("budget_leads").remove(),
    db.ref("tarot_analyses").remove(),
    db.ref("zodiac_analyses").remove(),
    db.ref("diet_leads").remove(),
  ]);
  return NextResponse.json({ ok: true });
}
