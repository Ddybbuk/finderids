
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Barcode, AlertCircle, Info } from 'lucide-react';
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
      toast({
        title: "Please enter an ID",
        description: "Enter a pallet ID to search for",
        variant: "destructive",
      });
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
      if (productId.trim().length > 3) { // Only search if at least 4 characters
        handleSearch();
      }
    }, 500); // Longer debounce time for better UX
    
    return () => clearTimeout(timer);
  }, [productId]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder={isScanning ? "Scan barcode..." : "Enter pallet ID..."}
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
        <Button
          onClick={handleSearch}
          disabled={isSearching || !productId.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {isScanning && (
        <div className="flex items-center p-2 bg-blue-50 rounded text-sm">
          <AlertCircle className="h-4 w-4 text-factory-teal mr-2" />
          <p>Scan mode is active. Scanned barcodes will be processed automatically.</p>
        </div>
      )}
      
      <div className="flex items-center p-2 bg-gray-50 rounded text-sm">
        <Info className="h-4 w-4 text-gray-500 mr-2" />
        <p>Try searching by exact ID (e.g., "PTQF31083") or partial ID (e.g., "31083")</p>
      </div>
    </div>
  );
};

export default ProductScanner;
