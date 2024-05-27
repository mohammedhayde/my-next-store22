'use client';
import { useState, useEffect } from 'react';
import Layout from '@/app/components/Layout';
import { Product } from '@/app/types/typesProduct'; // تأكد من مسار الملف بشكل صحيح
import { useRouter } from 'next/navigation';

interface CartItem extends Product {
  quantity: number;
}

const CheckoutPage = () => {
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    phoneNumber: '',
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // جلب السلة من localStorage عند تحميل الصفحة
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    try {
      const parsedCart = savedCart ? JSON.parse(savedCart) : {};
      const cartItems = Object.values(parsedCart) as CartItem[]; // تحويل الكائن إلى مصفوفة وإضافة النوع
      console.log('Parsed cart items:', cartItems); // تأكد من أن السلة تحتوي على القيم الصحيحة
      setCart(Array.isArray(cartItems) ? cartItems : []);
    } catch (error) {
      console.error('Error parsing cart from localStorage', error);
      setCart([]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // إعداد تفاصيل الطلب من السلة
    const orderDetails = cart.map(item => ({
      productId: item.id, // استخدام `id` بدلاً من `productId`
      quantity: item.quantity,
      productName: item.title,
    }));

    console.log('Order details to be submitted:', orderDetails); // تحقق من تفاصيل الطلب

    console.log('Submitting order with details:', {
      name: shippingInfo.name,
      address: shippingInfo.address,
      city: shippingInfo.city,
      phoneNumber: shippingInfo.phoneNumber,
      orderDetails: orderDetails,
    });

    // طلب إلى API لإكمال عملية الشراء
    const response = await fetch('http://localhost:5187/api/Orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: shippingInfo.name,
        address: shippingInfo.address,
        city: shippingInfo.city,
        phoneNumber: shippingInfo.phoneNumber,
        orderDetails: orderDetails,
      }),
    });

    if (response.ok) {
      alert('شكراً لطلبك! تم إكمال الشراء بنجاح.');
      // يمكنك أيضًا مسح السلة هنا
      localStorage.removeItem('cart');
      setCart([]); // قم بتفريغ حالة السلة
      setTimeout(() => {
        setIsSubmitting(false);
        router.push('/'); // إعادة التوجيه إلى الصفحة الرئيسية
      }, 1000); // مدة الأنميشن قبل إعادة التوجيه (1000 ملي ثانية = 1 ثانية)
    } else {
      const errorData = await response.json();
      console.error('Error placing order:', errorData);
      alert('حدث خطأ أثناء إكمال الشراء. يرجى المحاولة مرة أخرى.');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">إتمام الشراء</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">معلومات الشحن</h2>
            <div className="mb-2">
              <label className="block">الاسم:</label>
              <input
                type="text"
                name="name"
                value={shippingInfo.name}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block">العنوان:</label>
              <input
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block">المدينة:</label>
              <input
                type="text"
                name="city"
                value={shippingInfo.city}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block">رقم الهاتف:</label>
              <input
                type="text"
                name="phoneNumber"
                value={shippingInfo.phoneNumber}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
          </div>
          <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded" disabled={isSubmitting}>
            {isSubmitting ? 'جاري إتمام الشراء...' : 'إتمام الشراء'}
          </button>
        </form>
        {isSubmitting && <div className="mt-4 text-center text-green-500">جاري معالجة طلبك...</div>}
      </div>
    </Layout>
  );
};

export default CheckoutPage;
