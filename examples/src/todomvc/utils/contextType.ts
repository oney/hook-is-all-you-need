import { Context } from "use-context-selector";

export type ContextType<C extends Context<any>> = C extends Context<infer T>
  ? T
  : never;
