'use client';
import Head from 'next/head';
import { loadProductData } from './ProductData.server';
import React, { useState, useEffect } from 'react';
import GalleryHorizontal from '@/app/components/ProductGallery';
import Layout from '@/app/components/Layout';
import { SfRating } from '@storefront-ui/react';
import { addToCart } from '@/app/services/cart';
import { useRouter } from 'next/navigation';

interface Params {
  productId: string;
}

interface Product {
  id: number;
  title: string;
  image: string;
  description: string;
  price: number;
  imagePaths: string[];
  handle: string;
}

function ProductPage({ params }: { params: Params }) {
  const { productId } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const loadedProduct = await loadProductData(productId);
      setProduct(loadedProduct);
    }

    fetchData();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      setIsAddingToCart(true);
      addToCart(product);
      setTimeout(() => {
        setIsAddingToCart(false);
      //  router.push('/Cart'); // إعادة التوجيه إلى صفحة الكارت
      }, 1000); // مدة الأنميشن قبل إعادة التوجيه (1000 ملي ثانية = 1 ثانية)
    }
  };

  if (product === null) {
    return <div>No product data available.</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <div className="relative h-full bg-secondary px-2 py-4 md:px-0" style={{ direction: 'rtl' }}>
          <div className="container mb-12 overflow-hidden rounded-xl bg-white md:p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <GalleryHorizontal imagePaths={product.imagePaths} />
              <div className="flex flex-col px-4">
                <div className="relative flex justify-between mt-4">
                  <h2 className="line-clamp-4 text-2xl font-product-name md:line-clamp-none md:text-product-name">
                    {product.title}
                  </h2>
                </div>
                <div className="mt-4 flex items-end">
                  <div className="me-2 text-3xl font-bold leading-10 text-primary" data-testid="product-price-sale">
                    {product.price} د.ع
                  </div>
                  <div className="text-lg font-medium text-gray-900 line-through" data-testid="product-price-regular">
                    {product.price} د.ع
                  </div>
                  <div className="flex grow justify-end" data-testid="product-price-discount">
                    <div
                      className="productSaleBadge rounded-2xl p-2 font-bold"
                      style={{ fontSize: '12px', color: 'rgb(229, 45, 39)', background: 'rgb(255, 237, 236)' }}
                    >
                      خصم 25%
                    </div>
                  </div>
                </div>
                <div className="mt-4 mb-4 flex flex-col">
                  <SfRating value={3.5} />
                </div>
                <div className='fixed inset-x-0 bottom-[69px] z-40 w-full bg-white p-2 shadow-[0px_0px_8px_rgb(0,0,0,0.15)] md:static md:bg-none md:p-0 md:shadow-none'>
                  <div className="flex">
                    <button
                      onClick={handleAddToCart}
                      className={`add-to-cart disabled:text-accent-disabled flex items-center justify-center rounded-xl bg-red-500 text-white p-2 text-sm font-bold leading-loose transition duration-200 ease-in-out hover:bg-red-600 focus:outline-dashed focus:outline-2 focus:outline-offset-1 focus:outline-primary disabled:bg-primary-700 md:text-button h-14 w-full rounded-lg ${isAddingToCart ? 'opacity-50' : ''}`}
                      disabled={isAddingToCart}
                    >
                      <div>اطلبه الآن</div>
                    </button>
                    <a
                      href="https://wa.me/971504700712?text=السلام عليكم، أرغب بالحصول على ترمس قهوة وشاي باليرمو مع مؤشر للحرارة قطعتين 1 لتر و 0.75 لتر Palermo Temperature Thermos Dalah"
                      className="flex items-center justify-center rounded-xl bg-whatsapp p-2 font-bold leading-loose text-white transition duration-200 ease-in-out hover:bg-whatsapp-hover focus:outline-none ms-2 h-14 w-16 focus:outline-dashed focus:outline-2 focus:outline-offset-1 focus:outline-primary"
                      style={{ background: 'linear-gradient(180deg, #5ffb7b 0%, #22d340 100%)' }}
                      aria-label="Order on Whatsapp"
                    >
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 12a8 8 0 11-16 0 8 8 0 0116 0zm0 0V12l-3-3m3 3l-3 3m3-3l1-5-5 2 2 2-5 1 5 2-2 2 3 1"
                        ></path>
                      </svg>
                    </a>
                  </div>
                  {isAddingToCart && <div className="mt-2 text-center text-green-500">جاري إضافة المنتج إلى السلة...</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductPage;
