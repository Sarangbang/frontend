'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useUserStore } from '@/lib/store/userStore';

const NavItem = ({ children, text, href }: { children: React.ReactNode, text: string, href: string }) => (
    <Link href={href} className="w-full">
        <div className="flex items-center w-full text-gray-600 hover:bg-gray-100 hover:text-blue-500 p-3 rounded-lg cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400">
            {children}
            <span className="ml-4 font-semibold">{text}</span>
        </div>
    </Link>
)

const Sidebar = () => {
  const { isLoggedIn } = useUserStore(); // 전역 로그인 상태 사용
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return(
    <aside className="w-64 bg-white dark:bg-gray-800 h-screen fixed top-0 left-0 shadow-[1px_0_3px_rgba(0,0,0,0.1)] p-4 flex flex-col z-20">
      <div className="flex items-center justify-between p-4 mb-4">
        <div className="flex items-center">
          <Image src="/images/charactors/gamza.png" alt="logo" width={40} height={40} />
          <h1 className="text-2xl font-bold ml-2 dark:text-white">일심동네</h1>
        </div>
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6 text-yellow-500" />
            ) : (
              <Moon className="h-6 w-6 text-gray-900" />
            )}
          </button>
        )}
      </div>
      <nav className="flex flex-col gap-2">
        <NavItem href="/" text="홈">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </NavItem>
        {isLoggedIn && (
          <>
          <NavItem href="/challenge" text="내 챌린지">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </NavItem>
        <NavItem href="/verification" text="챌린지 인증">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </NavItem>
        <NavItem href="/chat" text="채팅">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
          </svg>
        </NavItem>
        </>
        )}
        <NavItem href={isLoggedIn ? "/mypage" : "/login"} text={isLoggedIn ? "마이페이지" : "로그인"}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </NavItem>
      </nav>
    </aside>
  )
}
  
  export default Sidebar;