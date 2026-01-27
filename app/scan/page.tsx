"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";

const YELLOW = "#FFD158";

export default function ScanPage() {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const [status, setStatus] = useState<"idle" | "starting" | "running" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const stopScanner = async () => {
    try {
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
      scannerRef.current = null;
    } catch {}
  };

  useEffect(() => {
    let mounted = true;

    const start = async () => {
      if (!videoRef.current) return;

      setStatus("starting");
      setErrorMsg("");

      // iOS: playsInline 중요 (전체화면 재생 방지)
      videoRef.current.setAttribute("playsinline", "true");

      try {
        const scanner = new QrScanner(
          videoRef.current,
          (result) => {
            if (!mounted) return;
            const raw = result?.data?.trim();
            if (!raw) return;

            // ✅ QR 내용이 URL이면 그대로 이동
            // 예: https://.../g/ABC 또는 /g/ABC 같은 것도 허용
            stopScanner();

            // 상대경로/절대경로 모두 처리
            try {
              // 절대 URL이면 그대로
              const u = new URL(raw);
              router.push(u.pathname + (u.search || ""));
            } catch {
              // 상대 URL이면 그대로
              router.push(raw.startsWith("/") ? raw : `/${raw}`);
            }
          },
          {
            // 너무 자주 호출되는 걸 줄임
            maxScansPerSecond: 8,
            highlightScanRegion: true,
            highlightCodeOutline: true,
            returnDetailedScanResult: true,
          }
        );

        scannerRef.current = scanner;

        await scanner.start(); // 카메라 권한 요청
        if (!mounted) return;

        setStatus("running");
      } catch (err: any) {
        if (!mounted) return;
        setStatus("error");
        setErrorMsg(
          err?.message ||
            "카메라를 시작할 수 없어요. 브라우저 권한을 확인하거나 다른 브라우저로 시도해 주세요."
        );
      }
    };

    start();

    return () => {
      mounted = false;
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = async () => {
    await stopScanner();
    router.push("/");
  };

  const onPaste = async () => {
    // 백업: QR 문자열 붙여넣기(혹은 클립보드에서 읽기)
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;
      await stopScanner();

      try {
        const u = new URL(text.trim());
        router.push(u.pathname + (u.search || ""));
      } catch {
        router.push(text.trim().startsWith("/") ? text.trim() : `/${text.trim()}`);
      }
    } catch {
      setErrorMsg("클립보드 접근이 막혀있어요. URL을 직접 입력하는 방식으로 바꿔드릴까요?");
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#111] text-white">
      {/* 상단바 */}
      <div className="flex items-center justify-between px-6 pt-10">
        <div className="text-lg font-extrabold">QR 스캔</div>
        <button onClick={onClose} className="text-3xl leading-none active:opacity-70" aria-label="close">
          ×
        </button>
      </div>

      {/* 카메라 프리뷰 */}
      <div className="mt-8 px-6">
        <div className="relative overflow-hidden rounded-3xl bg-black shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <video
            ref={videoRef}
            className="h-[520px] w-full object-cover"
            muted
            autoPlay
          />

          {/* 안내 오버레이 */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[240px] w-[240px] rounded-3xl border-2 border-white/70" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-black/55 px-5 py-4">
            {status === "starting" && (
              <div className="text-sm text-white/90">카메라를 시작하는 중…</div>
            )}
            {status === "running" && (
              <div className="text-sm text-white/90">QR을 사각형 안에 맞춰주세요.</div>
            )}
            {status === "error" && (
              <div className="text-sm text-red-200">{errorMsg}</div>
            )}
          </div>
        </div>

        {/* 하단 버튼들 */}
        <div className="mt-6 grid gap-3 pb-10">
          <button
            onClick={onPaste}
            className="h-14 rounded-2xl font-extrabold text-[#111] active:opacity-80"
            style={{ backgroundColor: YELLOW }}
          >
            클립보드에서 URL 붙여넣기(대체)
          </button>

          <button
            onClick={onClose}
            className="h-14 rounded-2xl bg-white/10 font-extrabold active:opacity-80"
          >
            닫기
          </button>

          <p className="mt-1 text-center text-xs text-white/50">
            권한이 거부되면 브라우저 설정에서 카메라 권한을 허용해 주세요.
          </p>
        </div>
      </div>
    </main>
  );
}