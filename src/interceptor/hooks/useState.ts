import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState as useReactState,
} from "react";

import { InterceptorContext } from "../interceptor";
import { useScope } from "../interceptor/scope";
import { Definition } from "../types";
import { resolveAction } from "../utils";
import { tra } from "./stacktrace";

export function useState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] {
  const interceptor = useContext(InterceptorContext);
  // @ts-ignore
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!interceptor || !interceptor.enabled) return useReactState(initialState);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const scope = useScope();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const definitionRef = useRef<Definition>({});
  definitionRef.current.scope = scope;
  const hasNo = !!definitionRef.current.no;
  if (interceptor && !hasNo) {
    definitionRef.current.no = interceptor.no++;
    if (interceptor.enableSourceMap) definitionRef.current.trace = tra.get();
    // initialState = runInitialState(initialState);
    // initialState = manager
    //   ? manager.initState(initialState, definitionRef.current)
    //   : initialState;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, setState_] = useReactState(initialState);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const setState = useCallback(
    function (action_: SetStateAction<S>) {
      const [id, action] = interceptor
        ? interceptor.preState(action_, definitionRef.current)
        : [-1, action_];
      setState_((prev) => {
        prev = interceptor
          ? interceptor.beforeState(prev, action, id, definitionRef.current)
          : prev;
        const next = resolveAction(prev, action);
        return interceptor
          ? interceptor.afterState(
              prev,
              next,
              action,
              id,
              definitionRef.current
            )
          : next;
      });
    },
    [setState_, interceptor]
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const current = definitionRef.current;
    interceptor?.assignState(state, setState_, definitionRef.current);

    return () => {
      interceptor?.cleanState(current);
    };
  }, [interceptor]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo(() => [state, setState], [state, setState]);
}
