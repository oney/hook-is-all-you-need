import { useCounter } from "./useCounter";

export function Counter({ base }: { base: number }) {
  const counter = useCounter(base);
  const { count, pending, increment, incrementApi } = counter;

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={() => console.log("increment", increment(3))}>
        increment
      </button>
      <button
        onClick={async () => console.log("incrementApi", await incrementApi())}
      >
        api
      </button>
      {pending && "pending"}
    </div>
  );
}
