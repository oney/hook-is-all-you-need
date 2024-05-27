import { ReactNode, useCallback } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { useImmer } from "use-immer";
import { TodoContext } from "./todo";

export function useItem() {
  const updateTodo = useContextSelector(TodoContext, (ctx) => ctx.updateTodo);
  const remove = useContextSelector(TodoContext, (ctx) => ctx.remove);

  const [isWritable, updateIsWritable] = useImmer(false);

  const handleUpdate = useCallback(
    (title: string) => {
      if (title.length === 0) remove();
      else
        updateTodo((todo) => {
          todo.title = title;
        });

      updateIsWritable(false);
    },
    [remove, updateTodo, updateIsWritable]
  );

  return { isWritable, updateIsWritable, handleUpdate };
}

export const ItemContext = createContext<ReturnType<typeof useItem>>(
  undefined as any
);

export function ItemProvider({ children }: { children: ReactNode }) {
  return (
    <ItemContext.Provider value={useItem()}>{children}</ItemContext.Provider>
  );
}
