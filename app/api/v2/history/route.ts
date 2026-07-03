import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function safeKey(name: string) {
  return name.replace(/[.#$[\]/]/g, "_").trim() || "anonymous";
}

// GET ?name=xxx        → 해당 이름의 보관함 목록
// GET ?name=xxx&id=yyy → 특정 아이템 1개
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") || "";
  const id   = req.nextUrl.searchParams.get("id")   || "";
  if (!name) return NextResponse.json({ items: [], item: null });
  try {
    if (id) {
      const snap = await db.ref(`v2_history/${safeKey(name)}/${id}`).once("value");
      return NextResponse.json({ item: snap.val() ?? null });
    }
    const snap = await db.ref(`v2_history/${safeKey(name)}`).once("value");
    const data = snap.val() || {};
    const items = (Object.values(data) as any[]).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [], item: null });
  }
}

// POST {name, item}           → 아이템 저장
// POST {name, deleteAll:true} → 전체 삭제
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, item, deleteAll } = body;
    if (!name) return NextResponse.json({ ok: false });
    if (deleteAll) {
      await db.ref(`v2_history/${safeKey(name)}`).remove();
      return NextResponse.json({ ok: true });
    }
    if (!item?.id) return NextResponse.json({ ok: false });
    await db.ref(`v2_history/${safeKey(name)}/${item.id}`).set(item);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
