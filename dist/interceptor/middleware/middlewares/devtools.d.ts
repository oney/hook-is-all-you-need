import { Dispatch, SetStateAction } from "react";
import { Middleware } from "../types";
import { Definition } from "../../types";
interface Cb {
    id: number;
    args: any;
    deps: any;
    definition: Definition;
}
export declare class DevToolsMiddleware implements Middleware {
    devTools?: any;
    callbacks: Cb[];
    stateCtx: {
        [id: string]: Cb;
    };
    globalState: {
        [key: string]: any;
    };
    setState: {
        [key: string]: Dispatch<SetStateAction<any>>;
    };
    constructor();
    assignState: <T>(state: T, setState: Dispatch<SetStateAction<T>>, definition: Definition) => void;
    preState: (action: any, id: number) => any;
    afterState: (_prev: any, next: any, _action: any, id: number, definition: Definition) => any;
    cleanState: (definition: Definition) => void;
    beforeCallback: (args: any, deps: any, id: number, definition: Definition) => any;
    afterCallback: (result: any) => any;
}
export {};
