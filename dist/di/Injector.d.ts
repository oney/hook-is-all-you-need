import { PropsWithChildren } from "react";
import { InjectorProvider } from "./types";
export declare function Injector({ children, providers, }: PropsWithChildren<{
    providers: InjectorProvider[];
}>): JSX.Element;
