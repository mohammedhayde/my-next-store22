import HeroSection from '@/app/components/HeroSection';
import Layout from '@/app/components/Layout';
import ProductSlider from '@/app/components/ProductSlider';
import Slide from '@/app/components/slide';
import SwipeableTabs from '../components/SwipeableTabs';
import SearchComponent from '../components/SearchAutocomplete';
import ImageCarousel from '../components/ImageCarousel';

export async function getServerSideProps() {
  const res = await fetch('http://localhost:5187/api/ProductsController21/ByCategoryName/الملابس?pageNumber=1&pageSize=10');

  if (!res.ok) {
    return {
      notFound: true,
    };
  }

  const data = await res.json();

  return {
    props: {
      data,
    },
  };
}

const HomePage1 = ({ data }) => {
  return (
    <Layout>
      <Slide />
      <ImageCarousel apiEndpoint="http://localhost:5187/api/Categories/main" />
      <ProductSlider products={data} />
      <SwipeableTabs />
    </Layout>
  );
}

export default HomePage1;
