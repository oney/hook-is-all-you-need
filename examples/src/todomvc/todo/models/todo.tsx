import { Draft } from "immer";
import { ReactNode, useCallback } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { DraftFunction } from "use-immer";
import { TodosContext } from "./todos";
import { ITodo } from "./types";

export function useTodo(id: number) {
  const todo = useContextSelector(
    TodosContext,
    (ctx) => ctx.todos.find((todo) => todo.id === id)!
  );
  const updateTodos = useContextSelector(
    TodosContext,
    (ctx) => ctx.updateTodos
  );

  const findIndex = useCallback(
    (todos: Draft<ITodo[]>) => todos.findIndex((todo) => todo.id === id),
    [id]
  );

  const updateTodo = useCallback(
    (draft: DraftFunction<ITodo>) => {
      updateTodos((todos) => {
        const index = findIndex(todos);
        draft(todos[index]);
      });
    },
    [updateTodos, findIndex]
  );

  const toggle = useCallback(
    () =>
      updateTodo((todo) => {
        todo.completed = !todo.completed;
      }),
    [updateTodo]
  );

  const remove = useCallback(
    () =>
      updateTodos((todos) => {
        const index = findIndex(todos);
        todos.splice(index, 1);
      }),
    [updateTodos, findIndex]
  );

  return { todo, updateTodo, toggle, remove };
}

export const TodoContext = createContext<ReturnType<typeof useTodo>>(
  undefined as any
);

export function TodoProvider({
  id,
  children,
}: {
  id: number;
  children: ReactNode;
}) {
  return (
    <TodoContext.Provider value={useTodo(id)}>{children}</TodoContext.Provider>
  );
}
