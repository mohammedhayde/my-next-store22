"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/logout');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg mb-4">Welcome to the dashboard. Use the links below to navigate to different sections.</p>
        <div className="space-y-4">
          <Link href="/dashboard/users">
            <button className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Manage Users
            </button>
          </Link>
          <Link href="/dashboard/products">
            <button className="block w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Manage Products
            </button>
          </Link>
          <Link href="/dashboard/categories">
            <button className="block w-full bg-yellow-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
              Manage Categories
            </button>
          </Link>
          <Link href="/dashboard/orders">
            <button className="block w-full bg-red-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Manage Orders
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
