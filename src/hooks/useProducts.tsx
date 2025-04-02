
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import supabase from '@/lib/supabase';
import { Product } from '@/data/products';
import { useToast } from '@/components/ui/use-toast';

// Mock data for when Supabase is not connected
const mockProducts: Product[] = [
  {
    id: "P1001",
    name: "Hydraulic Pump",
    category: "Hydraulics",
    location: "Warehouse A",
    status: "in-stock",
    quantity: 15,
    lastUpdated: "2023-06-15",
    specifications: { pressure: "200 bar", flow: "60 L/min", weight: "25kg" }
  },
  {
    id: "P1002",
    name: "Electric Motor",
    category: "Electronics",
    location: "Warehouse B",
    status: "low-stock",
    quantity: 3,
    lastUpdated: "2023-06-10",
    specifications: { power: "5.5 kW", rpm: "1450", type: "3-phase" }
  },
  {
    id: "P1005",
    name: "PLC Controller",
    category: "Automation",
    location: "Section C",
    status: "in-stock",
    quantity: 8,
    lastUpdated: "2023-05-20",
    specifications: { inputs: 16, outputs: 12, communication: "Ethernet/IP" }
  }
];

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
      // Check if we're using the mock client
      const isMockClient = !import.meta.env.VITE_SUPABASE_URL;
      
      if (isMockClient) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data
        const mockProduct = mockProducts.find(p => p.id === id);
        
        if (mockProduct) {
          // Update search history
          setSearchHistory(prevHistory => {
            const filteredHistory = prevHistory.filter(item => item.id !== mockProduct.id);
            return [mockProduct, ...filteredHistory].slice(0, 10);
          });
          
          return mockProduct;
        }
        
        toast({
          title: "Product not found",
          description: `No product found with ID: ${id}`,
          variant: "destructive",
        });
        
        return undefined;
      }
      
      // Real Supabase query
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
      // Check if we're using the mock client
      const isMockClient = !import.meta.env.VITE_SUPABASE_URL;
      
      if (isMockClient) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockProducts;
      }
      
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
