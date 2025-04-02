
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Barcode, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

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
      toast({
        title: "Input is empty",
        description: "Please enter a product ID",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      // We'll let the parent component handle the actual searching
      // This simplifies the component and avoids duplicate logic
      onProductFound(productId.trim());
      setProductId('');
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

  useEffect(() => {
    // Auto-submit when in scan mode and there's input
    if (isScanning && productId.length > 0) {
      // Add a small delay to simulate a real scanner completing the scan
      const timer = setTimeout(() => {
        handleSearch();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [productId, isScanning]);

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
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className={`pr-10 ${isScanning ? 'border-factory-teal animate-pulse-light' : ''}`}
            disabled={isSearching}
          />
          {isScanning && (
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Barcode className="h-4 w-4 text-factory-teal" />
            </div>
          )}
        </div>
        <Button 
          onClick={handleSearch}
          className="bg-factory-blue hover:bg-factory-blue-dark"
          disabled={isSearching}
        >
          {isSearching ? (
            <div className="flex items-center">
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Searching...
            </div>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
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
