import { ReactNode, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { createContext } from "use-context-selector";
import { useImmer } from "use-immer";
import { ITodo } from "./types";

let id = 1;

export function useTodos() {
  const { pathname: route } = useLocation();
  const [todos, updateTodos] = useImmer<ITodo[]>([
    { id: id++, title: "todo 1", completed: false },
    { id: id++, title: "todo 2", completed: true },
    { id: id++, title: "todo 3", completed: false },
  ]);

  const visibleTodos = useMemo(
    () =>
      todos.filter((todo) => {
        if (route === "/active") return !todo.completed;
        if (route === "/completed") return todo.completed;
        return todo;
      }),
    [todos, route]
  );

  const allCompleted = useMemo(
    () => visibleTodos.every((todo) => todo.completed),
    [visibleTodos]
  );

  const activeTodos = useMemo(
    () => todos.filter((todo) => !todo.completed),
    [todos]
  );

  const addTodo = useCallback(
    (title: string) => {
      updateTodos((todos) => {
        todos.push({ id: id++, title, completed: false });
      });
    },
    [updateTodos]
  );

  const toggleAll = useCallback(
    (completed: boolean) =>
      updateTodos((todos) => {
        todos.forEach((todo) => (todo.completed = completed));
      }),
    [updateTodos]
  );

  const removeCompleted = useCallback(
    () => updateTodos((todos) => todos.filter((todo) => !todo.completed)),
    [updateTodos]
  );

  return {
    todos,
    visibleTodos,
    allCompleted,
    activeTodos,
    addTodo,
    updateTodos,
    toggleAll,
    removeCompleted,
  };
}

export const TodosContext = createContext<ReturnType<typeof useTodos>>(
  undefined as any
);

export function TodosProvider({ children }: { children?: ReactNode }) {
  return (
    <TodosContext.Provider value={useTodos()}>{children}</TodosContext.Provider>
  );
}
