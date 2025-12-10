# Plugin Developer Guide

Complete guide for developing plugins for the SAP Developer Portal.

## Table of Contents

- [Getting Started](#getting-started)
- [Plugin Architecture](#plugin-architecture)
- [Development Workflow](#development-workflow)
- [Plugin Context](#plugin-context)
- [Building Your Plugin](#building-your-plugin)
- [Testing](#testing)
- [Publishing](#publishing)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Basic knowledge of React and TypeScript
- Git

### Quick Start

1. **Clone the repository:**
```bash
   git clone https://github.tools.sap/cfs-platform-engineering/developer-portal-plugins.git
   cd developer-portal-plugins
```

2. **Copy the template:**
```bash
   cp -r packages/plugin-template my-awesome-plugin
   cd my-awesome-plugin
```

3. **Install dependencies:**
```bash
   npm install
```

4. **Update plugin manifest:**
   
   Edit `plugin.manifest.json`:
```json
   {
     "id": "my-awesome-plugin",
     "name": "My Awesome Plugin",
     "version": "1.0.0",
     "description": "Description of what my plugin does",
     "author": "Your Name",
     "bundleUrl": "https://your-cdn.com/plugins/my-awesome-plugin/v1.0.0/plugin.js",
     "tags": ["productivity", "tools"],
     "minPortalVersion": "1.0.0"
   }
```

5. **Start developing:**
```bash
   npm run dev
```

6. **Build for production:**
```bash
   npm run build
```

## Plugin Architecture

### Overview

Plugins in the SAP Developer Portal are:
- **Self-contained React components** bundled as ES modules
- **Dynamically loaded** at runtime from CDN or static hosting
- **Sandboxed** with controlled access to portal APIs
- **Theme-aware** supporting light and dark modes

### Plugin Structure
```
my-plugin/
├── src/
│   └── index.tsx          # Plugin entry point (required)
├── dist/
│   └── plugin.js          # Built bundle (generated)
├── plugin.manifest.json   # Plugin metadata (required)
├── package.json
├── tsconfig.json
└── esbuild.config.js
```

### Entry Point

Your plugin must default export a React component:
```typescript
import { createPlugin } from '@sap-developer-portal/plugin-sdk';

const MyPlugin = createPlugin(({ context }) => {
  return <div>Hello World!</div>;
});

export default MyPlugin;
```

### Plugin Manifest

The `plugin.manifest.json` file contains metadata about your plugin:
```json
{
  "id": "unique-plugin-id",           // Required: Unique identifier
  "name": "Display Name",             // Required: Human-readable name
  "version": "1.0.0",                 // Required: Semantic version
  "description": "What it does",      // Required: Short description
  "author": "Your Name",              // Required: Author name
  "bundleUrl": "https://...",         // Required: URL to plugin.js
  "thumbnail": "https://...",         // Optional: Preview image
  "tags": ["tag1", "tag2"],          // Optional: Categories
  "minPortalVersion": "1.0.0"        // Optional: Minimum portal version
}
```

## Development Workflow

### 1. Development Mode

Run with hot reload:
```bash
npm run dev
```

This watches for file changes and rebuilds automatically.

### 2. Local Testing

To test your plugin locally in the portal:

1. Build your plugin: `npm run build`
2. Copy `dist/plugin.js` to a local web server
3. Update `plugin.manifest.json` with the local URL
4. Use the portal's "Load Local Plugin" feature

### 3. Production Build

Build optimized bundle:
```bash
npm run build
```

Output: `dist/plugin.js` (minified, with source maps)

## Plugin Context

Every plugin receives a `context` object with portal integration:

### Context Structure
```typescript
interface PluginContext {
  theme: 'light' | 'dark';           // Current portal theme
  apiClient: ApiClient;               // HTTP client for API calls
  metadata: PluginMetadata;           // Your plugin's metadata
  utils: PluginUtils;                 // Utility functions
}
```

### Theme

Access the current theme:
```typescript
const MyPlugin = createPlugin(({ context }) => {
  const isDark = context.theme === 'dark';
  
  return (
    <div className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
      Content
    </div>
  );
});
```

### API Client

Make authenticated API calls:
```typescript
const MyPlugin = createPlugin(({ context }) => {
  const fetchData = async () => {
    try {
      // GET request
      const data = await context.apiClient.get('/api/items');
      
      // POST request
      const result = await context.apiClient.post('/api/items', {
        name: 'New Item'
      });
      
      // PUT, DELETE, PATCH also available
    } catch (error) {
      console.error('API error:', error);
    }
  };
  
  return <button onClick={fetchData}>Fetch Data</button>;
});
```

### Utilities

Use portal utilities:
```typescript
const MyPlugin = createPlugin(({ context }) => {
  const handleAction = () => {
    // Show toast notification
    context.utils.toast('Action successful!', 'success');
    
    // Navigate to another page
    context.utils.navigate('/dashboard');
    
    // Open external URL
    context.utils.openExternal('https://example.com');
  };
  
  return <button onClick={handleAction}>Do Something</button>;
});
```

### Metadata

Access your plugin's metadata:
```typescript
const MyPlugin = createPlugin(({ context }) => {
  return (
    <div>
      <h1>{context.metadata.name}</h1>
      <p>Version: {context.metadata.version}</p>
      <p>ID: {context.metadata.id}</p>
    </div>
  );
});
```

## Building Your Plugin

### Using SDK Hooks

The SDK provides React hooks for common patterns:

#### usePluginData - Fetch Data
```typescript
import { createPlugin, usePluginData } from '@sap-developer-portal/plugin-sdk';

const MyPlugin = createPlugin(({ context }) => {
  const { data, loading, error } = usePluginData(
    '/api/items',
    context.apiClient,
    {
      enabled: true,                    // Enable/disable fetching
      refetchInterval: 30000            // Refetch every 30s (optional)
    }
  );
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
});
```

#### usePluginTheme - Access Theme
```typescript
import { createPlugin, usePluginTheme } from '@sap-developer-portal/plugin-sdk';

const MyPlugin = createPlugin(({ context }) => {
  const theme = usePluginTheme(context);
  
  return <div>Current theme: {theme}</div>;
});
```

#### usePluginAsync - Async Operations
```typescript
import { createPlugin, usePluginAsync } from '@sap-developer-portal/plugin-sdk';

const MyPlugin = createPlugin(({ context }) => {
  const { execute, loading, error } = usePluginAsync(async (itemId: string) => {
    return await context.apiClient.post('/api/items', { id: itemId });
  });
  
  return (
    <button onClick={() => execute('123')} disabled={loading}>
      {loading ? 'Saving...' : 'Save Item'}
    </button>
  );
});
```

### State Management

Use standard React hooks for state:
```typescript
import { useState, useEffect } from 'react';
import { createPlugin } from '@sap-developer-portal/plugin-sdk';

const MyPlugin = createPlugin(({ context }) => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    // Fetch items on mount
    context.apiClient.get('/api/items').then(setItems);
  }, []);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ul>
        {items.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
});
```

### Styling

You can use:
- **Tailwind CSS classes** (already available in portal)
- **Inline styles**
- **CSS-in-JS** libraries (if bundled)
```typescript
const MyPlugin = createPlugin(({ context }) => {
  const isDark = context.theme === 'dark';
  
  return (
    <div className="p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Title</h1>
      <button 
        className={`px-4 py-2 rounded ${
          isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        Click Me
      </button>
    </div>
  );
});
```

### Error Handling

Always handle errors gracefully:
```typescript
import { createPlugin } from '@sap-developer-portal/plugin-sdk';
import { useState } from 'react';

const MyPlugin = createPlugin(({ context }) => {
  const [error, setError] = useState(null);
  
  const handleAction = async () => {
    try {
      setError(null);
      await context.apiClient.post('/api/action');
      context.utils.toast('Success!', 'success');
    } catch (err) {
      setError(err.message);
      context.utils.toast('Failed!', 'error');
    }
  };
  
  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <button onClick={handleAction}>Do Action</button>
    </div>
  );
});
```

## Testing

### Local Testing

1. **Mock Context** for unit tests:
```typescript
// test-utils.tsx
import { PluginContext } from '@sap-developer-portal/plugin-sdk';

export const mockContext: PluginContext = {
  theme: 'light',
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  },
  metadata: {
    id: 'test-plugin',
    name: 'Test Plugin',
    version: '1.0.0',
  },
  utils: {
    toast: jest.fn(),
    navigate: jest.fn(),
    openExternal: jest.fn(),
  },
};
```

2. **Test Component:**
```typescript
// MyPlugin.test.tsx
import { render, screen } from '@testing-library/react';
import MyPlugin from './index';
import { mockContext } from './test-utils';

test('renders plugin', () => {
  render(<MyPlugin context={mockContext} />);
  expect(screen.getByText('Test Plugin')).toBeInTheDocument();
});
```

### Integration Testing

Test in the actual portal:
1. Build plugin: `npm run build`
2. Upload to test CDN
3. Load in portal's staging environment
4. Verify functionality

## Publishing

### 1. Version Your Plugin

Update version in:
- `package.json`
- `plugin.manifest.json`

Follow [Semantic Versioning](https://semver.org/):
- `1.0.0` → `1.0.1` (bug fixes)
- `1.0.0` → `1.1.0` (new features)
- `1.0.0` → `2.0.0` (breaking changes)

### 2. Build Production Bundle
```bash
npm run build
```

Verify:
- `dist/plugin.js` exists
- File size is reasonable (< 500KB recommended)
- No console errors when loading

### 3. Upload to CDN

Upload `dist/plugin.js` to your hosting:
```bash
# Example: AWS S3
aws s3 cp dist/plugin.js s3://your-bucket/plugins/my-plugin/v1.0.0/plugin.js

# Example: Azure Blob Storage
az storage blob upload \
  --container-name plugins \
  --file dist/plugin.js \
  --name my-plugin/v1.0.0/plugin.js
```

### 4. Update Manifest

Update `plugin.manifest.json` with the final URL:
```json
{
  "bundleUrl": "https://cdn.example.com/plugins/my-plugin/v1.0.0/plugin.js"
}
```

### 5. Register Plugin

Submit your plugin manifest to the portal registry (process TBD).

## Best Practices

### Performance

1. **Keep bundles small:**
   - Avoid large dependencies
   - Use tree-shaking
   - Lazy load heavy components

2. **Optimize API calls:**
   - Cache responses when appropriate
   - Use pagination for large datasets
   - Debounce user input

3. **Efficient rendering:**
   - Use React.memo for expensive components
   - Avoid inline function definitions in render
   - Use keys properly in lists

### Security

1. **Never hardcode secrets:**
   - No API keys in code
   - Use environment variables for development
   - Rely on portal's API client for authentication

2. **Validate user input:**
   - Sanitize form inputs
   - Validate data before sending to API
   - Handle edge cases

3. **CORS and CSP:**
   - Only fetch from allowed domains
   - Portal enforces Content Security Policy
   - Test CORS issues early

### User Experience

1. **Loading states:**
   - Always show loading indicators
   - Provide feedback for actions
   - Handle empty states gracefully

2. **Error messages:**
   - Clear, actionable error messages
   - Avoid technical jargon
   - Provide recovery options

3. **Accessibility:**
   - Use semantic HTML
   - Provide keyboard navigation
   - Include ARIA labels
   - Test with screen readers

### Code Quality

1. **TypeScript:**
   - Use strict mode
   - Define proper types
   - Avoid `any` type

2. **Code organization:**
   - Keep components small and focused
   - Extract reusable logic to hooks
   - Use meaningful names

3. **Comments:**
   - Document complex logic
   - Add JSDoc for public APIs
   - Keep comments up-to-date

## Troubleshooting

### Plugin Won't Load

**Problem:** Plugin fails to load in portal

**Solutions:**
1. Check browser console for errors
2. Verify `bundleUrl` is correct and accessible
3. Check CORS headers on your CDN
4. Ensure bundle is valid ES module
5. Verify manifest JSON is valid

### API Calls Failing

**Problem:** API requests return errors

**Solutions:**
1. Check network tab in DevTools
2. Verify endpoint URL is correct
3. Check authentication (handled by portal)
4. Verify request payload format
5. Check backend logs

### Build Errors

**Problem:** `npm run build` fails

**Solutions:**
1. Check TypeScript errors: `npx tsc --noEmit`
2. Verify all dependencies installed: `npm install`
3. Clear cache: `rm -rf node_modules dist && npm install`
4. Check esbuild config

### Styling Issues

**Problem:** Styles not applying correctly

**Solutions:**
1. Verify Tailwind classes are correct
2. Check theme-specific styles
3. Inspect element in DevTools
4. Test in both light and dark modes
5. Check for CSS conflicts

### Memory Leaks

**Problem:** Plugin causes performance issues

**Solutions:**
1. Clean up effects: return cleanup function from `useEffect`
2. Cancel pending requests on unmount
3. Clear intervals/timeouts
4. Avoid circular references
5. Use Chrome DevTools Memory Profiler

## Support

- **Documentation:** [API Reference](./API_REFERENCE.md)
- **Examples:** [/examples](../examples)
- **Issues:** [GitHub Issues](https://github.tools.sap/cfs-platform-engineering/developer-portal-plugins/issues)
- **Contact:** CFS Platform Engineering Team

## Next Steps

- Review the [API Reference](./API_REFERENCE.md)
- Explore [Example Plugins](../examples)
- Join our developer community
- Start building your first plugin!