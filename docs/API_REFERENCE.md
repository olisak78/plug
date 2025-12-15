# Plugin SDK API Reference

Complete API reference for `@sap-developer-portal/plugin-sdk`

## Table of Contents

- [Core Concepts](#core-concepts)
- [Types](#types)
- [Plugin Context](#plugin-context)
- [API Client](#api-client)
- [Utilities](#utilities)
- [Hooks](#hooks)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Core Concepts

### Plugin Structure

Every plugin must export an object with the following structure:
```typescript
export default {
  component: PluginComponent,      // Required: React component
  metadata: {                      // Required: Plugin metadata
    name: string,
    version: string,
    author: string,
  },
  hooks?: {                        // Optional: Lifecycle hooks
    onMount?: () => void,
    onUnmount?: () => void,
  },
};
```

### React Global Access

**CRITICAL**: Plugins must access React from the global scope, not via imports.
```typescript
/// <reference types="react" />
declare const React: any;

const MyPlugin = ({ context }) => {
  const { useState, useEffect } = React;
  // ... plugin code
};
```

---

## Types

### PluginContext

The main context object provided to all plugins.
```typescript
interface PluginContext {
  theme: Theme;
  apiClient: ApiClient;
  metadata: PluginMetadata;
  utils: PluginUtils;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `Theme` | Current portal theme and colors |
| `apiClient` | `ApiClient` | Authenticated HTTP client for backend APIs |
| `metadata` | `PluginMetadata` | Plugin metadata from manifest |
| `utils` | `PluginUtils` | Utility functions (toast, navigation, etc.) |

**Example:**
```typescript
const MyPlugin = ({ context }) => {
  const { theme, apiClient, metadata, utils } = context;
  // Use context properties
};
```

---

### Theme

Theme information provided by the portal.
```typescript
interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  colors: {
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    destructive: string;
    border: string;
  };
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `mode` | `'light' \| 'dark'` | Current theme mode |
| `primaryColor` | `string` | Primary brand color (hex) |
| `colors` | `object` | Theme color palette |

**Example:**
```typescript
const MyPlugin = ({ context }) => {
  const themeMode = context.theme?.mode || 'light';
  const isDark = themeMode === 'dark';
  const primaryColor = context.theme?.primaryColor || '#2563eb';
  
  return (
    <div className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
      <h1 style={{ color: primaryColor }}>Themed Title</h1>
    </div>
  );
};
```

---

### PluginMetadata

Metadata about the plugin from the manifest.
```typescript
interface PluginMetadata {
  id: string;
  name: string;
  title?: string;
  version: string;
  description?: string;
  author?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique plugin identifier |
| `name` | `string` | Plugin name (code-friendly) |
| `title` | `string?` | Display title (human-readable) |
| `version` | `string` | Semantic version |
| `description` | `string?` | Short description |
| `author` | `string?` | Author name |

**Example:**
```typescript
const MyPlugin = ({ context }) => {
  return (
    <div>
      <h1>{context.metadata.title || context.metadata.name}</h1>
      <p>Version: {context.metadata.version}</p>
      <p>By: {context.metadata.author}</p>
    </div>
  );
};
```

---

## Plugin Context

### Accessing Context

Context is passed to your plugin component as a prop:
```typescript
const MyPlugin = ({ context }: { context: PluginContext }) => {
  // Access all context properties
  const { theme, apiClient, metadata, utils } = context;
};
```

### Context Properties Reference

#### `context.theme`
Portal theme information (mode, colors)
- See [Theme](#theme) for details

#### `context.apiClient`
Authenticated HTTP client for portal backend
- See [API Client](#api-client) for details

#### `context.metadata`
Plugin metadata from manifest
- See [PluginMetadata](#pluginmetadata) for details

#### `context.utils`
Utility functions (toast, navigation)
- See [Utilities](#utilities) for details

---

## API Client

The API client provides authenticated HTTP requests to the portal backend.

### Interface
```typescript
interface ApiClient {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body?: any, options?: RequestOptions): Promise<T>;
  put<T>(path: string, body?: any, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, body?: any, options?: RequestOptions): Promise<T>;
}
```

### RequestOptions
```typescript
interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}
```

---

### Methods

#### `get<T>(path, options?)`

Make a GET request.

**Parameters:**
- `path` (string): API endpoint path (e.g., `/api/v1/projects`)
- `options` (RequestOptions, optional): Request configuration

**Returns:** `Promise<T>`

**Example:**
```typescript
// Simple GET
const projects = await context.apiClient.get('/api/v1/projects');

// With query parameters
const filtered = await context.apiClient.get('/api/v1/projects', {
  params: {
    status: 'active',
    page: 1,
    limit: 10
  }
});

// With custom headers
const data = await context.apiClient.get('/api/v1/data', {
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

#### `post<T>(path, body?, options?)`

Make a POST request.

**Parameters:**
- `path` (string): API endpoint path
- `body` (any, optional): Request body (will be JSON stringified)
- `options` (RequestOptions, optional): Request configuration

**Returns:** `Promise<T>`

**Example:**
```typescript
// Simple POST
const newProject = await context.apiClient.post('/api/v1/projects', {
  name: 'new-project',
  title: 'New Project',
  description: 'A new project'
});

// With custom headers
const result = await context.apiClient.post('/api/v1/data', 
  { key: 'value' },
  {
    headers: { 'X-Custom': 'header' }
  }
);
```

#### `put<T>(path, body?, options?)`

Make a PUT request (full update).

**Parameters:**
- `path` (string): API endpoint path
- `body` (any, optional): Request body
- `options` (RequestOptions, optional): Request configuration

**Returns:** `Promise<T>`

**Example:**
```typescript
const updated = await context.apiClient.put('/api/v1/projects/123', {
  name: 'updated-project',
  title: 'Updated Project',
  description: 'Updated description'
});
```

#### `delete<T>(path, options?)`

Make a DELETE request.

**Parameters:**
- `path` (string): API endpoint path
- `options` (RequestOptions, optional): Request configuration

**Returns:** `Promise<T>`

**Example:**
```typescript
await context.apiClient.delete('/api/v1/projects/123');

// With confirmation
const deleteItem = async (id: string) => {
  try {
    await context.apiClient.delete(`/api/v1/items/${id}`);
    context.utils.toast('Item deleted', 'success');
  } catch (error) {
    context.utils.toast('Failed to delete', 'error');
  }
};
```

#### `patch<T>(path, body?, options?)`

Make a PATCH request (partial update).

**Parameters:**
- `path` (string): API endpoint path
- `body` (any, optional): Request body (partial data)
- `options` (RequestOptions, optional): Request configuration

**Returns:** `Promise<T>`

**Example:**
```typescript
// Update only specific fields
const patched = await context.apiClient.patch('/api/v1/projects/123', {
  status: 'archived'  // Only update status
});
```

---

### API Client Notes

**Authentication:**
- Authentication is automatic - JWT token is included in all requests
- No need to manually add Authorization headers

**Error Handling:**
- All methods throw errors on failure
- Always wrap in try-catch for proper error handling

**Base URL:**
- In production: Calls portal backend automatically
- In development with backend URL: Proxies to local backend

**Example with Error Handling:**
```typescript
const MyPlugin = ({ context }) => {
  const { useState } = React;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await context.apiClient.get('/api/v1/data');
      setData(response);
      context.utils.toast('Data loaded!', 'success');
    } catch (err) {
      setError(err.message);
      context.utils.toast('Failed to load data', 'error');
      console.error('API error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
```

---

## Utilities

Portal utility functions provided through `context.utils`.

### Interface
```typescript
interface PluginUtils {
  toast(message: string, type?: ToastType): void;
  navigate(path: string): void;
  openExternal(url: string): void;
}
```

### ToastType
```typescript
type ToastType = 'success' | 'error' | 'info' | 'warning';
```

---

### Methods

#### `toast(message, type?)`

Display a toast notification.

**Parameters:**
- `message` (string): Notification message
- `type` (ToastType, optional): Notification type (default: 'info')

**Returns:** `void`

**Example:**
```typescript
// Success notification
context.utils.toast('Data saved successfully!', 'success');

// Error notification
context.utils.toast('Failed to save data', 'error');

// Info notification
context.utils.toast('Processing...', 'info');

// Warning notification
context.utils.toast('Please review your changes', 'warning');

// Default (info)
context.utils.toast('Hello!');
```

**Toast Types:**

| Type | Use Case | Color |
|------|----------|-------|
| `success` | Successful operations | Green |
| `error` | Failed operations | Red |
| `info` | General information | Blue |
| `warning` | Warnings, cautions | Yellow/Orange |

---

#### `navigate(path)`

Navigate to a different route in the portal.

**Parameters:**
- `path` (string): Route path (must start with `/`)

**Returns:** `void`

**Example:**
```typescript
// Navigate to dashboard
context.utils.navigate('/dashboard');

// Navigate to specific plugin
context.utils.navigate('/plugins/my-plugin');

// Navigate to settings
context.utils.navigate('/settings');

// Navigate with state
const goToProject = (projectId: string) => {
  context.utils.navigate(`/projects/${projectId}`);
};
```

**Note:** This navigates within the portal, not to external URLs.

---

#### `openExternal(url)`

Open a URL in a new browser tab.

**Parameters:**
- `url` (string): Full URL to open

**Returns:** `void`

**Example:**
```typescript
// Open documentation
context.utils.openExternal('https://docs.example.com');

// Open GitHub repository
context.utils.openExternal('https://github.com/user/repo');

// Open with user confirmation
const openLink = (url: string) => {
  if (confirm('Open external link?')) {
    context.utils.openExternal(url);
  }
};

// From button click
<button onClick={() => context.utils.openExternal('https://example.com')}>
  Open External Link
</button>
```

**Note:** Always opens in a new tab, never in the current window.

---

## Hooks

Standard React hooks are available through the global `React` object.

### Available Hooks
```typescript
const {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  useReducer,
  // ... all standard React hooks
} = React;
```

---

### Common Patterns

#### State Management
```typescript
const MyPlugin = ({ context }) => {
  const { useState } = React;
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

#### Side Effects
```typescript
const MyPlugin = ({ context }) => {
  const { useState, useEffect } = React;
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Fetch data on mount
    const fetchData = async () => {
      const result = await context.apiClient.get('/api/data');
      setData(result);
    };
    
    fetchData();
    
    // Cleanup function
    return () => {
      console.log('Cleanup');
    };
  }, []); // Empty deps = run once on mount
  
  return <div>{data && JSON.stringify(data)}</div>;
};
```

#### Memoization
```typescript
const MyPlugin = ({ context }) => {
  const { useState, useMemo } = React;
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  
  // Expensive computation
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      {filteredItems.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
};
```

#### Callbacks
```typescript
const MyPlugin = ({ context }) => {
  const { useState, useCallback } = React;
  const [count, setCount] = useState(0);
  
  // Memoized callback
  const increment = useCallback(() => {
    setCount(c => c + 1);
    context.utils.toast('Incremented!', 'success');
  }, [context.utils]);
  
  return <button onClick={increment}>Count: {count}</button>;
};
```

#### Refs
```typescript
const MyPlugin = ({ context }) => {
  const { useRef, useEffect } = React;
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  return <input ref={inputRef} type="text" />;
};
```

---

## Error Handling

### Best Practices

#### Try-Catch for API Calls

Always wrap API calls in try-catch:
```typescript
const MyPlugin = ({ context }) => {
  const { useState } = React;
  const [error, setError] = useState(null);
  
  const saveData = async (data) => {
    try {
      setError(null);
      await context.apiClient.post('/api/save', data);
      context.utils.toast('Saved!', 'success');
    } catch (err) {
      const errorMessage = err.message || 'Unknown error';
      setError(errorMessage);
      context.utils.toast(`Failed: ${errorMessage}`, 'error');
      console.error('Save error:', err);
    }
  };
  
  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
          {error}
        </div>
      )}
      <button onClick={() => saveData({ foo: 'bar' })}>Save</button>
    </div>
  );
};
```

#### Error Boundaries (React)
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Plugin error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800 font-bold">Something went wrong</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
        </div>
      );
    }
    
    return this.props.children;
  }
}

const MyPlugin = ({ context }) => {
  return (
    <ErrorBoundary>
      <PluginContent context={context} />
    </ErrorBoundary>
  );
};
```

#### Graceful Degradation
```typescript
const MyPlugin = ({ context }) => {
  const { useState, useEffect } = React;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await context.apiClient.get('/api/data');
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  
  if (error) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded">
        <p>Could not load data: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  
  if (!data) {
    return <div className="p-6">No data available</div>;
  }
  
  return <div className="p-6">{JSON.stringify(data)}</div>;
};
```

---

## Examples

### Complete Plugin Example
```typescript
/// <reference types="react" />
declare const React: any;

interface Project {
  id: string;
  name: string;
  title: string;
  description: string;
}

const ProjectsPlugin = ({ context }: { context: any }) => {
  const { useState, useEffect } = React;
  const { theme, apiClient, metadata, utils } = context;
  
  const themeMode = theme?.mode || 'light';
  const isDark = themeMode === 'dark';
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<Project[]>('/api/v1/projects');
        setProjects(data);
        utils.toast(`Loaded ${data.length} projects`, 'success');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load';
        setError(errorMessage);
        utils.toast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  // Filter projects
  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded">
        <h3 className="text-red-800 font-semibold">Error</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Main UI
  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{metadata.title || metadata.name}</h1>
          <p className="text-sm opacity-75 mt-1">Version {metadata.version}</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 rounded border ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } shadow hover:shadow-lg transition-shadow`}
            >
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-sm opacity-75 mb-2">{project.name}</p>
              <p className="text-sm">{project.description}</p>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg opacity-75">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  component: ProjectsPlugin,
  metadata: {
    name: 'projects-plugin',
    version: '1.0.0',
    author: 'Your Name',
  },
  hooks: {
    onMount() {
      console.log('[Projects Plugin] Mounted');
    },
    onUnmount() {
      console.log('[Projects Plugin] Unmounted');
    },
  },
};
```

---

## Version History

### v1.0.0 (Current)

**Initial Release**
- Core types and interfaces
- Plugin context system
- Authenticated API client
- Utility functions (toast, navigation)
- Theme integration
- Backend proxy support for local testing

---

## Support

- **Developer Guide**: [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- **Examples**: [/examples](../examples)
- **Issues**: [GitHub Issues](https://github.tools.sap/cfs-platform-engineering/developer-portal-plugins/issues)
- **Contact**: CFS Platform Engineering Team