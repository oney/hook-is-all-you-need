import { Context } from "use-context-selector";
export declare const initializerMap: Map<Context<undefined>, () => any>;
export declare const initializingSet: Set<Context<undefined>>;
export declare const valueMap: Map<Context<undefined>, any>;
export declare function clear(): void;
