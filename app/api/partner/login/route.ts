import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app, "(default)");

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log("🔍 로그인 시도:", { email, password });

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요" },
        { status: 400 }
      );
    }

    // 임시: test@partner.com은 test001로 매핑
    let docId = email;
    if (email === "test@partner.com") {
      docId = "test001";
    }

    console.log("📧 이메일:", email);
    console.log("📄 문서 ID:", docId);

    const partnerRef = doc(db, "partners", docId);
    const partnerDoc = await getDoc(partnerRef);

    console.log("✅ 문서 존재:", partnerDoc.exists());
    console.log("📄 문서 데이터:", partnerDoc.data());

    if (!partnerDoc.exists()) {
      console.log("❌ 파트너 없음");
      return NextResponse.json(
        { error: "등록되지 않은 파트너입니다" },
        { status: 401 }
      );
    }

    const partnerData = partnerDoc.data();

    console.log("🔑 저장된 비밀번호:", partnerData.password);
    console.log("🔑 입력한 비밀번호:", password);

    if (partnerData.password !== password) {
      console.log("❌ 비밀번호 불일치");
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다" },
        { status: 401 }
      );
    }

    console.log("✅ 로그인 성공!");

    return NextResponse.json({
      partnerId: partnerDoc.id,
      partnerName: partnerData.name,
      partnerTier: partnerData.tier,
      email: partnerData.email,
    });
  } catch (error) {
    console.error("❌ 로그인 오류:", error);
    return NextResponse.json(
      { error: "로그인 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}