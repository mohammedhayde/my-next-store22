import React, { useState } from 'react';
import AutocompleteComponent from './AutocompleteComponent';
import ProductList from './ProductList';
import { Product } from './types';

const ParentComponent: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div>
      <AutocompleteComponent onSelectProduct={handleSelectProduct} />
      <ProductList prefilledProduct={selectedProduct} />
    </div>
  );
};

export default ParentComponent;
