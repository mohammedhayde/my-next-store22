import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";



const inter = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "المتحدة للإلكترونيات - حلول شاملة لعشاق التكنولوجيا",
  description: "المتحدة للإلكترونيات تقدم أحدث الأجهزة الإلكترونية وملحقاتها من ماركات عالمية موثوقة. تأسست في عام 2015 لتزويد العملاء بأفضل الحلول التقنية.",
  keywords: "إلكترونيات, أجهزة كمبيوتر, لابتوب, ألعاب فيديو, ملحقات, المتحدة للإلكترونيات",
  openGraph: {
    title: "المتحدة للإلكترونيات - حلول شاملة لعشاق التكنولوجيا",
    description: "المتحدة للإلكترونيات تقدم أحدث الأجهزة الإلكترونية وملحقاتها من ماركات عالمية موثوقة. تأسست في عام 2015 لتزويد العملاء بأفضل الحلول التقنية.",
    url: "https://yourdomain.com",
    type: "website",
    images: [
      {
        url: "/path/to/og-image.jpg",
        width: 800,
        height: 600,
        alt: "المتحدة للإلكترونيات",
      },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        {children}
        
        
        </body>
    </html>
  );
}
