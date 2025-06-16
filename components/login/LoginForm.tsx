'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import apiClient from '@/api/apiClient';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await apiClient.post('/users/signin', {
        email: formData.email,
        password: formData.password,
      });
      // TODO: Handle successful login (e.g., store token, redirect)
      router.push('/');
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: '로그인 중 오류가 발생했습니다.' });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image
            className="mx-auto h-20 w-auto"
            src="/images/sarangbang-logo.jpg"
            alt="사랑방 로고"
            width={150}
            height={150}
          />
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password-address" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                자동 로그인
              </label>
            </div>

            <div className="text-sm">
              {/* <a href="#" className="font-medium text-pink-500 hover:text-pink-600">
                비밀번호 찾기
              </a> */}
            </div>
          </div>

          {errors.submit && <p className="text-red-500 text-xs text-center pt-2">{errors.submit}</p>}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              로그인
            </button>
          </div>
        </form>
        
        <div className="text-sm text-center">
          <a href="/signup" className="font-medium text-gray-600 hover:text-pink-500">
            아직 계정이 없으신가요? <span className="text-pink-500">회원가입</span>
          </a>
        </div>
        
        {/* <div className="border-t border-gray-200 mt-6 pt-6 space-y-4">
          <div className="text-center text-sm text-gray-500">
            소셜 계정으로 로그인
          </div>
          <div className="grid grid-cols-2 gap-3">
              <div>
                  <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                  카카오로 로그인
                  </button>
              </div>
              <div>
                  <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                  네이버로 로그인
                  </button>
              </div>
          </div>
        </div> */}
      </div>
    </div>
  );
} 