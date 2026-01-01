import { useState } from "react";
import { MContext } from "./context";

export const MContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [counter, setCounter] = useState(0);
  return (
    <MContext.Provider
      value={{
        setValue: () => setCounter((prev) => prev + 1),
        value: counter,
      }}
    >
      {children}
    </MContext.Provider>
  );
};
