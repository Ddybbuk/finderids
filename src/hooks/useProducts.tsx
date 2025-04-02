
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import supabase from '@/lib/supabase';
import { Product } from '@/data/products';
import { useToast } from '@/components/ui/use-toast';

// Convert Supabase product to our app's Product type
const convertSupabaseProduct = (supabaseProduct: any): Product => {
  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    category: supabaseProduct.category,
    location: supabaseProduct.location,
    status: supabaseProduct.status,
    quantity: supabaseProduct.quantity,
    lastUpdated: supabaseProduct.last_updated.split('T')[0], // Format date
    specifications: supabaseProduct.specifications
  };
};

export const useProductLookup = () => {
  const [searchHistory, setSearchHistory] = useState<Product[]>([]);
  const { toast } = useToast();

  // Fetch product by ID
  const findProductById = async (id: string): Promise<Product | undefined> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const product = convertSupabaseProduct(data);
        
        // Update search history
        setSearchHistory(prevHistory => {
          const filteredHistory = prevHistory.filter(item => item.id !== product.id);
          return [product, ...filteredHistory].slice(0, 10);
        });
        
        return product;
      }
      
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
          .from('products')
          .select('*')
          .order('id');

        if (error) {
          throw error;
        }

        return (data || []).map(convertSupabaseProduct);
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
