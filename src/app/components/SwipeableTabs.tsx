"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Tabs, Tab, CircularProgress } from '@mui/material';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from './ProductCard';
import InfiniteScroll from 'react-infinite-scroll-component';

// تفعيل وحدات Swiper للتنقل والتصفح
SwiperCore.use([Pagination, Navigation]);

// تعريف نوع المنتج
interface Product {
  id: number;
  title: string;
  price: number;
  handle: string;
  imagePaths: string[];
  description?: string;
}

// تعريف نوع التصنيف
interface Category {
  id: number;
  name: string;
}

const SwipeableTabButtons = () => {
  const [value, setValue] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isFetching = useRef(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts(value, 1, true);
    }
  }, [categories]);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await fetch('https://api.un4store.com/api/Categories/main');
      const data: Category[] = await response.json();
      setCategories(data);
      console.log('Categories fetched successfully:', data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (categoryIndex: number, pageNumber: number, resetProducts: boolean = false) => {
    if (!categories[categoryIndex]) {
      console.warn('Invalid category index:', categoryIndex);
      return;
    }

    const category = categories[categoryIndex].name.toLowerCase();
    try {
      if (isFetching.current) {
        console.log('Fetch already in progress, skipping this call');
        return;
      }

      console.log(`Fetching products for category: ${category}, page: ${pageNumber}`);
      isFetching.current = true;

      const response = await fetch(`https://api.un4store.com/api/ProductsController21/ByCategoryName/${category}?pageNumber=${pageNumber}&pageSize=4`);
      const data: Product[] = await response.json();
      console.log(`Products fetched for page ${pageNumber}:`, data);

      if (resetProducts) {
        setProducts(data);
      } else {
        setProducts((prevProducts) => {
          const productIds = new Set(prevProducts.map(p => p.id));
          const uniqueNewProducts = data.filter(p => !productIds.has(p.id));
          return [...prevProducts, ...uniqueNewProducts];
        });
      }

      setCurrentPage(pageNumber);
      setHasMore(data.length === 4); // Set hasMore based on the number of fetched products
    } catch (error) {
      console.error('Error fetching products:', error);
      setHasMore(false);
    } finally {
      isFetching.current = false;
    }
  };

  const fetchMoreProducts = async () => {
    if (isFetching.current || !hasMore) {
      console.log('Skipping fetchMoreProducts: already fetching or no more products');
      return;
    }

    const nextPage = currentPage + 1;
    fetchProducts(value, nextPage);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(`Tab changed to: ${newValue}`);
    setValue(newValue);
    setCurrentPage(1);
    fetchProducts(newValue, 1, true);
  };

  const defaultImage = 'https://assets.qa.amalcloud.net/amal-akeneo/7/3/3/a/733aa30f576b935a743254366931795bc87fdc0a_AM00064198P_1.jpg'; // Replace with your default image path

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        {categories.map((category, index) => (
          <Tab key={index} label={category.name} />
        ))}
      </Tabs>
      <Swiper
        onSlideChange={(swiper) => {
          const newIndex = swiper.activeIndex;
          console.log(`Slide changed to: ${newIndex}`);
          setValue(newIndex);
          setCurrentPage(1);
          fetchProducts(newIndex, 1, true);
        }}
        slidesPerView={1}
        pagination={{ clickable: false }}
        navigation={false}
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <InfiniteScroll
              dataLength={products.length}
              next={fetchMoreProducts}
              hasMore={hasMore}
              loader={<Typography>Loading...</Typography>}
              endMessage={<Typography>No more products</Typography>}
            >
              <Grid container rowSpacing={1} justifyContent="center" alignItems="center" columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {products.length > 0 ? (
                  products.map((product, idx) => (
                    <Grid item key={`${product.id}-${idx}`} xs={12} sm={6} md={4} lg={3} style={{ flex: '0 0 auto' }}>
                      <ProductCard
                        product={{
                          ...product,
                          imagePaths: product.imagePaths.length ? product.imagePaths : [defaultImage]
                        }}
                      />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="textSecondary">
                      لا توجد منتجات في هذا القسم حاليًا.
                    </Typography>
                  </Grid>
                )}
              </Grid>
              {!hasMore && (
                <Box textAlign="center" mt={2}>
                  <Typography variant="body1" color="textSecondary">
                    لا توجد المزيد من المنتجات.
                  </Typography>
                </Box>
              )}
            </InfiniteScroll>
            {isFetching.current && (
              <Box textAlign="center" mt={2}>
                <CircularProgress />
              </Box>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default SwipeableTabButtons;
