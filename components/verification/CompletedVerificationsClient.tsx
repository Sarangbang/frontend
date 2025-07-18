'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getCompletedVerifications } from '@/api/verification';
import { Verification } from '@/types/Verification';
import CompletedVerificationCard from './CompletedVerificationCard';

const CompletedVerificationsClient = () => {
  const [verifications, setVerifications] = useState<Verification[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        const data = await getCompletedVerifications();
        setVerifications(data);
      } catch (error) {
        toast.error('인증 내역을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchVerifications();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (verifications.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        인증완료 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {verifications.map((verification, index) => (
        <CompletedVerificationCard key={index} verification={verification} />
      ))}
    </div>
  );
};

export default CompletedVerificationsClient; 