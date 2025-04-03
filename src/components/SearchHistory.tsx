
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from '@/data/products';
import { Clock } from 'lucide-react';

type SearchHistoryProps = {
  history: Product[];
  onSelectProduct: (product: Product) => void;
  clearHistory: () => void;
};

const SearchHistory: React.FC<SearchHistoryProps> = ({ 
  history, 
  onSelectProduct,
  clearHistory
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="w-full mt-6 shadow-md border-factory-gray bg-white">
      <CardHeader className="bg-factory-gray-light py-3 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-factory-gray" />
          <CardTitle className="text-sm font-medium">Recent Searches</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-7"
          onClick={clearHistory}
        >
          Clear
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-200">
          {history.map((product) => (
            <li 
              key={product.id} 
              className="flex flex-col p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectProduct(product)}
            >
              <div className="flex justify-between">
                <span className="font-medium">{product.id}</span>
                <span className="text-sm text-factory-gray">{product.category}</span>
              </div>
              <div className="mt-1">
                <span className="text-factory-gray">{product.name}</span>
                {product.quantity > 0 && (
                  <span className="ml-2 text-sm text-factory-gray">Value: {product.quantity}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SearchHistory;
