import { DependencyList } from "react";
export declare function useCallback<TArgs extends any[], TReturn>(callback: (...args: TArgs) => Generator<Promise<any>, TReturn, any>, deps: DependencyList): (...args: TArgs) => Promise<TReturn>;
export declare function useCallback<T extends Function>(callback: T, deps: DependencyList): T;
