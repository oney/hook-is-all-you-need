"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDefinition = exports.formatTrace = exports.validFuncName = exports.title = exports.isGenerator = exports.resolveAction = void 0;
const pattern_1 = require("../stacktrace/pattern");
function resolveAction(state, action) {
    return action instanceof Function ? action(state) : action;
}
exports.resolveAction = resolveAction;
function isGenerator(obj) {
    return (typeof obj === "object" && obj !== null && typeof obj.next === "function");
}
exports.isGenerator = isGenerator;
function title(definition) {
    var _a;
    return `${definition.namespace}/${(_a = definition.path) === null || _a === void 0 ? void 0 : _a.join(".")}`;
}
exports.title = title;
function validFuncName(functionName) {
    if (!functionName)
        return true;
    if (functionName.startsWith("use"))
        return true;
    if (functionName[0] === "_")
        return true;
    if (functionName[0] === functionName[0].toLowerCase())
        return false;
    return true;
}
exports.validFuncName = validFuncName;
function extractFunName(name) {
    return (name === null || name === void 0 ? void 0 : name.startsWith("use")) ? name.substring(3) : name;
}
function formatTrace(stackframes) {
    const hookTraces = [];
    for (let i = 2; i < stackframes.length; i++) {
        const sf = stackframes[i];
        if (!validFuncName(sf.functionName))
            break;
        if (sf.functionName === "renderWithHooks")
            break;
        hookTraces.push({
            varName: (0, pattern_1.varNameFromPrevLines)(sf.prevLines),
            functionName: sf.functionName,
        });
    }
    return [...hookTraces]
        .reverse()
        .map((t) => {
        var _a;
        return ((_a = t.functionName) === null || _a === void 0 ? void 0 : _a.startsWith("use"))
            ? t.varName
            : `${t.functionName}.${t.varName}`;
    })
        .join(".");
}
exports.formatTrace = formatTrace;
async function formatDefinition(definition) {
    const scope = definition.scope;
    const path = definition.trace
        ? await definition.trace
            .value()
            .then((stackframes) => formatTrace(stackframes))
        : title(definition);
    if (!scope || scope.length === 0)
        return path;
    return `@${scope.join(".")}|${path}`;
}
exports.formatDefinition = formatDefinition;
