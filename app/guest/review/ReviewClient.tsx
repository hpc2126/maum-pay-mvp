"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Side } from "@/lib/theme";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function ReviewClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const side = (sp.get("side") as Side) || "groom";
  const hostCode = sp.get("hostCode") || "";
  const amount = Number(sp.get("amount") || "0");

  const goNext = () => {
    const q = new URLSearchParams({ side, hostCode, amount: String(amount) });
    router.push(`/guest/sender?${q.toString()}`);
  };

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#E9E9E9] px-6 pt-14 pb-10">
      <div className="text-xl font-extrabold text-[#111]">확인</div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
        <div className="text-sm font-semibold text-[#888]">전할 금액</div>
        <div className="mt-2 text-3xl font-extrabold text-[#111]">
          {amount > 0 ? formatWon(amount) : "—"}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => router.back()}
            className="h-12 flex-1 rounded-2xl bg-[#EFEFEF] text-sm font-extrabold text-[#333]"
          >
            이전
          </button>
          <button
            onClick={goNext}
            disabled={!hostCode || amount <= 0}
            className="h-12 flex-1 rounded-2xl bg-[#FFD158] text-sm font-extrabold text-[#111] disabled:opacity-60"
          >
            다음
          </button>
        </div>
      </div>
    </main>
  );
}