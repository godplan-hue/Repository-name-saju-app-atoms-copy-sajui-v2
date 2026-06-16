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
      discountCodes: [
        {
          id: "code1",
          code: "SUMMER2024",
          discountRate: 20,
          partnerId: "partner1",
          usageCount: 0,
          status: "활성",
        },
      ],
    });
  } catch (error) {
    console.error("Discount codes error:", error);
    return NextResponse.json(
      { error: "할인코드 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}