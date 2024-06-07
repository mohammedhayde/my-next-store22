import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchData, putData } from '@/app/services/apiHelpers';
import LexicalEditor from '@/app/components/LexicalEditor';
import { uploadToS3 } from '@/app/services/uploadToS3';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string; // Include category name
  imagePaths: string[];
  handle: string;
  creationAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
}

const arabicToLatin = (text: string) => {
  const arabicToLatinMap: { [key: string]: string } = {
    'أ': 'a', 'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 
    'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'dh', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'h', 'ء': '', 'ئ': 'y', 'ؤ': 'w',
    'إ': 'i', 'آ': 'a'
  };

  return text.split('').map(char => arabicToLatinMap[char] || char).join('');
};

const createHandle = (name: string) => {
  const latinName = arabicToLatin(name);
  return latinName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const UpdateProductForm = ({ productId, onUpdate }: { productId: number, onUpdate: () => void }) => {
  const [productData, setProductData] = useState<Product | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState(''); // استخدم HTML هنا
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [handle, setHandle] = useState('');
  const [creationAt, setCreationAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const data = await fetchData(`https://api.un4store.com/api/Products/${productId}`, token);
        setProductData(data);
        setTitle(data.title);
        setPrice(data.price.toString());
        setDescription(data.description); // قم بتعيين HTML هنا
        setExistingImages(data.imagePaths);
        setCategory(data.category); // Set category name
        setHandle(data.handle);
        setCreationAt(data.creationAt);
        setUpdatedAt(data.updatedAt);
      } catch (error) {
        setError('Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const data = await fetchData('https://api.un4store.com/api/categories', token);
        setCategories(data);
      } catch (error) {
        setError('Error fetching categories');
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

  const handleDeleteImage = (index: number, type: 'existing' | 'new') => {
    if (type === 'existing') {
      setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
    } else {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // رفع الوصف إلى S3
      const descriptionBlob = new Blob([description], { type: 'text/html' }); // استخدم HTML هنا
      const descriptionLink = await uploadToS3(`descriptions/${handle}.html`, descriptionBlob, 'text/html');

      // رفع الصور إلى S3
      const imageLinks = [...existingImages];
      for (const image of images) {
        const imageLink = await uploadToS3(`images/${handle}/${image.name}`, image, image.type);
        imageLinks.push(imageLink);
      }

      const selectedCategory = categories.find(cat => cat.name === category);

      if (!selectedCategory) {
        setError('Category not found');
        return;
      }

      const updatedProduct = {
        id: productData?.id ?? 0,
        title,
        price: parseFloat(price),
        description: descriptionLink, // حفظ رابط S3 بدلاً من النص الكامل
        handle,
        categoryId: selectedCategory.id, // Use categoryId from the selected category
        imagePaths: imageLinks,
        creationAt,
        updatedAt: new Date().toISOString(), // تحديث تاريخ التحديث
      };

      await putData(`https://api.un4store.com/api/products/${productData?.id}`, token, updatedProduct);
      onUpdate();
      router.push('/dashboard/products'); // توجيه المستخدم إلى صفحة المنتجات بعد تحديث المنتج
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!productData) {
    return <div>Error loading product data</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Update Product</h1>
        {error && <p className="text-red-500">{error}</p>}
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select a category</option>
              {categories.map((categoryItem) => (
                <option key={categoryItem.id} value={categoryItem.name}>
                  {categoryItem.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <LexicalEditor value={description} onChange={setDescription} /> {/* استخدم HTML هنا */}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Existing Images</label>
            <div className="flex flex-wrap">
              {existingImages.map((path, index) => (
                <div key={index} className="relative">
                  <img src={path} alt={`Product Image ${index}`} className="w-16 h-16 mr-2" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index, 'existing')}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">New Images</label>
            <div className="flex flex-wrap">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(image)} alt={`New Product Image ${index}`} className="w-16 h-16 mr-2" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index, 'new')}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Add New Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md shadow-sm"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductForm;
