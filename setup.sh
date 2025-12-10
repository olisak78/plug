#!/bin/bash

echo " Setting up SAP Developer Portal Plugin System..."

# Create directory structure
echo -e "Creating directory structure..."
mkdir -p packages/plugin-sdk/src
mkdir -p packages/plugin-template/src
mkdir -p examples/dog-breeds-explorer/src
mkdir -p docs

# Install root dependencies
echo -e "Installing root workspace..."
npm install

# Setup Plugin SDK
echo -e "Setting up Plugin SDK..."
cd packages/plugin-sdk
npm install --save-dev typescript @types/react @types/react-dom
npm run build
cd ../..

# Setup Plugin Template
echo -e "Setting up Plugin Template..."
cd packages/plugin-template
npm install react react-dom
npm install --save-dev @types/react @types/react-dom typescript esbuild
npm run build
cd ../..

# Setup Example Plugin
echo -e "Setting up Example Plugin..."
cd examples/dog-breeds-explorer
npm install react react-dom
npm install --save-dev @types/react @types/react-dom typescript esbuild
npm run build
cd ../..

echo -e " Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Commit changes: git add . && git commit -m 'Initial setup'"
echo "  2. Push to remote: git push origin main"
echo ""
echo "To create a new plugin:"
echo "  cp -r packages/plugin-template my-new-plugin"
echo "  cd my-new-plugin"
echo "  npm install"
echo "  npm run dev"