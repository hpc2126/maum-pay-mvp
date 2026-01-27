import { Suspense } from "react";
import AmountClient from "./AmountClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-200" />}>
      <AmountClient />
    </Suspense>
  );
}