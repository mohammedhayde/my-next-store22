'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from '@/app/components/Layout';

interface CartItem {
  title: string;
  imagePaths: string[];
  price: number;
  quantity: number;
}

interface Cart {
  [key: string]: CartItem;
}

const CartPage = () => {
  const [cart, setCart] = useState<Cart>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      setCart(savedCart ? JSON.parse(savedCart) : {});
    }
  }, []);

  const removeFromCart = (productId: string) => {
    if (typeof window !== 'undefined') {
      const newCart = { ...cart };
      delete newCart[productId];
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  const changeQuantity = (productId: string, quantity: number) => {
    if (typeof window !== 'undefined') {
      const newCart = { ...cart };
      if (newCart[productId]) {
        newCart[productId].quantity = quantity;
      }
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  const shippingCost = 6; // يمكنك تعديل هذا الرقم بناءً على سياسة الشحن لديك

  const totalPrice = () => {
    return Object.values(cart).reduce((acc, { price, quantity }) => acc + price * quantity, 0);
  };

  const totalPriceWithShipping = () => {
    const totalProductsPrice = Object.values(cart).reduce((acc, { price, quantity }) => acc + price * quantity, 0);
    return totalProductsPrice + shippingCost;
  };

  const getLastAddedProductUrl = () => {
    if (typeof window !== 'undefined') {
      const lastAddedProductId = localStorage.getItem('lastAddedProductId');
      if (lastAddedProductId) {
        return `/product/${lastAddedProductId}`;
      }
    }
    return '/';
  };

  return (
    <Layout>
      <main className="container mx-auto p-4 flex flex-wrap md:flex-nowrap">
        <div className="flex-1 md:flex-2/3">
          {Object.keys(cart).length === 0 ? (
            <div className="text-center text-gray-500">عربة التسوق فارغة.</div>
          ) : (
            Object.keys(cart).map((key) => (
              <div key={key} className="mx-0 my-2 flex overflow-hidden rounded-xl border border-gray-400 bg-white md:mx-4">
                <div className="flex items-center justify-center border-l border-gray-400" style={{ minWidth: '120px' }}>
                  <img
                    alt={`صورة ${cart[key].title}`}
                    src={cart[key].imagePaths[0]}
                    className="object-contain p-5"
                  />
                </div>
                <div className="relative mx-4 my-2.5 flex grow flex-wrap items-center justify-between lg:my-8 lg:flex-nowrap">
                  <span className="max-w-full grow transition-colors hover:text-primary md:max-w-xs lg:px-5">{cart[key].title}</span>
                  <div className="order-last mt-3 flex items-center justify-center text-center lg:order-none lg:mt-0">
                    <button
                      className="h-8 w-8 rounded-full border border-primary text-xl text-primary hover:bg-primary hover:text-white"
                      onClick={() => changeQuantity(key, cart[key].quantity + 1)}
                    >
                      +
                    </button>
                    <input
                      className="mx-1 h-8 w-14 rounded-2xl border border-gray-600 text-center outline-none"
                      type="number"
                      min="1"
                      value={cart[key].quantity}
                      onChange={(e) => changeQuantity(key, parseInt(e.target.value))}
                    />
                    <button
                      className="h-8 w-8 rounded-full border border-primary text-xl text-primary hover:bg-primary hover:text-white"
                      onClick={() => changeQuantity(key, cart[key].quantity - 1)}
                      disabled={cart[key].quantity <= 1}
                    >
                      -
                    </button>
                  </div>
                  <span className="order-last mt-3 flex items-center justify-center text-center lg:order-none lg:mt-0">{cart[key].price * cart[key].quantity} د.ع</span>
                  <button
                    className="order-last mt-3 flex items-center justify-center text-center lg:order-none lg:mt-0"
                    onClick={() => removeFromCart(key)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex-1 md:flex-1/3">
          <div className="mx-0 my-2 overflow-hidden rounded-xl border border-gray-400 bg-white px-4 py-6 md:mx-4">
            <div className="my-4 flex justify-between">
              <span className="text-gray-800">المجموع</span>
              <span className="font-bold">{totalPrice()} د.ع</span>
            </div>
            <div className="my-4 flex justify-between">
              <span className="text-gray-800">كلفة التوصيل</span>
              <span className="flex items-center font-bold">6 د.ع</span>
            </div>
            <hr className="my-5 border-gray-500" />
            <div className="my-4 flex justify-between">
              <span className="text-lg font-bold text-gray-800">الإجمالي</span>
              <span className="text-lg font-bold">{totalPriceWithShipping()} د.ع</span>
            </div>
            <Link href="/Checkout">
              <button
              
              className="disabled:text-accent-disabled flex items-center justify-center rounded-xl bg-red-500 text-white p-2 text-sm font-bold leading-loose transition duration-200 ease-in-out hover:bg-red-600 focus:outline-dashed focus:outline-2 focus:outline-offset-1 focus:outline-primary disabled:bg-primary-700 md:text-button h-14 w-full rounded-lg">
                أكمل الشراء
              </button>
            </Link>
            <Link href={getLastAddedProductUrl()}>
              <button className="flex items-center justify-center font-bold focus:outline-none px-16 py-2 text-lg rounded leading-loose text-button-secondary bg-secondary hover:bg-secondary-hover border-solid border border-secondary-washed-out transition duration-200 ease-in-out disabled:text-primary-300 mb-2 mt-8 w-full">
                الرجوع الى المنتج
              </button>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default CartPage;
