
import { Product } from '@/data/products';

// Convert cell table data to our app's Product type
export const convertSupabaseCell = (cellData: any): Product => {
  // Create a specifications object with all columns that aren't explicitly mapped
  const specifications: Record<string, string | number> = {};
  
  // Add all fields from cellData to specifications except ones we explicitly handle
  Object.entries(cellData).forEach(([key, value]) => {
    if (!['id', 'defect type', '#', 'value', 'date'].includes(key) && value !== null) {
      specifications[key] = value as string | number;
    }
  });

  return {
    id: cellData.id || "unknown-id",
    name: cellData["defect type"] || "Unknown Defect",
    category: cellData["#"] ? `Row #: ${cellData["#"]}` : "",
    location: cellData.date || "",
    status: "in-stock" as "in-stock" | "low-stock" | "out-of-stock",
    quantity: cellData.value || 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    specifications: specifications
  };
};
