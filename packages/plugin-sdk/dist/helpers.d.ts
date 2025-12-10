import { PluginComponent } from './types';
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
export declare function createPlugin(component: PluginComponent): PluginComponent;
/**
 * Validate plugin manifest
 */
export declare function validateManifest(manifest: any): boolean;
/**
 * Helper to construct API URLs
 */
export declare function buildApiUrl(base: string, path: string, params?: Record<string, any>): string;
//# sourceMappingURL=helpers.d.ts.map