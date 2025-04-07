
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/data/products';
import { convertSupabaseCell } from '@/utils/productConverters';

// Hook to fetch all products
export const useAllProducts = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      try {
        console.log("Fetching all records from degas table");
        
        // We need to use a more generic approach to bypass TypeScript limitations
        const { data, error } = await supabase
          .from('degas')
          .select('*') as any;

        console.log("Degas table query result:", data, error);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          return data.map(convertSupabaseCell);
        }
        
        toast({
          title: "No records found",
          description: "There are no records in the degas table",
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
