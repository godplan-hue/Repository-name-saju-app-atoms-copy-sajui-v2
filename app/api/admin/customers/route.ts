import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 일반회원 DB는 시간이 지나면 수십만 건까지 쌓일 수 있어서, partnerArchive처럼
// 전체를 한 번에 읽어오면(once("value")) 점점 느려지고 Firebase 다운로드
// 용량도 커짐 — 그래서 최근 것부터 페이지 단위(기본 50건)로만 읽어옴.
// Firebase push 키는 생성 시각 순으로 정렬되므로 키 기준 정렬을 그대로 씀
const PAGE_SIZE = 50;

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get("cursor");

  let query = db.ref("consumerCustomers").orderByKey();
  query = cursor ? query.endBefore(cursor).limitToLast(PAGE_SIZE) : query.limitToLast(PAGE_SIZE);

  const snap = await query.once("value");
  const val = snap.val() || {};
  const customers = Object.entries(val)
    .map(([id, v]) => ({ id, ...(v as object) }))
    .sort((a: any, b: any) => (a.id < b.id ? 1 : -1)); // 최신순

  const nextCursor = customers.length === PAGE_SIZE ? customers[customers.length - 1].id : null;
  return NextResponse.json({ customers, nextCursor });
}
