import { Dispatch, SetStateAction } from "react";
export declare function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
export declare function useState<S = undefined>(): [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>
];
