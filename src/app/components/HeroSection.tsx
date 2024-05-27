import { SfButton } from '@storefront-ui/react';
import Slide from './slide';

 

export default function HeroSection() {
    return (
     
      <div className="bg-gray-200 text-center p-12">
       
        <h2 className="text-3xl mb-4">مرحباً بكم في متجرنا</h2>
        <SfButton className="w-full">Hello</SfButton>;
       
        <p>أفضل المنتجات بأفضل الأسعار، جربها الآن!</p>
      </div>
    );
  }
  