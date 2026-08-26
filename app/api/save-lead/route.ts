import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { isFakePhone } from "@/lib/fakePhone";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { app, name, phone, email, result } = body;

    if (!app || !phone) {
      return NextResponse.json({ error: "app, phone required" }, { status: 400, headers: CORS_HEADERS });
    }

    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const data = {
      id,
      name: name || "",
      phone,
      email: email || "",
      result: result || "",
      createdAt: new Date().toISOString(),
    };

    const pathMap: Record<string, string> = {
      battle: "battle_leads",
      movie: "movie_leads",
      style: "style_leads",
      work: "work_leads",
    };

    const path = pathMap[app] || `${app}_leads`;
    if (!isFakePhone(phone)) {
      await db.ref(`${path}/${id}`).set(data);
    }

    return NextResponse.json({ id, ok: true }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("save-lead error", err);
    return NextResponse.json({ error: "internal" }, { status: 500, headers: CORS_HEADERS });
  }
}
