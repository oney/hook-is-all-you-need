import { Context } from "use-context-selector";

export type NoArgFunc = () => any;
export type ProviderTuple<R = any> = [(...args: any[]) => R, () => R];
export type ContextTuple<R = any> = [Context<R>, () => R];
export type InjectorProvider = NoArgFunc | ProviderTuple | ContextTuple;

export const providerSymbol = Symbol("provider");

declare global {
  interface Function {
    [providerSymbol]?: Context<undefined>;
  }
}
