/* eslint-disable react/jsx-pascal-case */
import Nest from "react-nest";
import { useContextSelector } from "use-context-selector";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Main } from "./components/main";
import { HeaderProvider } from "./models/header";
import { InputProvider } from "./models/input";
import { SummaryProvider1, SummaryProvider2 } from "./models/summary";
import { TodosContext, TodosProvider } from "./models/todos";

import "./app.css";

export function App() {
  return (
    <Nest>
      <TodosProvider />
      <InputProvider />
      <SummaryProvider1 />
      <SummaryProvider2 />
      <_App />
    </Nest>
  );
}

function _App() {
  const addTodo = useContextSelector(TodosContext, (ctx) => ctx.addTodo);
  return (
    <HeaderProvider onSubmit={addTodo}>
      <__App />
    </HeaderProvider>
  );
}

function __App() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}
