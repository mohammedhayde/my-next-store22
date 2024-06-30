import React from 'react';
import Image from 'next/image';
import { SfButton, SfIconFavorite, SfLink } from '@storefront-ui/react';

interface Product {
  id: number;
  title: string;
  price: number;
  handle: string;
  imagePaths: string[];
  description?: string;
  formattedPrice:string;
}

interface ProductCard2Props {
  product: Product;
}

const ProductCard2: React.FC<ProductCard2Props> = ({ product }) => {
  const transformedProduct = {
    id: product.id.toString(),
    name: product.title,
    price: `د.ع ${product.price}`,
    formattedPrice : product.formattedPrice,
    handle: product.handle,
    img: {
      src: product.imagePaths && product.imagePaths.length > 0 ? product.imagePaths[0] : '/path/to/default-image.jpg',
      alt: product.description || 'Product Image',
    },
  };

  return (
    <div key={product.id} className="group border border-gray-300 rounded-lg p-4">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <Image
          src={transformedProduct.img.src}
          alt={transformedProduct.img.alt}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
          width={256}
          height={256}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700 line-clamp-2">{transformedProduct.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{transformedProduct.formattedPrice}</p>
    </div>
  );
};

export default ProductCard2;
