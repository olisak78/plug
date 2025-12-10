import { ReactElement } from 'react';
/**
 * Theme type supported by the portal
 */
export type Theme = 'light' | 'dark';
/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';
/**
 * HTTP methods supported by the API client
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
/**
 * API client for making authenticated requests to the portal backend
 */
export interface ApiClient {
    /**
     * Make a GET request
     */
    get<T = any>(url: string, config?: RequestConfig): Promise<T>;
    /**
     * Make a POST request
     */
    post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>;
    /**
     * Make a PUT request
     */
    put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>;
    /**
     * Make a DELETE request
     */
    delete<T = any>(url: string, config?: RequestConfig): Promise<T>;
    /**
     * Make a PATCH request
     */
    patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>;
}
/**
 * Configuration for API requests
 */
export interface RequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, any>;
    timeout?: number;
}
/**
 * Plugin metadata
 */
export interface PluginMetadata {
    id: string;
    name: string;
    version: string;
    description?: string;
    author?: string;
}
/**
 * Utility functions provided by the portal
 */
export interface PluginUtils {
    /**
     * Show a toast notification
     */
    toast(message: string, type?: ToastType): void;
    /**
     * Navigate to a different route in the portal
     */
    navigate(path: string): void;
    /**
     * Open a URL in a new tab
     */
    openExternal(url: string): void;
}
/**
 * Context provided to all plugins
 */
export interface PluginContext {
    /**
     * Current theme of the portal
     */
    theme: Theme;
    /**
     * API client for backend requests
     */
    apiClient: ApiClient;
    /**
     * Metadata about the plugin
     */
    metadata: PluginMetadata;
    /**
     * Utility functions
     */
    utils: PluginUtils;
}
/**
 * Props passed to plugin components
 */
export interface PluginProps {
    context: PluginContext;
}
/**
 * Plugin component type
 */
export type PluginComponent = (props: PluginProps) => ReactElement;
/**
 * Plugin manifest structure
 */
export interface PluginManifest {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    bundleUrl: string;
    thumbnail?: string;
    tags?: string[];
    minPortalVersion?: string;
}
/**
 * Plugin error types
 */
export declare enum PluginErrorType {
    LOAD_FAILED = "LOAD_FAILED",
    INVALID_MANIFEST = "INVALID_MANIFEST",
    RUNTIME_ERROR = "RUNTIME_ERROR",
    NETWORK_ERROR = "NETWORK_ERROR"
}
/**
 * Plugin error class
 */
export declare class PluginError extends Error {
    type: PluginErrorType;
    details?: any | undefined;
    constructor(type: PluginErrorType, message: string, details?: any | undefined);
}
//# sourceMappingURL=types.d.ts.map