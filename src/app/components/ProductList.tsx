import { useEffect, useState } from 'react';
import { fetchData, deleteData } from '@/app/services/apiHelpers';
import AddProductForm from './AddProductForm';
import UpdateProductForm from './UpdateProductForm';
import InfiniteScroll from 'react-infinite-scroll-component';
import { deleteFromS3 } from '@/app/services/s3Helpers'; // تأكد من استيراد دالة الحذف من S3

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  categoryId: number;
  category: string;
  imagePaths: string[];
  handle: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  const fetchProducts = async (page: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const data = await fetchData(`https://api.un4store.com/api/products?page=${page}&pageSize=${pageSize}`, token);
      if (data.length < pageSize) {
        setHasMore(false);
      }
      setProducts((prevProducts) => [...prevProducts, ...data]);
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

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleDelete = async (id: number, handle: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // حذف المجلد من S3
      await deleteFromS3(`images/${handle}/`);

      // حذف المنتج من قاعدة البيانات
      await deleteData(`https://api.un4store.com/api/products/${id}`, token);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      // Reset pagination
      setPage(1);
      setProducts([]);
      setHasMore(true);
      fetchProducts(1);
    } catch (error) {
      if (error instanceof Error) {
        setError('Error deleting product: ' + error.message);
      } else {
        setError('Error deleting product');
      }
    }
  };

  const handleAdd = () => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1);
  };

  const handleUpdate = () => {
    setEditingProductId(null);
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1);
  };

  if (loading && page === 1) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {editingProductId ? (
        <UpdateProductForm productId={editingProductId} onUpdate={handleUpdate} />
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Products</h1>
          <AddProductForm onAdd={handleAdd} />
          <InfiniteScroll
            dataLength={products.length}
            next={() => setPage((prevPage) => prevPage + 1)}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p style={{ textAlign: 'center' }}>No more products</p>}
          >
            <ul>
              {products.map((product) => (
                <li key={product.id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{product.title}</h2>
                      <p className="text-gray-600">Category: {product.category}</p> {/* Display the category */}
                      <p className="text-gray-600">${product.price}</p>
                      <p className="text-gray-600">{product.description}</p>
                      <div className="flex">
                        {product.imagePaths.map((path, index) => (
                          <img key={index} src={path} alt={product.title} className="w-16 h-16 mr-2" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => setEditingProductId(product.id)}
                        className="bg-yellow-500 text-white p-2 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.handle)}
                        className="bg-red-500 text-white p-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default ProductList;
