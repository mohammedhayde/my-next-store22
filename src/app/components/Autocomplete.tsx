import algoliasearch from 'algoliasearch/lite';
import { autocomplete } from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';
import { useEffect, useRef } from 'react';
import aa from 'search-insights';
interface Product extends Record<string, any> {
  objectID: string;
  title: string;
  price: number;
  description: string;
  handle: string;
  categoryId: number;
  imagePaths: string[];
  discount?: number; // اجعل هذا الحقل اختياريًا إذا لم يكن دائمًا موجودًا
}
aa('init', {
  appId: 'EMBIL6SNNG',
  apiKey: '58873b56533470d16c3d836d7b5142d6',
});
const searchClient = algoliasearch('EMBIL6SNNG', '58873b56533470d16c3d836d7b5142d6');

const AutocompleteComponent = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }
    const autocompleteInstance = autocomplete<Product>({

   
      container: containerRef.current,
      placeholder: 'ما الذي تبحث عنه...',
      getSources({ query }) {
        return [
          {
            sourceId: 'products',
            getItems() {
              return searchClient
              .initIndex('UN4STORE_PRODUCT')
              .search<Product>(query)
              .then((result) => {
                console.log(result.hits);

                // إرسال حدث مشاهدة نتائج البحث
                aa('viewedObjectIDs', {
                  eventName: 'Products Viewed4',
                  index: 'UN4STORE_PRODUCT',
                  objectIDs: result.hits.map(item => item.objectID),
                  
                });

                return result.hits;
              });
             

            },
            templates: {
              
              item({ item, html }) {
                return html`<>
                <li class="group" id="product#1430691" role="option" aria-selected="false" dir="rtl">
                
                <a href="https://www.un4store.com/product/${item.handle}"
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
                         src="${item.imagePaths[0]}"
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
