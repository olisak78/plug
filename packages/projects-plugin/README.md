# Plugin Template

This is a template for creating plugins for the SAP Developer Portal.

## Getting Started

### 1. Clone this template
```bash
# Copy this directory to start a new plugin
cp -r packages/plugin-template my-new-plugin
cd my-new-plugin
```

### 2. Update plugin information

Edit `plugin.manifest.json`:
- Change `id` to your unique plugin ID
- Update `name`, `description`, and `author`
- Set the correct `bundleUrl` for your hosting

### 3. Install dependencies
```bash
npm install
```

### 4. Develop your plugin

Edit `src/index.tsx` to implement your plugin functionality.

### 5. Build the plugin
```bash
# Development build with watch mode
npm run dev

# Production build
npm run build
```

The output will be in `dist/plugin.js`.

## Plugin Structure
```
plugin-template/
├── src/
│   └── index.tsx          # Your plugin component
├── dist/
│   └── plugin.js          # Built bundle (generated)
├── plugin.manifest.json   # Plugin metadata
├── package.json
├── tsconfig.json
└── esbuild.config.js
```

## Using the SDK
```typescript
import { createPlugin, usePluginData } from '@sap-developer-portal/plugin-sdk';

const MyPlugin = createPlugin(({ context }) => {
  // Access API client
  const { apiClient } = context;
  
  // Use hooks
  const { data, loading } = usePluginData('/api/data', apiClient);
  
  // Show notifications
  const handleClick = () => {
    context.utils.toast('Hello!', 'success');
  };
  
  return <div>Your plugin UI</div>;
});

export default MyPlugin;
```

## Available Context

Your plugin receives a `context` object with:

- `theme`: Current theme ('light' | 'dark')
- `apiClient`: HTTP client for API requests
- `metadata`: Your plugin's metadata
- `utils`: Utility functions (toast, navigate, etc.)

## Testing Locally

1. Build your plugin: `npm run build`
2. Copy `dist/plugin.js` to a local server or use a CDN
3. Update `plugin.manifest.json` with the URL
4. Load the plugin in the Developer Portal

## Publishing

1. Build production bundle: `npm run build`
2. Upload `dist/plugin.js` to your CDN/hosting
3. Update `plugin.manifest.json` with the final URL
4. Submit your plugin to the portal registry

## Example APIs

### Fetch data
```typescript
const { data, loading, error } = usePluginData('/api/items', context.apiClient);
```

### Post data
```typescript
const result = await context.apiClient.post('/api/items', { name: 'New Item' });
```

### Show toast
```typescript
context.utils.toast('Success!', 'success');
```

### Navigate
```typescript
context.utils.navigate('/dashboard');
```

## Need Help?

- [Full Documentation](https://github.tools.sap/cfs-platform-engineering/developer-portal-plugins)
- [API Reference](https://github.tools.sap/cfs-platform-engineering/developer-portal-plugins/wiki/API-Reference)
- [Examples](https://github.tools.sap/cfs-platform-engineering/developer-portal-plugins/tree/main/examples)