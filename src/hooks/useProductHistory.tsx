
import { useState, useEffect } from 'react';
import { Product } from '@/data/products';

export const useProductHistory = () => {
  const [searchHistory, setSearchHistory] = useState<Product[]>([]);
  const [maxHistoryItems, setMaxHistoryItems] = useState<number>(20); // Default to 20 items

  // Update search history with a new product
  const addToHistory = (product: Product) => {
    setSearchHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(item => item.id !== product.id);
      return [product, ...filteredHistory].slice(0, maxHistoryItems);
    });
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('productSearchHistory');
    localStorage.removeItem('productSearchHistoryMaxItems');
  };

  // Change max history items
  const changeMaxHistoryItems = (newMax: number) => {
    setMaxHistoryItems(newMax);
    localStorage.setItem('productSearchHistoryMaxItems', newMax.toString());
    // Apply new limit to existing history
    setSearchHistory(prev => prev.slice(0, newMax));
  };

  // Save history to localStorage
  const saveHistoryToLocalStorage = () => {
    localStorage.setItem('productSearchHistory', JSON.stringify(searchHistory));
    localStorage.setItem('productSearchHistoryMaxItems', maxHistoryItems.toString());
  };

  // Load history from localStorage
  const loadHistoryFromLocalStorage = () => {
    // Load max history items first
    const savedMaxItems = localStorage.getItem('productSearchHistoryMaxItems');
    if (savedMaxItems) {
      try {
        setMaxHistoryItems(parseInt(savedMaxItems, 10));
      } catch (error) {
        console.error('Failed to parse max history items:', error);
        localStorage.removeItem('productSearchHistoryMaxItems');
      }
    }

    // Then load history
    const savedHistory = localStorage.getItem('productSearchHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setSearchHistory(parsedHistory.slice(0, maxHistoryItems));
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
    maxHistoryItems,
    changeMaxHistoryItems,
    saveHistoryToLocalStorage,
    loadHistoryFromLocalStorage
  };
};
