import { ApiClient, PluginContext } from './types';
/**
 * Hook for fetching data from the API
 *
 * @example
 * ```typescript
 * const MyPlugin = createPlugin(({ context }) => {
 *   const { data, loading, error } = usePluginData('/api/items', context.apiClient);
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <div>{JSON.stringify(data)}</div>;
 * });
 * ```
 */
export declare function usePluginData<T = any>(url: string, apiClient: ApiClient, options?: {
    enabled?: boolean;
    refetchInterval?: number;
}): {
    data: T | null;
    loading: boolean;
    error: Error | null;
};
/**
 * Hook to access the current theme
 *
 * @example
 * ```typescript
 * const MyPlugin = createPlugin(({ context }) => {
 *   const theme = usePluginTheme(context);
 *
 *   return (
 *     <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
 *       Current theme: {theme}
 *     </div>
 *   );
 * });
 * ```
 */
export declare function usePluginTheme(context: PluginContext): import("./types").Theme;
/**
 * Hook for handling async operations with loading and error states
 *
 * @example
 * ```typescript
 * const MyPlugin = createPlugin(({ context }) => {
 *   const { execute, loading, error } = usePluginAsync(async (itemId: string) => {
 *     return await context.apiClient.post('/api/items', { id: itemId });
 *   });
 *
 *   return (
 *     <button onClick={() => execute('123')} disabled={loading}>
 *       {loading ? 'Saving...' : 'Save'}
 *     </button>
 *   );
 * });
 * ```
 */
export declare function usePluginAsync<T extends (...args: any[]) => Promise<any>>(asyncFunction: T): {
    execute: (...args: Parameters<T>) => Promise<ReturnType<T> | undefined>;
    loading: boolean;
    error: Error | null;
};
//# sourceMappingURL=hooks.d.ts.map