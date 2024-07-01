import { useEffect, useState } from 'react';
import { uploadToS3 } from '@/app/services/uploadToS3';

interface Category {
  id: number;
  name: string;
  image: string;
  parentCategoryId?: number;
}

interface UpdateCategoryFormProps {
  category: Category;
  onUpdate: () => void;
}

const UpdateCategoryForm: React.FC<UpdateCategoryFormProps> = ({ category, onUpdate }) => {
  const [name, setName] = useState(category.name);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(category.image);
  const [parentCategoryId, setParentCategoryId] = useState<number | undefined>(category.parentCategoryId);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = category.image;

    if (image) {
      const key = `categories/${image.name}`;
      const body = image;
      const contentType = image.type;
      imageUrl = await uploadToS3(key, body, contentType);
    }

    const updatedCategory = {
      name,
      image: imageUrl,
      parentCategoryId: parentCategoryId !== undefined ? parentCategoryId : null, // Set to null if undefined
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`https://api.un4store.com/api/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCategory),
      });
      if (response.ok) {
        onUpdate();
      } else {
        console.error('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-2xl font-bold mb-2">Update Category</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2 p-2 border border-gray-400"
      />
      <div className="mb-2">
        <img src={imagePreview} alt="Current Image" className="w-32 h-32 mb-2" />
        <input
          type="file"
          onChange={handleImageChange}
          className="p-2 border border-gray-400"
        />
      </div>
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
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update</button>
    </form>
  );
};

export default UpdateCategoryForm;
