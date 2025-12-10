/**
 * Plugin error types
 */
export var PluginErrorType;
(function (PluginErrorType) {
    PluginErrorType["LOAD_FAILED"] = "LOAD_FAILED";
    PluginErrorType["INVALID_MANIFEST"] = "INVALID_MANIFEST";
    PluginErrorType["RUNTIME_ERROR"] = "RUNTIME_ERROR";
    PluginErrorType["NETWORK_ERROR"] = "NETWORK_ERROR";
})(PluginErrorType || (PluginErrorType = {}));
/**
 * Plugin error class
 */
export class PluginError extends Error {
    constructor(type, message, details) {
        super(message);
        this.type = type;
        this.details = details;
        this.name = 'PluginError';
    }
}
//# sourceMappingURL=types.js.map