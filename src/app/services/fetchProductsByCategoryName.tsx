import { Product } from '@/app/types/typesProduct';

export const fetchProductsByCategoryName = async (categoryName: string): Promise<Product[]> => {
  const response = await fetch(`https://un4store.com//api/Categories/sub/${categoryName}`);
  const products: Product[] = await response.json();
  return products;
};
