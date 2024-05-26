import React, { ReactNode } from "react";
export declare const ScopeContext: React.Context<string[]>;
export declare const useScope: () => string[];
export interface ScopeProviderProps {
    scope: string;
    children: ReactNode;
}
export declare const ScopeProvider: React.FC<ScopeProviderProps>;
