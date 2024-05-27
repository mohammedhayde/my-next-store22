"use client";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// تسمية المكون بشكل يعكس وظيفته
export default function ImageCarousel() {
    return (
        <>
            <Swiper
                dir="rtl"
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 5500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <img
                        src="https://lzd-img-global.slatic.net/g/ot/homepage/64ca81166adca0b3a9c393ce3d0a86ab.png_760x760q80.png_.webp"
                        alt="عرض ترويجي للمنتجات"
                        width="100%"
                        height="100%"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        src="https://lzd-img-global.slatic.net/g/ot/homepage/e47223931ffa90bd37c5e047950c45e2.png_760x760q80.png_.webp"
                        alt="تخفيضات على الأجهزة الإلكترونية"
                        width="100%"
                        height="100%"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        src="https://lzd-img-global.slatic.net/g/ot/homepage/3feb7d42e7ca9002b41d34ba999dbdab.png_760x760q80.png_.webp"
                        alt="عروض خاصة على الأزياء"
                        width="100%"
                        height="100%"
                    />
                </SwiperSlide>
            </Swiper>
        </>
    );
}


