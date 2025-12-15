# SAP Developer Portal - Plugin System

A complete plugin development system for the SAP Developer Portal, enabling developers to create and test custom plugins with full-stack support.

## 🎯 What is This?

This repository provides everything you need to build plugins for the SAP Developer Portal:
- **Plugin SDK** - TypeScript types, helpers, and React hooks
- **Plugin Template** - Ready-to-use starter template
- **Local Testing** - Test plugins with frontend and backend before deploying
- **Example Plugins** - Working examples to learn from

## 🚀 Quick Start

### Create Your First Plugin

1. **Clone and copy the template:**
```bash
   git clone https://github.tools.sap/cfs-platform-engineering/developer-portal-plugins.git
   cd developer-portal-plugins
   cp -r packages/plugin-template packages/my-awesome-plugin
   cd packages/my-awesome-plugin
```

2. **Install and build:**
```bash
   npm install
   npm run build
```

3. **Test in the portal:**
```bash
   # Serve the plugin bundle
   cd dist
   http-server -p 8000 --cors
   
   # Open portal at http://localhost:3000/plugins
   # Enter bundle URL: http://localhost:8000/plugin.js
   # Click "Load Plugin"
```

## 📚 Documentation

**📖 [Complete Developer Guide](./docs/DEVELOPER_GUIDE.md)** - Everything you need to build plugins

Additional docs:
- [API Reference](./docs/API_REFERENCE.md) - Detailed API documentation
- [Examples](./examples) - Working plugin examples

## 📦 What's Included

### Packages

| Package | Description |
|---------|-------------|
| [`plugin-sdk`](./packages/plugin-sdk) | Official SDK with TypeScript types and utilities |
| [`plugin-template`](./packages/plugin-template) | Starter template for new plugins |

### Examples

| Example | Description |
|---------|-------------|
| [`climate-change-plugin`](./packages/climate-change-plugin) | Visualize climate data with external API integration |
| [`projects-plugin`](./packages/projects-plugin) | Display projects with portal backend integration |
| [`dog-breeds-explorer`](./examples/dog-breeds-explorer) | Browse dog breeds with search functionality |

## 🏗️ Repository Structure
```
developer-portal-plugins/
├── packages/
│   ├── plugin-sdk/              # SDK package
│   └── plugin-template/         # Template for new plugins
├── examples/
│   └── climate-change-plugin/   # Example: External API
│   └── projects-plugin/         # Example: Backend integration
└── docs/
    ├── DEVELOPER_GUIDE.md       # Complete development guide
    └── API_REFERENCE.md         # API documentation
```

## ✨ Key Features

### 🎨 Frontend Development
- **React Components** - Build with React and TypeScript
- **Theme Support** - Automatic light/dark mode integration
- **Hot Reload** - Fast development with watch mode
- **Portal Integration** - Access theme, navigation, and notifications

### 🔌 Backend Integration
- **API Client** - Authenticated calls to portal backend
- **Local Testing** - Test with local backend server before deploying
- **Backend Proxy** - Automatic proxy during development
- **Authentication** - Token management handled automatically

### 🧪 Testing
- **Plugin Preview** - Test in portal before publishing
- **Full Stack Testing** - Frontend + backend testing locally
- **Network Testing** - Test across devices on same network
- **Hot Reload** - See changes instantly during development

## 💡 Simple Plugin Example
```typescript
/// <reference types="react" />
declare const React: any;

const MyPlugin = ({ context }) => {
  const { useState } = React;
  const [count, setCount] = useState(0);

  const handleClick = async () => {
    setCount(count + 1);
    context.utils.toast(`Clicked ${count + 1} times!`, 'success');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{context.metadata.name}</h1>
      <button 
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Click Me! ({count})
      </button>
    </div>
  );
};

export default {
  component: MyPlugin,
  metadata: {
    name: 'my-plugin',
    version: '1.0.0',
    author: 'Your Name',
  },
};
```

## 🔧 Development Commands

### Repository Setup
```bash
# Install all dependencies
npm install

# Build all packages
npm run build

# Clean all builds
npm run clean
```

### Plugin Development
```bash
# Watch mode (auto-rebuild on changes)
npm run dev

# Production build
npm run build

# Serve for testing
cd dist && http-server -p 8000 --cors
```

## 🧪 Testing Workflow

### Frontend Only
```bash
# Terminal 1: Serve bundle
cd my-plugin/dist
http-server -p 8000 --cors

# Portal: Load http://localhost:8000/plugin.js
```

### Full Stack (Frontend + Backend)
```bash
# Terminal 1: Backend
cd my-plugin-backend
node server.js

# Terminal 2: Frontend
cd my-plugin/dist
http-server -p 8000 --cors

# Portal: 
# - Bundle URL: http://localhost:8000/plugin.js
# - Backend URL: http://localhost:4000
```

## 📋 Requirements

- **Node.js** 18+ and npm
- **React** knowledge (plugins are React components)
- **TypeScript** (optional but recommended)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly using the portal's plugin testing feature
5. Submit a pull request

## 📄 License

SAP

## 📧 Support

- **Documentation**: [Developer Guide](./docs/DEVELOPER_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.tools.sap/cfs-platform-engineering/developer-portal-plugins/issues)
- **Contact**: CFS Platform Engineering Team

---

**Ready to build?** Start with the [Developer Guide](./docs/DEVELOPER_GUIDE.md) 🚀