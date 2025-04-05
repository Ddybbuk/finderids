
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from '@/data/products';
import { Clock, Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

type SearchHistoryProps = {
  history: Product[];
  onSelectProduct: (product: Product) => void;
  clearHistory: () => void;
  maxHistoryItems?: number;
  onChangeMaxItems?: (value: number) => void;
};

const SearchHistory: React.FC<SearchHistoryProps> = ({ 
  history, 
  onSelectProduct,
  clearHistory,
  maxHistoryItems = 10,
  onChangeMaxItems
}) => {
  const [showSettings, setShowSettings] = useState(false);

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
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-3 w-3 mr-1" />
            Settings
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7"
            onClick={clearHistory}
          >
            Clear
          </Button>
        </div>
      </CardHeader>
      
      {showSettings && (
        <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm">Max history items:</span>
          <Select 
            value={maxHistoryItems.toString()} 
            onValueChange={(value) => onChangeMaxItems?.(parseInt(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <ul className="divide-y divide-gray-200">
            {history.map((product) => (
              <li 
                key={product.id} 
                className="flex flex-col p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{product.id}</span>
                </div>
                <div className="mt-1">
                  <span className="text-factory-gray">{product.name}</span>
                  {product.quantity > 0 && (
                    <span className="ml-2 text-sm text-factory-gray">Value: {product.quantity}</span>
                  )}
                  {product.location && (
                    <span className="ml-2 text-sm text-factory-gray">Date: {product.location}</span>
                  )}
                  
                  {/* Display all specifications in search history */}
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <span key={key} className="ml-2 text-sm text-factory-gray">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ')}: {value}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SearchHistory;
