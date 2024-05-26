import algoliasearch from 'algoliasearch/lite';
import { autocomplete } from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';
import { useEffect, useRef } from 'react';

const searchClient = algoliasearch('BHHXVEKGFH', '59327a638018a363eace1923b8cb9c81');

const AutocompleteComponent = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const autocompleteInstance = autocomplete({
      container: containerRef.current,
      placeholder: 'ما الذي تبحث عنه...',
      getSources({ query }) {
        return [
          {
            sourceId: 'products',
            getItems() {
              return searchClient
                .initIndex('shopify_products')
                .search(query)
                .then((result) => {
                    console.log(result.hits); // تسجيل النتائج للفحص
                    return result.hits;
                  });
                
            },
            templates: {
              
              item({ item, html }) {
                return html`<>
                <li class="group" id="product#1430691" role="option" aria-selected="false" dir="rtl">
                <a href="${item.handle}"
                   class="flex items-center justify-between bg-white px-4 py-3 hover:bg-gray-300 focus:bg-gray-300 md:p-4">
                  <div class="flex flex-1 items-center justify-between">
                    <div class="flex flex-col items-center">
                      <span class="mb-1 w-16 rounded-full bg-green-100 p-1 text-center text-xs font-medium text-green-700">خصم ${item.discount}%</span>
                      <span class="font-bold text-primary">${item.price} د.ع</span>
                    </div>
                    <span class="line-clamp-3 flex-3/4">${item.title}</span>
                  </div>
                  <div class="relative ms-3 flex h-18 w-18 items-center overflow-hidden rounded-xl border border-gray-400">
                    <img alt="${item.alt}" 
                         loading="lazy" 
                         width="59.4px" 
                         height="59.4px" 
                         decoding="async" 
                         data-nimg="1" 
                         sizes="59.4px" 
                         srcset="${item.imageSrcset}" 
                         src="${item.image}"
                         style="color: transparent; object-fit: contain; width: 59.4px; height: 59.4px;">
                  </div>
                </a>
            </li>
            
              
              

                </>`;
                
              },
            
            },
          },
        ];
      },
    });

    return () => {
      autocompleteInstance.destroy();
    };
  }, []);

  // إضافة الأنماط الداخلية هنا للتحكم في z-index
  return <div ref={containerRef} style={{ position: 'relative', zIndex: 1000, flexGrow: 1 }} className="autocomplete-container">


    
  </div>;
};

export default AutocompleteComponent;
