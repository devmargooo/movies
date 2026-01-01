import { useEffect, useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);

  //   useEffect(() => {
  //     console.log(`Count update: ${count}`);
  //     if (count === 5) {
  //       setCount(0);
  //     }
  //   }, [count]);

  const incriment = () => {
    setCount((prev) => (prev === 5 ? 0 : prev + 1));
  };

  return (
    <div>
      <p> Count: {count}</p>
      <button onClick={incriment}>+</button>
    </div>
  );
};
