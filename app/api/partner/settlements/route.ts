import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET() {
  const snap = await db.ref("settlements").once("value");
  const all = snap.val() || {};
  const list = Object.entries(all)
    .map(([id, value]) => ({ id, ...(value as object) }))
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return NextResponse.json({ settlements: list });
}
