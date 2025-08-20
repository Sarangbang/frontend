'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import NotificationBell from '../common/NotificationBell';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 z-40 flex items-center justify-between p-4 shadow-sm h-16">
      <div className="flex items-center">
        <Image
          src="/images/charactors/gamza.png"
          alt="logo"
          width={32}
          height={32}
        />
        <h1 className="text-xl font-bold ml-2 dark:text-white">일심동네</h1>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell position="header" />
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
    </header>
  );
};

export default Header; 