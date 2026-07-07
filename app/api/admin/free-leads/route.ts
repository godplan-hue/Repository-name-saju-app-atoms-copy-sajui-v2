import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  const adminId = request.headers.get("x-admin-id");
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snap = await db.ref("free_leads").orderByChild("createdAt").once("value");
  const leads: object[] = [];
  snap.forEach(child => {
    leads.push({ id: child.key, ...child.val() });
  });
  leads.reverse();
  return NextResponse.json({ leads });
}
