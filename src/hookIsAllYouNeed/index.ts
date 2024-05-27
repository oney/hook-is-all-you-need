import type ReactType from "react";
import { useCallback, useState } from "../interceptor";
import { React as RealReact } from "./real-react";

export function hookIsAllYouNeed(
  React: typeof ReactType & { __IS_HIAYN__?: boolean }
) {
  if (React.__IS_HIAYN__) return;
  React.__IS_HIAYN__ = true;

  RealReact.useState = React.useState;
  RealReact.useCallback = React.useCallback;

  React.useState = useState;
  React.useCallback = useCallback;
}
