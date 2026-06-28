import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = request.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json({ error: "인증되지 않았습니다" }, { status: 401 });
    }
    const { id } = await params;
    await db.ref(`consumerCustomers/${id}`).remove();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer delete error:", error);
    return NextResponse.json({ error: "삭제 중 오류가 발생했습니다" }, { status: 500 });
  }
}
