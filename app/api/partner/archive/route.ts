import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { calculatePartnerCharge, getPartnerTier } from "@/lib/partnerTiers";
import { PACKAGES } from "@/lib/constants";

function getListPrice(packageType: string): number {
  const pkg = Object.values(PACKAGES).find(p => p.name === packageType);
  return pkg?.price ?? PACKAGES.basic.price;
}

// 파트너가 분석을 생성하는 그 순간 = 우리에게 사용료를 즉시 내는 순간.
// 동시에 결과를 영구 저장 — 고객이 "못받았다"고 하면 다시 꺼내서 재발송할 수
// 있어야 하므로 세션이 끝나도 사라지지 않게 Firebase에 보관함.
// partnerId 기준으로만 분리되어 저장되어, 그 고객이 나중에 일반회원으로
// 직접 가입해도(별개의 localStorage 기반 가입) 이 보관함과는 섞이지 않음.
export async function POST(request: NextRequest) {
  try {
    const { partnerId, partnerName, customerName, customerEmail, customerPhone, birth, birthHour, gender, packageType, result, consentGiven } = await request.json();
    if (!partnerId || !customerName || !result) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }
    if (!consentGiven) {
      return NextResponse.json({ error: "고객 개인정보 수집·이용 동의를 확인해야 저장할 수 있습니다." }, { status: 400 });
    }

    const partnerSnap = await db.ref(`partners/${partnerId}`).once("value");
    const partnerRecord = partnerSnap.val();
    const tierId = partnerRecord?.tier || "free";
    const tier = getPartnerTier(tierId);

    if (tier.monthlyLimit !== null) {
      const existingSnap = await db.ref(`partnerArchive/${partnerId}`).once("value");
      const existing = Object.values(existingSnap.val() || {}) as Array<{ createdAt: string }>;
      const now = new Date();
      const usedThisMonth = existing.filter(e => {
        const d = new Date(e.createdAt);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      }).length;
      if (usedThisMonth >= tier.monthlyLimit) {
        return NextResponse.json({ error: "이번 달 분석 생성 한도를 모두 사용했습니다. 다음 달에 다시 시도하거나 등급을 업그레이드해주세요." }, { status: 403 });
      }
    }

    const listPrice = getListPrice(packageType || "기본 분석");
    const charge = calculatePartnerCharge(listPrice, tierId);

    const entry = {
      partnerName: partnerName || "",
      customerName, customerEmail: customerEmail || "", customerPhone: customerPhone || "",
      birth: birth || "", birthHour: birthHour || "", gender: gender || "",
      packageType: packageType || "기본 분석", result, consentGiven: true,
      charge, createdAt: new Date().toISOString(),
    };
    const ref = await db.ref(`partnerArchive/${partnerId}`).push(entry);
    return NextResponse.json({ success: true, id: ref.key, charge });
  } catch (error) {
    console.error("Partner archive save error:", error);
    return NextResponse.json({ error: "보관함 저장 실패" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const partnerId = request.nextUrl.searchParams.get("partnerId");
  const id = request.nextUrl.searchParams.get("id");
  if (!partnerId) {
    return NextResponse.json({ error: "partnerId가 필요합니다." }, { status: 400 });
  }

  if (id) {
    const snap = await db.ref(`partnerArchive/${partnerId}/${id}`).once("value");
    const entry = snap.val();
    if (!entry) return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json({ entry: { id, ...entry } });
  }

  const snap = await db.ref(`partnerArchive/${partnerId}`).once("value");
  const all = snap.val() || {};
  const list = Object.entries(all)
    .map(([entryId, value]) => {
      const v = value as any;
      return { id: entryId, customerName: v.customerName, packageType: v.packageType, charge: v.charge, createdAt: v.createdAt };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ entries: list });
}
