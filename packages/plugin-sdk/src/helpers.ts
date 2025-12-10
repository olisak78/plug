import { PluginComponent, PluginProps } from './types';

/**
 * Helper function to create a type-safe plugin component
 * 
 * @example
 * ```typescript
 * const MyPlugin = createPlugin(({ context }) => {
 *   return <div>Hello from {context.metadata.name}!</div>;
 * });
 * 
 * export default MyPlugin;
 * ```
 */
export function createPlugin(component: PluginComponent): PluginComponent {
  // Add display name for better debugging
  (component as any).displayName = component.name || 'Plugin';
  return component;
}

/**
 * Validate plugin manifest
 */
export function validateManifest(manifest: any): boolean {
  const required = ['id', 'name', 'version', 'description', 'author', 'bundleUrl'];
  
  for (const field of required) {
    if (!manifest[field]) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Helper to construct API URLs
 */
export function buildApiUrl(base: string, path: string, params?: Record<string, any>): string {
  const url = new URL(path, base);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}