"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.valueMap = exports.initializingSet = exports.initializerMap = void 0;
exports.initializerMap = new Map();
exports.initializingSet = new Set();
exports.valueMap = new Map();
function clear() {
    exports.initializerMap.clear();
    exports.initializingSet.clear();
    exports.valueMap.clear();
}
exports.clear = clear;
