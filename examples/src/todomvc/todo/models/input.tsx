import { ReactNode } from "react";
import { createContext } from "use-context-selector";
import { useImmer } from "use-immer";

export function useInput({ defaultValue }: { defaultValue?: string }) {
  const [input, updateInput] = useImmer<string>(defaultValue ?? "");

  return { input, updateInput };
}

export const InputContext = createContext<ReturnType<typeof useInput>>(
  undefined as any
);

export function InputProvider({
  children,
  ...props
}: { children?: ReactNode } & Parameters<typeof useInput>[0]) {
  return (
    <InputContext.Provider value={useInput(props)}>
      {children}
    </InputContext.Provider>
  );
}
