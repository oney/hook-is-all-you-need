import { DependencyList, createContext } from "react";

import { Middleware, DevToolsMiddleware } from "../middleware";
import { Definition } from "../types";

export class Interceptor {
  id = 1;
  no = 1;
  enabled = true;
  enableSourceMap = true;
  middlewares: Middleware[] = [];
  callbacks: number[] = [];

  constructor(options?: {
    enabled: boolean;
    enableInProd: boolean;
    middlewares?: Middleware[];
  }) {
    this.enabled = options?.enabled ?? true;
    this.middlewares = options?.middlewares ?? [new DevToolsMiddleware()];
  }

  initState = <T>(initialState: T, definition: Definition) =>
    this.middlewares.reduce(
      (initialState, { initState }) =>
        initState ? initState(initialState, definition) : initialState,
      initialState
    );
  assignState = <T>(state: T, setState: any, definition: Definition) =>
    this.middlewares.forEach(({ assignState }) =>
      assignState?.(state, setState, definition)
    );
  preState = <T>(action: T, definition: Definition) => {
    const id = this.id++;
    return [
      id,
      this.middlewares.reduce(
        (action, { preState }) =>
          preState ? preState(action, id, definition) : action,
        action
      ),
    ] as [number, T];
  };
  beforeState = <T>(prev: T, action: any, id: number, definition: Definition) =>
    this.middlewares.reduce(
      (prev, { beforeState }) =>
        beforeState ? beforeState(prev, action, id, definition) : prev,
      prev
    );
  afterState = <T>(
    prev: T,
    next: T,
    action: any,
    id: number,
    definition: Definition
  ) =>
    this.middlewares.reduce(
      (next, { afterState }) =>
        afterState ? afterState(prev, next, action, id, definition) : next,
      next
    );
  cleanState = (definition: Definition) => {
    this.middlewares.forEach(({ cleanState }) => cleanState?.(definition));
  };
  beforeCallback = <T extends any[]>(
    args: T,
    deps: DependencyList,
    definition: Definition
  ) => {
    const id = this.id++;
    return [
      id,
      this.middlewares.reduce(
        (args, { beforeCallback }) =>
          beforeCallback ? beforeCallback(args, deps, id, definition) : args,
        args
      ),
    ] as [number, T];
  };
  afterCallback = <T>(result: T, id: number, definition: Definition) =>
    this.middlewares.reduce(
      (result, { afterCallback }) =>
        afterCallback ? afterCallback(result, id, definition) : result,
      result
    );
  afterCallbackError = <T>(error: T, id: number, definition: Definition) =>
    this.middlewares.reduce(
      (error, { afterCallbackError }) =>
        afterCallbackError ? afterCallbackError(error, id, definition) : error,
      error
    );
  pauseCallback = <T>(result: T, id: number, definition: Definition) =>
    this.middlewares.reduce(
      (result, { pauseCallback }) =>
        pauseCallback ? pauseCallback(result, id, definition) : result,
      result
    );
  resumeCallback = <T>(result: T, id: number, definition: Definition) =>
    this.middlewares.reduce(
      (result, { resumeCallback }) =>
        resumeCallback ? resumeCallback(result, id, definition) : result,
      result
    );
}

export const InterceptorContext = createContext<Interceptor | null>(null);
