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
            <span className="ml-4 font-medium">{text}</span>
        </div>
    </Link>
)

const Sidebar = () => {
  const { isLoggedIn } = useUserStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return(
    <aside className="w-64 bg-white dark:bg-gray-800 h-screen fixed top-0 left-0 shadow-[1px_0_3px_rgba(0,0,0,0.1)] p-4 flex-col z-20 hidden md:flex">
      <div className="flex items-center justify-between p-4 mb-4">
        <div className="flex items-center">
          <Image src="/images/charactors/gamza.png" alt="logo" width={40} height={40} />
          <h1 className="text-2xl font-bold ml-2 dark:text-white">일심동네</h1>
        </div>
        <div className="flex items-center gap-2">
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
      </div>
      <nav className="flex flex-col items-start w-full">
        <NavItem href="/" text="홈">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </NavItem>
        <NavItem href="/challenges" text="챌린지 목록">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            viewBox="0 0 512 512"
            fill="currentColor"
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform="translate(50,567) scale(0.1,-0.1)">
              <path d="M955 5106 c-84 -21 -147 -57 -211 -121 -180 -179 -177 -457 5 -635 31 -30 80 -66 109 -79 l52 -24 0 -1674 0 -1673 -150 0 -150 0 0 -150 0 -150 -132 0 -133 0 -171 -298 -171 -297 529 -3 c291 -1 765 -1 1052 0 l523 3 -171 297 -171 298 -127 0 -128 0 0 150 0 150 -150 0 -150 0 0 1673 0 1674 52 24 c29 13 78 49 109 79 182 178 184 455 4 636 -112 113 -269 158 -420 120z" />
              <path d="M3550 4514 c-289 -34 -546 -104 -826 -224 -64 -28 -201 -95 -303 -149 -309 -165 -427 -207 -621 -217 -87 -5 -120 -3 -193 15 -49 11 -90 21 -93 21 -2 0 -4 -411 -4 -914 l0 -913 63 -8 c216 -26 585 -20 806 14 412 64 717 192 1012 425 103 81 205 134 289 148 90 15 163 -3 397 -97 103 -41 189 -72 192 -70 8 8 -59 382 -90 502 -46 182 -122 366 -210 515 l-22 37 24 21 c62 53 230 157 346 215 156 77 282 129 563 230 118 43 219 81 223 85 9 8 -318 143 -514 211 -284 99 -545 147 -829 153 -96 3 -191 2 -210 0z" />
            </g>
          </svg>
        </NavItem>
        {isLoggedIn && (
          <>
            <NavItem href="/challenge" text="내 챌린지">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
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
            <NavItem href="/notification" text="알림">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
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
};

export default Sidebar;