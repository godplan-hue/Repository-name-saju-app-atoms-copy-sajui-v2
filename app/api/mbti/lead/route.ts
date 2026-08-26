import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function cors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phoneDigits = String(body?.phone || "").replace(/\D/g, "");
    const isFakePhone = phoneDigits === "01012345678" || /^010(\d)\1{7}$/.test(phoneDigits);
    if (!isFakePhone) {
      await db.ref("free_leads/toss").push(body);
    }
    return cors(NextResponse.json({ ok: true }));
  } catch (e) {
    console.error(e);
    return cors(NextResponse.json({ error: "저장 오류" }, { status: 500 }));
  }
}
