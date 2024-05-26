import { DependencyList } from "react";
import { Middleware } from "../middleware";
import { Definition } from "../types";
export declare class Interceptor {
    id: number;
    no: number;
    enabled: boolean;
    enableSourceMap: boolean;
    middlewares: Middleware[];
    callbacks: number[];
    constructor(options?: {
        enabled: boolean;
        enableInProd: boolean;
        middlewares?: Middleware[];
    });
    initState: <T>(initialState: T, definition: Definition) => T;
    assignState: <T>(state: T, setState: any, definition: Definition) => void;
    preState: <T>(action: T, definition: Definition) => [number, T];
    beforeState: <T>(prev: T, action: any, id: number, definition: Definition) => T;
    afterState: <T>(prev: T, next: T, action: any, id: number, definition: Definition) => T;
    cleanState: (definition: Definition) => void;
    beforeCallback: <T extends any[]>(args: T, deps: DependencyList, definition: Definition) => [number, T];
    afterCallback: <T>(result: T, id: number, definition: Definition) => T;
    afterCallbackError: <T>(error: T, id: number, definition: Definition) => T;
    pauseCallback: <T>(result: T, id: number, definition: Definition) => T;
    resumeCallback: <T>(result: T, id: number, definition: Definition) => T;
}
export declare const InterceptorContext: import("react").Context<Interceptor | null>;
