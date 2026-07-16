import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const snap = await db.ref("share_coupon_pending").once("value");
    const data = snap.val() || {};
    const list = Object.values(data).sort((a: any, b: any) => b.createdAt - a.createdAt);
    return NextResponse.json({ list });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ list: [] });
  }
}
