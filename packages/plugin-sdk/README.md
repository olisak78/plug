# SAP Developer Portal Plugin SDK

Official SDK for developing plugins for the SAP Developer Portal.

## Installation
```bash
npm install @sap-developer-portal/plugin-sdk
```

## Quick Start
```typescript
import { createPlugin, usePluginData } from '@sap-developer-portal/plugin-sdk';

const MyPlugin = createPlugin(({ context }) => {
  const { data, loading, error } = usePluginData('/api/data', context.apiClient);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{context.metadata.name}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
});

export default MyPlugin;
```

## API Reference

### Types

- `PluginContext` - Context provided to all plugins
- `PluginComponent` - Type for plugin components
- `ApiClient` - HTTP client for backend requests
- `PluginManifest` - Plugin metadata structure

### Helpers

- `createPlugin()` - Create a type-safe plugin component
- `validateManifest()` - Validate plugin manifest
- `buildApiUrl()` - Construct API URLs with query parameters

### Hooks

- `usePluginData()` - Fetch data from API with loading states
- `usePluginTheme()` - Access current theme
- `usePluginAsync()` - Handle async operations

## Documentation

For full documentation, visit: [Plugin Developer Guide](https://github.tools.sap/cfs-platform-engineering/developer-portal-plugins)
