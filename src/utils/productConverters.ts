
import { Product } from '@/data/products';

// Convert cell table data to our app's Product type
export const convertSupabaseCell = (cellData: any): Product => {
  let productName = "Unknown Product";
  let productCategory = "Unknown";
  
  try {
    // Try to extract product info from defect type
    if (cellData.defect_type) {
      productName = cellData.defect_type;
    }
  } catch (e) {
    console.error("Error parsing cell data:", e);
  }

  return {
    id: cellData.id || "unknown-id",
    name: productName,
    category: productCategory,
    location: "Warehouse",
    status: "in-stock" as "in-stock" | "low-stock" | "out-of-stock",
    quantity: 1,
    lastUpdated: new Date().toISOString().split('T')[0], // Use current date
    specifications: {}
  };
};
