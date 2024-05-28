import { Product } from '@/app/types/typesProduct';

export const fetchProductsByCategoryName = async (categoryName: string): Promise<Product[]> => {
  const response = await fetch(`${process.env.API_URL}/api/ProductsController21/ByCategoryName/${categoryName}?pageNumber=1&pageSize=10`);
  const products: Product[] = await response.json();
  return products;
};
