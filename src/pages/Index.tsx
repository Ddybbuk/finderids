
import React, { useState, useEffect } from 'react';
import { Product } from '@/data/products';
import ProductScanner from '@/components/ProductScanner';
import ProductDetails from '@/components/ProductDetails';
import SearchHistory from '@/components/SearchHistory';
import { Separator } from "@/components/ui/separator";
import { useProductLookup } from '@/hooks/useProducts';

const Index = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const {
    findProductById,
    searchHistory,
    setSearchHistory,
    clearHistory,
    loadHistoryFromLocalStorage,
    saveHistoryToLocalStorage
  } = useProductLookup();

  useEffect(() => {
    // Load search history from localStorage on component mount
    loadHistoryFromLocalStorage();
  }, []);

  useEffect(() => {
    // Save search history to localStorage whenever it changes
    saveHistoryToLocalStorage();
  }, [searchHistory]);

  const handleProductFound = async (productId: string) => {
    const product = await findProductById(productId);
    if (product) {
      setCurrentProduct(product);
    }
  };

  const handleSelectFromHistory = (product: Product) => {
    setCurrentProduct(product);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-factory-blue-dark text-white py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Product Property Finder</h1>
          <p className="text-factory-gray-light">Scan or search for product details</p>
        </div>
      </header>
      
      <main className="container mx-auto p-6 max-w-4xl">
        <ProductScanner onProductFound={handleProductFound} />
        
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
            <Separator className="my-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Example Product IDs:</h3>
                <ul className="space-y-1 text-factory-gray">
                  <li>P1001 - Hydraulic Pump</li>
                  <li>P1002 - Electric Motor</li>
                  <li>P1005 - PLC Controller</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Tips:</h3>
                <ul className="space-y-1 text-factory-gray">
                  <li>Press the barcode button to enable scan mode</li>
                  <li>Recent searches are saved automatically</li>
                  <li>Click on history items to view again</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <SearchHistory 
          history={searchHistory} 
          onSelectProduct={handleSelectFromHistory}
          clearHistory={clearHistory}
        />
      </main>
    </div>
  );
};

export default Index;
