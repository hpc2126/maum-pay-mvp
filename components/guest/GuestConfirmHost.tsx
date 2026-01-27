"use client";

import { useRouter } from "next/navigation";
import { Side, THEME } from "@/lib/theme";

type Props = {
  side: Side;            // groom / bride
  hostCode: string;      // QR에서 온 코드
  weddingDateText?: string;
  venueText?: string;
  displayName?: string;  // "신랑 이몽룡" or "신부 성춘향" 같은 표시용
};

export default function GuestConfirmHost({
  side,
  hostCode,
  weddingDateText = "2025년 12월 20일 토요일 12:00",
  venueText = "마음호텔 그랜드볼룸",
  displayName = side === "groom" ? "신랑 이몽룡" : "신부 성춘향",
}: Props) {
  const router = useRouter();
  const theme = THEME[side];

  const onConfirm = () => {
    // MVP: hostCode/side를 다음 페이지에서 쓰기 위해 query로 넘김(가장 쉬움)
    // 나중에 쿠키/세션으로 바꿀 수 있음
    router.push(`/guest/amount?side=${side}&hostCode=${encodeURIComponent(hostCode)}`);
  };

  const onBack = () => {
    // QR 다시 찍게 유도: 그냥 뒤로가기
    router.back();
  };

  return (
    <main className="mx-auto max-w-md p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2 py-1 text-xs ${theme.pill}`}>Step 1</span>
        <span className="text-xs text-neutral-500">확인</span>
      </div>

      <div className={`rounded-2xl border p-5 ${theme.card} bg-white space-y-2`}>
        <div className="text-sm text-neutral-500">{weddingDateText}</div>
        <div className="text-sm text-neutral-500">{venueText}</div>
        <div className={`text-xl font-semibold ${theme.accent}`}>{displayName}</div>
      </div>

      <div className="pt-2 text-center text-sm text-neutral-600">
        해당 예식이 맞나요?
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onBack}
          className="h-12 rounded-xl border border-neutral-200 text-neutral-700"
        >
          아니요
        </button>
        <button
          onClick={onConfirm}
          className={`h-12 rounded-xl ${theme.button}`}
        >
          네 맞아요
        </button>
      </div>

      <p className="pt-2 text-xs text-neutral-500 text-center">
        QR로 선택된 측({theme.label})으로 축의금이 전달됩니다.
      </p>
    </main>
  );
}