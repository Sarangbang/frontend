import ChallengeManageClient from '@/components/challenge/ChallengeManageClient';

const ChallengeManagePage = ({ params }: { params: { id: string } }) => {
  return <ChallengeManageClient challengeId={Number(params.id)} />;
};

export default ChallengeManagePage;