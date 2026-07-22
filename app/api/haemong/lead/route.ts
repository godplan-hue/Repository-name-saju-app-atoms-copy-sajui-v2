import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, marketing } = body;
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (cleanPhone.length < 10) return NextResponse.json({ error: "전화번호 오류" }, { status: 400 });
    await db.ref(`haemong_leads/${cleanPhone}`).set({
      name: name || "",
      phone: cleanPhone,
      marketing: marketing ?? false,
      source: "haemong",
      createdAt: Date.now(),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "저장 오류" }, { status: 500 });
  }
}
