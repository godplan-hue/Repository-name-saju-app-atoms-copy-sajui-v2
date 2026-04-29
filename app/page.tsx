'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold mb-4">사주앱</h1>
      <p className="text-xl text-gray-600 mb-6">당신의 운명을 분석합니다</p>
      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-lg">
        지금 분석받기
      </button>
    </div>
  );
}
