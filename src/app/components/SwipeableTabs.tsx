"use client";
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Tabs, Tab } from '@mui/material';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from './ProductCard';
import InfiniteScroll from 'react-infinite-scroll-component';

// Activate Swiper modules for navigation and pagination
SwiperCore.use([Pagination, Navigation]);

// Define the product type
interface Product {
  id: number;
  title: string;
  price: number;
  handle: string;
  imagePaths: string[];
  description?: string;
}

// Define the category type
interface Category {
  id: number;
  name: string;
}

export default function SwipeableTabButtons() {
  const [value, setValue] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setCurrentPage(1);
      setProducts([]); // Clear products when tab changes
      fetchProducts(0); // Fetch products for the first tab initially
    }
  }, [categories]);

  useEffect(() => {
    if (categories.length > 0) {
      setCurrentPage(1);
      setProducts([]); // Clear products when tab changes
      fetchProducts(value); // Fetch products when tab changes
    }
  }, [value]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.un4store.com/api/Categories/main');
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (index: number) => {
    const category = categories[index].name.toLowerCase();
    try {
      const response = await fetch(`https://api.un4store.com/api/ProductsController21/ByCategoryName/${category}?pageNumber=1&pageSize=4`);
      const data: Product[] = await response.json();
      setProducts(data);
      setHasMore(data.length === 4); // Set hasMore based on the number of fetched products
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Clear products in case of an error
      setHasMore(false);
    }
  };

  const fetchMoreProducts = async () => {
    const nextPage = currentPage + 1;
    const category = categories[value].name.toLowerCase();

    try {
      const response = await fetch(`https://api.un4store.com/api/ProductsController21/ByCategoryName/${category}?pageNumber=${nextPage}&pageSize=4`);
      const data: Product[] = await response.json();
      setProducts([...products, ...data]);
      setCurrentPage(nextPage);
      setHasMore(data.length === 4); // Set hasMore based on the number of fetched products
    } catch (error) {
      console.error('Error fetching more products:', error);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentPage(1);
    setProducts([]); // Clear products when tab changes
    setValue(newValue); // Update tab index
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
          setValue(newIndex);
          fetchProducts(newIndex);
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
                    <Grid item key={idx} xs={12} sm={6} md={4} lg={3} style={{ flex: '0 0 auto' }}>
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
            </InfiniteScroll>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
