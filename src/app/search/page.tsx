"use client"; // تأكد من أن هذا السطر موجود في أعلى الملف

import React, { Suspense, useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { useRouter, useSearchParams } from 'next/navigation';

const searchClient = algoliasearch('BHHXVEKGFH', '59327a638018a363eace1923b8cb9c81');

interface Hit {
  objectID: string;
  handle: string;
  image: string;
  title: string;
  description: string;
  price: number;
}

const SearchPageContent = () => {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  let debounceTimeout: NodeJS.Timeout;

  useEffect(() => {
    const fetchHits = async () => {
      setLoading(true);
      const q = searchParams.get('q') || '';
      if (q) {
        setQuery(q); // تعبئة حقل البحث بالبارامتر المستخرج
        const results = await searchClient.initIndex('shopify_products').search<Hit>(q);
        setHits(results.hits);
      }
      setLoading(false);
    };

    fetchHits();
  }, [searchParams]);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(async () => {
      if (query) {
        setLoading(true);
        const results = await searchClient.initIndex('shopify_products').search<Hit>(query);
        setHits(results.hits);
        setLoading(false);
      }
    }, 500); // تنفيذ البحث بعد 500 مللي ثانية من آخر تغيير في النص

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${query}`);
    setLoading(true);

    const results = await searchClient.initIndex('shopify_products').search<Hit>(query);
    setHits(results.hits);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">صفحة البحث المتقدم</h1>
      <form onSubmit={handleSearch} className="flex justify-center mb-4">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products"
          className="border p-2 w-1/2"
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white">بحث</button>
      </form>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {hits.map(hit => (
            <a href={`/product/${hit.handle}`} className="block border p-4 rounded-lg hover:shadow-lg transition-shadow duration-300" key={hit.objectID}>
              <img src={hit.image} alt={hit.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h2 className="text-xl font-bold mb-2">{hit.title}</h2>
              <p className="mb-2 text-gray-700">{hit.description}</p>
              <p className="text-lg font-semibold text-green-600">{hit.price} د.ع</p>
            </a>
          ))}
        </div>
      )}
      <style jsx>{`
        .loader {
          border-top-color: transparent;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const SearchPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SearchPageContent />
  </Suspense>
);

export default SearchPage;
