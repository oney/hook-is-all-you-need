/* eslint-disable react/jsx-pascal-case */
import { Context, useContextSelector } from "use-context-selector";
import { initializerMap, initializingSet, valueMap } from "./initializer";
import { providerSymbol } from "./types";

export function useInject<T extends (...args: any[]) => any, Selected>(
  hook: T,
  selector: (value: ReturnType<T>) => Selected
): Selected {
  const context: Context<any> | undefined = hook[providerSymbol];
  if (!context) {
    console.error("Context not provided for hook:", hook);
    throw new Error(`Context not provided for hook: ${hook}`);
  }

  const value_ = useContextSelector(context, (c) => c);
  if (value_ !== undefined) return selector(value_);

  const value: ReturnType<T> = (() => {
    const value = valueMap.get(context) as ReturnType<T> | undefined;
    if (value) return value;

    const initializer = initializerMap.get(context) as T | undefined;
    if (!initializer) {
      console.error("Initializer not found for context:", context);
      throw new Error(`Initializer not found for context: ${context}`);
    }

    if (initializingSet.has(context)) {
      console.error("Circular dependency detected of context:", context);
      throw new Error(`Circular dependency detected of context: ${context}`);
    }
    initializingSet.add(context);

    const initialized: ReturnType<T> = initializer();

    initializingSet.delete(context);

    valueMap.set(context, initialized);
    return initialized;
  })();

  return selector(value);
}
