import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    const adminId = verifyAdminToken(request.headers.get("x-admin-id"));
    if (!adminId) return NextResponse.json({ error: "인증되지 않았습니다" }, { status: 401 });

    const snap = await db.ref("share_coupon_pending").once("value");
    const data = snap.val() || {};
    const list = Object.values(data).sort((a: any, b: any) => b.createdAt - a.createdAt);
    return NextResponse.json({ list });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ list: [] });
  }
}
