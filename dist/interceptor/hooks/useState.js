"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useState = void 0;
const react_1 = require("react");
const real_react_1 = require("../../hookIsAllYouNeed/real-react");
const interceptor_1 = require("../interceptor");
const scope_1 = require("../interceptor/scope");
const utils_1 = require("../utils");
const stacktrace_1 = require("./stacktrace");
function useState(initialState) {
    const interceptor = (0, react_1.useContext)(interceptor_1.InterceptorContext);
    // @ts-ignore
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (!interceptor || !interceptor.enabled)
        return real_react_1.React.useState(initialState);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const scope = (0, scope_1.useScope)();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const definitionRef = (0, react_1.useRef)({});
    definitionRef.current.scope = scope;
    const hasNo = !!definitionRef.current.no;
    if (interceptor && !hasNo) {
        definitionRef.current.no = interceptor.no++;
        if (interceptor.enableSourceMap)
            definitionRef.current.trace = stacktrace_1.tra.get();
        // initialState = runInitialState(initialState);
        // initialState = manager
        //   ? manager.initState(initialState, definitionRef.current)
        //   : initialState;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [state, setState_] = real_react_1.React.useState(initialState);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const setState = real_react_1.React.useCallback(function (action_) {
        const [id, action] = interceptor
            ? interceptor.preState(action_, definitionRef.current)
            : [-1, action_];
        setState_((prev) => {
            prev = interceptor
                ? interceptor.beforeState(prev, action, id, definitionRef.current)
                : prev;
            // @ts-ignore
            const next = (0, utils_1.resolveAction)(prev, action);
            return interceptor
                ? interceptor.afterState(prev, next, action, id, definitionRef.current)
                : next;
        });
    }, [setState_, interceptor]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (0, react_1.useEffect)(() => {
        const current = definitionRef.current;
        interceptor === null || interceptor === void 0 ? void 0 : interceptor.assignState(state, setState_, definitionRef.current);
        return () => {
            interceptor === null || interceptor === void 0 ? void 0 : interceptor.cleanState(current);
        };
    }, [interceptor]);
    // @ts-ignore
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return (0, react_1.useMemo)(() => [state, setState], [state, setState]);
}
exports.useState = useState;
