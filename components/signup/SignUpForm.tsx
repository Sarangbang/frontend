'use client';

import { useState } from 'react';
import Image from 'next/image';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [nickname, setNickname] = useState('');

  const handleGenderChange = (selectedGender: string) => {
    if (gender === selectedGender) {
      setGender('');
    } else {
      setGender(selectedGender);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 회원가입 로직 구현
    console.log({
      email,
      password,
      passwordConfirm,
      gender,
      address,
      nickname,
    });
  };

  const inputStyle =
    'appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white';
  const labelStyle = 'block text-sm font-medium text-gray-700 dark:text-gray-200';

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
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  autoComplete="new-password"
                  required
                  placeholder="비밀번호"
                  className={inputStyle}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className={labelStyle}
              >
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
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
            </div>

            <fieldset>
              <legend className={labelStyle}>성별</legend>
              <div className="flex items-center mt-2 space-x-4">
                <label
                  htmlFor="male"
                  className="flex items-center cursor-pointer"
                >
                  <input
                    id="male"
                    name="gender"
                    type="checkbox"
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    checked={gender === 'male'}
                    onChange={() => handleGenderChange('male')}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                    남자
                  </span>
                </label>
                <label
                  htmlFor="female"
                  className="flex items-center cursor-pointer"
                >
                  <input
                    id="female"
                    name="gender"
                    type="checkbox"
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    checked={gender === 'female'}
                    onChange={() => handleGenderChange('female')}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                    여자
                  </span>
                </label>
              </div>
            </fieldset>

            <div>
              <label htmlFor="address" className={labelStyle}>
                주소
              </label>
              <div className="mt-1">
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  placeholder="도로명/지번"
                  className={inputStyle}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

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
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm; 