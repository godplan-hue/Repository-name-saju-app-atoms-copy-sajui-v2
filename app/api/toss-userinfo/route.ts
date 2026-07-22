import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// 토스 유저정보 연동 콜백 — 이름/전화번호/이메일 받아서 Firebase free_leads/toss에 저장
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = body.name || body.userName || "";
    const phone = body.phoneNumber || body.phone || body.mobilePhoneNumber || "";
    const email = body.email || body.emailAddress || "";
    const source = body.source || "toss-mbti";

    if (!name && !phone && !email) {
      return NextResponse.json({ ok: false, error: "no data" }, { status: 400, headers: CORS });
    }

    const mbtiType = body.mbtiType || "";

    const entry: Record<string, string | number> = {
      name,
      source,
      createdAt: Date.now(),
    };
    if (phone) entry.phone = phone;
    if (email) entry.email = email;
    if (mbtiType) entry.mbtiType = mbtiType;

    const newRef = db.ref("free_leads/toss").push();
    await newRef.set(entry);

    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (e) {
    console.error("toss-userinfo error:", e);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500, headers: CORS });
  }
}
