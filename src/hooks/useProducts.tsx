
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

// Mock data for when Supabase is not connected or while loading
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
  },
  {
    id: "TECEQAG140",
    name: "Pressure Control Valve",
    category: "Hydraulics",
    location: "Warehouse A, Section D",
    status: "in-stock",
    quantity: 12,
    lastUpdated: "2023-07-05",
    specifications: { 
      pressure: "350 bar", 
      connection: "G1/4", 
      material: "Stainless Steel",
      weight: "1.2kg",
      "max-temp": "120°C"
    }
  },
  {
    id: "TECFQ10524",
    name: "Hydraulic Filter",
    category: "Filtration",
    location: "Warehouse B, Section A",
    status: "in-stock",
    quantity: 18,
    lastUpdated: "2023-08-10",
    specifications: {
      "filtration": "10 micron",
      "flow-rate": "120 L/min",
      "pressure": "420 bar",
      "material": "Aluminum",
      "connection": "1 1/2 inch"
    }
  }
];

// Convert cell table data to our app's Product type
const convertSupabaseCell = (cellData: any): Product => {
  // Parse the defect type data which might contain product information
  let productData = { 
    name: "Unknown Product",
    category: "Unknown",
    location: "Unknown",
    status: "in-stock",
    quantity: 0,
    specifications: {}
  };

  try {
    // Try to extract product info from defect type which might be JSON or structured text
    // This is a flexible approach since we're not sure about the exact data structure
    if (cellData.defect_type) {
      // For simplicity, we're using the defect type as the product name
      productData.name = cellData.defect_type;
    }
  } catch (e) {
    console.error("Error parsing cell data:", e);
  }

  return {
    id: cellData.id || "unknown-id",
    name: productData.name,
    category: productData.category,
    location: productData.location,
    status: productData.status as "in-stock" | "low-stock" | "out-of-stock",
    quantity: productData.quantity,
    lastUpdated: new Date().toISOString().split('T')[0], // Use current date
    specifications: productData.specifications
  };
};

export const useProductLookup = () => {
  const [searchHistory, setSearchHistory] = useState<Product[]>([]);
  const { toast } = useToast();

  // Fetch product by ID
  const findProductById = async (id: string): Promise<Product | undefined> => {
    try {
      // First check in mock data for fast development
      const mockProduct = mockProducts.find(p => 
        p.id.toLowerCase() === id.toLowerCase()
      );
      
      if (mockProduct) {
        // Update search history
        setSearchHistory(prevHistory => {
          const filteredHistory = prevHistory.filter(item => item.id !== mockProduct.id);
          return [mockProduct, ...filteredHistory].slice(0, 10);
        });
        
        return mockProduct;
      }
      
      // If not in mock data, try to fetch from Supabase cell table
      console.log("Fetching from Supabase:", id);
      const { data, error } = await supabase
        .from('cell')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      console.log("Supabase response:", data, error);

      if (error) {
        throw error;
      }

      if (data) {
        const product = convertSupabaseCell(data);
        
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
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('cell')
          .select('*');

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          return data.map(convertSupabaseCell);
        }
        
        // Fallback to mock data if no data in Supabase
        return mockProducts;
      } catch (error: any) {
        toast({
          title: "Failed to fetch products",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
        console.error("Error fetching products:", error);
        return mockProducts; // Fallback to mock data
      }
    }
  });
};
