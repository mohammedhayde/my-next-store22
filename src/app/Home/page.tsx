'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/app/components/HeroSection';
import Layout from '@/app/components/Layout';
import ProductSlider from '@/app/components/ProductSlider';
import Slide from '@/app/components/slide';
import SwipeableTabs from '../components/SwipeableTabs';
import SearchComponent from '../components/SearchAutocomplete';
import ImageCarousel from '../components/ImageCarousel';
export default function HomePage1() {
  const [data, setData] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.API_URL}/api/ProductsController21/ByCategoryName/الملابس?pageNumber=1&pageSize=10`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

      
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <Layout>
      <Slide />
      <ImageCarousel apiEndpoint={`${process.env.API_URL}/api/Categories/main`} />
      <ProductSlider products={data} />
      <SwipeableTabs />
    </Layout>
  );
}
