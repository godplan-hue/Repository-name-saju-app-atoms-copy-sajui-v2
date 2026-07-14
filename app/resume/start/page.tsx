"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FIELDS = ["IT", "경영", "마케팅", "금융", "영업", "의약", "교육", "공공", "기타"];
const SIZES = ["대기업", "중견", "공기업", "스타트업", "중소"];

export default function ResumeStartPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", birthYear: "", birthMonth: "", birthDay: "",
    field: "", companySize: "", company: "", keywords: "", phone: "", email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);


  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
      setForm(f => ({
        ...f,
        ...(p.name ? { name: p.name } : {}),
        ...(p.phone ? { phone: p.phone } : {}),
        ...(p.email ? { email: p.email } : {}),
      }));
    } catch {}
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit() {
    if (!form.name || !form.birthYear || !form.birthMonth || !form.birthDay || !form.field || !form.companySize) {
      setError("이름, 생년월일, 직무, 기업 규모는 필수입니다"); return;
    }
    if (!form.phone.replace(/\D/g, "") || form.phone.replace(/\D/g, "").length < 10) {
      setError("전화번호를 입력해주세요. (필수사항)"); return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...(localStorage.getItem("resume_paid_token") === "1" ? { prepaid: true } : {}) }),
      });
      const data = await res.json();
      if (data.id) {
        localStorage.removeItem("resume_paid_token");
        window.location.href = `/resume/result/${data.id}`;
      }
      else setError(data.error || "분석 실패. 다시 시도해주세요.");
    } catch { setError("네트워크 오류. 잠시 후 다시 시도해주세요."); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight:"100vh", overflowX:"hidden", background:"#030014", color:"#F5F5F5", fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"40px 16px" }}>
        <Link href="/resume" className="text-purple-400 text-sm mb-6 inline-block">← 합격자소서로</Link>

        <div className="text-center mb-8">
          <span className="inline-block bg-purple-600/80 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">🎯 AI 합격 전략 분석</span>
          <h1 className="text-3xl font-black text-white mb-2">합격 가능성 분석</h1>
          <p className="text-gray-400 text-sm">생년월일 + 직무 정보로<br />AI가 맞춤 합격 전략을 분석해드려요</p>
          <p className="text-xs mt-2" style={{color:"#a78bfa"}}>점수 무료 · 전략·키워드·면접질문은 결제 후 공개</p>
        </div>

        <div className="space-y-4">
          {/* 이름 */}
          <div>
            <label className="text-xs text-purple-400 font-bold block mb-1">이름 *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="홍길동" className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-400" />
          </div>

          {/* 생년월일 */}
          <div>
            <label className="text-xs text-purple-400 font-bold block mb-1">생년월일 *</label>
            <div className="grid grid-cols-3 gap-2">
              <input value={form.birthYear} onChange={e => set("birthYear", e.target.value)} placeholder="출생년도" maxLength={4} className="bg-white/8 border border-white/15 rounded-xl px-3 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-400" />
              <input value={form.birthMonth} onChange={e => set("birthMonth", e.target.value)} placeholder="월" maxLength={2} className="bg-white/8 border border-white/15 rounded-xl px-3 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-400" />
              <input value={form.birthDay} onChange={e => set("birthDay", e.target.value)} placeholder="일" maxLength={2} className="bg-white/8 border border-white/15 rounded-xl px-3 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-400" />
            </div>
          </div>

          {/* 지원 직무 */}
          <div>
            <label className="text-xs text-purple-400 font-bold block mb-1">지원 직무 *</label>
            <div className="flex flex-wrap gap-2">
              {FIELDS.map(f => (
                <button key={f} onClick={() => set("field", f)} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${form.field === f ? "bg-purple-600 border-purple-400 text-white" : "bg-white/8 border-white/15 text-gray-300"}`}>{f}</button>
              ))}
            </div>
          </div>

          {/* 기업 규모 */}
          <div>
            <label className="text-xs text-purple-400 font-bold block mb-1">기업 규모 *</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button key={s} onClick={() => set("companySize", s)} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${form.companySize === s ? "bg-pink-600 border-pink-400 text-white" : "bg-white/8 border-white/15 text-gray-300"}`}>{s}</button>
              ))}
            </div>
          </div>

          {/* 지원 회사명 (선택) */}
          <div>
            <label className="text-xs text-gray-400 font-bold block mb-1">지원 회사명 (선택)</label>
            <input value={form.company} onChange={e => set("company", e.target.value)} placeholder="예: 삼성전자, 카카오" className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-400" />
          </div>

          {/* 나의 강점 키워드 (선택) */}
          <div>
            <label className="text-xs text-gray-400 font-bold block mb-1">나의 강점 키워드 (선택)</label>
            <input value={form.keywords} onChange={e => set("keywords", e.target.value)} placeholder="예: 데이터 분석, 팀 리더십, 코딩" className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-400" />
          </div>

          {/* 연락처 (선택, 나중에 재열람 위해) */}
          <div>
            <label className="text-xs text-purple-400 font-bold block mb-1">전화번호 <span className="text-pink-400">★ 필수사항</span></label>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="010-0000-0000" className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-400" />
          </div>

          {/* 이메일 (선택) */}
          <div>
            <label className="text-xs text-gray-400 font-bold block mb-1">이메일 (선택 — 합격 전략 뉴스레터 수신)</label>
            <input value={form.email} onChange={e => set("email", e.target.value)} placeholder="example@email.com" type="email" className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-400" />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 shrink-0 accent-purple-500"
            />
            <span className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-300">[필수] 개인정보 수집·이용 동의</strong><br />
              수집 항목: 이름, 생년월일, 전화번호·이메일(선택) /<br />
              목적: 합격 전략 분석 서비스 제공 / 보관 기간: 3년 후 파기
            </span>
          </label>

          <button onClick={submit} disabled={loading || !agreed} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 rounded-xl text-lg mt-2 disabled:opacity-50 transition-opacity">
            {loading ? "분석 중..." : "합격 가능성 분석하기 →"}
          </button>

          <p className="text-center text-xs text-gray-500">수집된 정보는 서비스 제공 외 목적으로 사용되지 않습니다</p>
        </div>
      </div>
    </div>
  );
}
