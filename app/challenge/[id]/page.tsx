import ChallengeDetailClient from '@/components/challenge/ChallengeDetailClient';

const ChallengeDetailPage = async ({ params }: { params: Promise<{ id: BigInt }> }) => {
  const { id } = await params;
  return <ChallengeDetailClient challengeId={id} />;
};

export default ChallengeDetailPage; 