"use client";

import { useRouter } from "next/navigation";

const YELLOW = "#FFD158";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function HomePage() {
  const router = useRouter();

  const goScan = () => router.push("/scan");
  const goMy = () => alert("MVP: MY 준비중");
  const goStore = () => alert("MVP: 스토어 준비중");
  const goWedding = () => alert("MVP: 청첩장 준비중");

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#E9E9E9] px-5 pt-10 pb-28">
      {/* 상단 상태바 영역은 모바일에서 자동이므로 여백만 유지 */}

      {/* 상단 카드 */}
      <section className="rounded-[26px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* 카드 헤더: 로고 + 식권 */}
        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex items-center gap-2">
            <img src="/assets/logo.svg" alt="MaumPay" className="h-7 w-auto" />
          </div>

          {/* 식권 pill */}
          <button
            onClick={() => router.push("/guest/ticket")}
            className="rounded-full px-4 py-2 text-sm font-bold text-[#111] active:opacity-70"
            style={{ backgroundColor: YELLOW }}
          >
            식권
          </button>
        </div>

        {/* 잔액 */}
        <div className="px-6 pt-4">
          <button
            className="flex w-full items-center justify-end gap-2 text-right text-3xl font-extrabold text-[#333] active:opacity-70"
            onClick={() => alert("MVP: 잔액 상세 준비중")}
          >
            {formatWon(300_000)}
            <span className="text-[#777]">{">"}</span>
          </button>

          {/* 충전 | 송금 */}
          <div className="mt-4 flex items-center gap-4 text-sm font-semibold text-[#555]">
            <button className="active:opacity-70" onClick={() => alert("MVP: 충전 준비중")}>
              충전
            </button>
            <span className="text-[#D0D0D0]">|</span>
            <button className="active:opacity-70" onClick={() => alert("MVP: 송금 준비중")}>
              송금
            </button>

            <div className="flex-1" />

            {/* 마음 전하기 버튼 */}
            <button
              onClick={goScan}
              className="flex items-center gap-2 rounded-2xl bg-[#222] px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(0,0,0,0.18)] active:opacity-80"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/10">
                ▣
              </span>
              마음 전하기
            </button>
          </div>
        </div>

        {/* 큰 배너 영역 */}
        <div className="mt-5 px-6 pb-6">
          <div className="relative h-36 w-full rounded-[22px] bg-[#CFCFCF]">
            <div className="absolute bottom-3 right-4 text-xs font-semibold text-[#555]">
              1/10
            </div>
          </div>
        </div>
      </section>

      {/* 아래 카드: 아이콘 그리드 */}
      <section className="mt-5 rounded-[26px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)] px-6 py-6">
        <div className="grid grid-cols-4 gap-x-6 gap-y-6">
          {[
            "웨딩 신청",
            "웨딩홀 예약",
            "스드메 특가",
            "상견례",
            "가전 혼수",
            "예물 예단",
            "다이어트",
            "신혼 여행",
          ].map((label) => (
            <button
              key={label}
              onClick={() => alert(`MVP: ${label} 준비중`)}
              className="flex flex-col items-center gap-2 active:opacity-70"
            >
              <div className="h-12 w-12 rounded-xl bg-[#E7E7E7]" />
              <div className="text-[11px] font-semibold text-[#666]">{label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 하단 탭바 */}
      <nav className="fixed inset-x-0 bottom-0 mx-auto max-w-md px-5 pb-5">
        <div className="rounded-[26px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between px-4 py-3">
            {/* 왼쪽 노란 버튼(스캔) */}
            <button
              onClick={goScan}
              className="flex h-12 w-16 items-center justify-center rounded-[18px] active:opacity-80"
              style={{ backgroundColor: YELLOW }}
              aria-label="scan"
            >
              <span className="text-xl font-black text-[#111]">▣</span>
            </button>

            {/* 탭들 */}
            <button onClick={goWedding} className="flex flex-col items-center gap-1 text-xs font-semibold text-[#777]">
              <span className="h-5 w-5 rounded-md bg-[#E6E6E6]" />
              청첩장
            </button>

            <button onClick={goStore} className="flex flex-col items-center gap-1 text-xs font-semibold text-[#777]">
              <span className="h-5 w-5 rounded-md bg-[#E6E6E6]" />
              스토어
            </button>

            <button onClick={goMy} className="flex flex-col items-center gap-1 text-xs font-semibold text-[#777]">
              <span className="h-5 w-5 rounded-md bg-[#E6E6E6]" />
              MY
            </button>
          </div>
        </div>
      </nav>
    </main>
  );
}