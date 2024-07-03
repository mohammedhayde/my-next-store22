import React, { useEffect, useRef } from 'react';
import instantsearch from 'instantsearch.js';
import { lookingSimilar } from 'instantsearch.js/es/widgets';
import algoliasearch from 'algoliasearch/lite';
import {
  SfButton,
  SfIconChevronLeft,
  SfIconChevronRight,
  SfScrollable,
} from '@storefront-ui/react';
import classNames from 'classnames';

interface Product {
  id: number;
  title: string;
  price: number;
  handle: string;
  imagePaths: string[];
  description?: string;
}

interface LookingSimilarProps {
  objectIDs: string[];
}

function ButtonPrev({ disabled, ...attributes }: { disabled?: boolean }) {
  return (
    <SfButton
      className={classNames('absolute !rounded-full z-10 left-4 bg-white hidden md:block', {
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

function ButtonNext({ disabled, ...attributes }: { disabled?: boolean }) {
  return (
    <SfButton
      className={classNames('absolute !rounded-full z-10 right-4 bg-white hidden md:block', {
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

const LookingSimilarComponent: React.FC<LookingSimilarProps> = ({ objectIDs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // دالة لتنسيق السعر بالدينار العراقي
  const formatPriceIQD = (price: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };


  useEffect(() => {
    if (containerRef.current) {
      const searchClient = algoliasearch('EMBIL6SNNG', '58873b56533470d16c3d836d7b5142d6');
      
      const search = instantsearch({
        searchClient,
        indexName: 'UN4STORE_PRODUCT',
        future: {
            preserveSharedStateOnUnmount: true
          }
      });

      search.addWidgets([
        lookingSimilar({
          container: containerRef.current,
          objectIDs: objectIDs,
          cssClasses: {
            root: 'looking-similar-root',
            list: 'looking-similar-list',
            item: 'looking-similar-item',
          },
          templates: {
            item: (hit: Product) => `
              <div class="ring-1 ring-inset ring-neutral-200 shrink-0 rounded-md hover:shadow-lg w-[148px] lg:w-[192px]">
                <div class="relative">
                  <a href="/product/${hit.handle}" class="block">
                    <img
                      src="${hit.imagePaths[0]}"
                      alt="${hit.title}"
                      class="block object-cover h-auto rounded-md aspect-square lg:w-[190px] lg:h-[190px]"
                      width="146"
                      height="146"
                    />
                  </a>
                  <button
                    class="absolute bottom-0 right-0 mr-2 mb-2 bg-white border border-neutral-200 !rounded-full p-2"
                    aria-label="Add to wishlist"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div class="p-2 border-t border-neutral-200 typography-text-sm">
                  <a href="/product/${hit.handle}" class="no-underline text-black">${hit.title}</a>
                  <span class="block mt-2 font-bold">${formatPriceIQD(hit.price)}</span>
                </div>
              </div>
            `,
          },
        }),
      ]);

      search.start();

      return () => {
        search.dispose();
      };
    }
  }, [objectIDs]);

  return (
    <SfScrollable
      className="m-auto py-4 items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      buttons-placement="floating"
      drag
      slotPreviousButton={<ButtonPrev />}
      slotNextButton={<ButtonNext />}
    >
      <div ref={containerRef} className="looking-similar-container" />
    </SfScrollable>
  );
};

export default LookingSimilarComponent;