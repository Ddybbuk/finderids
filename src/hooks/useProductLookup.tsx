
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
      console.log("Searching for record with ID:", id);
      
      // Try multiple search approaches, starting with direct query
      let data;
      let error;

      // First try exact match on id field
      console.log("Trying exact match on id field:", id);
      const idMatch = await supabase
        .from('cell')
        .select('*')
        .eq('id', id);
        
      if (idMatch.data && idMatch.data.length > 0) {
        console.log("Found match by id field!");
        data = idMatch.data;
        error = idMatch.error;
      } else {
        // Then try exact match on defect type field
        console.log("Trying exact match on defect type field:", id);
        const exactMatch = await supabase
          .from('cell')
          .select('*')
          .eq('defect type', id);
        
        if (exactMatch.data && exactMatch.data.length > 0) {
          console.log("Found exact match on defect type!");
          data = exactMatch.data;
          error = exactMatch.error;
        } else {
          // Try partial match using ilike
          console.log("Trying partial match on defect type:", `%${id}%`);
          const partialMatch = await supabase
            .from('cell')
            .select('*')
            .ilike('defect type', `%${id}%`);
            
          console.log("Partial match result:", partialMatch);
          data = partialMatch.data;
          error = partialMatch.error;
          
          // If still no results, try as a number in the value field
          if ((!data || data.length === 0) && !isNaN(Number(id))) {
            console.log("Trying as number in value field:", Number(id));
            const valueMatch = await supabase
              .from('cell')
              .select('*')
              .eq('value', Number(id));
              
            console.log("Value match result:", valueMatch);
            if (valueMatch.data && valueMatch.data.length > 0) {
              data = valueMatch.data;
              error = valueMatch.error;
            }
          }
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
        title: "Record not found",
        description: `No record found with ID: ${id}`,
        variant: "destructive",
      });
      
      return undefined;
    } catch (error: any) {
      toast({
        title: "Error finding record",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      console.error("Error finding record:", error);
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
