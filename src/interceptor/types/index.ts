import StackFrame_ from "stackframe";
import { Trace } from "../stacktrace/trace";

export interface Definition {
  no?: number;
  namespace?: string;
  path?: string[];
  trace?: Trace;
  scope?: string[];
}

export interface StackFrame extends StackFrame_ {
  prevLines?: string[];
}

export interface HookTrace {
  varName?: string;
  functionName?: string;
}
