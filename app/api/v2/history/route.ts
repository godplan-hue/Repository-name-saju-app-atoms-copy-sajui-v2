import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function safeKey(name: string) {
  return name.replace(/[.#$[\]/]/g, "_").trim() || "anonymous";
}

function safePhone(phone: string) {
  return phone.replace(/\D/g, "").slice(0, 11) || "unknown_phone";
}

// GET ?name=xxx        → 이름으로 목록
// GET ?name=xxx&id=yyy → 특정 아이템 1개
// GET ?phone=xxx       → 전화번호로 목록
export async function GET(req: NextRequest) {
  const name  = req.nextUrl.searchParams.get("name")  || "";
  const phone = req.nextUrl.searchParams.get("phone") || "";
  const id    = req.nextUrl.searchParams.get("id")    || "";
  if (!name && !phone) return NextResponse.json({ items: [], item: null });
  try {
    if (name && id) {
      const snap = await db.ref(`v2_history/${safeKey(name)}/${id}`).once("value");
      return NextResponse.json({ item: snap.val() ?? null });
    }
    if (phone && !name) {
      const snap = await db.ref(`v2_history_phone/${safePhone(phone)}`).once("value");
      const data = snap.val() || {};
      const items = (Object.values(data) as any[]).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return NextResponse.json({ items });
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

// POST {name, phone?, item}   → 이름 + 전화번호 경로 모두 저장
// POST {name, deleteAll:true} → 전체 삭제
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, item, deleteAll } = body;
    if (!name) return NextResponse.json({ ok: false });
    if (deleteAll) {
      await db.ref(`v2_history/${safeKey(name)}`).remove();
      return NextResponse.json({ ok: true });
    }
    if (!item?.id) return NextResponse.json({ ok: false });
    await db.ref(`v2_history/${safeKey(name)}/${item.id}`).set(item);
    if (phone) {
      await db.ref(`v2_history_phone/${safePhone(phone)}/${item.id}`).set(item);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
