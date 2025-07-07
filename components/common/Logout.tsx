import React from 'react';

const Logout = ({ onLogout }: { onLogout: () => void }) => {
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    alert('로그아웃 되었습니다.');
    onLogout();
    window.location.reload(); // 항상 새로고침
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
