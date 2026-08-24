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

const ALLOWED_PREFIXES = ["saju_leads/", "haemong_toss_users/", "zodiac_toss_users/", "petun_toss_users/"];

export async function POST(req: NextRequest) {
  try {
    const { path, data } = await req.json();
    if (typeof path !== "string" || !ALLOWED_PREFIXES.some((p) => path.startsWith(p))) {
      return cors(NextResponse.json({ error: "잘못된 경로" }, { status: 400 }));
    }
    await db.ref(path).set(data);
    return cors(NextResponse.json({ ok: true }));
  } catch (e) {
    console.error(e);
    return cors(NextResponse.json({ error: "저장 오류" }, { status: 500 }));
  }
}
