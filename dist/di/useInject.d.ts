export declare function useInject<T extends (...args: any[]) => any, Selected>(hook: T, selector: (value: ReturnType<T>) => Selected): Selected;
