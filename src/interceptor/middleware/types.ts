import { Dispatch, SetStateAction } from "react";
import { Definition } from "../types";

export interface Middleware {
  initState?: <T>(initialState: T, definition: Definition) => T;
  assignState?: <T>(
    state: T,
    setState: Dispatch<SetStateAction<T>>,
    definition: Definition
  ) => void;
  preState?: <T>(action: any, id: number, definition: Definition) => T;
  beforeState?: <T>(
    prev: T,
    action: any,
    id: number,
    definition: Definition
  ) => T;
  afterState?: <T>(
    prev: T,
    next: T,
    action: any,
    id: number,
    definition: Definition
  ) => T;
  cleanState?: (definition: Definition) => void;
  beforeCallback?: (
    args: any,
    deps: any,
    id: number,
    definition: Definition
  ) => any | Promise<any>;
  afterCallback?: (result: any, id: number, definition: Definition) => any;
  afterCallbackError?: (result: any, id: number, definition: Definition) => any;
  pauseCallback?: (result: any, id: number, definition: Definition) => any;
  resumeCallback?: (result: any, id: number, definition: Definition) => any;
}
