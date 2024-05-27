import classnames from "classnames";
import { useLocation } from "react-router-dom";
import { useContextSelector } from "use-context-selector";
import { TodosContext } from "../models/todos";
import { Summary } from "./summary";
import { SummaryContext1, SummaryContext2 } from "../models/summary";

export function Footer() {
  const { pathname: route } = useLocation();
  const todos = useContextSelector(TodosContext, (ctx) => ctx.todos);
  const activeTodos = useContextSelector(
    TodosContext,
    (ctx) => ctx.activeTodos
  );
  const removeCompleted = useContextSelector(
    TodosContext,
    (ctx) => ctx.removeCompleted
  );

  if (todos.length === 0) return null;

  return (
    <div>
      <footer className="footer" data-testid="footer">
        <span className="todo-count">{`${activeTodos.length} ${
          activeTodos.length === 1 ? "item" : "items"
        } left!`}</span>
        <ul className="filters" data-testid="footer-navigation">
          <li>
            <a className={classnames({ selected: route === "/" })} href="#/">
              All
            </a>
          </li>
          <li>
            <a
              className={classnames({ selected: route === "/active" })}
              href="#/active"
            >
              Active
            </a>
          </li>
          <li>
            <a
              className={classnames({ selected: route === "/completed" })}
              href="#/completed"
            >
              Completed
            </a>
          </li>
        </ul>
        <button
          className="clear-completed"
          disabled={activeTodos.length === todos.length}
          onClick={removeCompleted}
        >
          Clear completed
        </button>
      </footer>
      <Summary SummaryContext={SummaryContext1} completed={false} />
      <Summary SummaryContext={SummaryContext2} completed={true} />
    </div>
  );
}
