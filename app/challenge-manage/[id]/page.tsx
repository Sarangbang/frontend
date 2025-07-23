import { Suspense } from "react";
import ChallengeManageClient from '@/components/challenge/ChallengeManageClient';

interface ChallengeManagePageProps {
  params: { id: string };
}

const ChallengeManagePage = ({ params }: ChallengeManagePageProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
          </div>
        }
      >
        <ChallengeManageClient challengeId={Number(params.id)} />
      </Suspense>
    </div>
  );
};

export default ChallengeManagePage;