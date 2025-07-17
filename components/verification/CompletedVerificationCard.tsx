'use client';
import Image from 'next/image';
import { Verification } from '@/types/Verification';

interface CompletedVerificationCardProps {
  verification: Verification;
}

const CompletedVerificationCard = ({
  verification,
}: CompletedVerificationCardProps) => {
  const verifiedDate = new Date(verification.verifiedAt)
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\s/g, '')
    .slice(0, -1);

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
      <Image
        src={verification.imgUrl}
        alt={verification.title}
        layout="fill"
        objectFit="cover"
        className="transform hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-30 text-white p-3 rounded-md">
        <h3 className="font-bold truncate">{verification.title}</h3>
        <p className="text-xs">{verifiedDate}</p>
      </div>
    </div>
  );
};

export default CompletedVerificationCard; 