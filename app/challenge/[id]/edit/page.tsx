"use client";

import ChallengeEditForm from "@/components/challenge/ChallengeEditForm";
import { useParams } from "next/navigation";

export default function ChallengeEditPage() {
  const params = useParams();
  const challengeId = params?.id;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md">
        <ChallengeEditForm challengeId={challengeId} />
      </div>
    </div>
  );
} 