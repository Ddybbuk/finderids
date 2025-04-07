
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
        console.log("Fetching all cells from Supabase");
        // Use any to bypass TypeScript checking until types are properly updated
        const { data, error } = await supabase
          .from('cell')
          .select('*') as any;

        console.log("All cells query result:", data, error);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          return data.map(convertSupabaseCell);
        }
        
        toast({
          title: "No products found",
          description: "There are no cells in the database",
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
