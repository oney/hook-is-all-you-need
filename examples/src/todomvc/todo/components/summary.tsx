/* eslint-disable react/jsx-pascal-case */
import { memo, useMemo } from "react";
import { useContextSelector } from "use-context-selector";
import { SummaryContextType } from "../models/summary";
import { TodosContext } from "../models/todos";

export const Summary = memo(function Summary({
  SummaryContext,
  completed,
}: {
  SummaryContext: SummaryContextType;
  completed: boolean;
}) {
  const visible = useContextSelector(SummaryContext, (ctx) => ctx.visible);
  const todos = useContextSelector(TodosContext, (ctx) => ctx.todos);
  const filtered = useMemo(
    () => todos.filter((todo) => todo.completed === completed),
    [todos, completed]
  );
  return visible ? (
    <div>
      {!completed ? "Active todos: " : "Completed todos:"}
      {filtered.map((t) => t.title).join(", ")}
    </div>
  ) : (
    <></>
  );
});
