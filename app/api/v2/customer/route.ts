import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 일반(파트너 아닌) 고객의 연락처를 서버에도 저장 — 지금까지는 동의를 받고도
// 본인 휴대폰(localStorage)에만 저장되고 서버에는 남지 않았음. 목록이 매우
// 커질 수 있어 admin 쪽에서는 전체를 한 번에 읽지 않고 최근 것부터 페이지
// 단위로만 읽도록 만들었음(GET /api/admin/customers 참고)
export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, birthYear, birthMonth, birthDay, gender, birthHour, relationship } = await request.json();
    if (!name || !phone && !email) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }
    const entry = {
      name, phone: phone || "", email: email || "",
      birthYear: birthYear || "", birthMonth: birthMonth || "", birthDay: birthDay || "",
      gender: gender || "", birthHour: birthHour || "", relationship: relationship || "",
      consentGiven: true, createdAt: new Date().toISOString(),
    };
    const ref = await db.ref("consumerCustomers").push(entry);
    return NextResponse.json({ success: true, id: ref.key });
  } catch (error) {
    console.error("일반회원 저장 실패:", error);
    return NextResponse.json({ error: "저장에 실패했습니다." }, { status: 500 });
  }
}
