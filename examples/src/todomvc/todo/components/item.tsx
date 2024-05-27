/* eslint-disable react/jsx-pascal-case */
import classnames from "classnames";
import { memo, useCallback } from "react";
import { useContextSelector } from "use-context-selector";
import { ItemContext, ItemProvider } from "../models/item";
import { TodoContext, TodoProvider } from "../models/todo";
import { Input } from "./input";

export const Item = memo(function Item({ id }: { id: number }) {
  return (
    <TodoProvider id={id}>
      <ItemProvider>
        <_Item />
      </ItemProvider>
    </TodoProvider>
  );
});

function _Item() {
  const title = useContextSelector(TodoContext, (ctx) => ctx.todo.title);
  const completed = useContextSelector(
    TodoContext,
    (ctx) => ctx.todo.completed
  );
  const toggle = useContextSelector(TodoContext, (ctx) => ctx.toggle);
  const remove = useContextSelector(TodoContext, (ctx) => ctx.remove);
  const isWritable = useContextSelector(ItemContext, (ctx) => ctx.isWritable);
  const updateIsWritable = useContextSelector(
    ItemContext,
    (ctx) => ctx.updateIsWritable
  );

  // const handleDoubleClick = () => updateIsWritable(true);
  const handleDoubleClick = useCallback(
    () => updateIsWritable(true),
    [updateIsWritable]
  );

  const handleBlur = useCallback(
    () => updateIsWritable(false),
    [updateIsWritable]
  );

  const handleUpdate = useContextSelector(
    ItemContext,
    (ctx) => ctx.handleUpdate
  );

  return (
    <li className={classnames({ completed })} data-testid="todo-item">
      <div className="view">
        {isWritable ? (
          <Input
            onSubmit={handleUpdate}
            label="Edit Todo Input"
            defaultValue={title}
            onBlur={handleBlur}
          />
        ) : (
          <>
            <input
              className="toggle"
              type="checkbox"
              data-testid="todo-item-toggle"
              checked={completed}
              onChange={toggle}
            />
            <label
              data-testid="todo-item-label"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </label>
            <button
              className="destroy"
              data-testid="todo-item-button"
              onClick={remove}
            />
          </>
        )}
      </div>
    </li>
  );
}
