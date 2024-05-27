/* eslint-disable react/jsx-pascal-case */
import { memo } from "react";
import { useContextSelector } from "use-context-selector";
import { HeaderContext, useHeader } from "../models/header";
import { SummaryContext1, SummaryContext2 } from "../models/summary";
import { Input } from "./input";

export const Header = memo(function Header(
  props: Parameters<typeof useHeader>[0]
) {
  return (
    <_Header />
    // <HeaderProvider {...props}>
    // </HeaderProvider>
  );
});

function _Header() {
  const input = useContextSelector(HeaderContext, (ctx) => ctx.input);
  const updateInput = useContextSelector(
    HeaderContext,
    (ctx) => ctx.updateInput
  );
  const onSubmit = useContextSelector(HeaderContext, (ctx) => ctx.onSubmit);
  const updateVisible1 = useContextSelector(
    SummaryContext1,
    (ctx) => ctx.updateVisible
  );
  const updateVisible2 = useContextSelector(
    SummaryContext2,
    (ctx) => ctx.updateVisible
  );

  return (
    <header className="header" data-testid="header">
      <h1>todos</h1>
      <div>
        <button
          className="toggle-summary"
          onClick={() => updateVisible1((v) => !v)}
        >
          Toggle Active
        </button>{" "}
        <button
          className="toggle-summary"
          onClick={() => updateVisible2((v) => !v)}
        >
          Toggle Completed
        </button>
      </div>
      <Input
        value={input}
        valueChange={updateInput}
        onSubmit={onSubmit}
        label="New Todo Input"
        placeholder="What needs to be done?"
      />
    </header>
  );
}
