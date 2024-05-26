import { Dispatch, SetStateAction } from "react";
export declare function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
