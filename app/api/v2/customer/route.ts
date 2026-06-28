import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, birthYear, birthMonth, birthDay, gender, birthHour, relationship } = await request.json();
    if (!name || (!phone && !email)) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    // 전화번호 또는 이메일 기준 중복 확인 — 같은 사람이 여러 번 가입해도 1건만 저장
    if (phone) {
      const snap = await db.ref("consumerCustomers").orderByChild("phone").equalTo(phone).limitToFirst(1).once("value");
      if (snap.exists()) return NextResponse.json({ success: true, duplicate: true });
    }
    if (email) {
      const snap = await db.ref("consumerCustomers").orderByChild("email").equalTo(email).limitToFirst(1).once("value");
      if (snap.exists()) return NextResponse.json({ success: true, duplicate: true });
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
