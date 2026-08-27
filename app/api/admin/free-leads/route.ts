import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyAdminToken } from "@/lib/adminAuth";

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
  const adminId = verifyAdminToken(request.headers.get("x-admin-id"));
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [freeSnap, careerSnap, resumeSnap, mbtiSnap, lottoSnap, gunghapSnap, petunSnap, tarotSnap, zodiacSnap, gamjungSnap, dietSnap, budgetSnap, tossSnap, haemongSnap, momcareSnap, tDaewoonSnap, tTaegilSnap, tFortuneSnap, tGamjungSnap, tHaemongSnap, tMomcareSnap, tBudgetSnap, tSajuSnap, tTarotSnap, tZodiacSnap, tGunghapSnap, tPetunSnap, tJigunSnap, tResumeSnap, battleSnap, movieSnap, styleSnap, workSnap, tGwangyeoradarSnap, gwangyeoradarSnap, sonjeolgakSnap, tSonjeolgakSnap] = await Promise.all([
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
    db.ref("haemong_leads").orderByChild("createdAt").once("value"),
    db.ref("momcare_leads").orderByChild("agreedAt").once("value"),
    db.ref("daewoon_toss_users").once("value"),
    db.ref("taegil_toss_users").once("value"),
    db.ref("fortune_toss_users").once("value"),
    db.ref("gamjung_toss_users").once("value"),
    db.ref("haemong_toss_users").once("value"),
    db.ref("momcare_toss_users").once("value"),
    db.ref("budget_toss_users").once("value"),
    db.ref("saju_leads").orderByChild("createdAt").once("value"),
    db.ref("tarot_toss_users").once("value"),
    db.ref("zodiac_toss_users").once("value"),
    db.ref("gunghap_toss_users").once("value"),
    db.ref("petun_toss_users").once("value"),
    db.ref("jigun_toss_users").once("value"),
    db.ref("resume_toss_users").once("value"),
    db.ref("battle_leads").orderByChild("createdAt").once("value"),
    db.ref("movie_leads").orderByChild("createdAt").once("value"),
    db.ref("style_leads").orderByChild("createdAt").once("value"),
    db.ref("work_leads").orderByChild("createdAt").once("value"),
    db.ref("gwangyeoradar_toss_users").once("value"),
    db.ref("gwangyeoradar_analyses").orderByChild("createdAt").once("value"),
    db.ref("sonjeolgak_analyses").orderByChild("createdAt").once("value"),
    db.ref("sonjeolgak_toss_users").once("value"),
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
    if (v && v.phone && v.source !== "toss") mbtiItems.push({ id: child.key, ...v, name: v.userName || "" });
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

  // 꿈해몽 — haemong_leads
  const haemongItems: any[] = [];
  haemongSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) haemongItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(haemongItems, "haemong")) leads.push(item);

  // 맘케어 (웹앱) — momcare_leads
  const momcareItems: any[] = [];
  momcareSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) momcareItems.push({ id: child.key, ...v, createdAt: v.createdAt || v.agreedAt || 0 });
  });
  for (const item of dedupByPhone(momcareItems, "momcare")) leads.push(item);

  // 토스대운 — daewoon_toss_users
  tDaewoonSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 토스택일 — taegil_toss_users
  tTaegilSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 토스오늘운세 — fortune_toss_users
  tFortuneSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 토스감정일기 — gamjung_toss_users
  tGamjungSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 토스꿈해몽 — haemong_toss_users
  tHaemongSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 토스맘케어 — momcare_toss_users
  tMomcareSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 토스가계부 — budget_toss_users
  tBudgetSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 토스사주 — saju_leads
  tSajuSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, source: "toss-saju", createdAt: v.createdAt || 0 });
  });

  // 토스타로 — tarot_toss_users
  tTarotSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, source: "toss-tarot", createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 토스별자리 — zodiac_toss_users
  tZodiacSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, source: "toss-zodiac", createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 토스궁합 — gunghap_toss_users
  tGunghapSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, source: "toss-gunghap", createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 토스펫운 — petun_toss_users
  tPetunSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, source: "toss-petun", createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 토스직운 — jigun_toss_users
  tJigunSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, source: "toss-jigun", createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 토스합격 — resume_toss_users
  tResumeSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, source: "toss-resume", createdAt: v.createdAt || v.agreedAt || 0 });
  });

  // 이상형월드컵 — battle_leads
  const battleItems: any[] = [];
  battleSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) battleItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(battleItems, "battle")) leads.push(item);

  // 인생이영화라면 — movie_leads
  const movieItems: any[] = [];
  movieSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) movieItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(movieItems, "movie")) leads.push(item);

  // 추구미 — style_leads
  const styleItems: any[] = [];
  styleSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) styleItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(styleItems, "style")) leads.push(item);

  // 직장버티기 — work_leads
  const workItems: any[] = [];
  workSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) workItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(workItems, "work")) leads.push(item);

  // 토스연락통계 — gwangyeoradar_toss_users
  tGwangyeoradarSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, source: "toss-gwangyeoradar", createdAt: v.createdAt || 0 });
  });

  // 점운연락통계 — gwangyeoradar_analyses
  const gwangyeoradarItems: any[] = [];
  gwangyeoradarSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) gwangyeoradarItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(gwangyeoradarItems, "gwangyeoradar")) leads.push(item);

  // 점운손절각 — sonjeolgak_analyses
  const sonjeolgakItems: any[] = [];
  sonjeolgakSnap.forEach(child => {
    const v = child.val();
    if (v && v.phone) sonjeolgakItems.push({ id: child.key, ...v });
  });
  for (const item of dedupByPhone(sonjeolgakItems, "sonjeolgak")) leads.push(item);

  // 토스손절각 — sonjeolgak_toss_users
  tSonjeolgakSnap.forEach(child => {
    const v = child.val();
    if (v) leads.push({ id: child.key, ...v, source: "toss-sonjeolgak", createdAt: v.createdAt || 0 });
  });

  // 최종 dedup: 전화번호 기준 한 항목으로 묶기 + sources 배열로 모든 앱 기록
  // 이름 있는 항목 우선, 둘 다 이름 있으면 최신 기준
  const finalByPhone = new Map<string, any>();
  const finalNoPhone: any[] = [];
  for (const lead of leads) {
    const p = lead.phone ? String(lead.phone).replace(/\D/g, "") : "";
    const s = lead.source ?? "free";
    if (p.length >= 10) {
      const ex = finalByPhone.get(p);
      if (!ex) {
        finalByPhone.set(p, { ...lead, phone: p, sources: [s] });
      } else {
        const sources = ex.sources.includes(s) ? ex.sources : [...ex.sources, s];
        const newHasName = hasName(lead);
        const exHasName = hasName(ex);
        let merged: any;
        if (newHasName && !exHasName) {
          merged = { ...lead, phone: p, sources, email: lead.email || ex.email || "" };
        } else if (newHasName === exHasName && (lead.createdAt || 0) > (ex.createdAt || 0)) {
          merged = { ...lead, phone: p, sources, email: lead.email || ex.email || "" };
        } else {
          merged = { ...ex, sources };
        }
        finalByPhone.set(p, merged);
      }
    } else {
      finalNoPhone.push({ ...lead, sources: [s] });
    }
  }
  // 전화번호도 없고 이름도 없는 유령 항목 제거
  const validNoPhone = finalNoPhone.filter((l: any) => hasName(l));
  const finalLeads: any[] = [...finalByPhone.values(), ...validNoPhone];
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
  const adminId = verifyAdminToken(request.headers.get("x-admin-id"));
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
    db.ref("haemong_leads").remove(),
  ]);
  return NextResponse.json({ ok: true });
}
