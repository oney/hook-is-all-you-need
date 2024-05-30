# Hook Is All You Need (HIAYN)

Hook Is All You Need (HIAYN) is a design pattern for React developers to manage complex state without needing to learn any third-party state management libraries.

HIAYN offers a 0-API, 0-learning curve, 0-boilerplate solution that is performant, DevTools-powered (with time travel and logging), supports async flow, and provides compositional, immutable, multi-store state management. It is also test-friendly and 100% TypeScript.

## Why HIAYN?

Have you ever wondered why React developers often have to learn third-party state management libraries after mastering React hooks? The philosophy behind these libraries often diverges significantly from React itself, making it feel like you're not using React anymore. But do we really need them?

No, we don’t. React’s built-in hooks, such as `useState`, `useCallback`, and `useContext`, are powerful enough to manage even the most complex state. The challenge is that the design patterns are not well-structured and lack DevTools support.

# HIAYN Interceptor

HIAYN's Interceptor allows you to view state changes from any `useState` hook, along with the triggering `useCallback`, in Redux DevTools.

![devtools](./assets/devtools-1.jpg)

You can even click the "Jump" button on an action to time travel to that state.

Here’s the example:

```tsx
import { useState, useCallback } from "hook-is-all-you-need";

function useCounter(base: number) {
  const [count, setCount] = useState(0);

  const increment = useCallback(
    (mul: number) => setCount((count) => count + base * mul),
    [base]
  );
  return { count, increment };
}

function Counter({ base }: { base: number }) {
  const counter = useCounter(base);
  const { count, increment } = counter;

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={() => increment(3)}>increment</button>
    </div>
  );
}
```

Let's explore it in depth

## Action

useCallback is a Redux action.

```js
type: "@Example.c10|Counter.counter.increment";
args: [3];
deps: [10];
```

- `@Example.c10|` refers to the scopes, which we’ll discuss later
- `Counter` is the function component name
- `counter` is the variable name of the hook call (`const counter = useCounter`)
- `increment` is the callback variable name (`const increment = useCallback`)
- `args` are the arguments of the `increment` callback (`(mul: number)`)
- `deps` are the dependencies of the `increment` callback (`[base]`)

## State

useState is a Redux reducer

```js
@Example.c10|Counter.counter.count: 0 => 30
```

- `@Example.c10|`, `Counter`, `counter` are the same as above
- `count` is the state variable name (`const [count, setCount] = useState`)
- The state changed from `0` to `30`.

## Scopes

The `Counter` component is used in `App`:

```tsx
import { ScopeProvider } from "hook-is-all-you-need";

function App() {
  return (
    <ScopeProvider scope="Example">
      <ScopeProvider scope="c10">
        <Counter base={10} />
      </ScopeProvider>
      <ScopeProvider scope="c100">
        <Counter base={100} />
      </ScopeProvider>
    </ScopeProvider>
  );
}
```

In `@Example.c10|`, `Example` is from the parent `ScopeProvider`, and `c10` is from the child `ScopeProvider`.

Scopes help distinguish multiple instances of the same component and are concatenable.

Scopes are not necessary if your component names are unique.

## Setup

```shell
npm i hook-is-all-you-need
```

Initialize `Interceptor` and wrap `InterceptorContext` around your root component.

```tsx
import { Interceptor, InterceptorContext } from "hook-is-all-you-need";

const interceptor = new Interceptor({
  enabled: process.env.NODE_ENV === "development",
});

root.render(
  <InterceptorContext.Provider value={interceptor}>
    <App />
  </InterceptorContext.Provider>
);
```

And use `useState` and `useCallback` from the `hook-is-all-you-need` package instead of `react`, as demonstrated in the example code above.

```tsx
import { useState, useCallback } from "hook-is-all-you-need";
```

To not manually modify `react` to `hook-is-all-you-need`, include the following at the top of your application's entry point file, similar to [why-did-you-render](https://github.com/welldone-software/why-did-you-render?tab=readme-ov-file#setup).

```tsx
import React from "react";
import { hookIsAllYouNeed } from "hook-is-all-you-need";
hookIsAllYouNeed(React);

// ...
ReactDOM.render(<App />, document.getElementById("root"));

// Then we still import from react
import { useState, useCallback } from "react";
```

## Concept

That’s all you need to use HIAYN!

It’s a 0-API, 0-learning curve, 0-boilerplate, DevTools-powered, test-friendly, TypeScript-safe, compositional, immutable and multi-store state management pattern, as promised.

### Core Concepts

- Custom hooks act as data models or stores in Redux
  - Easy to test
  - Compositional and supports `extraReducers` by nature
- Callbacks are actions of reducers:
  - The callback itself is the action type
  - `args` are the action payload
  - `deps` are static data in the action creator
- Reducers are non-reusable and useless

## Async flow

