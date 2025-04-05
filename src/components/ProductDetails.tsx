
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from '@/data/products';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ProductDetailsProps = {
  product: Product | null;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product
}) => {
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({
    defectType: true,
    value: true,
    date: true,
    specifications: true
  });

  if (!product) {
    return null;
  }
  
  const toggleField = (field: string) => {
    setVisibleFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  const specKeys = Object.keys(product.specifications || {});
  
  return (
    <Card className="w-full shadow-lg border-factory-gray bg-white">
      <CardHeader className="bg-factory-blue-dark text-white rounded-t-md bg-slate-500">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 bg-white text-gray-700 hover:bg-gray-100">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Show/Hide Fields</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="defect-type" 
                        checked={visibleFields.defectType} 
                        onCheckedChange={() => toggleField('defectType')} 
                      />
                      <label htmlFor="defect-type" className="text-sm">Defect Type</label>
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
            <Badge className="text-sm font-medium" variant="outline">{product.id}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {visibleFields.defectType && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-lg font-medium mb-2">Defect Type: {product.name}</p>
            </div>
          )}
          
          {visibleFields.value && product.quantity > 0 && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-factory-gray mb-1">Value</p>
              <p className="font-medium">{product.quantity}</p>
            </div>
          )}
          
          {visibleFields.date && product.location && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-factory-gray mb-1">Date</p>
              <p className="font-medium">{product.location}</p>
            </div>
          )}
          
          {/* Display all other specifications dynamically */}
          {visibleFields.specifications && Object.entries(product.specifications).length > 0 && (
            <>
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-factory-gray mb-1">{key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ')}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetails;
