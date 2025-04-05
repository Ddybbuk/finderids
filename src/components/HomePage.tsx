
import React from 'react';
import { Search } from 'lucide-react';

type HomePageProps = {
  onNavigateToSearch: () => void;
};

const HomePage: React.FC<HomePageProps> = ({ onNavigateToSearch }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Cell Information Finder</h2>
      <p className="text-center text-gray-600 mb-6">
        Search Cell's information.
      </p>
      
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
