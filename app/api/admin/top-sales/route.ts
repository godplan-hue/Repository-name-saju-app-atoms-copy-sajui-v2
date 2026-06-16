import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-admin-id");

    if (!adminId) {
      return NextResponse.json(
        { error: "인증되지 않았습니다" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      topSales: [
        {
          rank: 1,
          partnerId: "partner1",
          partnerName: "테스트파트너",
          analysisCount: 0,
          revenue: 0,
          tier: "실버",
        },
      ],
    });
  } catch (error) {
    console.error("Top sales error:", error);
    return NextResponse.json(
      { error: "TOP 판매자 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}