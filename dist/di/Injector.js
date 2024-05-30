"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injector = void 0;
const react_1 = __importDefault(require("react"));
const use_context_selector_1 = require("use-context-selector");
const initializer_1 = require("./initializer");
const types_1 = require("./types");
function Injector({ children, providers, }) {
    (0, initializer_1.clear)();
    // Setup contexts
    for (const provider of providers) {
        const [context, initializer] = (() => {
            var _a;
            const [hookOrContext, initializer] = Array.isArray(provider)
                ? [provider[0], provider[1]]
                : [provider, provider];
            const context = typeof hookOrContext === "function"
                ? (_a = hookOrContext[types_1.providerSymbol]) !== null && _a !== void 0 ? _a : (hookOrContext[types_1.providerSymbol] = (0, use_context_selector_1.createContext)(undefined))
                : hookOrContext;
            return [context, initializer];
        })();
        initializer_1.initializerMap.set(context, initializer);
    }
    for (const [context, initializer] of initializer_1.initializerMap.entries()) {
        if (initializer_1.valueMap.has(context))
            continue;
        initializer_1.valueMap.set(context, initializer());
    }
    const result = Array.from(initializer_1.valueMap.entries()).reduceRight((acc, [Context, value]) => (react_1.default.createElement(Context.Provider, { value: value }, acc)), children);
    (0, initializer_1.clear)();
    return result;
}
exports.Injector = Injector;
