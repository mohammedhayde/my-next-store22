// app/layout.tsx
import './globals.css';
import GTMTracker from '@/app/components/GTMTracker';

export const metadata = {
  title: 'المتحدة للإلكترونيات - حلول شاملة لعشاق التكنولوجيا',
  description: 'المتحدة للإلكترونيات تقدم أحدث الأجهزة الإلكترونية وملحقاتها من ماركات عالمية موثوقة. تأسست في عام 2015 لتزويد العملاء بأفضل الحلول التقنية.',
  keywords: 'إلكترونيات, أجهزة كمبيوتر, لابتوب, ألعاب فيديو, ملحقات, المتحدة للإلكترونيات',
  openGraph: {
    title: 'المتحدة للإلكترونيات - حلول شاملة لعشاق التكنولوجيا',
    description: 'المتحدة للإلكترونيات تقدم أحدث الأجهزة الإلكترونية وملحقاتها من ماركات عالمية موثوقة. تأسست في عام 2015 لتزويد العملاء بأفضل الحلول التقنية.',
    url: 'https://yourdomain.com',
    type: 'website',
    images: [
      {
        url: '/path/to/og-image.jpg',
        width: 800,
        height: 600,
        alt: 'المتحدة للإلكترونيات',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body>
        <GTMTracker>{children}</GTMTracker>
      </body>
    </html>
  );
}
