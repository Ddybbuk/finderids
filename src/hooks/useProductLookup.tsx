import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/data/products';
import { useProductHistory } from './useProductHistory';
import { convertSupabaseCell, convertSupabaseDegas } from '@/utils/productConverters';

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

  // Keep track of current table selection
  const [tableSource, setTableSource] = useState<'cell' | 'degas'>('cell');

  // Fetch product by ID from selected table
  const findProductById = async (id: string): Promise<Product | undefined> => {
    try {
      console.log(`Searching for record with ID: ${id} in ${tableSource} table`);
      
      // Try multiple search approaches, starting with direct query
      let data;
      let error;

      // Search strategy depends on which table we're querying
      if (tableSource === 'cell') {
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
      } else if (tableSource === 'degas') {
        // First try exact match on id field
        console.log("Trying exact match on id field:", id);
        const idMatch = await supabase
          .from('degas')
          .select('*')
          .eq('id', id);
          
        if (idMatch.data && idMatch.data.length > 0) {
          console.log("Found match by id field!");
          data = idMatch.data;
          error = idMatch.error;
        } else {
          // Then try exact match on PalletID field
          console.log("Trying exact match on PalletID field:", id);
          const palletMatch = await supabase
            .from('degas')
            .select('*')
            .eq('PalletID', id);
          
          if (palletMatch.data && palletMatch.data.length > 0) {
            console.log("Found exact match on PalletID!");
            data = palletMatch.data;
            error = palletMatch.error;
          } else {
            // Try match on RFID field
            console.log("Trying match on RFID field:", id);
            const rfidMatch = await supabase
              .from('degas')
              .select('*')
              .eq('RFID', id);
              
            console.log("RFID match result:", rfidMatch);
            data = rfidMatch.data;
            error = rfidMatch.error;
            
            // If still no results, try as a number in the FIFO field
            if ((!data || data.length === 0) && !isNaN(Number(id))) {
              console.log("Trying as number in FIFO field:", Number(id));
              const fifoMatch = await supabase
                .from('degas')
                .select('*')
                .eq('FIFO', Number(id));
                
              console.log("FIFO match result:", fifoMatch);
              if (fifoMatch.data && fifoMatch.data.length > 0) {
                data = fifoMatch.data;
                error = fifoMatch.error;
              }
            }
          }
        }
      }

      console.log("Final search result:", data, error);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Convert data based on table source
        const product = tableSource === 'cell' 
          ? convertSupabaseCell(data[0]) 
          : convertSupabaseDegas(data[0]);
        
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
    tableSource,
    setTableSource,
    searchHistory,
    setSearchHistory,
    clearHistory,
    maxHistoryItems,
    changeMaxHistoryItems,
    saveHistoryToLocalStorage,
    loadHistoryFromLocalStorage
  };
};
