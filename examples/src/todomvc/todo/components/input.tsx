/* eslint-disable react/jsx-pascal-case */
import { Dispatch, SetStateAction, useCallback } from "react";
import { useMixed } from "../hooks";

const sanitize = (string: string) => {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  const reg = /[&<>"'/]/gi;
  // @ts-ignore
  return string.replace(reg, (match) => map[match]);
};

const hasValidMin = (value: string, min: number) => {
  return value.length >= min;
};

export interface Props {
  defaultValue?: string;
  value?: string;
  valueChange?: Dispatch<SetStateAction<string>>;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  label?: string;
  onBlur?: () => void;
}

export function Input({
  defaultValue,
  value: value_,
  valueChange: valueChange_,
  onSubmit,
  placeholder,
  label,
  onBlur,
}: Props) {
  const [value, valueChange] = useMixed("", defaultValue, value_, valueChange_);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const value = (e.target as any).value.trim();
        if (!hasValidMin(value, 2)) return;
        onSubmit?.(sanitize(value));
      }
    },
    [onSubmit]
  );

  return (
    <div className="input-container">
      <input
        className="new-todo"
        id="todo-input"
        type="text"
        data-testid="text-input"
        autoFocus
        placeholder={placeholder}
        value={value}
        onChange={(e) => valueChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
      />
      <label className="visually-hidden" htmlFor="todo-input">
        {label}
      </label>
    </div>
  );
}
