"use client";

import { TutorDetailPage } from "@/components/features/tutors/tutor-detail-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  return <TutorDetailPage params={params} />;
}
