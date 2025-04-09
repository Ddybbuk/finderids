
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '@/data/products';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Search, Database, Menu } from 'lucide-react';
import { useProductLookup } from '@/hooks/useProductLookup';
import HomePage from '@/components/HomePage';
import SearchPage from '@/components/SearchPage';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Index = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  
  const {
    findProductById,
    tableSource,
    setTableSource,
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

  const handleTableChange = (table: 'cell' | 'degas') => {
    setTableSource(table);
    setCurrentProduct(null); // Clear current product when changing tables
    setSidebarOpen(false); // Close sidebar after selection
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-factory-blue-dark text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white mr-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px]">
                <SheetHeader>
                  <SheetTitle>Database Source</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <h3 className="mb-2 font-semibold">Select Table Source</h3>
                  <div className="space-y-2">
                    <Button 
                      variant={tableSource === 'cell' ? "default" : "outline"} 
                      className="w-full justify-start"
                      onClick={() => handleTableChange('cell')}
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Cell Table
                    </Button>
                    <Button 
                      variant={tableSource === 'degas' ? "default" : "outline"} 
                      className="w-full justify-start"
                      onClick={() => handleTableChange('degas')}
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Degas Table
                    </Button>
                  </div>
                  <div className="border-t my-4"></div>
                  <h3 className="mb-2 font-semibold">Navigation</h3>
                  <div className="space-y-2">
                    <Button 
                      variant={activeTab === 'home' ? "default" : "outline"} 
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab('home');
                        setSidebarOpen(false);
                      }}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Button>
                    <Button 
                      variant={activeTab === 'search' ? "default" : "outline"} 
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab('search');
                        setSidebarOpen(false);
                      }}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-2xl font-bold">Product Property Finder</h1>
          </div>
          <div className="text-sm">
            <span className="bg-blue-600 px-2 py-1 rounded text-xs font-mono">
              {tableSource === 'cell' ? 'CELL' : 'DEGAS'}
            </span>
          </div>
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
              autoSearch={true} // Enable auto search
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
