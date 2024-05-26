"use client";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { fetchCategoryName } from '@/app/services/fetchCategoryName';

// Define the type for a single slide
interface Slide {
  id: number;
  name: string;
  image: string;
}

// Define the type for the props
interface ImageCarouselProps {
  apiEndpoint: string;
}

// تعديل المكون ليقبل الخصائص
const ImageCarousel: React.FC<ImageCarouselProps> = ({ apiEndpoint }) => {
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    // جلب البيانات من API
    const fetchCategories = async () => {
      try {
        const categories = await fetchCategoryName(apiEndpoint);
        setSlides(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [apiEndpoint]); // إضافة الاعتماد على apiEndpoint

  // تقسم الشرائح إلى مجموعات من 10
  const groupedSlides = [];
  for (let i = 0; i < slides.length; i += 10) {
    groupedSlides.push(slides.slice(i, i + 10));
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
    >
      {groupedSlides.map((group, index) => (
        <SwiperSlide key={index}>
          <div className="grid grid-cols-5 gap-4 p-2">
            {group.map((slide) => (
              <Link href={`/category/${slide.name}`} key={slide.id}>
                <div className="flex flex-col items-center">
                  <img 
                    src={slide.image}
                    alt={slide.name}
                    className="w-full h-auto size-6"
                  />
                  <h1 className="mt-1 text-center">{slide.name}</h1>
                </div>
              </Link>
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
