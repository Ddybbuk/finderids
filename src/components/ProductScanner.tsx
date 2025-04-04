
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Barcode, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type ProductScannerProps = {
  onProductFound: (productId: string) => void;
};

const ProductScanner: React.FC<ProductScannerProps> = ({ onProductFound }) => {
  const [productId, setProductId] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!productId.trim()) {
      return;
    }

    setIsSearching(true);
    
    try {
      // We'll let the parent component handle the actual searching
      onProductFound(productId.trim());
    } catch (error: any) {
      toast({
        title: "Error searching product",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleScanMode = () => {
    setIsScanning(prev => !prev);
    // Focus on input when scan mode is enabled
    if (!isScanning && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Auto-search when user types or pastes text (with small debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (productId.trim().length > 0) {
        handleSearch();
      }
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [productId]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder={isScanning ? "Scan barcode..." : "Enter product ID..."}
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className={`pr-10 ${isScanning ? 'border-factory-teal animate-pulse-light' : ''}`}
            disabled={isSearching}
            autoComplete="off"
          />
          {isScanning && (
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Barcode className="h-4 w-4 text-factory-teal" />
            </div>
          )}
        </div>
        <Button
          variant={isScanning ? "default" : "outline"}
          className={isScanning ? "bg-factory-teal hover:bg-factory-blue" : ""}
          onClick={handleScanMode}
          disabled={isSearching}
        >
          <Barcode className="h-4 w-4" />
        </Button>
      </div>
      
      {isScanning && (
        <div className="flex items-center p-2 bg-blue-50 rounded text-sm">
          <AlertCircle className="h-4 w-4 text-factory-teal mr-2" />
          <p>Scan mode is active. Scanned barcodes will be processed automatically.</p>
        </div>
      )}
    </div>
  );
};

export default ProductScanner;
