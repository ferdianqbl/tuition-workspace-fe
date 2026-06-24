"use client";

import { CaseDetailPage } from "@/components/features/cases/case-detail-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  return <CaseDetailPage params={params} />;
}
