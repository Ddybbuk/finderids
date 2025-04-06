
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
        const { data, error } = await supabase
          .from('pallet')
          .select('*');

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          return data.map(convertSupabasePallet);
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
