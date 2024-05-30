import { Context } from "use-context-selector";
import { ContextTuple, ProviderTuple } from "./types";
export declare function provide<R>(token: (...args: any[]) => R, initializer: () => R): ProviderTuple<R>;
export declare function provide<R>(token: Context<R>, initializer: () => R): ContextTuple<R>;