For example, let’s say we have an `incrementApi` callback. It sets `pending` to true, and after the API promise resolves, it updates `count` and `pending` to false.

```tsx
function useCounter() {
  // ...
  const incrementApi = useCallback(async function () {
    setPending(true);
    const inc = await api(base);
    setCount((count) => count + inc);
    setPending(false);
  }, [base]);
```

HIAYN Interceptor supports asynchronous operations in callbacks, ensuring state changes are accurately linked to the correct callbacks.

![devtools async](./assets/devtools-async.jpg)

To make it work, for async callbacks, you need to change

- `async function` to a generator function `function*`
- `await` to `yield`.

```tsx
function useCounter() {
  // ...
  const incrementApi = useCallback(function* () { // async function -> function*
    setPending(true);
    const inc = yield api(base); // await -> yield
    setCount((count) => count + inc);
    setPending(false);
  }, [base]);
```

You can find a fully functional example in the ["examples"](./examples/) folder.

## Single global store

Using `useState` with custom hooks might seem limited to creating local state, but that's not the case. You can import other custom hooks to form a comprehensive global store, similar to Redux's `configureStore`, at any nested depth level.

To avoid performance issues with Context re-rendering, `use-context-selector` is needed to use.

PS: Hey React! Just implement the f\*cking context selector!

```tsx
import {
  createContext,
  useContextSelector as useCs,
} from "use-context-selector";

import useAuth from "useAuth";
import useTodos from "useTodos";
import useSettings from "useSettings";
import useDialog from "useDialog";

function useStore() {
  return {
    auth: useAuth(),
    todos: useTodos(),
    settings: useSettings(),
    dialog: useDialog(),
  };
}

const StoreContext = createContext(undefined);

const StoreProvider = ({ children }) => (
  <StoreContext.Provider value={useStore()}>{children}</StoreContext.Provider>
);

function TodosApp() {
  const todos = useCs(StoreContext, (s) => s.todos);
}
```

## Multi store

However, in my opinion, a single store is an anti-pattern. Single store is difficult to structure and manage in both small and large applications.

A better approach is to create a Context for each custom hook and use it directly. You can even create custom hooks to manipulate multiple data sources. This approach represents true composition, unlike Redux's `extraReducers`.

```tsx
function Auth() {
  const hasAuth = useCs(AuthContext, (s) => s.hasAuth);
}

function TodosHeader() {
  const addTodo = useCs(TodoContext, (s) => s.addTodo);
}

function useLogout() {
  const clearAuth = useCs(AuthContext, (s) => s.clearAuth);
  const clearTodos = useCs(TodoContext, (s) => s.clearTodos);

  return useCallback(() => {
    clearAuth();
    clearTodos();
  }, [clearAuth, clearTodos]);
}
```

