// src/index.tsx
import { useState as useState2 } from "react";

// ../plugin-sdk/dist/types.js
var PluginErrorType;
(function(PluginErrorType2) {
  PluginErrorType2["LOAD_FAILED"] = "LOAD_FAILED";
  PluginErrorType2["INVALID_MANIFEST"] = "INVALID_MANIFEST";
  PluginErrorType2["RUNTIME_ERROR"] = "RUNTIME_ERROR";
  PluginErrorType2["NETWORK_ERROR"] = "NETWORK_ERROR";
})(PluginErrorType || (PluginErrorType = {}));

// ../plugin-sdk/dist/helpers.js
function createPlugin(component) {
  component.displayName = component.name || "Plugin";
  return component;
}

// ../plugin-sdk/dist/hooks.js
import { useState, useEffect } from "react";

// src/index.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var MyPlugin = createPlugin(({ context }) => {
  const [count, setCount] = useState2(0);
  const handleClick = () => {
    setCount(count + 1);
    context.utils.toast(`Clicked ${count + 1} times!`, "success");
  };
  return /* @__PURE__ */ jsx("div", { className: `p-6 ${context.theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-4", children: context.metadata.name }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mb-6", children: "Welcome to your plugin! This is a template to get you started." }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Plugin Info" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 text-sm", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { children: "ID:" }),
            " ",
            context.metadata.id
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Version:" }),
            " ",
            context.metadata.version
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Author:" }),
            " ",
            context.metadata.author || "Unknown"
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Theme:" }),
            " ",
            context.theme
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Interactive Example" }),
        /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
          "Click count: ",
          count
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleClick,
            className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",
            children: "Click Me!"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Available Features" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-1 text-sm", children: [
          /* @__PURE__ */ jsx("li", { children: "API Client for backend requests" }),
          /* @__PURE__ */ jsx("li", { children: "Toast notifications" }),
          /* @__PURE__ */ jsx("li", { children: "Navigation utilities" }),
          /* @__PURE__ */ jsx("li", { children: "Theme-aware styling" }),
          /* @__PURE__ */ jsx("li", { children: "TypeScript support" })
        ] })
      ] })
    ] })
  ] }) });
});
var src_default = MyPlugin;
export {
  src_default as default
};
//# sourceMappingURL=plugin.js.map
