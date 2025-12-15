# Plugin Developer Guide

Complete guide for developing plugins for the SAP Developer Portal.

## Table of Contents

- [Getting Started](#getting-started)
- [Plugin Architecture](#plugin-architecture)
- [Development Workflow](#development-workflow)
- [Testing Your Plugin](#testing-your-plugin)
- [Plugin Context](#plugin-context)
- [Building Your Plugin](#building-your-plugin)
- [Backend Integration](#backend-integration)
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

Your plugin must export a default object with `component`, `metadata`, and optional `hooks`:
```typescript
// Access React from global scope
/// <reference types="react" />
declare const React: any;

const MyPlugin = ({ context }) => {
  const { useState } = React;
  
  return <div>Hello World!</div>;
};

// Export in the expected format
export default {
  component: MyPlugin,
  metadata: {
    name: 'my-plugin',
    version: '1.0.0',
    author: 'Your Name',
  },
  hooks: {
    onMount() {
      console.log('[My Plugin] mounted');
    },
    onUnmount() {
      console.log('[My Plugin] unmounted');
    },
  },
};
```

### Important: React Global Access

**CRITICAL:** Your plugin must access React from the global scope (`window.React`), not via imports. The portal provides React globally.

**DO THIS:**
```typescript
/// <reference types="react" />
declare const React: any;

const MyPlugin = ({ context }) => {
  const { useState } = React;
  // ...
};
```

**DON'T DO THIS:**
```typescript
import React, { useState } from 'react';  // ❌ Will cause errors!
```

### Build Configuration

Your `tsconfig.json` should use classic JSX transform:
```json
{
  "compilerOptions": {
    "jsx": "react",  // Use "react", NOT "react-jsx"
    // ... other settings
  }
}
```

Your `esbuild.config.js` should configure React as a global:
```javascript
const config = {
  // ...
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  banner: {
    js: `// My Plugin\nconst React = window.React;\n`
  }
};
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

### 2. Build for Testing

Build your plugin bundle:
```bash
npm run build
```

This creates `dist/plugin.js` - your complete plugin bundle.

## Testing Your Plugin

### Overview of Testing Modes

The portal provides two testing modes:

1. **Frontend Only**: Test your plugin's UI without backend integration
2. **Full Stack**: Test your plugin with a local backend server

### Step 1: Serve Your Plugin Bundle

After building your plugin, you need to make it accessible via HTTP.

#### Option A: Using npx (No Installation)
```bash
cd dist
npx http-server -p 8000 --cors
```

**Note:** The `--cors` flag is important - it allows the portal to load your plugin from a different origin.

#### Option B: Using Your Machine's IP (For Testing Across Network)

If you want to test on another machine or device on the same network:
```bash
# Find your IP address
# On macOS/Linux:
ifconfig | grep "inet "
# On Windows:
ipconfig

# Start server
cd dist
http-server -p 8000 --cors

# Your plugin will be available at:
# http://YOUR_IP_ADDRESS:8000/plugin.js
# Example: http://10.26.182.201:8000/plugin.js
```

### Step 2: Test in the Portal

#### Frontend Only Testing (No Backend)

1. **Open the Developer Portal** in your browser:
```
   http://localhost:3000/plugins
```

2. **Use the "Test Your Plugin" Section:**
   - Find the "Test Your Plugin" card at the top of the page
   - Enter your plugin bundle URL:
```
     http://localhost:8000/plugin.js
```
   - **Leave the backend URL empty** if your plugin doesn't need backend APIs
   - Click **"Load Plugin"**

3. **Verify Plugin Functionality:**
   - Test all interactive features
   - Switch between light/dark themes
   - Check browser console for errors

#### Full Stack Testing (With Backend)

If your plugin uses `context.apiClient` to call backend APIs:

1. **Start Your Plugin Backend** (see [Backend Integration](#backend-integration) section)

2. **In the "Test Your Plugin" Section:**
   - **Plugin Bundle URL**: `http://localhost:8000/plugin.js`
   - **Plugin Backend URL**: `http://localhost:4000` (or your backend port)
   - Click **"Load Plugin"**

3. **Backend Proxy Active:**
   - You'll see a blue message: "✓ Backend proxy active: http://localhost:4000"
   - All `context.apiClient` calls will be proxied to your local backend
   - The portal's authentication token is automatically included

4. **Verify Full Stack:**
   - Test API calls from your plugin
   - Check backend console for incoming requests
   - Verify data is loaded correctly

### Step 3: Development Iteration

For rapid development with hot reload:

**Terminal 1 - Watch Mode:**
```bash
cd my-awesome-plugin
npm run dev
```

**Terminal 2 - Serve Bundle:**
```bash
cd my-awesome-plugin/dist
http-server -p 8000 --cors
```

**Terminal 3 - Backend (if needed):**
```bash
cd my-plugin-backend
node server.js
```

**Browser - Portal:**
1. Make changes to `src/index.tsx`
2. Watch mode automatically rebuilds
3. In the portal, click "Clear" then "Load Plugin" again
4. Or simply refresh the browser page

### Common Testing Scenarios

#### Scenario 1: Testing Frontend Only (No Backend)
```bash
# Build plugin
npm run build

# Serve from dist directory
cd dist
http-server -p 8000 --cors

# In portal "Test Your Plugin":
# Plugin Bundle URL: http://localhost:8000/plugin.js
# Plugin Backend URL: (leave empty)
```

#### Scenario 2: Testing with Local Backend
```bash
# Terminal 1 - Backend
cd my-plugin-backend
node server.js
# Running on http://localhost:4000

# Terminal 2 - Frontend bundle
cd my-plugin/dist
http-server -p 8000 --cors

# In portal "Test Your Plugin":
# Plugin Bundle URL: http://localhost:8000/plugin.js
# Plugin Backend URL: http://localhost:4000
```

#### Scenario 3: Testing Across Network
```bash
# Find your IP (example: 10.26.182.201)
ifconfig | grep "inet "

# Serve bundle
cd dist
http-server -p 8000 --cors

# In portal "Test Your Plugin":
# Plugin Bundle URL: http://10.26.182.201:8000/plugin.js
# Plugin Backend URL: http://10.26.182.201:4000 (if using backend)
```

### Troubleshooting Testing Issues

**Problem: CORS Error**
```
Access to fetch at 'http://localhost:8000/plugin.js' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:** Make sure you're using the `--cors` flag:
```bash
http-server -p 8000 --cors
```

**Problem: Backend 401 Unauthorized**
```
GET http://localhost:4000/api/data 401 (Unauthorized)
```

**Solution:** The portal's authentication is working correctly. Make sure your backend:
1. Accepts the `Authorization: Bearer <token>` header
2. Has CORS configured to accept credentials
3. Is running and accessible

**Problem: Plugin Not Loading**

**Solution:** Check:
1. Server is still running (check the terminal)
2. URL is correct (try opening in a new browser tab)
3. Build completed successfully (`dist/plugin.js` exists)
4. Browser console for specific error messages

**Problem: Changes Not Reflecting**

**Solution:**
1. Verify watch mode is running and rebuilding
2. Click "Clear" then "Load Plugin" again in portal
3. Or do a hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
4. Check that the server is serving the latest `dist/plugin.js`

**Problem: "React is not defined"**

**Solution:** You're likely importing React instead of using the global:
```typescript
// ❌ Wrong
import React from 'react';

// ✅ Correct
declare const React: any;
```

**Problem: Backend calls going to wrong URL**

**Solution:** Check the console logs:
```
[PluginApiClient] Direct request: GET http://localhost:4000/api/data
```
Should show the correct backend URL. If showing portal backend instead, verify:
1. Backend URL is entered in "Test Your Plugin" section
2. Blue "Backend proxy active" message is displayed
3. Browser was refreshed after entering backend URL

### Verifying Your Bundle

Before testing in the portal, verify your bundle is accessible:
```bash
# Test with curl
curl http://localhost:8000/plugin.js | head -n 10

# Should show JavaScript code starting with:
# // My Plugin
# const React = window.React;
# ...
```

Or open in browser:
```
http://localhost:8000/plugin.js
```

You should see the JavaScript bundle content.

## Plugin Context

Every plugin receives a `context` object with portal integration:

### Context Structure
```typescript
interface PluginContext {
  theme: {
    mode: 'light' | 'dark';
    primaryColor: string;
    colors: { ... };
  };
  apiClient: ApiClient;
  metadata: PluginMetadata;
  utils: PluginUtils;
}
```

### Theme

Access the current theme:
```typescript
const MyPlugin = ({ context }) => {
  const { useState } = React;
  const { theme } = context;
  
  // Theme is an object, not a string
  const themeMode = theme?.mode || 'light';
  const isDark = themeMode === 'dark';
  
  return (
    <div className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
      Content
    </div>
  );
};
```

### API Client

Make authenticated API calls to **your portal's backend**:
```typescript
const MyPlugin = ({ context }) => {
  const fetchData = async () => {
    try {
      // This calls YOUR portal's backend
      // When testing locally with backend URL, proxies to your local backend
      const data = await context.apiClient.get('/api/v1/projects');
      
      // POST request
      const result = await context.apiClient.post('/api/v1/items', {
        name: 'New Item'
      });
      
    } catch (error) {
      console.error('API error:', error);
    }
  };
  
  return <button onClick={fetchData}>Fetch Data</button>;
};
```

**Important:** `context.apiClient` is for calling **your portal's backend APIs**, not external APIs. For external APIs, use standard `fetch()`:
```typescript
// External API - use fetch directly
const response = await fetch('https://api.example.com/data');
const data = await response.json();

// Portal backend - use context.apiClient
const data = await context.apiClient.get('/api/v1/data');
```

### Utilities

Use portal utilities:
```typescript
const MyPlugin = ({ context }) => {
  const handleAction = () => {
    // Show toast notification
    context.utils.toast('Action successful!', 'success');
    
    // Navigate to another page
    context.utils.navigate('/dashboard');
    
    // Open external URL
    context.utils.openExternal('https://example.com');
  };
  
  return <button onClick={handleAction}>Do Something</button>;
};
```

### Metadata

Access your plugin's metadata:
```typescript
const MyPlugin = ({ context }) => {
  return (
    <div>
      <h1>{context.metadata.title || context.metadata.name}</h1>
      <p>Version: {context.metadata.version}</p>
      <p>ID: {context.metadata.id}</p>
    </div>
  );
};
```

## Building Your Plugin

### State Management

Use standard React hooks for state:
```typescript
const MyPlugin = ({ context }) => {
  const { useState, useEffect } = React;
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    // Fetch items on mount
    fetch('https://api.example.com/items')
      .then(res => res.json())
      .then(setItems);
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
};
```

### Styling

You can use:
- **Tailwind CSS classes** (already available in portal)
- **Inline styles**
- **CSS-in-JS** libraries (if bundled)
```typescript
const MyPlugin = ({ context }) => {
  const themeMode = context.theme?.mode || 'light';
  const isDark = themeMode === 'dark';
  
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
};
```

### Error Handling

Always handle errors gracefully:
```typescript
const MyPlugin = ({ context }) => {
  const { useState } = React;
  const [error, setError] = useState(null);
  
  const handleAction = async () => {
    try {
      setError(null);
      await context.apiClient.get('/api/data');
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
};
```

## Backend Integration

### When Do You Need a Backend?

Your plugin needs backend integration if it:
- Stores user-specific data
- Requires authentication
- Needs to access private/internal APIs
- Performs server-side processing

**You DON'T need a backend if:**
- Your plugin only uses public external APIs
- It's purely frontend (UI only)
- It only displays data without persistence

### Backend Architecture Options

#### Option 1: Portal Backend Endpoints (Recommended)

Create endpoints in the portal's backend that your plugin can call:
```javascript
// portal-backend/routes/plugins.js

// Plugin-specific endpoint
app.get('/api/v1/projects', authenticateUser, async (req, res) => {
  try {
    // Query database or external service
    const projects = await db.query('SELECT * FROM projects');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/favorites', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.user;
    const favorite = req.body;
    
    await db.query(
      'INSERT INTO favorites (user_id, data) VALUES (?, ?)',
      [userId, JSON.stringify(favorite)]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**In your plugin:**
```typescript
const MyPlugin = ({ context }) => {
  const fetchProjects = async () => {
    // Calls portal backend in production
    // Or local backend when testing with backend URL
    const projects = await context.apiClient.get('/api/v1/projects');
    return projects;
  };
};
```

### Creating a Local Backend for Testing

#### Step 1: Create Backend Directory
```bash
mkdir my-plugin-backend
cd my-plugin-backend
npm init -y
npm install express cors
```

#### Step 2: Create Backend Server

Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for portal
app.use(cors({
  origin: 'http://localhost:3000', // Portal URL
  credentials: true
}));

app.use(express.json());

// Middleware to verify authorization header (optional for local testing)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Authorization header is required' 
    });
  }
  
  // In production, verify the JWT token here
  // For local testing, we'll accept any token
  console.log('Auth header:', authHeader);
  next();
};

// Your plugin endpoints
app.get('/api/v1/projects', authenticate, (req, res) => {
  console.log('[Backend] GET /api/v1/projects');
  
  // Mock data
  const projects = [
    {
      id: '1',
      name: 'project-1',
      title: 'Project One',
      description: 'First project'
    },
    {
      id: '2',
      name: 'project-2',
      title: 'Project Two',
      description: 'Second project'
    }
  ];
  
  res.json(projects);
});

app.post('/api/v1/favorites', authenticate, (req, res) => {
  console.log('[Backend] POST /api/v1/favorites', req.body);
  
  // Mock saving
  res.json({ 
    success: true,
    id: Date.now(),
    ...req.body
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Plugin backend running on http://localhost:${PORT}`);
  console.log('Ready to accept requests from portal');
});
```

#### Step 3: Test Backend Locally
```bash
# Start backend
node server.js

# In another terminal, test it
curl http://localhost:4000/api/v1/projects \
  -H "Authorization: Bearer test-token"

# Should return JSON data
```

### Full Stack Testing Workflow

**Terminal 1 - Backend:**
```bash
cd my-plugin-backend
node server.js
# Output: Plugin backend running on http://localhost:4000
```

**Terminal 2 - Frontend Bundle:**
```bash
cd my-plugin/dist
http-server -p 8000 --cors
```

**Terminal 3 - Watch Mode (optional):**
```bash
cd my-plugin
npm run dev
```

**Portal:**
1. Navigate to `http://localhost:3000/plugins`
2. In "Test Your Plugin":
   - Plugin Bundle URL: `http://localhost:8000/plugin.js`
   - Plugin Backend URL: `http://localhost:4000`
3. Click "Load Plugin"
4. Test API functionality

**Console Output:**

Plugin:
```
[Projects Plugin] Fetching projects from backend...
[PluginApiClient] Using backend proxy: http://localhost:4000/api/v1/projects
[PluginApiClient] Got auth token for direct request
[PluginApiClient] Direct request: GET http://localhost:4000/api/v1/projects
[Projects Plugin] Received projects: Array(2)
```

Backend:
```
Auth header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
[Backend] GET /api/v1/projects
```

### Authentication in Backend Proxy Mode

When testing with a backend URL, the portal automatically:
1. Fetches its authentication token
2. Includes it in the `Authorization: Bearer <token>` header
3. Sends it with every `context.apiClient` request

**Your local backend should:**
- Accept the `Authorization` header
- Validate it (or skip validation for local testing)
- Return data as usual
```javascript
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer '
  
  // For local testing, accept any token
  // In production, validate with JWT library
  console.log('Authenticated with token:', token.substring(0, 20) + '...');
  next();
};
```

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

Submit your plugin manifest to the portal registry (contact portal administrators for the registration process).

## Best Practices

### Performance

1. **Keep bundles small:**
   - Avoid large dependencies
   - The bundle should be under 500KB ideally
   - Use tree-shaking

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
   - Rely on portal's API client for authentication to portal backend

2. **Validate user input:**
   - Sanitize form inputs
   - Validate data before sending to API
   - Handle edge cases

3. **CORS and CSP:**
   - Only fetch from allowed domains
   - Portal enforces Content Security Policy
   - Test CORS issues early during development

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
   - Avoid `any` type when possible

2. **Code organization:**
   - Keep components small and focused
   - Extract reusable logic to functions
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
2. Verify `bundleUrl` is correct and accessible (open in new tab)
3. Check CORS headers on your server (use `--cors` flag)
4. Ensure bundle is in the correct format (check export structure)
5. Verify server is still running

### API Calls Failing

**Problem:** API requests return errors

**Solutions:**
1. Check network tab in DevTools
2. Verify endpoint URL is correct
3. For portal backend: Check authentication (handled by portal)
4. For external APIs: Check CORS and API key
5. Verify request payload format
6. Check backend logs for detailed error messages

### Build Errors

**Problem:** `npm run build` fails

**Solutions:**
1. Check TypeScript errors: `npx tsc --noEmit`
2. Verify all dependencies installed: `npm install`
3. Clear cache: `rm -rf node_modules dist && npm install`
4. Check esbuild config matches template

### Styling Issues

**Problem:** Styles not applying correctly

**Solutions:**
1. Verify Tailwind classes are correct
2. Check theme-specific styles using `context.theme.mode`
3. Inspect element in DevTools
4. Test in both light and dark modes
5. Check for CSS conflicts

### React Errors

**Problem:** "React is not defined" error

**Solution:** You're importing React instead of using global:
```typescript
// ❌ Wrong
import React from 'react';

// ✅ Correct
declare const React: any;
const { useState, useEffect } = React;
```

**Problem:** "Objects are not valid as a React child"

**Solution:** You're trying to render an object. Check that you're rendering `theme.mode` not `theme`:
```typescript
// ❌ Wrong
<p>Theme: {context.theme}</p>

// ✅ Correct
<p>Theme: {context.theme?.mode}</p>
```

### Backend Integration Issues

**Problem:** Backend proxy not working

**Solution:** Verify:
1. Backend URL is entered in "Test Your Plugin" section
2. Blue "Backend proxy active" message is displayed
3. Backend server is running and accessible
4. Check console for `[PluginApiClient]` logs

**Problem:** 401 Unauthorized from backend

**Solution:**
1. Check that backend accepts `Authorization: Bearer <token>` header
2. Verify CORS is configured with `credentials: true`
3. Check backend logs to see if auth header is received
4. For local testing, you can skip token validation

**Problem:** API calls going to wrong endpoint

**Solution:** Check console logs:
```
[PluginApiClient] Direct request: GET http://localhost:4000/api/v1/data
```
Should show your backend URL, not `/api/plugins/...`

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
- Start building your first plugin!
- Test your plugin using the "Test Your Plugin" feature in the portal
- Try full-stack testing with a local backend server