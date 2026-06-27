import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { calculatePartnerCharge, getPartnerTier, isAnnualFeeExpired } from "@/lib/partnerTiers";
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

    // 가입비/연회비를 계좌이체로 받기로 했고, 점운님이 입금을 직접 확인하기
    // 전까지는 분석 생성 자체를 막음(확인 전에 마음대로 쓰는 걸 방지)
    if (partnerRecord?.paymentConfirmed === false) {
      return NextResponse.json({ error: "가입비 입금 확인 후 이용 가능합니다. 입금 확인되면 안내드릴게요." }, { status: 403 });
    }

    if (isAnnualFeeExpired(tierId, partnerRecord?.feeRenewedAt)) {
      return NextResponse.json({ error: "연회비 갱신이 필요합니다. 갱신 후 다시 시도해주세요." }, { status: 403 });
    }

    if (tierId === "free" && partnerRecord?.createdAt) {
      const createdAt = new Date(partnerRecord.createdAt);
      const threeMonthsLater = new Date(createdAt);
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 0); // 테스트용 — 원복 필요
      if (new Date() > threeMonthsLater) {
        return NextResponse.json({ error: "무료 등급 3개월 이용 기간이 만료되었습니다. 유료 등급으로 업그레이드 후 계속 이용하세요." }, { status: 403 });
      }
    }

    // 한도 확인은 파트너 보관함 전체를 읽지 않고, 미리 집계해 둔 이번 달
    // 건수(partnerStats)만 가볍게 읽어서 확인함 — 보관함이 몇만 건이 쌓여도
    // 분석 생성 속도가 느려지지 않게 하기 위함
    const yyyymm = new Date().toISOString().slice(0, 7);
    if (tier.monthlyLimit !== null) {
      const monthSnap = await db.ref(`partnerStats/${partnerId}/${yyyymm}/count`).once("value");
      const usedThisMonth = monthSnap.val() || 0;
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

    // 관리자 화면에서 전체 보관함을 매번 다 읽지 않고도 매출/건수를 바로 볼 수
    // 있게, 총합/이번달 집계를 같이 갱신해둠(트랜잭션이라 동시 요청에도 안전)
    const inc = (cur: { count: number; revenue: number } | null) => ({
      count: (cur?.count || 0) + 1,
      revenue: (cur?.revenue || 0) + charge.totalCharge,
    });
    await Promise.all([
      db.ref(`partnerStats/${partnerId}/total`).transaction(inc),
      db.ref(`partnerStats/${partnerId}/${yyyymm}`).transaction(inc),
    ]);

    return NextResponse.json({ success: true, id: ref.key, charge });
  } catch (error) {
    console.error("Partner archive save error:", error);
    return NextResponse.json({ error: "보관함 저장 실패" }, { status: 500 });
  }
}

const PAGE_SIZE = 50;

export async function GET(request: NextRequest) {
  const partnerId = request.nextUrl.searchParams.get("partnerId");
  const id = request.nextUrl.searchParams.get("id");
  const cursor = request.nextUrl.searchParams.get("cursor");
  if (!partnerId) {
    return NextResponse.json({ error: "partnerId가 필요합니다." }, { status: 400 });
  }

  if (id) {
    const snap = await db.ref(`partnerArchive/${partnerId}/${id}`).once("value");
    const entry = snap.val();
    if (!entry) return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json({ entry: { id, ...entry } });
  }

  // 보관함이 많이 쌓여도 느려지지 않게, 한 번에 다 읽지 않고 최신 50건씩만
  // 페이지 단위로 읽음. 전체/이번달 합계는 미리 집계해둔 partnerStats로 따로
  // 정확하게 계산해서 같이 내려줌(목록이 일부만 보여도 합계는 정확함)
  let query = db.ref(`partnerArchive/${partnerId}`).orderByKey();
  query = cursor ? query.endBefore(cursor).limitToLast(PAGE_SIZE) : query.limitToLast(PAGE_SIZE);

  const [snap, statsSnap] = await Promise.all([
    query.once("value"),
    db.ref(`partnerStats/${partnerId}`).once("value"),
  ]);
  const all = snap.val() || {};
  const list = Object.entries(all)
    .map(([entryId, value]) => {
      const v = value as any;
      return { id: entryId, customerName: v.customerName, packageType: v.packageType, charge: v.charge, createdAt: v.createdAt };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const nextCursor = list.length === PAGE_SIZE ? Object.keys(all).sort()[0] : null;
  const stats = statsSnap.val() || {};
  return NextResponse.json({ entries: list, nextCursor, stats });
}
