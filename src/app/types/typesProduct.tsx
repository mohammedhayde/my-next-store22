// تعريف نوع البيانات لمنتج
 
export interface Product {
  quantity: any;
  id: number;
  title: string;
  price: number;
  handle: string;
  imagePaths: string[]; // Ensure this property is included
  description?: string;
}

// تعريف نوع البيانات للخصائص المرسلة إلى المكون HomePage
export interface HomePageProps {
  products: Product[];
}
