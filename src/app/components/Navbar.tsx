
"use client"
import { useState } from 'react';
import {
  SfButton,
  SfIconShoppingCart,
  SfIconFavorite,
  SfIconPerson,
  SfIconExpandMore,
  SfInput,
  SfIconSearch,
  SfIconMenu,
} from '@storefront-ui/react';
import Link from 'next/link';
import AutocompleteComponent from './Autocomplete';

export default function Navbar() {
  const [inputValue, setInputValue] = useState('');

  const actionItems = [
    {
      icon: <SfIconShoppingCart />,
      label: '',
      ariaLabel: 'Cart',
      role: 'button',
    },
    {
      icon: <SfIconFavorite />,
      label: '',
      ariaLabel: 'Wishlist',
      role: 'button',
    },
    {
      label: 'Log in',
      icon: <SfIconPerson />,
      ariaLabel: 'Log in',
      role: 'login',
    },
  ];

  const search = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(`Successfully found 10 results for ${inputValue}`);
  };

  return (
    <header className="flex justify-center w-full py-2 px-4 lg:py-5 lg:px-6 bg-white border-b border-neutral-200">
      <div className="flex flex-wrap lg:flex-nowrap items-center flex-row-reverse justify-end h-full max-w-[1536px] w-full">
        <Link 
          href="/Home"
          
          aria-label="SF Homepage"
          className="inline-block ml-4 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm shrink-0"
        >
          <picture>
            <source srcSet="https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/vsf_logo.svg" media="(min-width: 768px)" />
            <img
              src="https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/vsf_logo_sign.svg"
              alt="Sf Logo"
              className="w-8 h-8 md:h-6 md:w-[176px] lg:w-[12.5rem] lg:h-[1.75rem]"
            />
          </picture>
        </Link >
        <SfButton
          aria-label="Open categories"
          className="hidden lg:flex lg:ml-4"
          variant="tertiary"
          slotSuffix={<SfIconExpandMore className="hidden lg:block" />}
        >
          <span className="hidden lg:flex whitespace-nowrap">الأقسام</span>
        </SfButton>
        <form
          role="search"
          className="flex flex-[100%] order-last lg:order-3 mt-2 lg:mt-0 pb-2 lg:pb-0"
          onSubmit={search}
        >
                <AutocompleteComponent />

         
        </form>
        <SfButton
          aria-label="Open categories"
          className="lg:hidden order-first lg:order-last ml-4"
          square
          variant="tertiary"
        >
          <SfIconMenu />
        </SfButton>
        <nav className="flex-1 flex justify-start lg:order-last lg:mr-4">
          <div className="flex flex-row flex-nowrap">
            {actionItems.map((actionItem) => (
              <SfButton
                key={actionItem.ariaLabel}
                className="ml-2 -mr-0.5 rounded-md text-primary-700 hover:bg-primary-100 active:bg-primary-200 hover:text-primary-600 active:text-primary-700"
                aria-label={actionItem.ariaLabel}
                variant="tertiary"
                square
                slotPrefix={actionItem.icon}
              >
                {actionItem.role === 'login' && (
                  <p className="hidden xl:inline-flex whitespace-nowrap">{actionItem.label}</p>
                )}
              </SfButton>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

