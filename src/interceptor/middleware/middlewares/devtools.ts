import { Dispatch, SetStateAction } from "react";
import { Middleware } from "../types";
import { Definition } from "../../types";
import { formatDefinition } from "../../utils";

import type from "@redux-devtools/extension";
// import type { ConnectResponse } from "@redux-devtools/extension";

interface Cb {
  id: number;
  args: any;
  deps: any;
  definition: Definition;
}

async function formatCb(cb?: Cb) {
  if (!cb) return "anonymous";
  return await formatDefinition(cb.definition);
}

export class DevToolsMiddleware implements Middleware {
  devTools?: any; // ConnectResponse
  callbacks: Cb[] = [];
  stateCtx: { [id: string]: Cb } = {};
  globalState: { [key: string]: any } = {};
  setState: { [key: string]: Dispatch<SetStateAction<any>> } = {};

  constructor() {
    if (!window.__REDUX_DEVTOOLS_EXTENSION__) return;
    this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
      name: "HookIsAllYouNeed",
      trace: true,
    });
    this.devTools.subscribe((message: any) => {
      if (message.type === "DISPATCH" && message.state) {
        const state: any = JSON.parse(message.state);
        for (const [key, value] of Object.entries(state)) {
          this.setState[key]?.(value);
        }
      }
    });
    this.devTools.init({});
  }
  assignState = <T>(
    state: T,
    setState: Dispatch<SetStateAction<T>>,
    definition: Definition
  ) => {
    (async () => {
      const path = await formatDefinition(definition);
      this.setState[path] = setState;
      if (this.globalState[path] === state) return;
      const globalState = { ...this.globalState, [path]: state };
      this.globalState = globalState;
      this.devTools?.send(
        {
          type: path,
          state,
        } as any,
        globalState
      );
    })();
  };
  preState = (action: any, id: number) => {
    this.stateCtx[id] = this.callbacks[this.callbacks.length - 1];
    return action;
  };
  afterState = (
    _prev: any,
    next: any,
    _action: any,
    id: number,
    definition: Definition
  ) => {
    (async () => {
      const path = await formatDefinition(definition);
      const cb: Cb | undefined = this.stateCtx[id];
      if (this.globalState[path] === next) return;
      const globalState = { ...this.globalState, [path]: next };
      this.globalState = globalState;
      this.devTools?.send(
        {
          type: await formatCb(cb),
          args: cb?.args,
          deps: cb?.deps,
        } as any,
        globalState
      );
    })();
    return next;
  };
  cleanState = (definition: Definition) => {
    (async () => {
      const path = await formatDefinition(definition);
      delete this.setState[path];
      // if (!(path in this.globalState)) return;
      const globalState = { ...this.globalState };
      const state = globalState[path];
      delete globalState[path];
      this.globalState = globalState;
      this.devTools?.send(
        {
          type: path,
          teardown: state,
        } as any,
        globalState
      );
    })();
  };
  beforeCallback = (
    args: any,
    deps: any,
    id: number,
    definition: Definition
  ) => {
    this.callbacks.push({ id, args, deps, definition });
    return args;
  };
  afterCallback = (result: any) => {
    this.callbacks.pop();
    return result;
  };
}
