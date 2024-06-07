"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postData, fetchData } from '@/app/services/apiHelpers';
import LexicalEditor from '@/app/components/LexicalEditor';
import { uploadToS3 } from '@/app/services/uploadToS3';

interface Category {
  id: number;
  name: string;
}

interface AddProductFormProps {
  onAdd: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [handle, setHandle] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const arabicToLatin = (text: string): string => {
    const arabicToLatinMap: { [key: string]: string } = {
      'أ': 'a', 'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 
      'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'dh', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 
      'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'h', 'ء': '', 'ئ': 'y', 'ؤ': 'w',
      'إ': 'i', 'آ': 'a'
    };

    return text.split('').map(char => arabicToLatinMap[char] || char).join('');
  };

  const createHandle = (name: string): string => {
    const latinName = arabicToLatin(name);
    return latinName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const data = await fetchData('https://api.un4store.com/api/categories', token);
        setCategories(data);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError('Error fetching categories: ' + err.message);
        } else {
          setError('Unknown error fetching categories');
        }
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setHandle(createHandle(title));
  }, [title]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // رفع الوصف إلى S3
      const descriptionBlob = new Blob([description], { type: 'text/plain' });
      const descriptionLink = await uploadToS3(`descriptions/${handle}.txt`, descriptionBlob, 'text/plain');

      // رفع الصور إلى S3
      const imageLinks: string[] = [];
      for (const image of images) {
        const imageLink = await uploadToS3(`images/${handle}/${image.name}`, image, image.type);
        imageLinks.push(imageLink);
      }

      const product = {
        title,
        price: parseFloat(price),
        description: descriptionLink, // حفظ رابط S3 بدلاً من النص الكامل
        handle,
        categoryId: parseInt(categoryId),
        imagePaths: imageLinks
      };

      await postData('https://api.un4store.com/api/Products', token, product);
      setSuccess('Product added successfully');
      setError(null); // إزالة رسالة الخطأ إذا كانت موجودة

      // إعادة تعيين الحقول إلى القيم الافتراضية
      setTitle('');
      setPrice('');
      setDescription('');
      setImages([]);
      setCategoryId('');
      setHandle('');

      onAdd();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Error adding product: ' + err.message);
        setSuccess(null); // إزالة رسالة النجاح إذا كانت موجودة
      } else {
        setError('Unknown error adding product');
        setSuccess(null); // إزالة رسالة النجاح إذا كانت موجودة
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <LexicalEditor value={description} onChange={setDescription} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
            <div className="flex flex-wrap mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative mr-2 mb-2">
                  <img src={URL.createObjectURL(image)} alt={`Selected Image ${index}`} className="w-16 h-16 rounded" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md shadow-sm"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
