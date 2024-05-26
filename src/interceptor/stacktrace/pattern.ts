export function getVarName(str: string): string | undefined {
  const regex =
    /\b(?:const|let|var)\s+(\w+|\[(?:\s*\w+\s*,?)*\])\s*=\s*use\w*/g;
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
    } else {
      variableNames.push(declaration);
    }
  }
  return variableNames[0];
}

export function varNameFromPrevLines(prevLines?: string[]) {
  if (!prevLines) return;

  for (const item of [...prevLines].reverse()) {
    const result = getVarName(item);
    if (result !== undefined) return result;
  }
}
