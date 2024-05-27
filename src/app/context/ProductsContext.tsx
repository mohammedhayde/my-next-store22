import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// تحديد نوع البيانات للـcontext
interface ProductsContextType {
  products: any[]; // استبدل 'any' بنوع البيانات المحدد للمنتجات إذا أمكن
  setProducts: Dispatch<SetStateAction<any[]>>; // استخدم نوع البيانات الدقيق للمنتجات بدلاً من 'any' إذا كان ذلك ممكنًا
}

// تحديد قيمة افتراضية تتوافق مع النوع ProductsContextType
const ProductsContext = createContext<ProductsContextType>({
  products: [],
  setProducts: () => {}
});

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<any[]>([]); // استبدل 'any' بنوع البيانات المحدد للمنتجات إذا كان ذلك ممكنًا

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
