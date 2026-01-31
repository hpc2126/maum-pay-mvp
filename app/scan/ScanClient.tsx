"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanClient() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const navigatingRef = useRef(false);
  const qrRef = useRef<Html5Qrcode | null>(null);

  // ✅ 노란 프레임(= 투명창) 사이즈
  const FRAME_W = 300;
  const FRAME_H = 360;

  // ✅ 위치: “대충 120px” 고정 대신 safe-area 고려해서 안정적으로
  // (iOS 노치/다이나믹아일랜드에서도 어긋남 덜함)
  const FRAME_TOP_CSS = "calc(110px + env(safe-area-inset-top))";

  // ✅ 오버레이 투명도(더 투명하게)
  const MASK_ALPHA = 0.35;

  useEffect(() => {
    const id = "qr-reader";
    const qr = new Html5Qrcode(id);
    qrRef.current = qr;

    const start = async () => {
      try {
        setError("");
        setReady(false);

        await qr.start(
          { facingMode: "environment" },
          {
            fps: 12,
            // ✅ qrbox 쓰면 html5-qrcode가 회색 모서리 가이드/프레임을 그려버림
            // ✅ 우리는 노란 프레임만 쓰니까 qrbox는 제거
            // disableFlip: true,
          },
          async (decodedText) => {
            if (navigatingRef.current) return;

            const raw = (decodedText || "").trim();
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
          () => {
            // 실패 콜백(너무 자주 호출되어 기본은 무시)
          }
        );

        setReady(true);
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
    <main className="relative mx-auto min-h-screen w-full max-w-md bg-black">
      {/* ✅ 카메라 전체화면 */}
      <div id="qr-reader" className="absolute inset-0" />

      {/* ✅ 오버레이(4면 마스크) + 가운데 투명창 + 노란 프레임 */}
      <div className="pointer-events-none absolute inset-0">
        {/* 중앙 투명창 영역 (노란 프레임과 1:1) */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: FRAME_TOP_CSS, width: FRAME_W, height: FRAME_H }}
        >
          {/* 노란 프레임 */}
          <div
            className="absolute inset-0 rounded-[28px]"
            style={{ border: "4px solid #FFD158" }}
          />
        </div>

        {/* 마스크(위) */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: 0,
            height: FRAME_TOP_CSS,
            background: `rgba(0,0,0,${MASK_ALPHA})`,
          }}
        />

        {/* 마스크(아래) */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: `calc(${FRAME_TOP_CSS} + ${FRAME_H}px)`,
            bottom: 0,
            background: `rgba(0,0,0,${MASK_ALPHA})`,
          }}
        />

        {/* 마스크(좌) */}
        <div
          className="absolute"
          style={{
            top: FRAME_TOP_CSS,
            left: 0,
            height: FRAME_H,
            width: `calc(50% - ${FRAME_W / 2}px)`,
            background: `rgba(0,0,0,${MASK_ALPHA})`,
          }}
        />

        {/* 마스크(우) */}
        <div
          className="absolute"
          style={{
            top: FRAME_TOP_CSS,
            right: 0,
            height: FRAME_H,
            width: `calc(50% - ${FRAME_W / 2}px)`,
            background: `rgba(0,0,0,${MASK_ALPHA})`,
          }}
        />
      </div>

      {/* ✅ 상단 헤더 */}
      <header
        className="absolute left-0 right-0 z-10 flex items-center justify-between px-5"
        style={{ top: "calc(14px + env(safe-area-inset-top))" }}
      >
        <img src="/assets/logo.svg" alt="MaumPay" className="h-7 w-auto opacity-70" />
        <button
          type="button"
          onClick={() => router.push("/")}
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full text-4xl leading-none text-white/90 active:opacity-60"
          aria-label="close"
        >
          ×
        </button>
      </header>

      {/* ✅ 안내 텍스트 (싸구려 느낌 줄이기: 크기↓, 굵기↓, 간격 정리) */}
      <div
        className="absolute left-0 right-0 z-10 px-6 text-center text-white"
        style={{ top: `calc(${FRAME_TOP_CSS} + ${FRAME_H}px + 22px)` }}
      >
        <div className="text-[15px] font-medium tracking-tight text-white/80">
          신랑측 🤵 · 신부측 👰 확인 후
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
          QR코드를 스캔하세요
        </div>
      </div>

      {/* ✅ 하단 도움 카드 */}
      <div className="absolute bottom-8 left-0 right-0 z-10 px-5">
        <div className="rounded-[28px] bg-white/88 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur">
          <div className="text-2xl font-extrabold text-[#111]">
            혹시 인식이 안 되나요?
          </div>
          <div className="mt-4 space-y-2 text-lg font-medium text-[#666]">
            <div>• QR이 노란 프레임 안에 들어오도록 맞춰주세요</div>
            <div>• 반사/어두우면 각도를 바꿔보세요</div>
          </div>

          {!ready && (
            <div className="mt-4 text-sm font-medium text-[#888]">카메라 준비 중…</div>
          )}
          {error && (
            <div className="mt-3 text-sm font-semibold text-red-600">{error}</div>
          )}
        </div>
      </div>

      {/* ✅ html5-qrcode DOM “회색 모서리/가이드” 완전 제거 + 비디오 풀스크린 */}
      <style jsx global>{`
        #qr-reader,
        #qr-reader__scan_region {
          width: 100% !important;
          height: 100% !important;
        }

        #qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        /* ✅ 핵심: scan_region 안에서 video만 남기고 전부 숨김
           -> 회색 모서리 라인(가이드/프레임) 사라짐 */
        #qr-reader__scan_region > *:not(video) {
          display: none !important;
        }

        /* 대시보드/텍스트 등도 혹시 남으면 제거 */
        #qr-reader__dashboard,
        #qr-reader__dashboard_section,
        #qr-reader__header_message {
          display: none !important;
        }
      `}</style>
    </main>
  );
}