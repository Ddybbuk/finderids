
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Product } from '@/data/products';

type ProductDetailsProps = {
  product: Product | null;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  if (!product) {
    return null;
  }

  // Map status to appropriate color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-500';
      case 'low-stock':
        return 'bg-yellow-500';
      case 'out-of-stock':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full shadow-lg border-factory-gray bg-white">
      <CardHeader className="bg-factory-blue-dark text-white rounded-t-md">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
          <Badge className="text-sm font-medium" variant="outline">{product.id}</Badge>
        </div>
        <p className="text-factory-gray-light">{product.category}</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-factory-gray mb-1">Location</p>
            <p className="font-medium">{product.location}</p>
          </div>
          <div>
            <p className="text-sm text-factory-gray mb-1">Status</p>
            <div className="flex items-center">
              <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(product.status)} mr-2`}></span>
              <p className="font-medium capitalize">{product.status.replace('-', ' ')}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-factory-gray mb-1">Quantity</p>
            <p className="font-medium">{product.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-factory-gray mb-1">Last Updated</p>
            <p className="font-medium">{product.lastUpdated}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <p className="text-sm font-semibold mb-3">Specifications</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <p className="text-sm text-factory-gray capitalize">{key.replace('-', ' ')}</p>
                <p className="text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetails;
