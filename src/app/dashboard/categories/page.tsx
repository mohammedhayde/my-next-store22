"use client";

import CategoryList from '@/app/components/CategoryList';

const Categories = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className=" bg-gray-100 p-6 rounded shadow-md w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Manage Categories</h1>
        <CategoryList />
      </div>
    </div>
  );
};

export default Categories;
