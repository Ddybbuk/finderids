
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from '@/data/products';
import { Clock, Settings, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({
    id: true,
    defectType: true,
    value: true,
    date: true,
    specifications: true
  });

  const toggleField = (field: string) => {
    setVisibleFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

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
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7"
              >
                <Filter className="h-3 w-3 mr-1" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Show/Hide Fields</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="id" 
                      checked={visibleFields.id} 
                      onCheckedChange={() => toggleField('id')} 
                    />
                    <label htmlFor="id" className="text-sm">ID</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="defectType" 
                      checked={visibleFields.defectType} 
                      onCheckedChange={() => toggleField('defectType')} 
                    />
                    <label htmlFor="defectType" className="text-sm">Defect Type</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="value" 
                      checked={visibleFields.value} 
                      onCheckedChange={() => toggleField('value')} 
                    />
                    <label htmlFor="value" className="text-sm">Value</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="date" 
                      checked={visibleFields.date} 
                      onCheckedChange={() => toggleField('date')} 
                    />
                    <label htmlFor="date" className="text-sm">Date</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="specifications" 
                      checked={visibleFields.specifications} 
                      onCheckedChange={() => toggleField('specifications')} 
                    />
                    <label htmlFor="specifications" className="text-sm">Specifications</label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
                  {visibleFields.id && <span className="font-medium">{product.id}</span>}
                </div>
                <div className="mt-1">
                  {visibleFields.defectType && <span className="text-factory-gray">{product.name}</span>}
                  
                  {visibleFields.value && product.quantity > 0 && (
                    <span className="ml-2 text-sm text-factory-gray">Value: {product.quantity}</span>
                  )}
                  
                  {visibleFields.date && product.location && (
                    <span className="ml-2 text-sm text-factory-gray">Date: {product.location}</span>
                  )}
                  
                  {/* Display specifications in search history with filtering */}
                  {visibleFields.specifications && Object.entries(product.specifications).map(([key, value]) => (
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
