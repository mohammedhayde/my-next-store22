export async function loadProductData(productId: string): Promise<Product | null> {
  try {
    const response = await fetch(`http://localhost:5187/api/ProductsController21/ByHandle/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product data, status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data.length > 0 ? data[0] : null;  // Return null if no data found
  } catch (error) {
    console.error("Failed to load product data:", error);
    return null;
  }
}

// Define the Product type
interface Product {
  id: number;
  title: string;
  image: string;
  description: string;
  price: number;
  imagePaths: string[];
  handle: string;
}
