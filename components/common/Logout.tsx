import React from 'react';
import { useRouter } from 'next/navigation';

const Logout = ({ onLogout }: { onLogout: () => void }) => {
    const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    alert('로그아웃 되었습니다.');
    onLogout();
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-semibold shadow-md"
    >
      로그아웃
    </button>
  );
};

export default Logout;
