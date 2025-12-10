import { useState, useEffect } from 'react';
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
export function usePluginData<T = any>(
  url: string,
  apiClient: ApiClient,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (options?.enabled === false) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiClient.get<T>(url);
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Setup refetch interval if specified
    let intervalId: number | undefined;
    if (options?.refetchInterval) {
      intervalId = setInterval(fetchData, options.refetchInterval);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [url, apiClient, options?.enabled, options?.refetchInterval]);

  return { data, loading, error };
}

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
export function usePluginTheme(context: PluginContext) {
  return context.theme;
}

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
export function usePluginAsync<T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction(...args);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}