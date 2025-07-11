'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { SignUpRequest } from '@/types/SignUp';

interface SignUpFormProps {
  onNext: (data: Partial<SignUpRequest>) => void;
  initialData: Partial<SignUpRequest>;
}

const SignUpForm = ({ onNext, initialData }: SignUpFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState(initialData.email || '');
  const [password, setPassword] = useState(initialData.password || '');
  const [passwordConfirm, setPasswordConfirm] = useState(
    initialData.passwordConfirm || '',
  );
  const [gender, setGender] = useState(initialData.gender || '');
  const [nickname, setNickname] = useState(initialData.nickname || '');
  const [error, setError] = useState<string | null>(null);

  const isNextEnabled =
    email && password && passwordConfirm && gender && nickname;

  const handleGenderChange = (selectedGender: string) => {
    if (gender === selectedGender) {
      setGender('');
    } else {
      setGender(selectedGender);
    }
  };

  const handleNextClick = () => {
    // 브라우저 내장 유효성 검사 실행
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    // 비밀번호 일치 여부 확인 (커스텀 유효성 검사)
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 모든 유효성 검사 통과
    setError(null);
    onNext({ email, password, passwordConfirm, gender, nickname });
  };

  const inputStyle =
    'appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white';
  const labelStyle =
    'block text-sm font-medium text-gray-700 dark:text-gray-200';

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

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-2 bg-white  sm:rounded-lg sm:px-10 dark:bg-gray-800">
          <form ref={formRef} className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className={labelStyle}>
                이메일
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="example@email.com"
                  className={inputStyle}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={labelStyle}>
                비밀번호
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="비밀번호 (8자 이상)"
                  className={inputStyle}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="passwordConfirm" className={labelStyle}>
                비밀번호 확인
              </label>
              <div className="mt-1">
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="비밀번호 확인"
                  className={inputStyle}
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                />
              </div>
            </div>

            <fieldset>
              <legend className={labelStyle}>성별</legend>
              <div className="flex items-center mt-2 space-x-4">
                <label
                  htmlFor="MALE"
                  className="flex items-center cursor-pointer"
                >
                  <input
                    id="MALE"
                    name="gender"
                    type="checkbox"
                    required={!gender} // 둘 중 하나만 선택되도록 required 로직 추가
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    checked={gender === 'MALE'}
                    onChange={() => handleGenderChange('MALE')}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                    남자
                  </span>
                </label>
                <label
                  htmlFor="FEMALE"
                  className="flex items-center cursor-pointer"
                >
                  <input
                    id="FEMALE"
                    name="gender"
                    type="checkbox"
                    required={!gender} // 둘 중 하나만 선택되도록 required 로직 추가
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    checked={gender === 'FEMALE'}
                    onChange={() => handleGenderChange('FEMALE')}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                    여자
                  </span>
                </label>
              </div>
            </fieldset>

            <div>
              <label htmlFor="nickname" className={labelStyle}>
                닉네임
              </label>
              <div className="mt-1">
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  required
                  placeholder="닉네임"
                  className={inputStyle}
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                />
              </div>
            </div>

            <div className="min-h-[48px] flex items-center">
              {error && (
                <div className="w-full p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
                  {error}
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleNextClick}
                disabled={!isNextEnabled}
              >
                다음(1/2)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm; 