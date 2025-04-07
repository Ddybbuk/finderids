// src/pages/Index.tsx
import React, { useState, useEffect } from 'react';
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
    setSearchHistory, // Keep if needed elsewhere, but useProductHistory handles updates
    clearHistory,
    maxHistoryItems,
    changeMaxHistoryItems,
    loadHistoryFromLocalStorage,
    saveHistoryToLocalStorage
  } = useProductLookup();

  useEffect(() => {
    // Load search history from localStorage on component mount
    loadHistoryFromLocalStorage();
  }, [loadHistoryFromLocalStorage]); // Add dependency

  useEffect(() => {
    // Save search history to localStorage whenever it changes
    // Note: useProductHistory hook already handles saving internally when history/maxItems change.
    // This might be redundant unless you have specific reasons.
    saveHistoryToLocalStorage();
  }, [searchHistory, maxHistoryItems, saveHistoryToLocalStorage]); // Add dependency

  // --- MODIFICATION START ---
  const handleProductFound = async (productId: string): Promise<boolean> => {
    const product = await findProductById(productId); // findProductById is already async
    if (product) {
      setCurrentProduct(product);
      // Switch to search tab when a product is found
      setActiveTab("search");
      return true; // Indicate success
    }
    return false; // Indicate failure (product not found)
  };
  // --- MODIFICATION END ---

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
              onProductFound={handleProductFound} // Pass the modified async function
              searchHistory={searchHistory}
              onSelectProduct={handleSelectFromHistory}
              clearHistory={clearHistory}
              maxHistoryItems={maxHistoryItems}
              onChangeMaxItems={changeMaxHistoryItems}
              // Optionally pass clear setting if needed later
              // clearInputOnScanSuccess={true}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index; // Ensure export default is present
