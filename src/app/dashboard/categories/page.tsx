"use client";

import { useState } from 'react';
import CategoryList from '@/app/components/CategoryList';
 
const CategoryPage: React.FC = () => {
  const [updateList, setUpdateList] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-gray-100 p-6 rounded shadow-md w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Manage Categories</h1>
        <CategoryList key={updateList.toString()} />
      </div>
    </div>
  );
};

export default CategoryPage;