Provider hell can be a problem, but [`react-nest`](https://www.npmjs.com/package/react-nest) can easily solve it. It's much simpler than Redux, isn't it?

```tsx
import Nest from "react-nest";

function Root() {
  return (
    <Nest>
      <AuthProvider />
      <TodosProvider />
      <SettingsProvider />
      <DialogProvider />
      <App />
    </Nest>
  );
}
```

## Dependency Injection

As our React app grows larger, props drilling becomes a significant issue. Props drilling violates the principle of Separation of Concerns (SOC), where a parent component accepts a prop to pass to its child component without directly using it.

Note that Redux, Zustand, and Jotai do not entirely solve props drilling for sub and non-single data. While they improve performance by re-rendering only when subscribed data changes, we still need to pass some data, like an id, index or key, to deeply nested child components.

React Context is already a robust Dependency Injection system which can perpermanently solve props drilling.

First, we need to regard custom hook as a data model. For instance, consider a `useTodos` custom hook.

```tsx
export function useTodos() {
  const [todos, updateTodos] = useImmer([]);
  const addTodo = useCallback(/* ... */);
  return { todos, updateTodos, addTodo };
}

export const TodosCtx = createContext(undefined);
```

Avoid doing this:

```tsx
export function TodoList() {
  const todosModel = useTodos();
  const { todos, addTodo } = todosModel;

  return (
    <div>
      <button onClick={addTodo}>Add</button>
      <TodosCtx.Provider value={todosModel}>
        {todos.map((todo) => <TodoItem todo={todo} />)}
      </TodosCtx.Provider>
    </div>
  );
}

export function TodoItem({ todo }) {
  const updateTodos = useCs(TodosCtx, (ctx) => ctx.updateTodos);
  const updateTitle = (title) => updateTodos(todos => /* ... */);
}
```

Instead, do this:

```tsx
export function TodoList() {
  return (
    <TodosCtx.Provider value={useTodos()}>
      <_TodoList />
    </TodosCtx.Provider>
  );
}

function _TodoList() {
  const todos = useCs(TodosCtx, (ctx) => ctx.todos);
  const addTodo = useCs(TodosCtx, (ctx) => ctx.addTodo);

  return (
    <div>
      <button onClick={addTodo}>Add</button>
      {todos.map((todo) => (
        <TodoItem todo={todo} />
      ))}
    </div>
  );
}
```

In this pattern, `TodoList` acts as a Provider component, and `_TodoList` is a Render component.

The benefits include:

- `_TodoList` doesn't need to know how or where the TodosCtx value is created; it just uses it.
- If we need to lift the state up, we only need to move `<TodosCtx.Provider>` up.
- "Provider hell" is contained within Provider components and doesn't clutter the rendering code.

## Split state

In Redux, we still need to pass the todo itself or its id to a deeply nested child component and use the id in the dispatched action.

```tsx
export function TodoItem({ todo }) {
  const update = (title) => dispatch(updateTitle(todo.id, title));
}

export const todosSlice = createSlice({
  name: "todos",
  initialState: { todos: [] },
  reducers: {
    updateTitle: (state, action) => {
      const { id, title } = action.payload;
      const todo = state.todos.find((todo) => todo.id === id);
      todo?.title = title;
    },
  },
});
```

React Context used as a Dependency Injection can do this much elegantly.

Define the `useTodo` hook as the Todo data model.

```tsx
export function useTodo(id: number) {
  const updateTodos = useCs(TodosCtx, ({ updateTodos }) => updateTodos);

  const updateTodo = (draft) =>
    updateTodos((todos) => {
      const index = todos.findIndex((todo) => todo.id === id);
      draft(todos[index]);
    });

  return { todo, updateTodo };
}

export const TodoCtx = createContext(undefined);
```

And the `TodoItem` component looks like:

```tsx
export function TodoItem({ id }) {
  return (
    <TodoCtx.Provider value={useTodo(id)}>
      <_TodoItem />
    </TodoCtx.Provider>
  );
}

function _TodoItem() {
  const update = useCs(TodoCtx, (ctx) => ctx.updateTodo);
}
```

With this approach, any deeply nested child components of `TodoItem` can access the `useTodo` data model without deeply passing props and while remaining performant.

You can find a fully working todo example in the ["examples/src/todomvc"](./examples/src/todomvc/) folder.

Although [jotai-scope](https://jotai.org/docs/extensions/scope), [unstated-next](https://github.com/jamiebuilds/unstated-next) and [constate](https://github.com/diegohaz/constate) can achieve the same functionality, they do not view React Context as a powerful DI pattern.

## React DI in the wild

The above pattern has 2 small issues:

It requires boilerplate code to create a Context, Provider, and use a shortcut hook for a custom hook.

```tsx
function useTodo(id) {}
const TodoCtx = createContext(undefined);
function TodoProvider({ id, children }) {
  return <TodoCtx.Provider value={useTodo(id)}>{children}</TodoCtx.Provider>;
}
const useTodo = (selector) => useCs(TodosCtx, selector);
```

2. Context providers must be in the correct order; otherwise, the context can't be found.

# HIAYN Dependency Injection

The HIAYN library provides a much handier way to solve the above issues with minimal APIs. Yes, I promised there wouldn't be new APIs. Think of this more as syntax sugar rather than new APIs. Underneath, it's almost the same as writing it by hand.

Let's say we have 3 custom hooks: `useApi` uses the context of `useHttp`, and `useTodos` uses `useApi`.

```tsx
function useHttp() {}
function useApi() {
  const fetch = useContextSelector(HttpContext, (c) => c.fetch);
}
function useTodos() {
  const api = useContextSelector(ApiContext, (c) => c.api);
}
function TodoApp() {
  return (
    <Nest>
      <HttpProvider />
      <ApiProvider />
      <TodosProvider />
      <App />
    </Nest>
  );
}
```

With HIAYN's Dependency Injection, you can do it like this:

```tsx
function useHttp() {}
function useApi() {
  const fetch = useInject(useHttp, (c) => c.fetch);
}
function useTodos() {
  const api = useInject(useApi, (c) => c.api);
}

export function TodoApp() {
  return (
    <Injector providers={[useApi, useHttp, useTodos]}>
      <_TodoApp />
    </Injector>
  );
}
```

There's no need to create a Context and Provider. A custom hook itself is an identifiable context, and custom hooks can be provided directly. Note that the order of custom hooks in `providers` can be arbitrary. It will automatically figure out the correct order and will throw an error if a circular dependency is detected.

## Arguments

If the custom hook needs arguments, its provider is a tuple of the hook and a factory function.

```tsx
export function TodoApp(endpoint) {
  return (
    <Injector
      providers={[
        useHttp,
        [useApi, () => useApi(endpoint)], // <-- [hook, factory] tuple
        useTodos,
      ]}
    >
      <_TodoApp />
    </Injector>
  );
}
```

You can find the example in the ["examples/src/di"](./examples/src/di) folder.
