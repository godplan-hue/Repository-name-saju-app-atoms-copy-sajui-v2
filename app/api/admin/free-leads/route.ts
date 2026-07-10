import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  const adminId = request.headers.get("x-admin-id");
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [freeSnap, careerSnap, resumeSnap] = await Promise.all([
    db.ref("free_leads").orderByChild("createdAt").once("value"),
    db.ref("career_analyses").orderByChild("createdAt").once("value"),
    db.ref("resume_analyses").orderByChild("createdAt").once("value"),
  ]);

  const leads: object[] = [];

  freeSnap.forEach(child => {
    leads.push({ id: child.key, ...child.val() });
  });

  careerSnap.forEach(child => {
    const v = child.val();
    if (v && v.name) {
      leads.push({
        id: child.key,
        name: v.name,
        phone: v.phone || "",
        email: v.email || "",
        birthYear: v.birthYear ? String(v.birthYear) : "",
        source: "jigun",
        createdAt: v.createdAt || 0,
      });
    }
  });

  resumeSnap.forEach(child => {
    const v = child.val();
    if (v && v.name) {
      leads.push({
        id: child.key,
        name: v.name,
        phone: v.phone || "",
        email: v.email || "",
        birthYear: v.birthYear ? String(v.birthYear) : "",
        source: "resume",
        createdAt: v.createdAt || 0,
      });
    }
  });

  leads.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

  return NextResponse.json({ leads });
}
