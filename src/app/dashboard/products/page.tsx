"use client"; // إضافة هذا السطر

import ProductList from '@/app/components/ProductList';

const Products = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Manage Products</h1>
        <ProductList />
      </div>
    </div>
  );
};

export default Products;
