import { useCallback, useState } from "react";
import { useCallback as useGenerator } from "hook-is-all-you-need";

import { api } from "./api";

export function useCounter(base: number) {
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(false);

  const increment = useCallback(
    (multiplier: number) => {
      const inc = base * multiplier;
      setCount((count) => count + inc);
      return inc;
    },
    [base]
  );

  const incrementApi = useGenerator(
    function* () {
      setPending(true);
      const inc: Awaited<ReturnType<typeof api>> = yield api(base);
      setCount((count) => count + inc);
      setPending(false);
      return inc;
    },
    [base]
  );

  return { count, pending, increment, incrementApi };
}
