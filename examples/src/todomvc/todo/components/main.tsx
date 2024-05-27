import classnames from "classnames";
import { useCallback } from "react";
import { useContextSelector } from "use-context-selector";
import { TodosContext } from "../models/todos";
import { Item } from "./item";

export function Main() {
  const visibleTodos = useContextSelector(
    TodosContext,
    (ctx) => ctx.visibleTodos
  );
  const allCompleted = useContextSelector(
    TodosContext,
    (ctx) => ctx.allCompleted
  );
  const toggleAll = useContextSelector(TodosContext, (ctx) => ctx.toggleAll);

  const toggleAllChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => toggleAll(e.target.checked),
    [toggleAll]
  );

  return (
    <main className="main" data-testid="main">
      {visibleTodos.length > 0 ? (
        <div className="toggle-all-container">
          <input
            className="toggle-all"
            type="checkbox"
            data-testid="toggle-all"
            checked={allCompleted}
            onChange={toggleAllChange}
          />
          <label className="toggle-all-label" htmlFor="toggle-all">
            Toggle All Input
          </label>
        </div>
      ) : null}
      <ul className={classnames("todo-list")} data-testid="todo-list">
        {visibleTodos.map((todo) => (
          <Item key={todo.id} id={todo.id} />
        ))}
      </ul>
    </main>
  );
}
