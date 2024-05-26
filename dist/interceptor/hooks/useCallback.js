"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCallback = void 0;
const react_1 = require("react");
const interceptor_1 = require("../interceptor");
const scope_1 = require("../interceptor/scope");
const utils_1 = require("../utils");
const stacktrace_1 = require("./stacktrace");
function useCallback(callback, deps) {
    const interceptor = (0, react_1.useContext)(interceptor_1.InterceptorContext);
    if (!interceptor || !interceptor.enabled)
        // @ts-ignore
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return (0, react_1.useCallback)(callback, deps);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const scope = (0, scope_1.useScope)();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const definitionRef = (0, react_1.useRef)({});
    definitionRef.current.scope = scope;
    if (interceptor && !definitionRef.current.no) {
        definitionRef.current.no = interceptor.no++;
        if (interceptor.enableSourceMap)
            definitionRef.current.trace = stacktrace_1.tra.get();
    }
    // @ts-ignore
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return (0, react_1.useCallback)(
    // @ts-ignore
    (...args_) => {
        var _a;
        const [id, args] = (_a = interceptor === null || interceptor === void 0 ? void 0 : interceptor.beforeCallback(args_, deps, definitionRef.current)) !== null && _a !== void 0 ? _a : [-1, args_];
        // @ts-ignore
        const result = callback(...args);
        if (!(0, utils_1.isGenerator)(result)) {
            return interceptor
                ? interceptor.afterCallback(result, id, definitionRef.current)
                : result;
        }
        const generator = result;
        return (async () => {
            let result = generator.next();
            while (!result.done) {
                try {
                    const value = interceptor
                        ? interceptor.pauseCallback(result.value, id, definitionRef.current)
                        : result.value;
                    const resolvedValue = await value;
                    result = generator.next(interceptor
                        ? interceptor.resumeCallback(resolvedValue, id, definitionRef.current)
                        : resolvedValue);
                }
                catch (error) {
                    result = generator.throw(interceptor
                        ? interceptor.afterCallbackError(error, id, definitionRef.current)
                        : error);
                }
            }
            return interceptor
                ? interceptor.afterCallback(result.value, id, definitionRef.current)
                : result.value;
        })();
    }, [...deps, interceptor]);
}
exports.useCallback = useCallback;
