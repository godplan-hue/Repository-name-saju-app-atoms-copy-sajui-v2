import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { isFakePhone } from "@/lib/fakePhone";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, birthYear, birthMonth, birthDay, score } = await req.json();
    if (!name || !phone) return NextResponse.json({ error: "이름과 전화번호가 필요합니다." }, { status: 400 });
    const cleanPhone = String(phone).replace(/\D/g, "");
    const id = cleanPhone.length >= 10 ? `free_${cleanPhone}` : `free_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    if (!isFakePhone(cleanPhone)) {
      await db.ref(`resume_analyses/${id}`).set({
        name,
        phone: cleanPhone,
        email: email || "",
        birthYear: birthYear || "",
        birthMonth: birthMonth || "",
        birthDay: birthDay || "",
        score: score || 0,
        source: "resume",
        type: "free",
        createdAt: Date.now(),
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("resume-lead save error:", e);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
