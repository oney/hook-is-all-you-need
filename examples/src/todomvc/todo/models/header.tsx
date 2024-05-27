import { ReactNode, useCallback } from "react";
import { createContext } from "use-context-selector";
import { useImmer } from "use-immer";

export function useHeader({
  defaultValue,
  onSubmit: onSubmit_,
}: {
  defaultValue?: string;
  onSubmit?: (value: string) => void;
}) {
  const [input, updateInput] = useImmer<string>(defaultValue ?? "");

  const onSubmit = useCallback(
    (value: string) => {
      onSubmit_?.(value);
      updateInput("");
    },
    [updateInput, onSubmit_]
  );

  return { input, updateInput, onSubmit };
}

export const HeaderContext = createContext<ReturnType<typeof useHeader>>(
  undefined as any
);

export function HeaderProvider({
  children,
  ...props
}: { children?: ReactNode } & Parameters<typeof useHeader>[0]) {
  return (
    <HeaderContext.Provider value={useHeader(props)}>
      {children}
    </HeaderContext.Provider>
  );
}
