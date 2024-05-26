"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.varNameFromPrevLines = exports.getVarName = void 0;
function getVarName(str) {
    const regex = /\b(?:const|let|var)\s+(\w+|\[(?:\s*\w+\s*,?)*\])\s*=\s*use\w*/g;
    let match;
    const variableNames = [];
    while ((match = regex.exec(str)) !== null) {
        const declaration = match[1];
        if (declaration.startsWith("[")) {
            const innerRegex = /\w+/g;
            let innerMatch;
            while ((innerMatch = innerRegex.exec(declaration)) !== null) {
                variableNames.push(innerMatch[0]);
            }
        }
        else {
            variableNames.push(declaration);
        }
    }
    return variableNames[0];
}
exports.getVarName = getVarName;
function varNameFromPrevLines(prevLines) {
    if (!prevLines)
        return;
    for (const item of [...prevLines].reverse()) {
        const result = getVarName(item);
        if (result !== undefined)
            return result;
    }
}
exports.varNameFromPrevLines = varNameFromPrevLines;
