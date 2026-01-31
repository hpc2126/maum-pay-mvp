"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

export const dynamic = "force-dynamic";

export default function ScanPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<"init" | "starting" | "ready">("init");

  const qrRef = useRef<Html5Qrcode | null>(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const id = "qr-reader";
    const qr = new Html5Qrcode(id);
    qrRef.current = qr;

    const start = async () => {
      try {
        setError("");
        setStatus("starting");

        // ✅ iOS/모바일에서 권한/재생 안정성을 위해 playsinline 필요(기본으로 붙지만 CSS/DOM 조건 중요)
        // ✅ PC에서도 환경카메라가 없으면 다른 카메라로 떨어짐
        await qr.start(
          { facingMode: "environment" },
          {
            fps: 12,
            // 인식 박스는 내부 알고리즘용. UI 프레임은 우리가 그린 걸 씀.
            qrbox: { width: 260, height: 260 },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            if (isNavigatingRef.current) return;

            const raw = (decodedText || "").trim();
            const isUrl = /^https?:\/\//i.test(raw);

            if (!isUrl) {
              setError("예식장 QR이 아닙니다. (링크 QR만 인식)");
              return;
            }

            isNavigatingRef.current = true;

            try {
              await qr.stop();
              await qr.clear();
            } catch {}

            router.push(raw);
          }
        );

        setStatus("ready");
      } catch (e: unknown) {
        // 권한 거부/장치 없음/HTTPS 아님 등
        const msg =
          e instanceof Error
            ? e.message
            : "카메라를 시작할 수 없습니다. 브라우저 권한을 확인해 주세요.";
        setError(msg);
        setStatus("init");
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
      {/* ✅ 카메라 영역 */}
      <div id="qr-reader" />

      {/* ✅ 상단 헤더 */}
      <header className="absolute left-0 right-0 top-0 z-20 px-6 pt-10">
        <div className="flex items-center justify-between">
          <img
            src="/assets/logo.svg"
            alt="MaumPay"
            className="h-7 w-auto"
            draggable={false}
          />
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex h-12 w-12 items-center justify-center rounded-full text-4xl leading-none text-white/90 active:opacity-70"
            aria-label="close"
          >
            ×
          </button>
        </div>
      </header>

      {/* ✅ 오버레이(반투명 + 프레임 + 문구) */}
      <Overlay />

      {/* ✅ 하단 가이드 카드 */}
      <footer className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-8">
        <div className="w-full rounded-[28px] bg-[#EDEDED] px-7 py-6 shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
          <div className="text-[22px] font-extrabold text-[#111]">
            혹시 인식이 안 되나요?
          </div>
          <ul className="mt-3 space-y-2 text-[16px] font-medium text-[#6F6F6F]">
            <li>• QR이 프레임 안에 들어오도록 맞춰주세요</li>
            <li>• 반사/어두우면 각도를 바꿔보세요</li>
          </ul>

          {status !== "ready" && !error && (
            <div className="mt-4 text-sm font-medium text-[#777]">
              카메라 준비 중…
            </div>
          )}
          {error && (
            <div className="mt-4 text-sm font-semibold text-red-600">
              {error}
              <div className="mt-2 text-xs font-medium text-[#777]">
                ※ PC 크롬에서 테스트 시 카메라 권한 허용, 또는 HTTPS 환경인지 확인해 주세요.
              </div>
            </div>
          )}
        </div>
      </footer>

      {/* ✅ html5-qrcode가 만드는 “캔버스/기본UI” 때문에 화면이 2개처럼 보이는 것 방지 */}
      <style jsx global>{`
        #qr-reader {
          position: absolute;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden;
          background: #000;
        }

        /* 비디오를 화면 꽉 채움 */
        #qr-reader video {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        /* ✅ 두 번째 화면처럼 보이는 캔버스 제거 */
        #qr-reader canvas {
          display: none !important;
        }

        /* html5-qrcode 기본 UI 숨김 */
        #qr-reader__dashboard_section,
        #qr-reader__dashboard_section_csr,
        #qr-reader__camera_selection,
        #qr-reader__status_span,
        #qr-reader__scan_region {
          display: none !important;
        }
      `}</style>
    </main>
  );
}

function Overlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* 전체 반투명 */}
      <div className="absolute inset-0 bg-black/55" />

      {/* ✅ 프레임 크기: 모바일/데스크탑 모두 자연스럽게 */}
      <div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "clamp(260px, 82vw, 360px)",
          height: "clamp(320px, 48vh, 440px)",
        }}
      >
        {/* 구멍 뚫린 느낌 */}
        <div className="absolute inset-0 rounded-[26px] shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]" />
        {/* 노란 프레임 */}
        <div className="absolute inset-0 rounded-[26px] border-[4px] border-[#FFD158]" />
      </div>

      {/* 안내 문구 */}
      <div className="absolute left-0 right-0 top-[62%] px-6 text-center">
        <div className="text-[18px] font-bold text-white/90">
          신랑측 🤵‍♂️ · 신부측 👰 확인 후
        </div>
        <div className="mt-2 text-[34px] font-extrabold tracking-tight text-white">
          QR코드를 스캔하세요
        </div>
      </div>
    </div>
  );
}