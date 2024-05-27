import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AlgoliaSearchBox from './AlgoliaSearch/AlgoliaSearchBox.component';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => (
  <div >
         

    <Navbar />
    {children}
  
  </div>
);

export default Layout;
