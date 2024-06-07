import { useEffect, useState } from 'react';
import { uploadToS3 } from '@/app/services/uploadToS3';

interface Category {
  id: number;
  name: string;
}

interface AddCategoryFormProps {
  onAdd: () => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [parentCategoryId, setParentCategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.un4store.com/api/categories');
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching categories: ' + (err as Error).message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = '';

    if (image) {
      const key = `categories/${image.name}`;
      const body = image;
      const contentType = image.type;
      imageUrl = await uploadToS3(key, body, contentType);
    }

    const newCategory = {
      name,
      image: imageUrl,
      parentCategoryId: parentCategoryId !== undefined ? parentCategoryId : 0, // Set to 0 if undefined
    };

    try {
      const response = await fetch('https://api.un4store.com/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      if (response.ok) {
        onAdd();
        setName('');
        setImage(null);
        setParentCategoryId(undefined);
      } else {
        console.error('Failed to add category');
      }
    } catch (err) {
      setError('Error adding category: ' + (err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-2xl font-bold mb-2">Add Category</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2 p-2 border border-gray-400"
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        className="mb-2 p-2 border border-gray-400"
      />
      <select
        value={parentCategoryId}
        onChange={(e) => setParentCategoryId(e.target.value ? parseInt(e.target.value) : undefined)}
        className="mb-2 p-2 border border-gray-400"
      >
        <option value="">Select Parent Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add</button>
    </form>
  );
};

export default AddCategoryForm;
