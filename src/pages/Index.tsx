
// src/pages/Index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '@/data/products';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Search } from 'lucide-react';
import { useProductLookup } from '@/hooks/useProducts';
import HomePage from '@/components/HomePage';
import SearchPage from '@/components/SearchPage';

const Index = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<string>("home");
  const {
    findProductById,
    searchHistory,
    setSearchHistory,
    clearHistory,
    maxHistoryItems,
    changeMaxHistoryItems,
    saveHistoryToLocalStorage,
    loadHistoryFromLocalStorage
  } = useProductLookup();

  // Memoize the loadHistoryFromLocalStorage function to avoid infinite render loop
  const memoizedLoadHistory = useCallback(() => {
    loadHistoryFromLocalStorage();
  }, [loadHistoryFromLocalStorage]);

  // Memoize the saveHistoryToLocalStorage function to avoid infinite render loop
  const memoizedSaveHistory = useCallback(() => {
    saveHistoryToLocalStorage();
  }, [saveHistoryToLocalStorage, searchHistory, maxHistoryItems]);

  useEffect(() => {
    // Load search history from localStorage on component mount
    memoizedLoadHistory();
  }, [memoizedLoadHistory]);

  useEffect(() => {
    // Save search history to localStorage whenever it changes
    if (searchHistory.length > 0) {
      memoizedSaveHistory();
    }
  }, [searchHistory, maxHistoryItems, memoizedSaveHistory]);

  const handleProductFound = async (productId: string): Promise<boolean> => {
    console.log("handleProductFound called with ID:", productId);
    const product = await findProductById(productId);
    
    if (product) {
      console.log("Product found:", product);
      setCurrentProduct(product);
      // Switch to search tab when a product is found
      setActiveTab("search");
      return true; // Indicate success
    }
    
    console.log("Product not found for ID:", productId);
    return false; // Indicate failure (product not found)
  };

  const handleSelectFromHistory = (product: Product) => {
    setCurrentProduct(product);
    setActiveTab("search");
  };

  const navigateToSearch = () => {
    setActiveTab("search");
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="home" className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-0">
            <HomePage onNavigateToSearch={navigateToSearch} />
          </TabsContent>

          <TabsContent value="search" className="mt-0">
            <SearchPage
              currentProduct={currentProduct}
              onProductFound={handleProductFound}
              searchHistory={searchHistory}
              onSelectProduct={handleSelectFromHistory}
              clearHistory={clearHistory}
              maxHistoryItems={maxHistoryItems}
              onChangeMaxItems={changeMaxHistoryItems}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
