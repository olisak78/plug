// src/index.tsx
/// <reference types="react" />
declare const React: any;

import { Project } from './types';

const ProjectsPlugin = ({ context }: { context: any }) => {
  const { useState, useEffect } = React;
  const { theme, apiClient, metadata, utils } = context;
  
  const themeMode = theme?.mode || 'light';
  const isDark = themeMode === 'dark';

  // State
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Fetch projects from portal backend
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('[Projects Plugin] Fetching projects from backend...');
      
      // This will call portal backend: /api/v1/projects
      // Or if backend proxy is set: http://localhost:4000/api/v1/projects
      const response = await apiClient.get('/api/v1/projects');
      
      console.log('[Projects Plugin] Received projects:', response);
      setProjects(response);
      utils.toast(`Loaded ${response.length} projects`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
      utils.toast(errorMessage, 'error');
      console.error('[Projects Plugin] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Parse views string to array
  const parseViews = (views: string): string[] => {
    return views.split(',').map(v => v.trim());
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📁 {metadata.title || metadata.name}</h1>
          <p className="text-lg opacity-75">Browse and explore available projects</p>
          <p className="text-sm opacity-50 mt-1">
            Version {metadata.version} • Current theme: {themeMode}
          </p>
        </div>

        {/* Controls */}
        <div className={`p-6 rounded-lg shadow-lg mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-2 rounded border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                List
              </button>
              <button
                onClick={fetchProjects}
                disabled={loading}
                className={`px-4 py-2 rounded transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-4 text-sm">
            <span className="opacity-75">
              Total: <strong>{projects.length}</strong> projects
            </span>
            {searchTerm && (
              <span className="opacity-75">
                Filtered: <strong>{filteredProjects.length}</strong> projects
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading projects...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-red-800 dark:text-red-200 font-semibold mb-1">
                  Failed to Load Projects
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                <button
                  onClick={fetchProjects}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className={`p-12 rounded-lg shadow-lg text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-2xl font-semibold mb-2">No Projects Found</h3>
            <p className="opacity-75">
              {searchTerm ? `No projects match "${searchTerm}"` : 'No projects available'}
            </p>
          </div>
        )}

        {/* Grid View */}
        {!loading && !error && viewMode === 'grid' && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Project Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    {project['components-metrics'] && (
                      <span className="px-2 py-1 text-xs rounded bg-green-500 text-white">
                        Metrics
                      </span>
                    )}
                  </div>
                  <p className="text-sm opacity-75 font-mono">{project.name}</p>
                </div>

                {/* Description */}
                <p className="text-sm opacity-90 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Metadata */}
                <div className="space-y-2 text-xs">
                  {/* Views */}
                  <div className="flex items-center gap-2">
                    <span className="opacity-75">Views:</span>
                    <div className="flex gap-1 flex-wrap">
                      {parseViews(project.views).map((view) => (
                        <span
                          key={view}
                          className={`px-2 py-1 rounded ${
                            isDark ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          {view}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Alerts Link */}
                  {project.alerts && (
                    <div className="flex items-center gap-2">
                      <span className="opacity-75">Alerts:</span>
                      <a
                        href={project.alerts}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 hover:underline truncate"
                        onClick={(e) => {
                          e.preventDefault();
                          utils.openExternal(project.alerts!);
                        }}
                      >
                        View Alerts Config
                      </a>
                    </div>
                  )}

                  {/* ID */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="opacity-75">ID:</span>
                    <code className="text-xs opacity-60 truncate">{project.id}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && !error && viewMode === 'list' && filteredProjects.length > 0 && (
          <div className={`rounded-lg shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                    <th className="text-left py-3 px-4 font-semibold">Views</th>
                    <th className="text-center py-3 px-4 font-semibold">Metrics</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project, index) => (
                    <tr
                      key={project.id}
                      className={`border-t ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      } hover:bg-opacity-50 ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-4 font-semibold">{project.title}</td>
                      <td className="py-3 px-4">
                        <code className="text-sm">{project.name}</code>
                      </td>
                      <td className="py-3 px-4 text-sm max-w-md truncate">
                        {project.description}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {parseViews(project.views).map((view) => (
                            <span
                              key={view}
                              className={`px-2 py-1 text-xs rounded ${
                                isDark ? 'bg-gray-700' : 'bg-gray-100'
                              }`}
                            >
                              {view}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {project['components-metrics'] ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="opacity-30">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export in the expected format
export default {
  component: ProjectsPlugin,
  metadata: {
    name: 'projects-plugin',
    version: '1.0.0',
    author: 'Oleg',
  },
  hooks: {
    onMount() {
      console.log('[Projects Plugin] mounted');
    },
    onUnmount() {
      console.log('[Projects Plugin] unmounted');
    },
  },
};