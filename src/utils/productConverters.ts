
import { Product } from '@/data/products';

// Convert cell table data to our app's Product type
export const convertSupabaseCell = (cellData: any): Product => {
  return {
    id: cellData.id || "unknown-id",
    name: cellData["defect type"] || "Unknown Defect",
    category: cellData["#"] ? `Row #: ${cellData["#"]}` : "",
    location: "",
    status: "in-stock" as "in-stock" | "low-stock" | "out-of-stock",
    quantity: cellData.value || 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    specifications: {}
  };
};
