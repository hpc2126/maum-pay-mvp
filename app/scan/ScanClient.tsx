"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanClient() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [ready, setReady] = useState(false);

  const qrRef = useRef<Html5Qrcode | null>(null);
  const navigatingRef = useRef(false);

  useEffect(() => {
    const id = "qr-reader";
    const qr = new Html5Qrcode(id);
    qrRef.current = qr;

    const start = async () => {
      try {
        setError("");
        setReady(false);

        // iOS/모바일 안정성
        // (html5-qrcode 내부에서 video를 만들기 때문에, 컨테이너만 준비하면 됨)

        await qr.start(
          { facingMode: "environment" },
          {
            fps: 12,
            qrbox: { width: 240, height: 240 },
            // disableFlip: true, // 필요하면 켜도 됨
          },
          async (decodedText) => {
            if (navigatingRef.current) return;

            const raw = (decodedText || "").trim();

            // 예식장 QR 전용: URL만 허용
            const isUrl = /^https?:\/\//i.test(raw);
            if (!isUrl) {
              setError("예식장 QR이 아닙니다. (링크 QR만 인식)");
              return;
            }

            navigatingRef.current = true;

            try {
              await qr.stop();
              await qr.clear();
            } catch {}

            router.push(raw);
          },
          // ✅ 4번째 콜백(에러 콜백) 꼭 넣어야 타입 에러 안 남
          () => {
            // 스캔 실패 이벤트(너무 잦아서 보통 무시)
          }
        );

        setReady(true);

        // ✅ html5-qrcode가 video + canvas를 같이 올리는데,
        // canvas가 보이면 “카메라가 두 번 보이는 것처럼” 보일 수 있어서 숨김 처리
        setTimeout(() => {
          const el = document.getElementById(id);
          if (!el) return;
          const canvas = el.querySelector("canvas");
          if (canvas) (canvas as HTMLCanvasElement).style.display = "none";
        }, 0);
      } catch (e: any) {
        setError(e?.message || "카메라를 시작할 수 없습니다.");
      }
    };

    start();

    return () => {
      (async () => {
        try {
          await qr.stop();
          await qr.clear();
        } catch {}
      })();
    };
  }, [router]);

  return (
    <main className="relative mx-auto min-h-screen max-w-md bg-black">
      {/* ✅ 카메라 영역(전체 화면) */}
      <div className="absolute inset-0">
        <div
          id="qr-reader"
          className="h-full w-full overflow-hidden bg-black"
          style={{ position: "absolute", inset: 0 }}
        />
      </div>

      {/* ✅ 어두운 오버레이 + 중앙 투명 창 */}
      <div className="pointer-events-none absolute inset-0">
        {/* 바깥 어둡게 */}
        <div className="absolute inset-0 bg-black/55" />

        {/* 중앙 투명 창 */}
        <div
          className="absolute left-1/2 top-[120px] -translate-x-1/2"
          style={{ width: 300, height: 360 }}
        >
          {/* 투명창 만들기: box-shadow로 뚫는 느낌 */}
          <div
            className="absolute inset-0 rounded-[28px]"
            style={{
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
              background: "transparent",
            }}
          />

          {/* ✅ 노란 프레임(하나만) */}
          <div
            className="absolute inset-0 rounded-[28px]"
            style={{
              border: "4px solid #FFD158",
            }}
          />
        </div>
      </div>

      {/* ✅ 상단 헤더 */}
      <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-5 pt-10">
        <img src="/assets/logo.svg" alt="MaumPay" className="h-7 w-auto" />
        <button
          type="button"
          onClick={() => router.push("/")}
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full text-4xl leading-none text-white/90 active:opacity-60"
          aria-label="close"
        >
          ×
        </button>
      </header>

      {/* ✅ 안내 텍스트 */}
      <div className="absolute left-0 right-0 top-[520px] z-10 px-6 text-center text-white">
        <div className="text-base font-semibold text-white/90">
          신랑측 🤵 · 신부측 👰 확인 후
        </div>
        <div className="mt-2 text-4xl font-extrabold tracking-tight">
          QR코드를 스캔하세요
        </div>
      </div>

      {/* ✅ 하단 도움 카드 */}
      <div className="absolute bottom-8 left-0 right-0 z-10 px-5">
        <div className="rounded-[28px] bg-white/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur">
          <div className="text-2xl font-extrabold text-[#111]">
            혹시 인식이 안 되나요?
          </div>
          <div className="mt-4 space-y-2 text-lg font-medium text-[#666]">
            <div>• QR이 프레임 안에 들어오도록 맞춰주세요</div>
            <div>• 반사/어두우면 각도를 바꿔보세요</div>
          </div>

          {!ready && (
            <div className="mt-4 text-sm font-medium text-[#888]">
              카메라 준비 중…
            </div>
          )}
          {error && (
            <div className="mt-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* ✅ html5-qrcode가 만든 video 스타일 보정 */}
      <style jsx global>{`
        #qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        /* 캔버스가 보이면 “카메라 두 개”처럼 보일 수 있어서 숨김 */
        #qr-reader canvas,
        #qr-reader img {
          display: none !important;
        }
      `}</style>
    </main>
  );
}