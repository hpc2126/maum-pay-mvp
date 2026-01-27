"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Side } from "@/lib/theme";

const YELLOW = "#FFD158";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

type Pt = { x: number; y: number };

export default function GuestSenderPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const side = (sp.get("side") as Side) || "groom";
  const hostCode = sp.get("hostCode") || "";
  const amount = Number(sp.get("amount") || "0");

  const [senderName, setSenderName] = useState("");
  const [relation, setRelation] = useState("");

  const nameRef = useRef<HTMLInputElement | null>(null);
  const relationRef = useRef<HTMLInputElement | null>(null);

  // ✅ 라인 정렬용 ref
  const stageRef = useRef<HTMLDivElement | null>(null);
  const relationBoxRef = useRef<HTMLButtonElement | null>(null);
  const firstQuickRef = useRef<HTMLButtonElement | null>(null);

  const [p1, setP1] = useState<Pt | null>(null); // relation box right-middle
  const [p2, setP2] = useState<Pt | null>(null); // elbow (x stays, y moves)
  const [p3, setP3] = useState<Pt | null>(null); // quick button left-middle

  const quickRelations = ["직장동료", "대학동기", "부 지인", "모 지인"] as const;

  const canSubmit = useMemo(() => {
    return Boolean(hostCode) && amount > 0 && senderName.trim().length > 0;
  }, [hostCode, amount, senderName]);

  const goComplete = () => {
    if (!canSubmit) return;

    const q = new URLSearchParams({
      side,
      hostCode,
      amount: String(amount),
      senderName: senderName.trim(),
      relation: relation.trim(),
    });

    router.push(`/guest/complete?${q.toString()}`);
  };

  // ✅ 라인 좌표 계산 (요소 위치 기반)
  useEffect(() => {
    const compute = () => {
      if (!stageRef.current || !relationBoxRef.current || !firstQuickRef.current) return;

      const stage = stageRef.current.getBoundingClientRect();
      const rel = relationBoxRef.current.getBoundingClientRect();
      const quick = firstQuickRef.current.getBoundingClientRect();

      // 시작점: 소속관계 박스 오른쪽 중간
      const start: Pt = {
        x: rel.right - stage.left,
        y: rel.top - stage.top + rel.height / 2,
      };

      // 끝점: 첫 퀵버튼 왼쪽 중간
      const end: Pt = {
        x: quick.left - stage.left,
        y: quick.top - stage.top + quick.height / 2,
      };

      // 엘보(두번째 스샷 느낌):
      // 1) 시작점에서 오른쪽으로 조금 나간 x
      // 2) 거기서 위/아래로 end.y까지 수직
      const elbowX = start.x + 44; // "수평으로 나가는 길이" (필요하면 36~60 사이로 조절)
      const elbow1: Pt = { x: elbowX, y: start.y };
      const elbow2: Pt = { x: elbowX, y: end.y };

      setP1(start);
      // p2를 elbow2로 쓰고, 중간 elbow1은 path에서 직접 사용
      setP2(elbow2);
      setP3(end);

      // path에 elbow1도 필요해서, state 대신 아래 render에서 p1 기반으로 계산해도 되는데
      // 단순화를 위해 elbowX는 고정, y만 2개 쓰는 구조로 유지
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // relation/퀵 버튼 텍스트가 바뀌어도 높이는 같아서 보통 괜찮지만,
  // 폰트 로딩/레이아웃 변경 시 다시 계산
  useEffect(() => {
    const t = setTimeout(() => {
      const evt = new Event("resize");
      window.dispatchEvent(evt);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#E9E9E9] px-6 pt-10 pb-10">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D6D6D6] text-sm font-semibold text-[#7A7A7A]">
          1
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D6D6D6] text-sm font-semibold text-[#7A7A7A]">
          2
        </span>
        <span className="rounded-full px-4 py-1 text-sm font-semibold text-[#111]" style={{ backgroundColor: YELLOW }}>
          Step3
        </span>
      </div>

      <section className="mt-10">
        {/* 봉투 + 오버레이 무대 */}
        <div className="relative w-full">
          <div ref={stageRef} className="relative w-full aspect-[4/3]">
            <img
              src="/assets/envelope.svg"
              alt="envelope"
              draggable={false}
              className="absolute inset-0 h-full w-full object-contain"
              style={{
                transform: "scale(1.45)",
                transformOrigin: "center",
              }}
            />

            {/* ===== 보내는사람 ===== */}
            <button
              type="button"
              onClick={() => nameRef.current?.focus()}
              className="absolute"
              style={{
                left: "10.8%",
                top: "22%",
                width: "16%",
                height: "60%",
              }}
              aria-label="보내는사람 입력"
            >
              <div
                className="h-full w-full rounded-[16px] bg-transparent"
                style={{
                  border: `3px solid ${YELLOW}`,
                  boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
                }}
              >
                <input
                  ref={nameRef}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="보내는사람"
                  className="w-full bg-transparent font-extrabold text-[#111] outline-none placeholder:text-[#D6D6D6]"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "upright",
                    height: "100%",
                    padding: "6px 0",
                    textAlign: "center",
                    letterSpacing: "0.01em",
                    fontSize: "22px",
                    lineHeight: "1.05",
                  }}
                  inputMode="text"
                />
              </div>
            </button>

            {/* ===== 소속관계 ===== */}
            <button
              ref={relationBoxRef}
              type="button"
              onClick={() => relationRef.current?.focus()}
              className="absolute"
              style={{
                left: "29.8%",
                top: "22%",
                width: "14%",
                height: "54%",
              }}
              aria-label="소속관계 입력"
            >
              <div
                className="h-full w-full rounded-[16px] bg-transparent"
                style={{
                  border: "3px solid #CFCFCF",
                  boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
                }}
              >
                <input
                  ref={relationRef}
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  placeholder="소속관계"
                  className="w-full bg-transparent font-extrabold text-[#B5B5B5] outline-none placeholder:text-[#D6D6D6]"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "upright",
                    height: "100%",
                    padding: "6px 0",
                    textAlign: "center",
                    letterSpacing: "0.01em",
                    fontSize: "18px",
                    lineHeight: "1.05",
                  }}
                  inputMode="text"
                />
              </div>
            </button>

            {/* ===== 우측 퀵 선택 ===== */}
            <div
              className="absolute flex flex-col gap-3"
              style={{
                right: "8%",
                top: "22%",
                width: "28%",
              }}
            >
              {quickRelations.map((r, idx) => (
                <button
                  key={r}
                  ref={idx === 0 ? firstQuickRef : undefined}
                  type="button"
                  onClick={() => {
                    setRelation(r);
                    setTimeout(() => relationRef.current?.focus(), 0);
                    // 선택 시 레이아웃 흔들림 대비 라인 재계산
                    setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
                  }}
                  className="h-[50px] w-full rounded-full bg-[#E6E6E6] text-[16px] font-semibold text-[#B5B5B5] active:opacity-70"
                  style={{ boxShadow: "0 8px 18px rgba(0,0,0,0.06)" }}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* ✅ 라인(두번째 스샷처럼) */}
            {p1 && p2 && p3 && (
              <svg
                className="absolute pointer-events-none"
                style={{ inset: 0 }}
                width="100%"
                height="100%"
                aria-hidden="true"
              >
                {(() => {
                  const elbowX = p1.x + 44; // 위 compute와 동일
                  const d = `M ${p1.x} ${p1.y} L ${elbowX} ${p1.y} L ${elbowX} ${p3.y} L ${p3.x} ${p3.y}`;
                  return (
                    <path
                      d={d}
                      fill="none"
                      stroke="#BFBFBF"
                      strokeWidth={1} // ✅ 얇고 일정
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })()}
              </svg>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className="mt-10 h-px w-full bg-[#D3D3D3]" />

        {/* 안내 문구 2줄 */}
        <div className="mt-6 text-center text-xs text-[#9A9A9A] leading-relaxed">
          <div>성함은 축의 기록용으로만 사용됩니다.</div>
          <div>
            • 전할 금액: <span className="text-[#111]">{formatWon(amount)}</span>
          </div>
        </div>

        {/* 마음 전하기 */}
        <button
          onClick={goComplete}
          disabled={!canSubmit}
          className="mt-4 h-16 w-full rounded-3xl text-xl font-bold text-[#111] active:opacity-80"
          style={{
            backgroundColor: YELLOW,
            opacity: canSubmit ? 1 : 0.55,
          }}
        >
          마음 전하기
        </button>
      </section>
    </main>
  );
}