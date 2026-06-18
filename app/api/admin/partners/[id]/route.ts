import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    return NextResponse.json({
      id: id,
      name: "테스트파트너",
      email: "test@partner.com",
      tier: "실버",
      analysisCount: 0,
      revenue: 0,
      createdAt: "2026-06-01",
    });
  } catch (error) {
    console.error("Partner detail error:", error);
    return NextResponse.json(
      { error: "파트너 상세 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}