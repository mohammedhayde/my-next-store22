"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // مسح التوكن من localStorage
    localStorage.removeItem('token');
    // توجيه المستخدم إلى صفحة تسجيل الدخول
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
      </div>
    </div>
  );
};

export default Logout;
