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

  useEffect(() => {
    if (product?.title) {
      document.title = `${product.title} - المتحدة للإلكترونيات`;
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      setIsAddingToCart(true);
      addToCart(product);
      setTimeout(() => {
        setIsAddingToCart(false);
       router.push('/Cart'); // إعادة التوجيه إلى صفحة الكارت
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
      <Head>
        <title>{product.title} - المتحدة للإلكترونيات</title>
        <meta name="description" content={product.description} />
      </Head>
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
              
                <div className='fixed inset-x-0 bottom-[1px] z-40 w-full bg-white p-2 shadow-[0px_0px_8px_rgb(0,0,0,0.15)] md:static md:bg-none md:p-0 md:shadow-none'>
                  <div className="flex">
                    <button
                      onClick={handleAddToCart}
                      className={`add-to-cart disabled:text-accent-disabled flex items-center justify-center rounded-xl bg-red-500 text-white p-2 text-sm font-bold leading-loose transition duration-200 ease-in-out hover:bg-red-600 focus:outline-dashed focus:outline-2 focus:outline-offset-1 focus:outline-primary disabled:bg-primary-700 md:text-button h-14 w-full rounded-lg ${isAddingToCart ? 'opacity-50' : ''}`}
                      disabled={isAddingToCart}
                    >
                      <div>اطلبه الآن</div>
                    </button>
                    <a
  href={`https://wa.me/9647709705090?text=${encodeURIComponent(`السلام عليكم، أرغب بالحصول على ${product?.title}، رابط المنتج: https://un4store.com/product/${product?.handle}`)}`}
  className="flex items-center justify-center rounded-xl bg-whatsapp p-2 font-bold leading-loose text-white transition duration-200 ease-in-out hover:bg-whatsapp-hover focus:outline-none ms-2 h-14 w-16 focus:outline-dashed focus:outline-2 focus:outline-offset-1 focus:outline-primary"
  style={{ background: 'linear-gradient(180deg, #5ffb7b 0%, #22d340 100%)' }}
  aria-label="Order on Whatsapp"
>
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="25"
    width="25"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M260.062 32C138.605 32 40.134 129.701 40.134 250.232c0 41.23 11.532 79.79 31.559 112.687L32 480l121.764-38.682c31.508 17.285 67.745 27.146 106.298 27.146C381.535 468.464 480 370.749 480 250.232 480 129.701 381.535 32 260.062 32zm109.362 301.11c-5.174 12.827-28.574 24.533-38.899 25.072-10.314.547-10.608 7.994-66.84-16.434-56.225-24.434-90.052-83.844-92.719-87.67-2.669-3.812-21.78-31.047-20.749-58.455 1.038-27.413 16.047-40.346 21.404-45.725 5.351-5.387 11.486-6.352 15.232-6.413 4.428-.072 7.296-.132 10.573-.011 3.274.124 8.192-.685 12.45 10.639 4.256 11.323 14.443 39.153 15.746 41.989 1.302 2.839 2.108 6.126.102 9.771-2.012 3.653-3.042 5.935-5.961 9.083-2.935 3.148-6.174 7.042-8.792 9.449-2.92 2.665-5.97 5.572-2.9 11.269 3.068 5.693 13.653 24.356 29.779 39.736 20.725 19.771 38.598 26.329 44.098 29.317 5.515 3.004 8.806 2.67 12.226-.929 3.404-3.599 14.639-15.746 18.596-21.169 3.955-5.438 7.661-4.373 12.742-2.329 5.078 2.052 32.157 16.556 37.673 19.551 5.51 2.989 9.193 4.529 10.51 6.9 1.317 2.38.901 13.531-4.271 26.359z"></path>
  </svg>
</a>
                 
                  </div>
                  {isAddingToCart && <div className="mt-2 text-center text-green-500">جاري إضافة المنتج إلى السلة...</div>}
                </div>
              </div>
            </div>
            <div className="mt-4 mb-4 flex flex-col">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />

                </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductPage;
