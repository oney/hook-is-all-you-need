import { Context } from "use-context-selector";

export const initializerMap = new Map<Context<undefined>, () => any>();
export const initializingSet = new Set<Context<undefined>>();
export const valueMap = new Map<Context<undefined>, any>();

export function clear() {
  initializerMap.clear();
  initializingSet.clear();
  valueMap.clear();
}
