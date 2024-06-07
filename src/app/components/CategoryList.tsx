import { useEffect, useState } from 'react';
import fetchData from '@/app/services/fetchData';
import AddCategoryForm from './AddCategoryForm';
import UpdateCategoryForm from './UpdateCategoryForm';

interface Category {
  id: number;
  name: string;
  image: string;
  parentCategoryId?: number;
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
 
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const data = await fetchData('https://api.un4store.com/api/categories', token);
      setCategories(data);
    } catch (err) {
      if (err instanceof Error) {
        setError('Error fetching categories: ' + err.message);
      } else {
        setError('Error fetching categories');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch(`https://api.un4store.com/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        fetchCategories();
      } else {
        const errorText = await response.text();
        alert(errorText);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleAdd = () => {
    fetchCategories();
  };

  const handleUpdate = () => {
    setEditingCategory(null);
    fetchCategories();
  };

  const renderCategories = (parentId: number | null) => {
    return categories
      .filter(category => category.parentCategoryId === parentId)
      .map(category => (
        <li key={category.id} className="mb-4 ml-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={category.image} alt={category.name} className="w-16 h-16 mr-4" />
              <div>
                <h2 className="text-xl font-semibold">{category.name}</h2>
              </div>
            </div>
            <div>
              <button
                onClick={() => setEditingCategory(category)}
                className="bg-yellow-500 text-white p-2 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
          <ul>
            {renderCategories(category.id)}
          </ul>
        </li>
      ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {editingCategory ? (
        <UpdateCategoryForm category={editingCategory} onUpdate={handleUpdate} />
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Categories</h1>
          <AddCategoryForm onAdd={handleAdd} />
          <ul>
            {renderCategories(0)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
