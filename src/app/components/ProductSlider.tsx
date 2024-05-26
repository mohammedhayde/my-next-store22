"use client";
import React from 'react';
import {
  SfLink,
  SfButton,
  SfIconFavorite,
  SfIconChevronLeft,
  SfIconChevronRight,
  SfScrollable,
} from '@storefront-ui/react';
import classNames from 'classnames';
import Image from 'next/image';

// Define the type for the product
interface Product {
  id: number;
  title: string;
  price: number;
  handle: string;
  imagePaths: string[];
  description?: string;
}

interface GalleryVerticalProps {
  products: Product[];
}

function ButtonPrev({ disabled = false, ...attributes }) {
  return (
    <SfButton
      className={classNames('absolute !rounded-full z-10 left-4 bg-white', {
        '!hidden': disabled,
      })}
      variant="secondary"
      size="lg"
      square
      {...attributes}
    >
      <SfIconChevronLeft />
    </SfButton>
  );
}

function ButtonNext({ disabled = false, ...attributes }) {
  return (
    <SfButton
      className={classNames('absolute !rounded-full z-10 right-4 bg-white', {
        '!hidden': disabled,
      })}
      variant="secondary"
      size="lg"
      square
      {...attributes}
    >
      <SfIconChevronRight />
    </SfButton>
  );
}

const GalleryVertical: React.FC<GalleryVerticalProps> = ({ products }) => {
  const defaultImage = 'https://assets.qa.amalcloud.net/amal-akeneo/7/3/3/a/733aa30f576b935a743254366931795bc87fdc0a_AM00064198P_1.jpg'; // Replace with your default image path

  const transformedProducts = products.map(product => ({
    id: product.id.toString(),
    name: product.title,
    price: `د.ع ${product.price.toFixed(2)}`,
    handle: product.handle,
    img: {
      src: product.imagePaths && product.imagePaths.length > 0 ? product.imagePaths[0] : defaultImage,
      alt: product.description,
    },
  }));

  return (
    <div className="gallery-container relative">
      <div className="header flex justify-between items-center mb-4 pl-4 pr-4 py-4">
        <SfButton variant="secondary">
          عرض كل المنتجات
        </SfButton>
        <h2 className="text-2xl font-semibold">الأفضل مبيعاً</h2>
      </div>
      <SfScrollable
        className="relative m-auto items-center w-full overflow-x-auto scrollbar-hide"
        buttons-placement="floating"
        drag
        slotPreviousButton={<ButtonPrev />}
        slotNextButton={<ButtonNext />}
      >
        {transformedProducts.map(({ id, name, price, img, handle }) => (
          <div
            key={id}
            className="product-card first:ms-auto last:me-auto ring-1 ring-inset ring-neutral-200 shrink-0 rounded-md hover:shadow-lg lg:w-[192px]"
          >
            <div className="relative">
              <SfLink href={`/product/${handle}`} className="block">
                <Image
                  src={img.src}
                  alt={'img.alt'}
                  className="block object-cover h-auto rounded-md aspect-square lg:w-[190px] lg:h-[190px]"
                  width={190}
                  height={190}
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
              <SfLink href={`/product/${handle}`} variant="secondary" className="no-underline productName">
                {name}
              </SfLink>
              <span className="block mt-2 font-bold" style={{ color: '#fe4960' }}>{price}</span>
            </div>
          </div>
        ))}
      </SfScrollable>
    </div>
  );
}

export default GalleryVertical;
