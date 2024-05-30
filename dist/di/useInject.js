"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInject = void 0;
/* eslint-disable react/jsx-pascal-case */
const use_context_selector_1 = require("use-context-selector");
const initializer_1 = require("./initializer");
const types_1 = require("./types");
function useInject(hook, selector) {
    const context = hook[types_1.providerSymbol];
    if (!context) {
        console.error("Context not provided for hook:", hook);
        throw new Error(`Context not provided for hook: ${hook}`);
    }
    const value_ = (0, use_context_selector_1.useContextSelector)(context, (c) => c);
    if (value_ !== undefined)
        return selector(value_);
    const value = (() => {
        const value = initializer_1.valueMap.get(context);
        if (value)
            return value;
        const initializer = initializer_1.initializerMap.get(context);
        if (!initializer) {
            console.error("Initializer not found for context:", context);
            throw new Error(`Initializer not found for context: ${context}`);
        }
        if (initializer_1.initializingSet.has(context)) {
            console.error("Circular dependency detected of context:", context);
            throw new Error(`Circular dependency detected of context: ${context}`);
        }
        initializer_1.initializingSet.add(context);
        const initialized = initializer();
        initializer_1.initializingSet.delete(context);
        initializer_1.valueMap.set(context, initialized);
        return initialized;
    })();
    return selector(value);
}
exports.useInject = useInject;
