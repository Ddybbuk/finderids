
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
        Search for pallets by entering their ID code or RFID. The system will search for exact and partial matches.
      </p>
      
      <div className="bg-blue-50 rounded-md p-4 mb-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-700">Search Tips</h3>
            <ul className="list-disc list-inside text-sm text-blue-600 mt-1">
              <li>Use the exact Pallet ID (like PTQF31083) for best results</li>
              <li>You can also search by RFID (like PTACFE9464)</li>
              <li>Search is not case sensitive</li>
              <li>You can search with just a part of the ID (like 31083)</li>
              <li>The system will try to find matches in both PalletID and RFID fields</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 border border-yellow-200 bg-yellow-50 rounded-md">
        <h3 className="font-medium text-yellow-700 mb-2">Example Pallet IDs to try:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-yellow-100 rounded">PTQF31083</div>
          <div className="p-2 bg-yellow-100 rounded">PTQF31082</div>
          <div className="p-2 bg-yellow-100 rounded">PTS3F30094</div>
          <div className="p-2 bg-yellow-100 rounded">PTQF33122</div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
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
