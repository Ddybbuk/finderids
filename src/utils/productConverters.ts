
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

// Convert degas table data to our app's Product type
export const convertSupabaseDegas = (degasData: any): Product => {
  // Create a specifications object with all columns that aren't explicitly mapped
  const specifications: Record<string, string | number> = {};
  
  // Add all fields from degasData to specifications except ones we explicitly handle
  Object.entries(degasData).forEach(([key, value]) => {
    if (!['id', 'PalletID', 'RFID', 'FIFO', 'Dzien pracy'].includes(key) && value !== null) {
      specifications[key] = value as string | number;
    }
  });

  return {
    id: degasData.id?.toString() || "unknown-id",
    name: degasData.PalletID || "Unknown Pallet",
    category: "Degas", 
    location: degasData["Dzien pracy"] || "",
    status: "in-stock" as "in-stock" | "low-stock" | "out-of-stock",
    quantity: degasData.FIFO || 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    specifications: {
      ...specifications,
      "RFID": degasData.RFID || "",
      "FIFO": degasData.FIFO || 0,
    }
  };
};
