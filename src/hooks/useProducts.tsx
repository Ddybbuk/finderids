
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

// Convert cell table data to our app's Product type
const convertSupabaseCell = (cellData: any): Product => {
  let productName = "Unknown Product";
  let productCategory = "Unknown";
  
  try {
    // Try to extract product info from defect type
    if (cellData.defect_type) {
      productName = cellData.defect_type;
    }
  } catch (e) {
    console.error("Error parsing cell data:", e);
  }

  return {
    id: cellData.id || "unknown-id",
    name: productName,
    category: productCategory,
    location: "Warehouse",
    status: "in-stock" as "in-stock" | "low-stock" | "out-of-stock",
    quantity: 1,
    lastUpdated: new Date().toISOString().split('T')[0], // Use current date
    specifications: {}
  };
};

export const useProductLookup = () => {
  const [searchHistory, setSearchHistory] = useState<Product[]>([]);
  const { toast } = useToast();

  // Fetch product by ID
  const findProductById = async (id: string): Promise<Product | undefined> => {
    try {
      console.log("Fetching from Supabase:", id);
      const { data, error } = await supabase
        .from('cell')
        .select('*')
        .ilike('id', id)
        .maybeSingle();

      console.log("Supabase response:", data, error);

      if (error) {
        throw error;
      }

      if (data) {
        const product = convertSupabaseCell(data);
        
        // Update search history
        setSearchHistory(prevHistory => {
          const filteredHistory = prevHistory.filter(item => item.id !== product.id);
          return [product, ...filteredHistory].slice(0, 10);
        });
        
        return product;
      }
      
      toast({
        title: "Product not found",
        description: `No product found with ID: ${id}`,
        variant: "destructive",
      });
      
      return undefined;
    } catch (error: any) {
      toast({
        title: "Error finding product",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      console.error("Error finding product:", error);
      return undefined;
    }
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('productSearchHistory');
  };

  // Save history to localStorage whenever it changes
  const saveHistoryToLocalStorage = () => {
    localStorage.setItem('productSearchHistory', JSON.stringify(searchHistory));
  };

  // Load history from localStorage
  const loadHistoryFromLocalStorage = () => {
    const savedHistory = localStorage.getItem('productSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse search history:', error);
        localStorage.removeItem('productSearchHistory');
      }
    }
  };

  return {
    findProductById,
    searchHistory,
    setSearchHistory,
    clearHistory,
    saveHistoryToLocalStorage,
    loadHistoryFromLocalStorage
  };
};

// Hook to fetch all products (useful for admin interfaces or dropdowns)
export const useAllProducts = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      try {
        const { data, error } = await supabase
          .from('cell')
          .select('*');

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          return data.map(convertSupabaseCell);
        }
        
        toast({
          title: "No products found",
          description: "There are no products in the database",
          variant: "destructive",
        });
        return [];
      } catch (error: any) {
        toast({
          title: "Failed to fetch products",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
        console.error("Error fetching products:", error);
        return [];
      }
    }
  });
};
