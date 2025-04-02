
import { useState } from 'react';
import { Product } from '@/data/products';

export const useProductHistory = () => {
  const [searchHistory, setSearchHistory] = useState<Product[]>([]);

  // Update search history with a new product
  const addToHistory = (product: Product) => {
    setSearchHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(item => item.id !== product.id);
      return [product, ...filteredHistory].slice(0, 10);
    });
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('productSearchHistory');
  };

  // Save history to localStorage
  const saveHistoryToLocalStorage = () => {
    localStorage.setItem('productSearchHistory', JSON.stringify(searchHistory));
  };

  // Load history from localStorage
  const loadHistoryFromLocalStorage = () => {
    const savedHistory = localStorage.getItem('productSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse search history:', error);
        localStorage.removeItem('productSearchHistory');
      }
    }
  };

  return {
    searchHistory,
    setSearchHistory,
    addToHistory,
    clearHistory,
    saveHistoryToLocalStorage,
    loadHistoryFromLocalStorage
  };
};
