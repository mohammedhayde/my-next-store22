import { Product } from '@/app/types/typesProduct';

export const fetchProductsByCategoryName = async (categoryName: string): Promise<Product[]> => {
  const response = await fetch(`http://apiun4shop.eu-west-2.elasticbeanstalk.com/api/Categories/sub/${categoryName}`);
  const products: Product[] = await response.json();
  return products;
};
