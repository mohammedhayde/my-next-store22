import HeroSection from '@/app/components/HeroSection';
import Layout from '@/app/components/Layout';
import ProductSlider from '@/app/components/ProductSlider';
import Slide from '@/app/components/slide';
import SwipeableTabs from '../components/SwipeableTabs';
import SearchComponent from '../components/SearchAutocomplete';
import ImageCarousel from '../components/ImageCarousel';

async function getData() {
  const res = await fetch('http://localhost:5187/api/ProductsController21/ByCategoryName/الملابس?pageNumber=1&pageSize=10');
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function HomePage1() {
  const data = await getData();

  return (
    <Layout>

        <Slide />
        <ImageCarousel apiEndpoint="http://localhost:5187/api/Categories/main" />
        <ProductSlider products={data} />
        <SwipeableTabs />
    
    </Layout>
  );
}
