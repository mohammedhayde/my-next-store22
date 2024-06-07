"use client";

import { useEffect, useState } from 'react';
import fetchData from '@/app/services/fetchData';

interface Order {
  id: number;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  createdAt: string;
  orderDetails: OrderDetail[];
}

interface OrderDetail {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const data = await fetchData('https://api.un4store.com/api/orders',token);
        setOrders(data);
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="mb-4 p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{order.name}</h2>
            <p>Address: {order.address}</p>
            <p>City: {order.city}</p>
            <p>Phone Number: {order.phoneNumber}</p>
            <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
            <h3 className="text-lg font-bold mt-4">Order Details:</h3>
            <ul>
              {order.orderDetails.map((detail) => (
                <li key={detail.productId} className="mt-2">
                  <p>Product: {detail.productName}</p>
                  <p>Quantity: {detail.quantity}</p>
                  <p>Price: ${detail.price.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
