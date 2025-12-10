import React, { useState, useMemo } from 'react';
import { createPlugin, usePluginData } from '@sap-developer-portal/plugin-sdk';

interface DogBreedsResponse {
  message: Record<string, string[]>;
  status: string;
}

const DogBreedsExplorer = createPlugin(({ context }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  
  // Note: Using external API for demonstration
  // In real plugin, you'd use context.apiClient for your backend
  const { data, loading, error } = usePluginData<DogBreedsResponse>(
    'https://dog.ceo/api/breeds/list/all',
    context.apiClient
  );

  const breeds = useMemo(() => {
    if (!data?.message) return [];
    return Object.keys(data.message);
  }, [data]);

  const filteredBreeds = useMemo(() => {
    return breeds.filter(breed =>
      breed.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [breeds, searchTerm]);

  const handleBreedClick = (breed: string) => {
    setSelectedBreed(breed);
    context.utils.toast(`Selected: ${breed}`, 'info');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dog breeds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen ${context.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🐕 Dog Breeds Explorer</h1>
          <p className="text-lg opacity-75">
            Explore {breeds.length} different dog breeds
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search breeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              context.theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBreeds.map((breed) => (
            <button
              key={breed}
              onClick={() => handleBreedClick(breed)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedBreed === breed
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : context.theme === 'dark'
                  ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold capitalize">{breed}</div>
                {data?.message[breed].length > 0 && (
                  <div className="text-sm opacity-75 mt-1">
                    {data.message[breed].length} sub-breeds
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {filteredBreeds.length === 0 && (
          <div className="text-center py-12 opacity-75">
            No breeds found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
});

export default DogBreedsExplorer;