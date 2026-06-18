import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 파트너가 만든 분석 결과를 영구 저장 — 고객이 "못받았다"고 하면 다시 꺼내서
// 재발송할 수 있어야 하므로 세션이 끝나도 사라지지 않게 Firebase에 보관함.
// partnerId 기준으로만 분리되어 저장되어, 그 고객이 나중에 일반회원으로
// 직접 가입해도(별개의 localStorage 기반 가입) 이 보관함과는 섞이지 않음.
export async function POST(request: NextRequest) {
  try {
    const { partnerId, customerName, customerEmail, customerPhone, birth, birthHour, gender, packageType, result } = await request.json();
    if (!partnerId || !customerName || !result) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }
    const entry = {
      customerName, customerEmail: customerEmail || "", customerPhone: customerPhone || "",
      birth: birth || "", birthHour: birthHour || "", gender: gender || "",
      packageType: packageType || "기본 분석", result, createdAt: new Date().toISOString(),
    };
    const ref = await db.ref(`partnerArchive/${partnerId}`).push(entry);
    return NextResponse.json({ success: true, id: ref.key });
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
      return { id: entryId, customerName: v.customerName, packageType: v.packageType, createdAt: v.createdAt };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ entries: list });
}
