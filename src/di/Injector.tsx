import { PropsWithChildren } from "react";
import { Context, createContext } from "use-context-selector";
import { clear, initializerMap, valueMap } from "./initializer";
import { InjectorProvider, providerSymbol } from "./types";

export function Injector({
  children,
  providers,
}: PropsWithChildren<{
  providers: InjectorProvider[];
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
