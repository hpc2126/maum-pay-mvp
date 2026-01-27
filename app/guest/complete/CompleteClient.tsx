"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Side } from "@/lib/theme";

const BLUE = "#275DBA";
const YELLOW = "#FFD158";

function safe(s: string | null) {
  return (s ?? "").trim();
}

export default function CompleteClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const side = (sp.get("side") as Side) || "groom";
  const hostCode = safe(sp.get("hostCode"));
  const amount = Number(safe(sp.get("amount")) || "0");
  const senderName = safe(sp.get("senderName")) || "김강우";
  const relation = safe(sp.get("relation"));

  const hostName = useMemo(() => (side === "groom" ? "이몽룡" : "성춘향"), [side]);
  const hostSuffix = useMemo(() => (side === "groom" ? " 신랑" : " 신부"), [side]);

  const goTicket = () => {
    const q = new URLSearchParams({
      side,
      hostCode: hostCode || "TEST01",
      amount: String(amount),
      senderName,
      relation,
    });
    router.push(`/guest/ticket?${q.toString()}`);
  };

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#E9E9E9] px-6 pt-16 pb-8">
      {/* 중앙 컨텐츠 */}
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="text-[30px] font-extrabold leading-tight text-[#333]">
          <span style={{ color: BLUE }}>
            {hostName}
            {hostSuffix}
          </span>
          <span className="text-[#333]">님에게</span>
          <br />
          <span className="text-[#333]">소중한 마음을 전달했습니다</span>
        </div>

        {/* 안내 (필요 시) */}
        <div className="mt-8 text-sm font-semibold text-[#9A9A9A]">
          식권은 다음 화면에서 확인할 수 있어요.
        </div>
      </div>

      {/* 하단 버튼 */}
      <button
        onClick={goTicket}
        className="mt-6 h-16 w-full rounded-3xl text-xl font-extrabold text-[#111] active:opacity-80"
        style={{ backgroundColor: YELLOW }}
      >
        식권 수령
      </button>
    </main>
  );
}