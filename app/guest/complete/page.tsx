"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Side } from "@/lib/theme";

const BLUE = "#275DBA";
const YELLOW = "#FFD158";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function GuestCompletePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const side = (sp.get("side") as Side) || "groom";
  const amount = Number(sp.get("amount") || "0");

  const personName = sp.get("person") || (side === "groom" ? "이몽룡" : "성춘향");
  const roleText = side === "groom" ? "신랑" : "신부";
  const senderName = sp.get("senderName") || "";
  const relation = sp.get("relation") || "";

  const goTicket = () => {
  const q = new URLSearchParams();
  sp.forEach((v, k) => q.set(k, v)); // 현재 쿼리 그대로 전달
  router.push(`/guest/ticket?${q.toString()}`);
};

  return (
    <main className="relative mx-auto min-h-screen max-w-md bg-[#E9E9E9] px-6">
      {/* ===== 중앙 콘텐츠 ===== */}
      <div className="flex min-h-screen flex-col items-center justify-center pb-40 text-center">
        {/* 체크 아이콘 */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#111]">
          <svg width="38" height="30" viewBox="0 0 34 26" fill="none" aria-hidden="true">
            <path
              d="M3 14.5L12.5 23L31 3"
              stroke="#FFD158"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 타이틀 */}
        <div className="mt-14 text-2xl font-bold">
          <span style={{ color: BLUE }}>
            {personName} {roleText}
          </span>
          <span className="text-[#8A8A8A]">님에게</span>
        </div>

        {/* 서브 문구 */}
        <div className="mt-4 text-2xl font-extrabold text-[#333]">
          소중한 마음을 전달했습니다
        </div>

        {/* 상세 정보 */}
        <div className="mt-8 space-y-2 text-base text-[#9A9A9A]">
          {amount > 0 && (
            <div>
              전한 금액:{" "}
              <span className="text-[#111] font-medium">
                {formatWon(amount)}
              </span>
            </div>
          )}
          {(senderName || relation) && (
            <div>
              {senderName && <span className="text-[#111]">{senderName}</span>}
              {senderName && relation && <span> · </span>}
              {relation && <span>{relation}</span>}
            </div>
          )}
        </div>
      </div>

      {/* ===== 하단 버튼 ===== */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-8">
        <button
          onClick={goTicket}
          className="h-16 w-full rounded-3xl text-xl font-bold text-[#111] active:opacity-80"
          style={{ backgroundColor: YELLOW }}
        >
          식권 수령
        </button>

        <p className="mt-4 text-center text-xs text-[#9A9A9A]">
          연회장 입장 시 화면을 제시해주세요.
        </p>
      </div>
    </main>
  );
}