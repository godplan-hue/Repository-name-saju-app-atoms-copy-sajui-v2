import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 공유 링크를 받은 사람도(다른 휴대폰/브라우저) 실제 결과를 볼 수 있게,
// 공유하는 순간 결과를 서버(Firebase)에 저장해두고 그 고유 id로 공개 조회함
export async function POST(request: NextRequest) {
  try {
    const { name, scores, luckyColor, luckyNumber, luckyDirection, categories, businessName } = await request.json();
    if (!name || !categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }
    const entry = {
      name, scores: scores || {},
      luckyColor: luckyColor || "", luckyNumber: luckyNumber || "", luckyDirection: luckyDirection || "",
      categories, businessName: businessName || "", createdAt: new Date().toISOString(),
    };
    const ref = await db.ref("sharedResults").push(entry);
    return NextResponse.json({ id: ref.key });
  } catch (error) {
    console.error("공유 저장 실패:", error);
    return NextResponse.json({ error: "공유 저장에 실패했습니다." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
  const snap = await db.ref(`sharedResults/${id}`).once("value");
  const entry = snap.val();
  if (!entry) return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ entry });
}
