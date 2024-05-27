"use client"; // تأكد من أن هذا السطر موجود في أعلى الملف

import { useEffect, useState } from "react";

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

const Cart1 = () => {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});

  useEffect(() => {
    // تأكد من أن الكود يتم تشغيله فقط على جانب العميل
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  return (
    <div>
      <h2>Cart</h2>
      {Object.keys(cart).length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        Object.keys(cart).map((key) => (
          <div key={key}>
            <h4>{cart[key].name}</h4>
            <p>Quantity: {cart[key].quantity}</p>
            <p>Price: ${cart[key].price}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart1;
