
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/data/products';
import { useProductHistory } from './useProductHistory';
import { convertSupabaseCell } from '@/utils/productConverters';

export const useProductLookup = () => {
  const { toast } = useToast();
  const {
    searchHistory,
    setSearchHistory,
    addToHistory,
    clearHistory,
    maxHistoryItems,
    changeMaxHistoryItems,
    saveHistoryToLocalStorage,
    loadHistoryFromLocalStorage
  } = useProductHistory();

  // Fetch product by ID
  const findProductById = async (id: string): Promise<Product | undefined> => {
    try {
      console.log("Searching for cell with ID:", id);
      
      // Try multiple search approaches
      let data;
      let error;

      // First log the current search value to help with debugging
      console.log("Search value:", id);
      
      // 1. First, try an exact match on id
      // Use any to bypass TypeScript checking until types are properly updated
      const exactMatch = await supabase
        .from('cell')
        .select('*')
        .eq('id', id) as any;
      
      console.log("Exact match result:", exactMatch);
      
      if (exactMatch.data && exactMatch.data.length > 0) {
        console.log("Found exact match!");
        data = exactMatch.data;
        error = exactMatch.error;
      } else {
        console.log("No exact match found, trying alternative searches...");
        
        // 2. Try with ilike (case-insensitive partial match)
        if (!data || data.length === 0) {
          console.log("Trying with partial match (ilike):", `%${id}%`);
          const partialMatch = await supabase
            .from('cell')
            .select('*')
            .ilike('id', `%${id}%`) as any;
            
          console.log("Partial match result:", partialMatch);
          data = partialMatch.data;
          error = partialMatch.error;
        }
      }

      console.log("Final search result:", data, error);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Take the first item if multiple results exist
        const product = convertSupabaseCell(data[0]);
        console.log("Converting to product:", product);
        
        // Update search history
        addToHistory(product);
        
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

  return {
    findProductById,
    searchHistory,
    setSearchHistory,
    clearHistory,
    maxHistoryItems,
    changeMaxHistoryItems,
    saveHistoryToLocalStorage,
    loadHistoryFromLocalStorage
  };
};
