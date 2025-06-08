'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/apiClient';

interface Region {
  code: string;
  name: string;
}

interface District {
  code: string;
  name: string;
}

const SignUpPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    gender: '',
    birthYear: '',
    region: '',
    district: '',
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await apiClient.get('/regions');
        setRegions(response.data);
      } catch (error) {
        console.error('Failed to fetch regions:', error);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    if (formData.region) {
      const fetchDistricts = async () => {
        try {
          const response = await apiClient.get(`/regions/${formData.region}/districts`);
          setDistricts(response.data);
          setFormData(prev => ({ ...prev, district: '' }));
        } catch (error) {
          console.error('Failed to fetch districts:', error);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [formData.region]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = '유효한 이메일을 입력해주세요.';
    if (formData.password.length < 8) newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    if (formData.password !== formData.passwordConfirm) newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    if (formData.name.length < 2) newErrors.name = '이름은 최소 2자 이상이어야 합니다.';
    if (!formData.gender) newErrors.gender = '성별을 선택해주세요.';
    if (!formData.birthYear) newErrors.birthYear = '출생년도를 선택해주세요.';
    if (!formData.region) newErrors.region = '시/도를 선택해주세요.';
    if (!formData.district) newErrors.district = '구/군을 선택해주세요.';
    if (!formData.agreeTerms) newErrors.agreeTerms = '이용약관에 동의해주세요.';
    if (!formData.agreePrivacy) newErrors.agreePrivacy = '개인정보 처리방침에 동의해주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
        await apiClient.post('/users/signup', {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            gender: formData.gender,
            birthYear: parseInt(formData.birthYear),
            region: formData.region,
            district: formData.district,
        });
        alert('회원가입이 완료되었습니다.');
        router.push('/login');
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            setErrors({ submit: error.response.data.message });
        } else if (error.response && error.response.data) {
            const serverErrors = Object.entries(error.response.data).map(([key, value]) => `${value}`).join('\n');
            setErrors({ submit: serverErrors });
        } else {
            setErrors({ submit: '회원가입 중 오류가 발생했습니다.' });
        }
    }
  };

  const birthYears = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 14 - i);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
            <svg className="mx-auto h-12 w-auto text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-4.5L12 9l4.5-4.5L21 9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" fill="currentColor" />
            </svg>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">사랑방</h1>
        </div>
        <form className="mt-8 space-y-4" noValidate onSubmit={handleSubmit}>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
            <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="example@email.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password">비밀번호</label>
            <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="8자 이상 입력해주세요" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input id="passwordConfirm" name="passwordConfirm" type="password" required value={formData.passwordConfirm} onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="비밀번호를 다시 입력해주세요" />
            {errors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="name">이름</label>
            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="실명을 입력해주세요" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">성별</label>
            <div className="mt-2 flex items-center space-x-6">
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500" name="gender" value="MALE" checked={formData.gender === 'MALE'} onChange={handleChange} />
                <span className="ml-2">남성</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500" name="gender" value="FEMALE" checked={formData.gender === 'FEMALE'} onChange={handleChange} />
                <span className="ml-2">여성</span>
              </label>
            </div>
             {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="birthYear">출생년도</label>
            <select id="birthYear" name="birthYear" required value={formData.birthYear} onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm">
                <option value="">출생년도 선택</option>
                {birthYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
            {errors.birthYear && <p className="text-red-500 text-xs mt-1">{errors.birthYear}</p>}
          </div>

           <div className="space-y-2">
            <label htmlFor="region">지역</label>
            <select id="region" name="region" required value={formData.region} onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm">
              <option value="">시/도 선택</option>
              {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
            </select>
            {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="district">구/군</label>
            <select id="district" name="district" required value={formData.district} onChange={handleChange} disabled={!formData.region}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500">
              <option value="">먼저 지역을 선택해주세요</option>
               {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
            </select>
            {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
          </div>
          
          <div className="space-y-2 pt-4">
            <div className="flex items-start">
              <input id="agreeTerms" name="agreeTerms" type="checkbox" checked={formData.agreeTerms} onChange={handleChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded" />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                이용약관 동의 (필수)
              </label>
            </div>
            {errors.agreeTerms && <p className="text-red-500 text-xs mt-1 pl-6">{errors.agreeTerms}</p>}
             <div className="flex items-start">
              <input id="agreePrivacy" name="agreePrivacy" type="checkbox" checked={formData.agreePrivacy} onChange={handleChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded" />
              <label htmlFor="agreePrivacy" className="ml-2 block text-sm text-gray-900">
                개인정보 처리방침 동의 (필수)
              </label>
            </div>
            {errors.agreePrivacy && <p className="text-red-500 text-xs mt-1 pl-6">{errors.agreePrivacy}</p>}
          </div>

          {errors.submit && <p className="text-red-500 text-sm text-center py-2">{errors.submit}</p>}

          <div className="pt-4">
            <button type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
              회원가입
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <a href="/login" className="font-medium text-gray-600 hover:text-pink-500">
            이미 계정이 있으신가요? <span className="text-pink-500">로그인</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; 