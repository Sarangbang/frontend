'use client';

import { useEffect } from 'react';
import { requestForToken } from '@/lib/firebase';

const FCMInitializer = () => {
  useEffect(() => {
    requestForToken();
  }, []);

  return null;
};

export default FCMInitializer; 