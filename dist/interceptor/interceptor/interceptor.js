"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterceptorContext = exports.Interceptor = void 0;
const react_1 = require("react");
const middleware_1 = require("../middleware");
class Interceptor {
    constructor(options) {
        var _a, _b;
        this.id = 1;
        this.no = 1;
        this.enabled = true;
        this.enableSourceMap = true;
        this.middlewares = [];
        this.callbacks = [];
        this.initState = (initialState, definition) => this.middlewares.reduce((initialState, { initState }) => initState ? initState(initialState, definition) : initialState, initialState);
        this.assignState = (state, setState, definition) => this.middlewares.forEach(({ assignState }) => assignState === null || assignState === void 0 ? void 0 : assignState(state, setState, definition));
        this.preState = (action, definition) => {
            const id = this.id++;
            return [
                id,
                this.middlewares.reduce((action, { preState }) => preState ? preState(action, id, definition) : action, action),
            ];
        };
        this.beforeState = (prev, action, id, definition) => this.middlewares.reduce((prev, { beforeState }) => beforeState ? beforeState(prev, action, id, definition) : prev, prev);
        this.afterState = (prev, next, action, id, definition) => this.middlewares.reduce((next, { afterState }) => afterState ? afterState(prev, next, action, id, definition) : next, next);
        this.cleanState = (definition) => {
            this.middlewares.forEach(({ cleanState }) => cleanState === null || cleanState === void 0 ? void 0 : cleanState(definition));
        };
        this.beforeCallback = (args, deps, definition) => {
            const id = this.id++;
            return [
                id,
                this.middlewares.reduce((args, { beforeCallback }) => beforeCallback ? beforeCallback(args, deps, id, definition) : args, args),
            ];
        };
        this.afterCallback = (result, id, definition) => this.middlewares.reduce((result, { afterCallback }) => afterCallback ? afterCallback(result, id, definition) : result, result);
        this.afterCallbackError = (error, id, definition) => this.middlewares.reduce((error, { afterCallbackError }) => afterCallbackError ? afterCallbackError(error, id, definition) : error, error);
        this.pauseCallback = (result, id, definition) => this.middlewares.reduce((result, { pauseCallback }) => pauseCallback ? pauseCallback(result, id, definition) : result, result);
        this.resumeCallback = (result, id, definition) => this.middlewares.reduce((result, { resumeCallback }) => resumeCallback ? resumeCallback(result, id, definition) : result, result);
        this.enabled = (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true;
        this.middlewares = (_b = options === null || options === void 0 ? void 0 : options.middlewares) !== null && _b !== void 0 ? _b : [new middleware_1.DevToolsMiddleware()];
    }
}
exports.Interceptor = Interceptor;
exports.InterceptorContext = (0, react_1.createContext)(null);
