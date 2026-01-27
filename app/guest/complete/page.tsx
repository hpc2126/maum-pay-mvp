import { Suspense } from "react";
import CompleteClient from "./CompleteClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-200" />}>
      <CompleteClient />
    </Suspense>
  );
}