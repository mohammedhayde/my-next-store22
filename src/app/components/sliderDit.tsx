"use client";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Typography, Button, Grid, Paper, Box, Tab, Tabs, AppBar, TextField, MenuItem, Rating, Toolbar, IconButton, Badge } from '@mui/material';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import Swiper styles
 
export default function Slider() {
  return (
   

    <Swiper


    
      pagination={{
        type: 'fraction',
      }}
    
      modules={[Pagination, Navigation]}
      className={'mm'}
    >
       <Toolbar>
        {/* Toolbar content here */}
        <IconButton edge="start" color="inherit" aria-label="back">
          {/* Icon here */}
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
        <IconButton edge="end" color="inherit" aria-label="more">
          {/* Icon here */}
        </IconButton>
      </Toolbar>
     
     <SwiperSlide>
      <img
                        src="https://img.lazcdn.com/g/p/7a3ce6074a2259098af3449c3333bb7d.jpg_720x720q80.jpg_.webp"
                        alt="عروض خاصة على الأزياء"
                        width="100%"
                        height="100%"
                    />
      </SwiperSlide>
      <SwiperSlide>
      <img
                        src="https://img.lazcdn.com/g/p/7a3ce6074a2259098af3449c3333bb7d.jpg_720x720q80.jpg_.webp"
                        alt="عروض خاصة على الأزياء"
                        width="100%"
                        height="100%"
                    />
      </SwiperSlide>
      <SwiperSlide>
      <img
                        src="https://img.lazcdn.com/g/p/7a3ce6074a2259098af3449c3333bb7d.jpg_720x720q80.jpg_.webp"
                        alt="عروض خاصة على الأزياء"
                        width="100%"
                        height="100%"
                    />
      </SwiperSlide>
      <SwiperSlide>
      <img
                        src="https://img.lazcdn.com/g/p/7a3ce6074a2259098af3449c3333bb7d.jpg_720x720q80.jpg_.webp"
                        alt="عروض خاصة على الأزياء"
                        width="100%"
                        height="100%"
                    />
      </SwiperSlide>
    </Swiper>
  );
}
