import React from 'react';
import Image from 'next/image'; // استيراد مكون Image من next/image
import { SfButton, SfIconFavorite, SfLink } from '@storefront-ui/react';

// Define the type for the product prop
interface Product {
  id: number;
  title: string;
  price: number;
  handle: string;
  imagePaths: string[];
  description?: string;
  formattedPrice:string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // تحويل البيانات إلى التنسيق المطلوب
  const transformedProduct = {
    id: product.id.toString(),
    name: product.title,
    formattedPrice: product.formattedPrice,

  price: `د.ع ${product.price.toFixed(2)}`,
    handle: product.handle,
    img: {
      src: product.imagePaths && product.imagePaths.length > 0 ? product.imagePaths[0] : 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2568&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: product.description || 'Product Image',
    },
  };

  return (
    <div className="product-card first:ms-auto last:me-auto ring-1 ring-inset ring-neutral-200 shrink-0 rounded-md hover:shadow-lg lg:w-[25vw]">
      <div className="relative">
        <SfLink href={"/product/" + transformedProduct.handle} className="block">
          {/* استخدام مكون Image */}
          <Image
            src={transformedProduct.img.src}
            alt={transformedProduct.img.alt}
            className="block object-cover h-auto rounded-md aspect-square lg:w-[90%] lg:h-[90%]"
            width={146}
            height={146}
          />
        </SfLink>
        <SfButton
          variant="tertiary"
          size="sm"
          square
          className="absolute bottom-0 right-0 mr-2 mb-2 bg-white border border-neutral-200 !rounded-full"
          aria-label="Add to wishlist"
        >
          <SfIconFavorite size="sm" />
        </SfButton>
      </div>
      <div className="p-2 border-t border-neutral-200 typography-text-sm">
        <SfLink href={"/product/" + transformedProduct.handle} variant="secondary" className="no-underline productName">
          {transformedProduct.name} 
        </SfLink>
        <span className="block mt-2 font-bold" style={{ color: '#fe4960' }}>
          {transformedProduct.formattedPrice}
          
          
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
