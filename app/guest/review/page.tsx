"use client";

import { Suspense } from "react";
import ReviewClient from "./ReviewClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-200" />}>
      <ReviewClient />
    </Suspense>
  );
}