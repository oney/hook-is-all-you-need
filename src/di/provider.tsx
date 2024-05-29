/* eslint-disable react/jsx-pascal-case */
import React, { PropsWithChildren } from "react";
import {
  Context,
  createContext,
  useContextSelector,
} from "use-context-selector";

export type NoArgFunc = () => any;
export type ProviderTuple<R = any> = [(...args: any[]) => R, () => R];
export type ContextTuple<R = any> = [Context<R>, () => R];
export type DependencyProvider = NoArgFunc | ProviderTuple | ContextTuple;

export const providerSymbol = Symbol("provider");

declare global {
  interface Function {
    [providerSymbol]?: Context<undefined>;
  }
}

const initializerMap = new Map<Context<undefined>, () => any>();
const initializingSet = new Set<Context<undefined>>();
const valueMap = new Map<Context<undefined>, any>();

function clear() {
  initializerMap.clear();
  initializingSet.clear();
  valueMap.clear();
}

export function Dependency({
  children,
  providers,
}: PropsWithChildren<{
  providers: DependencyProvider[];
}>): JSX.Element {
  clear();

  // Setup contexts
  for (const provider of providers) {
    const [context, initializer]: [Context<undefined>, () => any] = (() => {
      const [hookOrContext, initializer] = Array.isArray(provider)
        ? [provider[0], provider[1]]
        : [provider, provider];
      const context =
        typeof hookOrContext === "function"
          ? hookOrContext[providerSymbol] ??
            (hookOrContext[providerSymbol] = createContext(undefined))
          : hookOrContext;
      return [context, initializer];
    })();

    initializerMap.set(context, initializer);
  }

  for (const [context, initializer] of initializerMap.entries()) {
    if (valueMap.has(context)) continue;
    valueMap.set(context, initializer());
  }

  const result = Array.from(valueMap.entries()).reduceRight(
    (acc, [Context, value]) => (
      <Context.Provider value={value}>{acc}</Context.Provider>
    ),
    children
  );

  clear();

  return result as JSX.Element;
}

export function useInject<T extends (...args: any[]) => any, Selected>(
  hook: T,
  selector: (value: ReturnType<T>) => Selected
): Selected {
  const context: Context<any> | undefined = hook[providerSymbol];
  if (!context) throw new Error(`Context not provided for hook: ${hook}`);

  const value_ = useContextSelector(context, (c) => c);
  if (value_ !== undefined) return selector(value_);

  const value: ReturnType<T> = (() => {
    const value = valueMap.get(context) as ReturnType<T> | undefined;
    if (value) return value;

    const initializer = initializerMap.get(context) as T | undefined;
    if (!initializer)
      throw new Error(`Initializer not found for context: ${context}`);

    if (initializingSet.has(context))
      throw new Error(`Circular dependency detected of context: ${context}`);
    initializingSet.add(context);

    const initialized: ReturnType<T> = initializer();

    initializingSet.delete(context);

    valueMap.set(context, initialized);
    return initialized;
  })();

  return selector(value);
}

export function provide<R>(
  token: (...args: any[]) => R,
  initializer: () => R
): ProviderTuple<R>;
export function provide<R>(
  token: Context<R>,
  initializer: () => R
): ContextTuple<R>;
export function provide<R>(
  token: ((...args: any[]) => R) | Context<R>,
  initializer: () => R
): ProviderTuple<R> | ContextTuple<R> {
  return [token, initializer] as ProviderTuple<R> | ContextTuple<R>;
}
