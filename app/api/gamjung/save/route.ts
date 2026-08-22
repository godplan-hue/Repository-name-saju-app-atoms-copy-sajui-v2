import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function cors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function POST(req: NextRequest) {
  try {
    const { userId, type, data } = await req.json();
    if (!userId || !type || data === undefined) return cors(NextResponse.json({ error: "필수 파라미터 없음" }, { status: 400 }));
    const safeId = userId.replace(/[.#$[\]]/g, "_");
    await db.ref(`gamjung_storage/${safeId}/${type}`).set(data);
    return cors(NextResponse.json({ ok: true }));
  } catch (e) {
    console.error(e);
    return cors(NextResponse.json({ error: "저장 오류" }, { status: 500 }));
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const type = url.searchParams.get("type");
    if (!userId || !type) return cors(NextResponse.json({ error: "필수 파라미터 없음" }, { status: 400 }));
    const safeId = userId.replace(/[.#$[\]]/g, "_");
    const snap = await db.ref(`gamjung_storage/${safeId}/${type}`).once("value");
    return cors(NextResponse.json({ data: snap.val() ?? [] }));
  } catch (e) {
    console.error(e);
    return cors(NextResponse.json({ data: [] }));
  }
}
