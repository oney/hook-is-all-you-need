import { Context } from "use-context-selector";
import { ContextTuple, ProviderTuple } from "./types";

export function provide<R>(
  token: (...args: any[]) => R,
  initializer: () => R
): ProviderTuple<R>;
export function provide<R>(
  token: Context<R>,
  initializer: () => R
): ContextTuple<R>;
export function provide<R>(
  token: ((...args: any[]) => R) | Context<R>,
  initializer: () => R
): ProviderTuple<R> | ContextTuple<R> {
  return [token, initializer] as ProviderTuple<R> | ContextTuple<R>;
}
