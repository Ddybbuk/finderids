
import React from 'react';
import { Product } from '@/data/products';
import ProductScanner from '@/components/ProductScanner';
import ProductDetails from '@/components/ProductDetails';
import SearchHistory from '@/components/SearchHistory';

type SearchPageProps = {
  currentProduct: Product | null;
  onProductFound: (productId: string) => void;
  searchHistory: Product[];
  onSelectProduct: (product: Product) => void;
  clearHistory: () => void;
  maxHistoryItems: number;
  onChangeMaxItems: (newMax: number) => void;
};

const SearchPage: React.FC<SearchPageProps> = ({ 
  currentProduct, 
  onProductFound, 
  searchHistory, 
  onSelectProduct, 
  clearHistory,
  maxHistoryItems,
  onChangeMaxItems
}) => {
  return (
    <div>
      <ProductScanner onProductFound={onProductFound} />
      
      {currentProduct ? (
        <div className="mt-6">
          <ProductDetails product={currentProduct} />
        </div>
      ) : (
        <div className="mt-10 text-center p-10 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-factory-blue-dark mb-2">No Product Selected</h2>
          <p className="text-factory-gray">
            Enter a product ID in the search box or scan a product barcode to view its details.
          </p>
        </div>
      )}
      
      <SearchHistory 
        history={searchHistory} 
        onSelectProduct={onSelectProduct}
        clearHistory={clearHistory}
        maxHistoryItems={maxHistoryItems}
        onChangeMaxItems={onChangeMaxItems}
      />
    </div>
  );
};

export default SearchPage;
