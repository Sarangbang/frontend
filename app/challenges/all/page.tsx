import { Suspense } from 'react';
import ChallengeBrowseClient from '@/components/challenge/ChallengeBrowseClient';

const ChallengeAllPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      }>
        <ChallengeBrowseClient />
      </Suspense>
    </div>
  );
};

export default ChallengeAllPage; 