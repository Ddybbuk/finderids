
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/data/products';
import { useProductHistory } from './useProductHistory';
import { convertSupabasePallet } from '@/utils/productConverters';

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
      console.log("Fetching from Supabase:", id);
      
      // Try multiple search approaches
      let data;
      let error;

      // 1. First, try an exact match
      const exactMatch = await supabase
        .from('pallet')
        .select('*')
        .eq('PalletID', id);
      
      if (exactMatch.data && exactMatch.data.length > 0) {
        data = exactMatch.data;
        error = exactMatch.error;
      } else {
        // 2. Try without leading zeros if it has them
        const withoutLeadingZeros = id.replace(/^0+/, '');
        if (withoutLeadingZeros !== id) {
          const noZerosMatch = await supabase
            .from('pallet')
            .select('*')
            .eq('PalletID', withoutLeadingZeros);
            
          if (noZerosMatch.data && noZerosMatch.data.length > 0) {
            data = noZerosMatch.data;
            error = noZerosMatch.error;
          }
        }
        
        // 3. Try with case-insensitive partial match as last resort
        if (!data || data.length === 0) {
          const partialMatch = await supabase
            .from('pallet')
            .select('*')
            .ilike('PalletID', `%${id}%`);
            
          data = partialMatch.data;
          error = partialMatch.error;
        }
      }

      console.log("Supabase response:", data, error);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Take the first item if multiple results exist
        const product = convertSupabasePallet(data[0]);
        
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
