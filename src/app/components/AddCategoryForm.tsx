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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api.un4store.com/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
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
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-2xl font-bold mb-2">Add Category</h2>
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
