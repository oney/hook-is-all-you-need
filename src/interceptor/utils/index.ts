import { SetStateAction } from "react";
import { varNameFromPrevLines } from "../stacktrace/pattern";
import { Definition, HookTrace, StackFrame } from "../types";

export function resolveAction<S>(state: S, action: SetStateAction<S>): S {
  return action instanceof Function ? action(state) : action;
}

export function isGenerator(obj: any): obj is Generator {
  return (
    typeof obj === "object" && obj !== null && typeof obj.next === "function"
  );
}

export function title(definition: Definition) {
  return `${definition.namespace}/${definition.path?.join(".")}`;
}

export function validFuncName(functionName?: string) {
  if (!functionName) return true;
  if (functionName.startsWith("use")) return true;
  if (functionName[0] === "_") return true;
  if (functionName[0] === functionName[0].toLowerCase()) return false;
  return true;
}

function extractFunName(name: string | undefined) {
  return name?.startsWith("use") ? name.substring(3) : name;
}

export function formatTrace(stackframes: StackFrame[]) {
  const hookTraces: HookTrace[] = [];
  for (let i = 2; i < stackframes.length; i++) {
    const sf = stackframes[i];
    if (!validFuncName(sf.functionName)) break;
    if (sf.functionName === "renderWithHooks") break;
    hookTraces.push({
      varName: varNameFromPrevLines(sf.prevLines),
      functionName: sf.functionName,
    });
  }
  return [...hookTraces]
    .reverse()
    .map((t) =>
      t.functionName?.startsWith("use")
        ? t.varName
        : `${t.functionName}.${t.varName}`
    )
    .join(".");
}

export async function formatDefinition(definition: Definition) {
  const scope = definition.scope;
  const path: string = definition.trace
    ? await definition.trace
        .value()
        .then((stackframes) => formatTrace(stackframes))
    : title(definition);
  if (!scope || scope.length === 0) return path;
  return `@${scope.join(".")}|${path}`;
}
