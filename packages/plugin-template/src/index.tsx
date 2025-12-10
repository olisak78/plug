import React, { useState } from 'react';
import { createPlugin, usePluginData } from '@sap-developer-portal/plugin-sdk';

/**
 * Example Plugin Component
 * 
 * This is a template for creating your own plugin.
 * Replace this with your own implementation.
 */
const MyPlugin = createPlugin(({ context }) => {
  const [count, setCount] = useState(0);
  
  // Example: Fetch data from an API
  // const { data, loading, error } = usePluginData('/api/example', context.apiClient);

  const handleClick = () => {
    setCount(count + 1);
    context.utils.toast(`Clicked ${count + 1} times!`, 'success');
  };

  return (
    <div className={`p-6 ${context.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          {context.metadata.name}
        </h1>
        
        <p className="text-lg mb-6">
          Welcome to your plugin! This is a template to get you started.
        </p>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Plugin Info</h2>
            <ul className="space-y-1 text-sm">
              <li><strong>ID:</strong> {context.metadata.id}</li>
              <li><strong>Version:</strong> {context.metadata.version}</li>
              <li><strong>Author:</strong> {context.metadata.author || 'Unknown'}</li>
              <li><strong>Theme:</strong> {context.theme}</li>
            </ul>
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Interactive Example</h2>
            <p className="mb-4">Click count: {count}</p>
            <button
              onClick={handleClick}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Click Me!
            </button>
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Available Features</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>API Client for backend requests</li>
              <li>Toast notifications</li>
              <li>Navigation utilities</li>
              <li>Theme-aware styling</li>
              <li>TypeScript support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MyPlugin;