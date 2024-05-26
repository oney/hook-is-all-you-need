# Hook Is All You Need (HIAYN)

Hook Is All You Need (HIAYN) is a design pattern that helps React developers manage complex state without learning any third-party state management library.

HIAYN is 0 API, 0 learning curve, 0 boilerplate, performant, DevTools-powered (time travel and logging), async flow, compositional, immutable and decentralized state, test-driven, TypeScript-safe state management pattern.

Have you ever wondered why React developers suddenly need to learn a third-party state management after we have already learned the native hooks (such as useState, useContext)? And the philosophy of these third-party state management differs a lot from React itself which make us look like not using React anymore. Do we really need third-party state management?

No we don't need to. React built-in hooks such as useState, useCallback and useContext is powerful to manage very complex state. It's just that these design patterns are not so structural and lack of devtools support.

# HIAYN Interceptor

HIAYN's Interceptor lets us be able to view state changes from any `useState` with the triggering `useCallback` in Redux DevTools.

![devtools](./assets/devtools-1.jpg)

We can even click "Jump" button of an action to get back to that state.

The code is

```tsx
import { useState, useCounter } from "hook-is-all-you-need";

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

## Action

```js
type: "@Example.c10|Counter.counter.increment";
args: [3];
deps: [10];
```

- `@Example.c10|` is the scopes which will be talked later
- `Counter` is the function component name
- `counter` is the variable name of the hook call (`const counter = useCounter(`)
- `increment` is the callback variable name (`const increment = useCallback(`)
- `args` is the arguments of `increment` callback (`(mul: number)`)
- `deps` is the dependency list of `increment` callback (`[base]`)

## State

```js
@Example.c10|Counter.counter.count: 0 => 30
```

- `@Example.c10|`, `Counter`, `counter` are the same as above
- `count` is the state variable name (`const [count, setCount] = useState(`)
- state changed from `0` to `30`.

## Scopes

`Counter` component is used like

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

`Example` is from the parent `ScopeProvider` and `c10` is from the child `ScopeProvider`.

Scopes help us distinguish multiple rendering of a same component, and scopes are concatenable.

## Setup

Initializing `Interceptor` and wrap `InterceptorContext` in your root component.

```tsx
import { Interceptor, InterceptorContext } from "hook-is-all-you-need";

const interceptor = new Interceptor();

root.render(
  <InterceptorContext.Provider value={interceptor}>
    <App />
  </InterceptorContext.Provider>
);
```

And use `useState` and `useCallback` from `hook-is-all-you-need` package instead of `react`.

## Concept

That's all you need to use HIAYN! It's 0 API, 0 learning curve, 0 boilerplate, DevTools-powered (time travel and logging), immutable and decentralized state, state management pattern as I promised you, right?
