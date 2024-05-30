/* eslint-disable react/jsx-pascal-case */
import { useCallback, useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { Injector, useInject } from "hook-is-all-you-need";

let id = 1;

interface ITodo {
  id: number;
  title: string;
}

function useHttp() {
  const fetch = useCallback(async (path: string) => {
    console.log(`fetching: ${path}`);
    await new Promise((r) => setTimeout(r, 1000));
  }, []);
  return { fetch };
}

function useQuery(endpoint: string) {
  const fetch = useInject(useHttp, (c) => c.fetch);

  const [pending, setPending] = useState(true);
  const query = useCallback(
    async (path: string) => {
      setPending(true);
      const result = await fetch(`${endpoint}/${path}`);
      setPending(false);
      return result;
    },
    [endpoint, fetch]
  );

  return { pending, query };
}

function useApi() {
  const query = useInject(useQuery, (c) => c.query);
  const todosApi = useCallback(async () => {
    await query("todos");
    return ["hello", "world"].map((title) => ({ id: id++, title } as ITodo));
  }, [query]);
  const addTodoApi = useCallback(
    async (title: string) => {
      await query("add-todo");
      return { id: id++, title } as ITodo;
    },
    [query]
  );

  return { todosApi, addTodoApi };
}

function useTodos() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const pending = useInject(useQuery, (c) => c.pending);
  const todosApi = useInject(useApi, (c) => c.todosApi);
  const addTodoApi = useInject(useApi, (c) => c.addTodoApi);
  const fetchTodos = useCallback(async () => {
    const todos = await todosApi();
    setTodos(todos);
  }, [todosApi]);
  const addTodo = useCallback(
    async (title: string) => {
      const todo = await addTodoApi(title);
      setTodos((todos) => [...todos, todo]);
    },
    [addTodoApi]
  );
  return { todos, pending, fetchTodos, addTodo };
}

const CustomApi = createContext<ReturnType<typeof useApi>>(undefined as any);

export function DiExample() {
  return (
    <Injector
      providers={[
        useApi,
        useHttp,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        [useQuery, () => useQuery("foo.com")],
      ]}
    >
      <_DiExample />
    </Injector>
  );
}

function _DiExample() {
  return (
    <div>
      <Todos />
      <Todos />
    </div>
  );
}

export function Todos() {
  return (
    <Injector
      providers={[
        useTodos,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        // provide(CustomApi, () => useApi()),
      ]}
    >
      <_Todos />
    </Injector>
  );
}

function _Todos() {
  const todos = useInject(useTodos, (c) => c.todos);
  const pending = useInject(useTodos, (c) => c.pending);
  const fetchTodos = useInject(useTodos, (c) => c.fetchTodos);
  const addTodo = useInject(useTodos, (c) => c.addTodo);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div>
      <div>
        <button disabled={pending} onClick={() => addTodo("new todo")}>
          Add
        </button>
        {pending && <span>pending</span>}
      </div>
      <div>todos: {todos.map((t) => t.title).join(", ")}</div>
    </div>
  );
}
