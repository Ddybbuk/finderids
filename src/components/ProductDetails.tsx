
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from '@/data/products';

type ProductDetailsProps = {
  product: Product | null;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  if (!product) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg border-factory-gray bg-white">
      <CardHeader className="bg-factory-blue-dark text-white rounded-t-md">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
          <Badge className="text-sm font-medium" variant="outline">{product.id}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-lg font-medium mb-2">Defect Type: {product.name}</p>
          </div>
          
          {product.category && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-factory-gray mb-1">Row Number</p>
              <p className="font-medium">{product.category.replace('Row #: ', '')}</p>
            </div>
          )}
          
          {product.quantity > 0 && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-factory-gray mb-1">Value</p>
              <p className="font-medium">{product.quantity}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetails;
