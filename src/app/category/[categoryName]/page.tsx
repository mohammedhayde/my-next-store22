'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/app/components/Layout';
import { Product } from '@/app/types/typesProduct'; // تأكد من صحة المسار
import ProductCard2 from '@/app/components/ProductCard2';
import { Typography } from '@mui/material';
import ImageCarousel from '@/app/components/ImageCarousel';

const CategoryPage = () => {
  const params = useParams();
  const encodedCategoryName = params.categoryName as string;
  const categoryName = decodeURIComponent(encodedCategoryName);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchProducts = useCallback(async (pageNumber: number) => {
    console.log(`Fetching products for page ${pageNumber}`);
    try {
      setIsLoading(true);
      setIsFetching(true);
      const response = await fetch(`${process.env.API_URL}/api/ProductsController21/ByCategoryName1/${categoryName}?pageNumber=${pageNumber}&pageSize=10`);
 
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const newProducts: Product[] = await response.json();
      if (newProducts.length === 0) {
        setHasMore(false);
        if (pageNumber === 1) {
          setError('لا توجد منتجات في هذا القسم.');
        }
      } else {
        setProducts(prevProducts => {
          const productIds = new Set(prevProducts.map(p => p.id));
          const uniqueNewProducts = newProducts.filter(p => !productIds.has(p.id));
          return [...prevProducts, ...uniqueNewProducts];
        });
        setHasMore(newProducts.length === 10); // بافتراض أن حجم الصفحة هو 10
      }
      setIsLoading(false);
      setIsFetching(false);
    } catch (error) {
      setError('فشل في جلب المنتجات');
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [categoryName]);

  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    setError(null);
  }, [categoryName]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  useEffect(() => {
    if (page > 1) {
      fetchProducts(page);
    }
  }, [page, fetchProducts]);

  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading || !hasMore || isFetching) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log(`Intersecting - increasing page to ${page + 1}`);
        setIsFetching(true); // إضافة قفل لمنع التكرار
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, isFetching, page]);

  return (
    <Layout>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <ImageCarousel apiEndpoint={`https://api.un4store.com/api/Categories/sub/${encodedCategoryName}`} />

          <h2 className="sr-only">الأقسام</h2>
          <div className="flex justify-end">
            <h3 className="text-right text-xl font-semibold text-gray-900 p-2">{categoryName}</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div key={product.id} ref={products.length === index + 1 ? lastProductElementRef : null}>
                  <Link href={`/product/${product.handle}`} passHref>
                    <ProductCard2 product={product} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-2 lg:col-span-3 xl:col-span-4 text-center">
                <Typography variant="body1" color="textSecondary">
                  لا توجد منتجات في هذا القسم حاليًا.
                </Typography>
              </div>
            )}
          </div>
          {isLoading && page > 1 && <div>Loading more products...</div>}
          {!hasMore && !isLoading && products.length > 0 && (
            <div className="col-span-2 lg:col-span-3 xl:col-span-4 text-center">
              <Typography variant="body1" color="textSecondary">
                لا توجد المزيد من المنتجات.
              </Typography>
            </div>
          )}
          {error && (
            <div className="col-span-2 lg:col-span-3 xl:col-span-4 text-center">
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
