// components/GTMTracker.tsx
'use client';
import { useEffect, ReactNode } from 'react';

const GTM_ID = 'GTM-K3X3FTXF';

interface GTMTrackerProps {
  children: ReactNode;
}

// تعريف dataLayer على كائن window
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

const GTMTracker = ({ children }: GTMTrackerProps) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const category = target.getAttribute('data-event-category');
      const action = target.getAttribute('data-event-action');
      const label = target.getAttribute('data-event-label');

      if (category && action && label) {
        window.dataLayer.push({
          event: 'customEvent',
          category: category,
          action: action,
          label: label,
        });
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {/* Google Tag Manager */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
      {/* End Google Tag Manager */}
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>
      {/* End Google Tag Manager (noscript) */}
      {children}
    </>
  );
};

export default GTMTracker;
