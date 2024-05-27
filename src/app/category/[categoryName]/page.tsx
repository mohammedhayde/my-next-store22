'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/app/components/Layout';
import { Product } from '@/app/types/typesProduct'; // Ensure the path is correct
import { fetchProductsByCategoryName } from '@/app/services/fetchProductsByCategoryName';
import ProductCard2 from '@/app/components/ProductCard2';
import ImageCarousel from '@/app/components/ImageCarousel';
import { Typography } from '@mui/material';

const CategoryPage = () => {
  const params = useParams();
  const encodedCategoryName = params.categoryName as string;
  const categoryName = decodeURIComponent(encodedCategoryName);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryName) return;

    const fetchProducts = async () => {
      try {
        const fetchedProducts = await fetchProductsByCategoryName(categoryName);
        setProducts(fetchedProducts);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch products');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Layout>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <ImageCarousel apiEndpoint={`http://localhost:5187/api/Categories/sub/${encodedCategoryName}`} />
          <h2 className="sr-only">الأقسام</h2>
          <div className="flex justify-end">
            <h3 className="text-right text-xl font-semibold text-gray-900 p-2">{categoryName}</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.length > 0 ? (
              products.map((product) => (
                <Link href={`/product/${product.handle}`} passHref key={product.id}>
                  <ProductCard2 product={product} />
                </Link>
              ))
            ) : (
              <div className="col-span-2 lg:col-span-3 xl:col-span-4 text-center">
                <Typography variant="body1" color="textSecondary">
                  لا توجد منتجات في هذا القسم حاليًا.
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
