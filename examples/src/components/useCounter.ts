import { useCallback, useState } from "hook-is-all-you-need";

import { theApi } from "./api";

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

  const incrementApi = useCallback(
    function* () {
      setPending(true);
      const inc: Awaited<ReturnType<typeof theApi>> = yield theApi(base);
      setCount((count) => count + inc);
      setPending(false);
      return inc;
    },
    [base]
  );

  return { count, pending, increment, incrementApi };
}
