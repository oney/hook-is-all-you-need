import React from "react";
import {
  Interceptor,
  InterceptorContext,
  ScopeProvider,
} from "hook-is-all-you-need";
import { Counter } from "./counter/Counter";
import { TodoMvc } from "./todomvc";

const interceptor = new Interceptor();

function App() {
  return (
    <>
      <InterceptorContext.Provider value={interceptor}>
        <ScopeProvider scope="Example">
          <ScopeProvider scope="c10">
            <Counter base={10} />
          </ScopeProvider>
          <ScopeProvider scope="c100">
            <Counter base={100} />
          </ScopeProvider>
        </ScopeProvider>
      </InterceptorContext.Provider>
      <TodoMvc />
    </>
  );
}

export default App;
