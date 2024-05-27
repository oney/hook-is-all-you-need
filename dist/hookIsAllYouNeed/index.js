"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hookIsAllYouNeed = void 0;
const interceptor_1 = require("../interceptor");
const real_react_1 = require("./real-react");
function hookIsAllYouNeed(React) {
    if (React.__IS_HIAYN__)
        return;
    React.__IS_HIAYN__ = true;
    real_react_1.React.useState = React.useState;
    real_react_1.React.useCallback = React.useCallback;
    React.useState = interceptor_1.useState;
    React.useCallback = interceptor_1.useCallback;
}
exports.hookIsAllYouNeed = hookIsAllYouNeed;
