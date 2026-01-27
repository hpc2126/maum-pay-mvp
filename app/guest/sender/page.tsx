import { Suspense } from "react";
import SenderClient from "./SenderClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-200" />}>
      <SenderClient />
    </Suspense>
  );
}