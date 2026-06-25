import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 다이아 등급 전용 — 서브도메인(예: kim.jeomun.com)으로 들어왔을 때 보여줄
// 파트너 브랜드(상호명·로고)를 저장/조회. partnerBrands는 서브도메인을
// 키로 써서, 메인 사이트가 호스트명만 보고 바로 O(1)로 찾을 수 있게 함
const RESERVED_SUBDOMAINS = new Set([
  "www", "api", "app", "admin", "main", "mail", "ftp", "blog", "shop",
  "store", "support", "help", "cdn", "static", "assets", "test", "dev",
  "staging", "jeomun",
]);

function isValidSubdomain(s: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,18}[a-z0-9]$/.test(s) && !RESERVED_SUBDOMAINS.has(s);
}

export async function POST(request: NextRequest) {
  try {
    const { partnerId, subdomain, businessName, logoUrl, customPriceBasic, customPriceStandard, customPricePremium, customPriceVip } = await request.json();
    if (!partnerId || !subdomain || !businessName) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    const partnerSnap = await db.ref(`partners/${partnerId}`).once("value");
    const partnerRecord = partnerSnap.val();
    if (!partnerRecord) {
      return NextResponse.json({ error: "파트너 정보를 찾을 수 없습니다." }, { status: 404 });
    }
    if (partnerRecord.tier !== "diamond") {
      return NextResponse.json({ error: "다이아 등급만 이용할 수 있는 기능입니다." }, { status: 403 });
    }

    const slug = String(subdomain).trim().toLowerCase();
    if (!isValidSubdomain(slug)) {
      return NextResponse.json({ error: "나만의 도메인은 영문 소문자·숫자·하이픈만 가능하며 3~20자여야 합니다(예약된 이름은 사용할 수 없습니다)." }, { status: 400 });
    }

    // 이미 다른 파트너가 쓰고 있는 서브도메인인지 확인(본인이 이전에 등록한
    // 것을 그대로 다시 저장하는 경우는 허용)
    const existing = await db.ref(`partnerBrands/${slug}`).once("value");
    if (existing.exists() && existing.val()?.partnerId !== partnerId) {
      return NextResponse.json({ error: "이미 사용 중인 도메인입니다. 다른 이름을 선택해주세요." }, { status: 409 });
    }

    // 같은 파트너가 이전에 다른 서브도메인을 등록했었다면 그 옛 기록은 정리
    const prevSlug = partnerRecord.subdomain;
    if (prevSlug && prevSlug !== slug) {
      await db.ref(`partnerBrands/${prevSlug}`).remove();
    }

    await db.ref(`partnerBrands/${slug}`).set({
      partnerId, businessName, logoUrl: logoUrl || "", updatedAt: new Date().toISOString(),
      // 화면에 보여줄 가격만 다이아 파트너가 자유롭게 바꿀 수 있게 함(실제 결제는
      // 어차피 직접 받으므로 점운 시스템 결제·정산에는 전혀 영향 없는 표시용 값)
      customPriceBasic: customPriceBasic || "", customPriceStandard: customPriceStandard || "",
      customPricePremium: customPricePremium || "", customPriceVip: customPriceVip || "",
    });
    await db.ref(`partners/${partnerId}/subdomain`).set(slug);

    return NextResponse.json({ message: "저장되었습니다.", subdomain: slug });
  } catch (error) {
    console.error("Brand save error:", error);
    return NextResponse.json({ error: "저장에 실패했습니다." }, { status: 500 });
  }
}

// 메인 사이트가 호스트명(서브도메인)을 보고 브랜드 정보를 가져올 때 씀 —
// 누구나 호출 가능(로그인 불필요), 민감 정보 없이 상호명·로고만 공개
export async function GET(request: NextRequest) {
  try {
    const subdomainParam = request.nextUrl.searchParams.get("subdomain");
    const partnerId = request.nextUrl.searchParams.get("partnerId");

    // 파트너 본인 설정 화면에서 "지금 등록된 내 브랜드"를 불러올 때 씀
    if (partnerId) {
      const partnerSnap = await db.ref(`partners/${partnerId}/subdomain`).once("value");
      const slug = partnerSnap.val();
      if (!slug) return NextResponse.json({ error: "등록된 브랜드가 없습니다." }, { status: 404 });
      const brandSnap = await db.ref(`partnerBrands/${slug}`).once("value");
      if (!brandSnap.exists()) return NextResponse.json({ error: "등록된 브랜드가 없습니다." }, { status: 404 });
      const { businessName, logoUrl, customPriceBasic, customPriceStandard, customPricePremium, customPriceVip } = brandSnap.val();
      return NextResponse.json({
        subdomain: slug, businessName, logoUrl: logoUrl || "",
        customPriceBasic: customPriceBasic || "", customPriceStandard: customPriceStandard || "",
        customPricePremium: customPricePremium || "", customPriceVip: customPriceVip || "",
      });
    }

    // 메인 사이트가 호스트명(서브도메인)을 보고 브랜드를 찾을 때 씀 — 누구나
    // 호출 가능(로그인 불필요), 민감 정보 없이 상호명·로고만 공개
    if (!subdomainParam) return NextResponse.json({ error: "subdomain 또는 partnerId가 필요합니다." }, { status: 400 });
    const snap = await db.ref(`partnerBrands/${subdomainParam.toLowerCase()}`).once("value");
    if (!snap.exists()) return NextResponse.json({ error: "등록된 브랜드가 없습니다." }, { status: 404 });

    const { businessName, logoUrl, customPriceBasic, customPriceStandard, customPricePremium, customPriceVip } = snap.val();
    return NextResponse.json({
      businessName, logoUrl: logoUrl || "",
      customPriceBasic: customPriceBasic || "", customPriceStandard: customPriceStandard || "",
      customPricePremium: customPricePremium || "", customPriceVip: customPriceVip || "",
    });
  } catch (error) {
    console.error("Brand lookup error:", error);
    return NextResponse.json({ error: "조회에 실패했습니다." }, { status: 500 });
  }
}
