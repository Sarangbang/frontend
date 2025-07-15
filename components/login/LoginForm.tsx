'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { login } from '@/api/auth';
import { useRouter } from 'next/navigation';
import { LoginRequest } from '@/types/Login';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('signupSuccess')) {
      toast.success('회원가입이 완료되었습니다');
      localStorage.removeItem('signupSuccess');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const loginData: LoginRequest = { email, password };
      const response = await login(loginData);

      if(response && response.token) {
        localStorage.setItem('accessToken', response.token);
      }
      setIsLoading(false);
      router.push('/');
    } catch (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle =
    'appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white';
  const labelStyle = 'block text-sm font-medium text-gray-700 dark:text-gray-200 sr-only';

  return (
    <div className="flex flex-col justify-center min-h-screen py-12 bg-white sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <Image
            src="/images/charactors/gamza.png"
            alt="일심동네 로고"
            width={80}
            height={80}
          />
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-white">
            일심동네
          </h2>
          <p className="mt-2 text-sm font-semibold text-orange-600">
            같은 동네, 같은 마음 함께 만드는 습관
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white sm:rounded-lg sm:px-10 dark:bg-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className={labelStyle}>
                아이디
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="아이디"
                  className={inputStyle}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={labelStyle}
              >
                비밀번호
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="비밀번호"
                  className={inputStyle}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md mt-4">
              {error}
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
                  간편 계정으로 로그인하기
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-6 space-x-4">
              {/* Kakao Login */}
              <button
                type="button"
                title="카카오 로그인"
                className="w-12 h-12 bg-[#FEE500] rounded-full flex items-center justify-center cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 4.688c-7.462 0-13.5 5.12-13.5 11.438 0 4.13 2.593 7.74 6.49 9.654l-2.298 5.516.03.028 6.02-3.44c1.07.194 2.18.298 3.3.298 7.462 0 13.5-5.12 13.5-11.438C29.5 9.807 23.462 4.688 16 4.688z"
                    fill="#000000"
                  />
                </svg>
              </button>
              {/* Naver Login */}
              <button
                type="button"
                title="네이버 로그인"
                className="w-12 h-12 bg-[#03C75A] rounded-full flex items-center justify-center cursor-pointer"
              >
                <span className="text-2xl font-bold text-white">N</span>
              </button>
              {/* Google Login */}
              <button
                type="button"
                title="구글 로그인"
                className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56,12.25C22.56,11.45 22.49,10.68 22.35,9.92H12.27V14.4H18.1C17.84,15.93 16.96,17.24 15.59,18.15V20.89H19.28C21.38,18.99 22.56,15.89 22.56,12.25Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.27,23C15.1,23 17.5,22.12 19.28,20.89L15.59,18.15C14.65,18.79 13.56,19.16 12.27,19.16C9.69,19.16 7.5,17.39 6.67,15.05H2.91V17.82C4.66,21.03 8.18,23 12.27,23Z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.67,15.05C6.44,14.36 6.3,13.62 6.3,12.86C6.3,12.1 6.44,11.36 6.67,10.67V7.9H2.91C1.94,9.75 1.38,11.72 1.38,13.86C1.38,15.99 1.94,18 2.91,19.82L6.67,15.05Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.27,6.58C13.73,6.58 15.02,7.09 16.03,8.04L19.36,4.71C17.5,3.02 15.1,2 12.27,2C8.18,2 4.66,4.7 2.91,7.9L6.67,10.67C7.5,8.33 9.69,6.58 12.27,6.58Z"
                    fill="#EA4335"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6 space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/signup" className="hover:text-orange-500">회원가입</Link>
          <span>|</span>
          <Link href="/find-id" className="hover:text-orange-500">아이디 찾기</Link>
          <span>|</span>
          <Link href="/find-password" className="hover:text-orange-500">비밀번호 찾기</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 