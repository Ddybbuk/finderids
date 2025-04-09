
// src/components/ProductScanner.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Barcode, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type ProductScannerProps = {
  onProductFound: (productId: string) => Promise<boolean>; // Return success status
  clearInputOnScanSuccess?: boolean; // Optional prop with default value
};

const ProductScanner: React.FC<ProductScannerProps> = ({
  onProductFound,
  clearInputOnScanSuccess = true // Default to true if prop not provided
}) => {
  const [productId, setProductId] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    const trimmedId = productId.trim();
    if (!trimmedId) {
      return;
    }
    
    setIsSearching(true);

    try {
      console.log("Searching for product with ID:", trimmedId);
      const productFound = await onProductFound(trimmedId);
      
      console.log("Product found status:", productFound, "isScanning:", isScanning, "clearInputOnScanSuccess:", clearInputOnScanSuccess);
      
      // Clear input on successful scan if enabled and in scan mode or product was found
      if (productFound && (isScanning || clearInputOnScanSuccess)) {
        console.log("Clearing input field after successful scan");
        setProductId('');
      }
    } catch (error: any) {
      console.error("Error during product lookup:", error);
      toast({
        title: "Search Error",
        description: error.message || "An unexpected error occurred during the search.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If Enter key is pressed, trigger search
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleScanMode = () => {
    setIsScanning(prev => !prev);
    if (!isScanning && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // In scan mode, automatically search after a brief delay when input changes
  useEffect(() => {
    if (!isScanning || productId.trim() === '') return;
    
    const timer = setTimeout(() => {
      if (!isSearching && productId.trim().length > 0) {
        handleSearch();
      }
    }, 300);
    
    return () => clearTimeout(timer);
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
            onKeyDown={handleKeyDown}
            className={`pr-10 ${isScanning ? 'border-factory-teal animate-pulse-light' : ''}`}
            disabled={isSearching}
            autoComplete="off"
            autoFocus={isScanning}
          />
          {isScanning && (
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Barcode className="h-4 w-4 text-factory-teal" />
            </div>
          )}
        </div>
        <Button
          type="button"
          onClick={isScanning ? handleScanMode : handleSearch}
          variant={isScanning ? "default" : "outline"}
          className={isScanning ? "bg-factory-teal hover:bg-factory-blue" : ""}
          disabled={isSearching || (productId.trim() === '' && !isScanning)}
        >
          {isScanning ? <Barcode className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </Button>
        <Button
          type="button"
          variant={isScanning ? "default" : "outline"}
          className={isScanning ? "bg-factory-teal hover:bg-factory-blue" : ""}
          onClick={handleScanMode}
          disabled={isSearching}
        >
          <Barcode className="h-4 w-4" />
        </Button>
      </div>

      {isScanning && (
        <div className="flex items-center p-2 bg-blue-50 rounded text-sm text-blue-800 border border-blue-200">
          <AlertCircle className="h-4 w-4 text-factory-teal mr-2 flex-shrink-0" />
          <p>Scan mode active. Input field will clear automatically after successful scan.</p>
        </div>
      )}
    </div>
  );
};

export default ProductScanner;
