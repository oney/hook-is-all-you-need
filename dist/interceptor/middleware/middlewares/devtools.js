"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevToolsMiddleware = void 0;
const utils_1 = require("../../utils");
async function formatCb(cb) {
    if (!cb)
        return "anonymous";
    return await (0, utils_1.formatDefinition)(cb.definition);
}
class DevToolsMiddleware {
    constructor() {
        this.callbacks = [];
        this.stateCtx = {};
        this.globalState = {};
        this.setState = {};
        this.assignState = (state, setState, definition) => {
            (async () => {
                var _a;
                const path = await (0, utils_1.formatDefinition)(definition);
                this.setState[path] = setState;
                if (this.globalState[path] === state)
                    return;
                const globalState = Object.assign(Object.assign({}, this.globalState), { [path]: state });
                this.globalState = globalState;
                (_a = this.devTools) === null || _a === void 0 ? void 0 : _a.send({
                    type: path,
                    state,
                }, globalState);
            })();
        };
        this.preState = (action, id) => {
            this.stateCtx[id] = this.callbacks[this.callbacks.length - 1];
            return action;
        };
        this.afterState = (_prev, next, _action, id, definition) => {
            (async () => {
                var _a;
                const path = await (0, utils_1.formatDefinition)(definition);
                const cb = this.stateCtx[id];
                if (this.globalState[path] === next)
                    return;
                const globalState = Object.assign(Object.assign({}, this.globalState), { [path]: next });
                this.globalState = globalState;
                (_a = this.devTools) === null || _a === void 0 ? void 0 : _a.send({
                    type: await formatCb(cb),
                    args: cb === null || cb === void 0 ? void 0 : cb.args,
                    deps: cb === null || cb === void 0 ? void 0 : cb.deps,
                }, globalState);
            })();
            return next;
        };
        this.cleanState = (definition) => {
            (async () => {
                var _a;
                const path = await (0, utils_1.formatDefinition)(definition);
                delete this.setState[path];
                // if (!(path in this.globalState)) return;
                const globalState = Object.assign({}, this.globalState);
                const state = globalState[path];
                delete globalState[path];
                this.globalState = globalState;
                (_a = this.devTools) === null || _a === void 0 ? void 0 : _a.send({
                    type: path,
                    teardown: state,
                }, globalState);
            })();
        };
        this.beforeCallback = (args, deps, id, definition) => {
            this.callbacks.push({ id, args, deps, definition });
            return args;
        };
        this.afterCallback = (result) => {
            this.callbacks.pop();
            return result;
        };
        if (!window.__REDUX_DEVTOOLS_EXTENSION__)
            return;
        this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
            name: "HookIsAllYouNeed",
            trace: true,
        });
        this.devTools.subscribe((message) => {
            var _a, _b;
            if (message.type === "DISPATCH" && message.state) {
                const state = JSON.parse(message.state);
                for (const [key, value] of Object.entries(state)) {
                    (_b = (_a = this.setState)[key]) === null || _b === void 0 ? void 0 : _b.call(_a, value);
                }
            }
        });
        this.devTools.init({});
    }
}
exports.DevToolsMiddleware = DevToolsMiddleware;
