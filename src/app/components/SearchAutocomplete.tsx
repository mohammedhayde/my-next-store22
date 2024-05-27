// components/SearchComponent.tsx
import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  Pagination,
} from 'react-instantsearch-hooks-web';
import { Hit as AlgoliaHit } from 'instantsearch.js';

// Algolia search client
const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

// Define the type for the hit
interface ProductHit extends AlgoliaHit {
  name: string;
  price: number;
  rating: number;
}

// Component to display each hit
function Hit({ hit }: { hit: ProductHit }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '5px' }}>
      <div style={{ fontWeight: 'bold' }}>
        <Highlight attribute="name" hit={hit} />
      </div>
      <div>Price: ${hit.price}</div>
      <div>Rating: {hit.rating} stars</div>
    </div>
  );
}

// Search component
function SearchComponent() {
  return (
    <InstantSearch searchClient={searchClient} indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}>
      <div>
        <h1>Product Search</h1>
        <SearchBox />
        <Hits<ProductHit> hitComponent={Hit} />
        <Pagination />
        
      </div>
    </InstantSearch>
  );
}

export default SearchComponent;
