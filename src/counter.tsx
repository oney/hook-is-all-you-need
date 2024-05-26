import React, { useState } from "react";

export function Counter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  return (
    <div>
      {count} <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
