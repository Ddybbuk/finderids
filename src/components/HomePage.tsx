
import React from 'react';
import { Search, Info } from 'lucide-react';

type HomePageProps = {
  onNavigateToSearch: () => void;
};

const HomePage: React.FC<HomePageProps> = ({ onNavigateToSearch }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Pallet Information Finder</h2>
      <p className="text-center text-gray-600 mb-6">
        Search for pallets by entering their ID code. The system will search for exact and partial matches.
      </p>
      
      <div className="bg-blue-50 rounded-md p-4 mb-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-700">Search Tips</h3>
            <ul className="list-disc list-inside text-sm text-blue-600 mt-1">
              <li>Use the exact Pallet ID for best results</li>
              <li>Search is not case sensitive</li>
              <li>System will also try partial matches if no exact match is found</li>
              <li>If you're not finding what you need, try a shorter part of the ID</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={onNavigateToSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Search className="h-4 w-4 mr-2" />
          Start Searching
        </button>
      </div>
    </div>
  );
};

export default HomePage;
