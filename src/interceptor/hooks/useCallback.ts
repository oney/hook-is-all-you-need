import { DependencyList, useContext, useRef } from "react";
import { React } from "../../hookIsAllYouNeed/real-react";

import { InterceptorContext } from "../interceptor";
import { useScope } from "../interceptor/scope";
import { Definition } from "../types";
import { isGenerator } from "../utils";
import { tra } from "./stacktrace";

export function useCallback<TArgs extends any[], TReturn>(
  callback: (...args: TArgs) => Generator<Promise<any>, TReturn, any>,
  deps: DependencyList
): (...args: TArgs) => Promise<TReturn>;

export function useCallback<T extends Function>(
  callback: T,
  deps: DependencyList
): T;

export function useCallback<TArgs extends any[], TReturn, C extends Function>(
  callback: (...args: TArgs) => Generator<Promise<any>, TReturn, any> | C,
  deps: DependencyList
): (...args: TArgs) => Promise<TReturn> | C {
  const interceptor = useContext(InterceptorContext);
  if (!interceptor || !interceptor.enabled)
    // @ts-ignore
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return React.useCallback(callback, deps);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const scope = useScope();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const definitionRef = useRef<Definition>({});
  definitionRef.current.scope = scope;
  if (interceptor && !definitionRef.current.no) {
    definitionRef.current.no = interceptor.no++;
    if (interceptor.enableSourceMap) definitionRef.current.trace = tra.get();
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return React.useCallback<any>(
    // @ts-ignore
    (...args_) => {
      const [id, args] = interceptor?.beforeCallback(
        args_,
        deps,
        definitionRef.current
      ) ?? [-1, args_];
      // @ts-ignore
      const result = callback(...args);
      if (!isGenerator(result)) {
        return interceptor
          ? interceptor.afterCallback(result, id, definitionRef.current)
          : result;
      }
      const generator = result;
      return (async () => {
        let result = generator.next();
        while (!result.done) {
          try {
            const value = interceptor
              ? interceptor.pauseCallback(
                  result.value,
                  id,
                  definitionRef.current
                )
              : result.value;
            const resolvedValue = await value;
            result = generator.next(
              interceptor
                ? interceptor.resumeCallback(
                    resolvedValue,
                    id,
                    definitionRef.current
                  )
                : resolvedValue
            );
          } catch (error) {
            result = generator.throw(
              interceptor
                ? interceptor.afterCallbackError(
                    error,
                    id,
                    definitionRef.current
                  )
                : error
            );
          }
        }
        return interceptor
          ? interceptor.afterCallback(result.value, id, definitionRef.current)
          : result.value;
      })();
    },
    [...deps, interceptor]
  );
}
