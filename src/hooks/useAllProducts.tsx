
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/data/products';
import { convertSupabasePallet } from '@/utils/productConverters';

// Hook to fetch all products
export const useAllProducts = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      try {
        console.log("Fetching all records from pallet table");
        
        // Use the pallet table instead of degas
        const { data, error } = await supabase.from('pallet').select('*');

        console.log("Pallet table query result:", data, error);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          return data.map(convertSupabasePallet);
        }
        
        toast({
          title: "No records found",
          description: "There are no records in the pallet table",
          variant: "destructive",
        });
        return [];
      } catch (error: any) {
        toast({
          title: "Failed to fetch records",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
        console.error("Error fetching records:", error);
        return [];
      }
    }
  });
};
