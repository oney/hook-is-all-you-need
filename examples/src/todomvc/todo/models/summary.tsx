import { ReactNode } from "react";
import {
  Context,
  createContext,
  useContextSelector,
} from "use-context-selector";
import { useImmer } from "use-immer";
import { ContextType } from "../../utils/contextType";
import { TodosContext } from "./todos";

export function useSummary() {
  const [visible, updateVisible] = useImmer(false);
  const todos = useContextSelector(TodosContext, (ctx) => ctx.todos);

  return { visible: visible && todos.length > 0, updateVisible };
}

const SummaryContext = createContext<ReturnType<typeof useSummary>>(
  undefined as any
);

export type SummaryContextType = Context<ContextType<typeof SummaryContext>>;

export const SummaryContext1 = createContext<
  ContextType<typeof SummaryContext>
>(undefined as any);

export function SummaryProvider1({ children }: { children?: ReactNode }) {
  return (
    <SummaryContext1.Provider value={useSummary()}>
      {children}
    </SummaryContext1.Provider>
  );
}

export const SummaryContext2 = createContext<
  ContextType<typeof SummaryContext>
>(undefined as any);

export function SummaryProvider2({ children }: { children?: ReactNode }) {
  return (
    <SummaryContext2.Provider value={useSummary()}>
      {children}
    </SummaryContext2.Provider>
  );
}
