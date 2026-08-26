import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { isFakePhone } from "@/lib/fakePhone";

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
    if (!isFakePhone(body?.phone)) {
      if (body && body.phone && body.entries) {
        await db.ref(`haemong_toss/${body.phone}`).set(body.entries);
      } else {
        await db.ref("haemong_toss_users").push(body);
      }
    }
    return cors(NextResponse.json({ ok: true }));
  } catch (e) {
    console.error(e);
    return cors(NextResponse.json({ error: "저장 오류" }, { status: 500 }));
  }
}
