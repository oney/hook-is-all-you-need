import { Dispatch, SetStateAction, useState } from "react";

function evalInitial<S>(initial: S | (() => S)): S {
  return typeof initial === "function" ? (initial as () => S)() : initial;
}

export function useMixed<S>(
  initialState: S | (() => S),
  defaultState?: S | (() => S),
  state?: S,
  setState?: Dispatch<SetStateAction<S>>
): [S, Dispatch<SetStateAction<S>>] {
  const pair = useState(defaultState ?? state ?? evalInitial(initialState));
  return state !== undefined
    ? ([state, setState] as [S, Dispatch<SetStateAction<S>>])
    : pair;
}
