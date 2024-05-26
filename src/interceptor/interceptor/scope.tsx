import React, { ReactNode, createContext, useContext, useMemo } from "react";

export const ScopeContext = createContext<string[]>([]);

export const useScope = () => useContext(ScopeContext);

export interface ScopeProviderProps {
  scope: string;
  children: ReactNode;
}

export const ScopeProvider: React.FC<ScopeProviderProps> = ({
  scope,
  children,
}) => {
  const parent = useScope();
  const mergedScope = useMemo(() => [...parent, scope], [parent, scope]);

  return (
    <ScopeContext.Provider value={mergedScope}>
      {children}
    </ScopeContext.Provider>
  );
};
