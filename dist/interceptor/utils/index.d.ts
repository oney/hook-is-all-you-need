import { SetStateAction } from "react";
import { Definition, StackFrame } from "../types";
export declare function resolveAction<S>(state: S, action: SetStateAction<S>): S;
export declare function isGenerator(obj: any): obj is Generator;
export declare function title(definition: Definition): string;
export declare function validFuncName(functionName?: string): boolean;
export declare function formatTrace(stackframes: StackFrame[]): string;
export declare function formatDefinition(definition: Definition): Promise<string>;
