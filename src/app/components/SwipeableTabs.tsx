"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Typography, Grid, Box, Tabs, Tab, CircularProgress } from '@mui/material';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from './ProductCard';
import InfiniteScroll from 'react-infinite-scroll-component';

SwiperCore.use([Pagination, Navigation]);

interface Product {
  id: number;
  title: string;
  price: number;
  handle: string;
  imagePaths: string[];
  description?: string;
  formattedPrice: string; // Changed to required
}

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
  }, [categories, value]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.un4store.com/api/Categories/main');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Consider showing an error message to the user
    }
  };

  const fetchProducts = async (categoryIndex: number, pageNumber: number, resetProducts: boolean = false) => {
    if (!categories[categoryIndex] || isFetching.current) return;

    const category = categories[categoryIndex].name.toLowerCase();
    isFetching.current = true;

    try {
      const response = await fetch(`https://api.un4store.com/api/ProductsController21/ByCategoryName/${category}?pageNumber=${pageNumber}&pageSize=4`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data: Product[] = await response.json();

      const formattedData = data.map(product => ({
        ...product,
        formattedPrice: `$${product.price.toFixed(2)}`
      }));

      if (resetProducts) {
        setProducts(formattedData);
      } else {
        setProducts(prevProducts => {
          const productIds = new Set(prevProducts.map(p => p.id));
          const uniqueNewProducts = formattedData.filter(p => !productIds.has(p.id));
          return [...prevProducts, ...uniqueNewProducts];
        });
      }

      setCurrentPage(pageNumber);
      setHasMore(formattedData.length === 4);
    } catch (error) {
      console.error('Error fetching products:', error);
      setHasMore(false);
      // Consider showing an error message to the user
    } finally {
      isFetching.current = false;
    }
  };

  const fetchMoreProducts = () => {
    if (!isFetching.current && hasMore) {
      fetchProducts(value, currentPage + 1);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setCurrentPage(1);
    fetchProducts(newValue, 1, true);
  };

  const defaultImage = 'https://assets.qa.amalcloud.net/amal-akeneo/7/3/3/a/733aa30f576b935a743254366931795bc87fdc0a_AM00064198P_1.jpg';

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        {categories.map((category) => (
          <Tab key={category.id} label={category.name} />
        ))}
      </Tabs>
      <Swiper
        onSlideChange={(swiper) => {
          setValue(swiper.activeIndex);
          setCurrentPage(1);
          fetchProducts(swiper.activeIndex, 1, true);
        }}
        slidesPerView={1}
        pagination={{ clickable: false }}
        navigation={false}
      >
        {categories.map((category, index) => (
          <SwiperSlide key={category.id}>
            <InfiniteScroll
              dataLength={products.length}
              next={fetchMoreProducts}
              hasMore={hasMore}
              loader={<CircularProgress />}
              endMessage={<Typography align="center">لا توجد المزيد من المنتجات.</Typography>}
            >
              <Grid container spacing={2} justifyContent="center" alignItems="stretch">
                {products.length > 0 ? (
                  products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
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
                    <Typography variant="body1" color="textSecondary" align="center">
                      لا توجد منتجات في هذا القسم حاليًا.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </InfiniteScroll>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default SwipeableTabButtons;