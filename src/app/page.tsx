"use client";

import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Application</h1>
        <p className="text-lg mb-4">This is the main page of the application. Use the links below to navigate.</p>
        <div className="space-y-4">
          <Link href="/login">
            <button className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Login
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="block w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
