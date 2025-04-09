
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDebouncedCallback } from '@/hooks/useDebounce';

type ProductScannerProps = {
  onProductFound: (productId: string) => Promise<boolean>;
  clearInputOnScanSuccess?: boolean;
  autoSearch?: boolean;
};

const ProductScanner: React.FC<ProductScannerProps> = ({ 
  onProductFound,
  clearInputOnScanSuccess = false,
  autoSearch = true  // Default to auto search mode
}) => {
  const [productId, setProductId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounce the search to prevent too many requests
  const debouncedSearch = useDebouncedCallback(async (searchTerm: string) => {
    if (searchTerm.trim() === '') return;
    
    setIsLoading(true);
    try {
      const success = await onProductFound(searchTerm);
      if (success && clearInputOnScanSuccess) {
        setProductId('');
        // Refocus the input after clearing
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (error) {
      console.error("Error in product search:", error);
    } finally {
      setIsLoading(false);
    }
  }, 600); // 600ms debounce delay
  
  // Handle auto search when productId changes
  useEffect(() => {
    if (autoSearch && productId && productId.trim() !== '') {
      debouncedSearch(productId);
    }
  }, [productId, autoSearch, debouncedSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId || productId.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a valid product ID or scan a barcode.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await onProductFound(productId);
      
      if (success && clearInputOnScanSuccess) {
        setProductId('');
        // Refocus the input after clearing
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (error) {
      console.error("Error in product lookup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard events - clear on escape, submit on enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setProductId('');
    } else if (e.key === 'Enter' && !autoSearch) {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Input
              ref={inputRef}
              type="text" 
              placeholder="Enter product ID or scan barcode"
              className="pr-10 h-12 text-lg"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              disabled={isLoading}
            />
            {productId && (
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setProductId('');
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
                aria-label="Clear input"
              >
                ✕
              </button>
            )}
          </div>
          
          {!autoSearch && (
            <Button 
              type="submit" 
              className="min-w-[100px] h-12 text-lg"
              disabled={isLoading || !productId}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-opacity-50 border-t-white rounded-full"></div>
                </div>
              ) : (
                <>
                  <Search className="mr-2 w-5 h-5" />
                  Search
                </>
              )}
            </Button>
          )}
        </div>
        
        <div className="text-sm text-factory-gray">
          {autoSearch ? (
            <span>Type or scan to automatically search for products</span>
          ) : (
            <span>Enter a product ID, barcode or keyword and click Search</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductScanner;
