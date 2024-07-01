// types.ts
export interface Product {
    objectID: string;
    id: number;
    title: string;
    price: number;
    description: string;
    categoryId: number;
    category: string;
    imagePaths: string[];
    handle: string;
    discount?: number;
  }
  