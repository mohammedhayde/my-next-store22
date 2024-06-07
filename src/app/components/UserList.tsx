"use client"; // إضافة هذا السطر

import { useEffect, useState } from 'react';
import fetchData from '@/app/services/fetchData';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const data = await fetchData('https://api.un4store.com/api/users', token);
        setUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError('Error fetching products: ' + err.message);
        } else {
          setError('Error fetching products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
   
    return <>
    <style jsx>{`
        .loader {
          border: 16px solid #f3f3f3; 
          border-top: 16px solid #3498db;
          border-radius: 50%;
          width: 120px;
          height: 120px;
          animation: spin 2s linear infinite;
          margin: auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
    `}</style>
    <div className="loader"></div> 
  </>
    
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-4 p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
