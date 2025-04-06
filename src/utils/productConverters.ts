
import { Product } from '@/data/products';

// Convert cell table data to our app's Product type
export const convertSupabaseCell = (cellData: any): Product => {
  // Create a specifications object with all columns that aren't explicitly mapped
  const specifications: Record<string, string | number> = {};
  
  // Add all fields from cellData to specifications except ones we explicitly handle 
  // and excluding row, row number and other system fields
  Object.entries(cellData).forEach(([key, value]) => {
    if (!['id', 'defect type', '#', 'value', 'date', 'row', 'row number'].includes(key.toLowerCase()) && value !== null) {
      specifications[key] = value as string | number;
    }
  });

  return {
    id: cellData.id || "unknown-id",
    name: cellData["defect type"] || "Unknown Defect",
    category: "", // No longer using row number for category
    location: cellData.date || "",
    status: "in-stock" as "in-stock" | "low-stock" | "out-of-stock",
    quantity: cellData.value || 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    specifications: specifications
  };
};

// Convert pallet table data to our app's Product type
export const convertSupabasePallet = (palletData: any): Product => {
  // Create a specifications object with all columns that aren't explicitly mapped
  const specifications: Record<string, string | number> = {};
  
  // Add all fields from palletData to specifications except ones we explicitly handle
  Object.entries(palletData).forEach(([key, value]) => {
    if (!['id', 'name', 'quantity', 'date', 'status'].includes(key.toLowerCase()) && value !== null) {
      specifications[key] = value as string | number;
    }
  });

  return {
    id: palletData.id || "unknown-id",
    name: palletData.name || "Unknown Product",
    category: palletData.category || "",
    location: palletData.date || palletData.location || "",
    status: (palletData.status as "in-stock" | "low-stock" | "out-of-stock") || "in-stock",
    quantity: palletData.quantity || 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    specifications: specifications
  };
};
