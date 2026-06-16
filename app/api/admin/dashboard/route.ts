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
      totalPartners: 0,
      monthlyRevenue: 0,
      totalAnalysis: 0,
      topPartner: null,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "대시보드 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}