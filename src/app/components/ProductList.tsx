"use client";

import { useEffect, useState } from 'react';
import { fetchData, deleteData } from '@/app/services/apiHelpers';
import AddProductForm from './AddProductForm';
import UpdateProductForm from './UpdateProductForm';
import InfiniteScroll from 'react-infinite-scroll-component';
import { deleteFromS3 } from '@/app/services/s3Helpers';
import algoliasearch from 'algoliasearch/lite';
import Image from 'next/image';
import Link from 'next/link';

const searchClient = algoliasearch('EMBIL6SNNG', '58873b56533470d16c3d836d7b5142d6');

// تحديث واجهة Product لتشمل objectID
interface Product {
  id?: number;
  objectID?: string;
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
  const [editingProductId, setEditingProductId] = useState<number | string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
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
    if (!isSearching) {
      fetchProducts(page);
    }
  }, [page, isSearching]);

  const handleDelete = async (id: number | string, handle: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await deleteFromS3(`images/${handle}/`);
      await deleteData(`https://api.un4store.com/api/products/${id}`, token);
      setProducts((prevProducts) => prevProducts.filter((product) => (product.id || product.objectID) !== id));
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

  // تحديث دالة handleSearch لتحويل نتائج Algolia
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setLoading(true);

    try {
      const results = await searchClient.initIndex('UN4STORE_PRODUCT').search<Product>(searchQuery);
      const formattedResults = results.hits.map(hit => ({
        ...hit,
        id: hit.objectID ? parseInt(hit.objectID) : undefined
      }));
      setProducts(formattedResults);
      setHasMore(false);
    } catch (err) {
      if (err instanceof Error) {
        setError('Error searching products: ' + err.message);
      } else {
        setError('Error searching products');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
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
    <div className="container mx-auto p-4">
      {editingProductId ? (
        <UpdateProductForm productId={editingProductId} onUpdate={handleUpdate} />
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Products</h1>
          <AddProductForm onAdd={handleAdd} />
          
          {/* نموذج البحث */}
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
              className="border p-2 mr-2 rounded"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Search</button>
            {isSearching && (
              <button onClick={clearSearch} className="ml-2 bg-gray-300 text-black p-2 rounded">Clear Search</button>
            )}
          </form>

          <InfiniteScroll
            dataLength={products.length}
            next={() => !isSearching && setPage((prevPage) => prevPage + 1)}
            hasMore={hasMore && !isSearching}
            loader={<h4>Loading...</h4>}
            endMessage={<p style={{ textAlign: 'center' }}>No more products</p>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id || product.objectID} className="border rounded-lg p-4 shadow-md">
                  <Link href={`/product/${product.handle}`}>
                    <div className="mb-2">
                      {product.imagePaths && product.imagePaths[0] && (
                        <Image 
                          src={product.imagePaths[0]} 
                          alt={product.title} 
                          width={300} 
                          height={300} 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                  </Link>
                  <p className="text-gray-600 mb-2">Category: {product.category}</p>
                  <p className="text-gray-600 mb-2">${product.price}</p>
                  <p className="text-gray-600 mb-4">{product.description.substring(0, 100)}...</p>
                  <div className="flex justify-between">
                    {/* تحديث زر التعديل ليستخدم id أو objectID */}
                    <button
                      onClick={() => setEditingProductId(product.id || product.objectID)}
                      className="bg-yellow-500 text-white p-2 rounded"
                    >
                      Edit
                    </button>
                    {/* تحديث زر الحذف ليستخدم id أو objectID */}
                    <button
                      onClick={() => handleDelete(product.id || product.objectID, product.handle)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default ProductList;