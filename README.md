# SAP Developer Portal - Plugin System

This repository contains the plugin system for the SAP Developer Portal, including the SDK and template for creating plugins.

## 📦 Packages

### [@sap-developer-portal/plugin-sdk](./packages/plugin-sdk)
Official SDK for developing portal plugins. Provides TypeScript types, helper functions, and React hooks.

### [Plugin Template](./packages/plugin-template)
Template repository for creating new plugins. Copy this to start developing your own plugin.

## 🚀 Quick Start

### For Plugin Developers

1. **Copy the template:**
```bash
   cp -r packages/plugin-template my-plugin
   cd my-plugin
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Update plugin info:**
   Edit `plugin.manifest.json` with your plugin details.

4. **Develop your plugin:**
   Edit `src/index.tsx` and run:
```bash
   npm run dev
```

5. **Build for production:**
```bash
   npm run build
```

### For Portal Integration

Install the SDK in your project:
```bash
npm install @sap-developer-portal/plugin-sdk
```

## 📚 Documentation

- [Plugin Developer Guide](./docs/DEVELOPER_GUIDE.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Examples](./examples)

## 🎯 Examples

- [Dog Breeds Explorer](./examples/dog-breeds-explorer) - Complete example plugin

## 🏗️ Repository Structure
```
developer-portal-plugins/
├── packages/
│   ├── plugin-sdk/          # SDK package
│   └── plugin-template/     # Template for new plugins
├── examples/
│   └── dog-breeds-explorer/ # Example plugin
└── docs/                    # Documentation
```

## 🔧 Development

### Install all dependencies:
```bash
npm install
```

### Build all packages:
```bash
npm run build
```

### Clean all builds:
```bash
npm run clean
```

## 📝 Creating Your First Plugin
```typescript
import { createPlugin } from '@sap-developer-portal/plugin-sdk';

const MyPlugin = createPlugin(({ context }) => {
  return (
    <div>
      <h1>Hello from {context.metadata.name}!</h1>
      <button onClick={() => context.utils.toast('Clicked!', 'success')}>
        Click Me
      </button>
    </div>
  );
});

export default MyPlugin;
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For questions or issues, please contact the CFS Platform Engineering team.