
import { useState, useCallback } from 'react';
import { Product } from '@/data/products';

export const useProductHistory = () => {
  const [searchHistory, setSearchHistory] = useState<Product[]>([]);
  const [maxHistoryItems, setMaxHistoryItems] = useState<number>(20); // Default to 20 items

  // Update search history with a new product
  const addToHistory = useCallback((product: Product) => {
    setSearchHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(item => item.id !== product.id);
      return [product, ...filteredHistory].slice(0, maxHistoryItems);
    });
  }, [maxHistoryItems]);

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('productSearchHistory');
    localStorage.removeItem('productSearchHistoryMaxItems');
  }, []);

  // Change max history items
  const changeMaxHistoryItems = useCallback((newMax: number) => {
    setMaxHistoryItems(newMax);
    localStorage.setItem('productSearchHistoryMaxItems', newMax.toString());
    // Apply new limit to existing history
    setSearchHistory(prev => prev.slice(0, newMax));
  }, []);

  // Save history to localStorage
  const saveHistoryToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem('productSearchHistory', JSON.stringify(searchHistory));
      localStorage.setItem('productSearchHistoryMaxItems', maxHistoryItems.toString());
    } catch (error) {
      console.error('Failed to save search history to localStorage:', error);
    }
  }, [searchHistory, maxHistoryItems]);

  // Load history from localStorage
  const loadHistoryFromLocalStorage = useCallback(() => {
    try {
      // Load max history items first
      const savedMaxItems = localStorage.getItem('productSearchHistoryMaxItems');
      if (savedMaxItems) {
        try {
          const parsedMaxItems = parseInt(savedMaxItems, 10);
          if (!isNaN(parsedMaxItems) && parsedMaxItems !== maxHistoryItems) {
            setMaxHistoryItems(parsedMaxItems);
          }
        } catch (error) {
          console.error('Failed to parse max history items:', error);
        }
      }

      // Then load history
      const savedHistory = localStorage.getItem('productSearchHistory');
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
            setSearchHistory(parsedHistory.slice(0, maxHistoryItems));
          }
        } catch (error) {
          console.error('Failed to parse search history:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load search history from localStorage:', error);
    }
  }, [maxHistoryItems]);

  return {
    searchHistory,
    setSearchHistory,
    addToHistory,
    clearHistory,
    maxHistoryItems,
    changeMaxHistoryItems,
    saveHistoryToLocalStorage,
    loadHistoryFromLocalStorage
  };
};
