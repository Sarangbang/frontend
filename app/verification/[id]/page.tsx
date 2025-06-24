import VerificationSubmitForm from '@/components/verification/VerificationSubmitForm';

const VerificationSubmitPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div className="bg-white min-h-screen">
      <VerificationSubmitForm challengeId={id} />
    </div>
  );
};

export default VerificationSubmitPage; 