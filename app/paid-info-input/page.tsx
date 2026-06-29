"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

export default function PaidInfoInput() {
  return (
    <Suspense fallback={null}>
      <PaidInfoInputInner />
    </Suspense>
  );
}

// 태어난시는 main-v2/profile이 전통 12간지 체계("00"=자시 등)를 쓰고 이 페이지는
// 0~23시 체계를 써서 형식이 달라, 각 간지의 시작 시각으로 변환함
const HOUR_PERIOD_TO_24H: Record<string, string> = {
  "00": "23", "01": "1", "02": "3", "03": "5", "04": "7", "05": "9",
  "06": "11", "07": "13", "08": "15", "09": "17", "10": "19", "11": "21",
};

// 위 변환의 반대 방향 — 이 화면은 0~23시 그대로 고르게 해두고, 서버로 보낼 때는
// 전통 12간지 체계("00"=자시 등)로 다시 바꿔야 함. 안 바꾸고 그대로 보내면
// (예: 23시를 그냥 "23"으로 보내면) 서버에서 0~11 범위를 벗어나 시주 계산이
// 통째로 빠지는 문제가 있었음(자정을 넘기는 자시만 23~01시로 특별 처리)
function hourTo12Branch(hour24: string): string {
  const h = parseInt(hour24, 10);
  if (isNaN(h)) return "unknown";
  return String(Math.floor(((h + 1) % 24) / 2)).padStart(2, "0");
}

function PaidInfoInputInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("unknown");
  const [birthMinute, setBirthMinute] = useState("unknown");
  const [isLoading, setIsLoading] = useState(false);
  const [autoSkipping, setAutoSkipping] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthYear, setPartnerBirthYear] = useState("");
  const [partnerBirthMonth, setPartnerBirthMonth] = useState("");
  const [partnerBirthDay, setPartnerBirthDay] = useState("");
  const [partnerBirthHour, setPartnerBirthHour] = useState("unknown");
  const [partnerBirthMinute, setPartnerBirthMinute] = useState("unknown");

  useEffect(() => {
    setPartnerName("");
    setPartnerBirthYear("");
    setPartnerBirthMonth("");
    setPartnerBirthDay("");
    setPartnerBirthHour("unknown");
    setPartnerBirthMinute("unknown");

    const packageFromUrl = searchParams.get("package") || "";
    const pkg = packageFromUrl ? decodeURIComponent(packageFromUrl) : "";

    // 한 번 입력한 본인 정보는 localStorage에 저장돼 있으면 전부 채워줌 — 결제할
    // 때마다 똑같은 정보를 다시 입력하는 불편을 줄이고 "다음"만 누르면 되게 함.
    // 이 페이지의 월/일 select는 0패딩 없는 값("5")을 쓰므로 숫자로 변환해서 채움.
    const saved = localStorage.getItem("v2_saved_profile");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setName(p.name ?? "");
        setBirthYear(p.birthYear ?? "");
        setBirthMonth(p.birthMonth ? String(Number(p.birthMonth)) : "");
        setBirthDay(p.birthDay ? String(Number(p.birthDay)) : "");
        setBirthHour(p.birthHour && HOUR_PERIOD_TO_24H[p.birthHour] ? HOUR_PERIOD_TO_24H[p.birthHour] : "unknown");

        // 유료 다시보기: 본인 정보가 다 있고 VIP 커플팩(상대방 정보 매번 다를 수
        // 있어 제외)이 아니며, 같은 로그인 세션 안에서 이미 한 번 분석을
        // 완료했으면 — 무료 다시보기와 똑같이 화면 자체를 건너뛰고 곧바로 분석함
        // 로그인을 계속 유지한 채로 다음 날 다시 들어와도(로그아웃 안 해도)
        // 이 화면을 한 번은 다시 보여줘야 해서, 로그인 세션뿐 아니라 "오늘 날짜"도
        // 같이 확인함 — 날짜가 바뀌면 세션이 같아도 다시 보여줌
        const loginSessionId = localStorage.getItem("v2_login_session_id") ?? "";
        const shownForSession = localStorage.getItem("v2_paid_info_shown_session") ?? "";
        const shownOnDate = localStorage.getItem("v2_paid_info_shown_date") ?? "";
        const todayKey = new Date().toDateString();
        const alreadyShownThisSession = loginSessionId !== "" && loginSessionId === shownForSession && shownOnDate === todayKey;
        const complete = !!(p.name && p.birthYear && p.birthMonth && p.birthDay);
        if (complete && pkg !== "VIP 커플팩" && alreadyShownThisSession) {
          setAutoSkipping(true);
          runAnalysis({
            name: p.name,
            birthYear: p.birthYear,
            birthMonth: String(Number(p.birthMonth)),
            birthDay: String(Number(p.birthDay)),
            birthHour: p.birthHour && HOUR_PERIOD_TO_24H[p.birthHour] ? HOUR_PERIOD_TO_24H[p.birthHour] : "unknown",
            birthMinute: "unknown",
            pkg,
          });
        }
        return;
      } catch {}
    }
    setName("");
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setBirthHour("unknown");
    setBirthMinute("unknown");
  }, []);

  useEffect(() => {
    const packageFromUrl = searchParams.get("package") || "";
    if (packageFromUrl) {
      setSelectedPackage(decodeURIComponent(packageFromUrl));
    }
  }, [searchParams]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const BIRTH_HOURS = [
    { label: "자시(子時)", time: "23~01시", value: "23" },
    { label: "축시(丑時)", time: "01~03시", value: "1" },
    { label: "인시(寅時)", time: "03~05시", value: "3" },
    { label: "묘시(卯時)", time: "05~07시", value: "5" },
    { label: "진시(辰時)", time: "07~09시", value: "7" },
    { label: "사시(巳時)", time: "09~11시", value: "9" },
    { label: "오시(午時)", time: "11~13시", value: "11" },
    { label: "미시(未時)", time: "13~15시", value: "13" },
    { label: "신시(申時)", time: "15~17시", value: "15" },
    { label: "유시(酉時)", time: "17~19시", value: "17" },
    { label: "술시(戌時)", time: "19~21시", value: "19" },
    { label: "해시(亥時)", time: "21~23시", value: "21" },
  ];
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  // 본인 정보(+선택적 상대방 정보)를 받아 실제 분석을 호출하는 공통 로직.
  // 버튼 클릭(폼 입력)과 "유료 다시보기 자동 건너뛰기" 양쪽에서 같이 씀.
  const runAnalysis = async (p: {
    name: string; birthYear: string; birthMonth: string; birthDay: string;
    birthHour: string; birthMinute: string; pkg: string;
    partnerName?: string; partnerBirthYear?: string; partnerBirthMonth?: string; partnerBirthDay?: string; partnerBirthHour?: string;
  }) => {
    setIsLoading(true);

    try {
      const birthDate = `${p.birthYear}-${String(p.birthMonth).padStart(2, '0')}-${String(p.birthDay).padStart(2, '0')}`;

      // 다음 방문 때(무료 흐름 포함) 그대로 채워줄 수 있도록 0패딩된 형태로 저장.
      // 이 페이지는 성별/태어난시/연락처를 안 받으므로, 기존에 저장돼 있던 값(예: 무료
      // 흐름에서 입력한 성별 등)을 통째로 덮어쓰지 않고 이름/생년월일만 덮어써서 병합
      let prevSaved: Record<string, string> = {};
      try { prevSaved = JSON.parse(localStorage.getItem('v2_saved_profile') || '{}'); } catch {}
      localStorage.setItem('v2_saved_profile', JSON.stringify({
        ...prevSaved,
        name: p.name, birthYear: p.birthYear,
        birthMonth: String(p.birthMonth).padStart(2, '0'), birthDay: String(p.birthDay).padStart(2, '0'),
      }));

      const PKG_NAMES_PRE = ['기본 분석', '베이직', '프리미엄', 'VIP 커플팩'];
      const prePlan = PKG_NAMES_PRE.includes(p.pkg) ? 'package' : 'select';

      const res = await fetch('/api/v2/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: p.name,
          birth: birthDate,
          birthHour: hourTo12Branch(p.birthHour),
          gender: 'N',
          relationship: 'solo',
          category: '🌟 오늘의 운세',
          planType: prePlan,
          partnerName: p.partnerName || undefined,
          partnerBirthHour: hourTo12Branch(p.partnerBirthHour ?? 'unknown'),
          partnerBirth: (p.partnerBirthYear && p.partnerBirthMonth && p.partnerBirthDay)
            ? `${p.partnerBirthYear}-${String(p.partnerBirthMonth).padStart(2,'0')}-${String(p.partnerBirthDay).padStart(2,'0')}`
            : undefined,
          partnerGender: 'N',
        }),
      });

      if (!res.ok) {
        alert('분석 실패. 다시 시도해주세요.');
        setIsLoading(false);
        setAutoSkipping(false);
        return;
      }

      const data = await res.json();

      const PKG_NAMES = ['기본 분석', '베이직', '프리미엄', 'VIP 커플팩'];
      const plan = PKG_NAMES.includes(p.pkg) ? 'package' : 'select';
      const profile = { name: p.name, birthYear: p.birthYear, birthMonth: p.birthMonth, birthDay: p.birthDay, birthHour: p.birthHour, gender: 'N', relationship: 'solo' };
      const result = { ...data, profile, histId: Date.now(), savedAt: new Date().toISOString() };

      const PKG_PRICE_MAP: Record<string, string> = {
        '기본 분석': '9900',
        '베이직': '19900',
        '프리미엄': '24900',
        'VIP 커플팩': '29900',
      };
      const price = plan === 'select' ? '990' : (PKG_PRICE_MAP[p.pkg] ?? '9900');

      sessionStorage.setItem('v2_result', JSON.stringify(result));
      sessionStorage.setItem('v2_paid', '1');
      sessionStorage.setItem('v2_plan', plan);
      sessionStorage.setItem('selectedPackage', p.pkg);
      sessionStorage.setItem('price', price);
      const _d = new Date();
      const _tk = `${_d.getFullYear()}-${String(_d.getMonth()+1).padStart(2,"0")}-${String(_d.getDate()).padStart(2,"0")}`;
      localStorage.setItem(`v2_qa_unlock_${p.name}_${p.birthYear}`, _tk);

      // 유료 다시보기도 무료 다시보기와 같은 패턴으로, 같은 로그인 세션 + 오늘
      // 안에서는 이번 화면을 다시 보여주지 않도록 기록(로그아웃하거나 날짜가
      // 바뀌면 다시 보여줌)
      const loginSessionId = localStorage.getItem('v2_login_session_id');
      if (loginSessionId) {
        localStorage.setItem('v2_paid_info_shown_session', loginSessionId);
        localStorage.setItem('v2_paid_info_shown_date', new Date().toDateString());
      }

      router.push('/main-v2/result');
    } catch (error) {
      console.error('분석 오류:', error);
      alert('분석 중 오류가 발생했습니다.');
      setIsLoading(false);
      setAutoSkipping(false);
    }
  };

  const handleAnalysis = async () => {
    if (
      !name ||
      !birthYear ||
      !birthMonth ||
      !birthDay ||
      birthHour === "" ||
      birthMinute === ""
    ) {
      alert("모든 필수 정보를 입력해주세요!");
      return;
    }

    if (selectedPackage === "VIP 커플팩") {
      if (
        !partnerName ||
        !partnerBirthYear ||
        !partnerBirthMonth ||
        !partnerBirthDay ||
        partnerBirthHour === "" ||
        partnerBirthMinute === ""
      ) {
        alert("상대방의 모든 정보를 입력해주세요!");
        return;
      }
    }

    runAnalysis({
      name, birthYear, birthMonth, birthDay, birthHour, birthMinute,
      pkg: selectedPackage,
      partnerName, partnerBirthYear, partnerBirthMonth, partnerBirthDay, partnerBirthHour,
    });
  };

  if (autoSkipping) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)" }}>
        <p style={{ color: "#fbbf24", fontWeight: 900, fontSize: 16 }}>🔮 분석 중...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)",
        backgroundImage:
          "url('https://i.pinimg.com/736x/01/06/cf/0106cf95904beef38c601c1f2062a25d.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "white",
        padding: "40px 16px",
        fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.55)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 420, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🔮</div>
            <h1
              style={{
                fontSize: "clamp(22px, 4vw, 28px)",
                fontWeight: 900,
                marginBottom: 8,
                color: "#fbbf24",
              }}
            >
              점운 분석
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#f5f5f5",
                fontWeight: 700,
                margin: 0,
              }}
            >
              당신의 정보를 입력해주세요
            </p>
          </div>

          <div
            style={{
              background: "rgba(139,92,246,0.3)",
              padding: 9,
              borderRadius: 12,
              marginBottom: 14,
              border: "1px solid rgba(251,191,36,0.3)",
            }}
          >
            <div style={{ marginBottom: 7, paddingBottom: 10, borderBottom: "2px solid rgba(251,191,36,0.5)" }}>
              <h3 style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, marginBottom: 8 }}>본인 정보</h3>

              <div style={{ marginBottom: 8 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fbbf24",
                    marginBottom: 5,
                  }}
                >
                  이름
                </label>
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 9,
                    borderRadius: 8,
                    border: "1px solid #fbbf24",
                    background: "#fff",
                    color: "#333",
                    fontSize: 14,
                    fontWeight: 700,
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fbbf24",
                    marginBottom: 8,
                  }}
                >
                  생년월일
                </label>

                <input
                  type="number"
                  placeholder="연도를 입력하세요 (예: 1990)"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  min="1900"
                  max={new Date().getFullYear()}
                  style={{
                    width: "100%",
                    padding: 9,
                    marginBottom: 7,
                    borderRadius: 8,
                    border: "1px solid #fbbf24",
                    background: "#fff",
                    color: "#333",
                    fontSize: 14,
                    fontWeight: 700,
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />

                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  style={{
                    width: "48%",
                    padding: 9,
                    marginRight: "4%",
                    marginBottom: 7,
                    borderRadius: 8,
                    border: "1px solid #fbbf24",
                    background: "#fff",
                    color: "#333",
                    fontSize: 14,
                    fontWeight: 700,
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <option value="">월선택</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}월
                    </option>
                  ))}
                </select>

                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  style={{
                    width: "48%",
                    padding: 9,
                    marginBottom: 7,
                    borderRadius: 8,
                    border: "1px solid #fbbf24",
                    background: "#fff",
                    color: "#333",
                    fontSize: 14,
                    fontWeight: 700,
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <option value="">일선택</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}일
                    </option>
                  ))}
                </select>

                <div style={{ width: "100%", marginBottom: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 6 }}>
                    {BIRTH_HOURS.map((h) => (
                      <button key={h.value} onClick={() => setBirthHour(h.value)} style={{ padding: "9px 2px", border: birthHour === h.value ? "2px solid #fbbf24" : "1.5px solid #ddd", background: birthHour === h.value ? "#fffbeb" : "#fff", borderRadius: 8, fontWeight: 700, fontSize: 11, cursor: "pointer", color: birthHour === h.value ? "#b45309" : "#333", textAlign: "center" }}>
                        {h.label}<br/><span style={{ fontSize: 9, opacity: 0.65 }}>{h.time}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setBirthHour("unknown")} style={{ width: "100%", padding: "9px 0", border: birthHour === "unknown" ? "2px solid #fbbf24" : "1.5px solid #ddd", background: birthHour === "unknown" ? "#fffbeb" : "#fff", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", color: birthHour === "unknown" ? "#b45309" : "#333" }}>모름</button>
                </div>

              </div>
            </div>

            {selectedPackage === "VIP 커플팩" && (
              <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "2px solid rgba(251,191,36,0.5)" }}>
                <h3 style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, marginBottom: 16 }}>상대방 정보</h3>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fbbf24",
                      marginBottom: 8,
                    }}
                  >
                    상대방 이름
                  </label>
                  <input
                    type="text"
                    placeholder="상대방 이름을 입력하세요"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 9,
                      borderRadius: 8,
                      border: "1px solid #fbbf24",
                      background: "#fff",
                      color: "#333",
                      fontSize: 14,
                      fontWeight: 700,
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fbbf24",
                      marginBottom: 8,
                    }}
                  >
                    상대방 생년월일
                  </label>

                  <input
                    type="number"
                    placeholder="연도를 입력하세요 (예: 1990)"
                    value={partnerBirthYear}
                    onChange={(e) => setPartnerBirthYear(e.target.value)}
                    min="1900"
                    max={new Date().getFullYear()}
                    style={{
                      width: "100%",
                      padding: 9,
                      marginBottom: 7,
                      borderRadius: 8,
                      border: "1px solid #fbbf24",
                      background: "#fff",
                      color: "#333",
                      fontSize: 14,
                      fontWeight: 700,
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />

                  <select
                    value={partnerBirthMonth}
                    onChange={(e) => setPartnerBirthMonth(e.target.value)}
                    style={{
                      width: "48%",
                      padding: 9,
                      marginRight: "4%",
                      marginBottom: 7,
                      borderRadius: 8,
                      border: "1px solid #fbbf24",
                      background: "#fff",
                      color: "#333",
                      fontSize: 14,
                      fontWeight: 700,
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">월선택</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}월
                      </option>
                    ))}
                  </select>

                  <select
                    value={partnerBirthDay}
                    onChange={(e) => setPartnerBirthDay(e.target.value)}
                    style={{
                      width: "48%",
                      padding: 9,
                      marginBottom: 7,
                      borderRadius: 8,
                      border: "1px solid #fbbf24",
                      background: "#fff",
                      color: "#333",
                      fontSize: 14,
                      fontWeight: 700,
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">일선택</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}일
                      </option>
                    ))}
                  </select>

                  <div style={{ width: "100%", marginBottom: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 6 }}>
                      {BIRTH_HOURS.map((h) => (
                        <button key={h.value} onClick={() => setPartnerBirthHour(h.value)} style={{ padding: "9px 2px", border: partnerBirthHour === h.value ? "2px solid #fbbf24" : "1.5px solid #ddd", background: partnerBirthHour === h.value ? "#fffbeb" : "#fff", borderRadius: 8, fontWeight: 700, fontSize: 11, cursor: "pointer", color: partnerBirthHour === h.value ? "#b45309" : "#333", textAlign: "center" }}>
                          {h.label}<br/><span style={{ fontSize: 9, opacity: 0.65 }}>{h.time}</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setPartnerBirthHour("unknown")} style={{ width: "100%", padding: "9px 0", border: partnerBirthHour === "unknown" ? "2px solid #fbbf24" : "1.5px solid #ddd", background: partnerBirthHour === "unknown" ? "#fffbeb" : "#fff", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", color: partnerBirthHour === "unknown" ? "#b45309" : "#333" }}>모름</button>
                  </div>

                </div>
              </div>
            )}

            <button
              onClick={handleAnalysis}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: 16,
                background: isLoading ? "rgba(251,191,36,0.5)" : "linear-gradient(135deg, #fbbf24, #f59e0b)",
                color: "#1a1a1a",
                border: "none",
                borderRadius: 10,
                fontWeight: 900,
                fontSize: 16,
                cursor: isLoading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {isLoading ? "분석 중..." : "분석 시작"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}