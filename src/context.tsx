import { createContext, useContext } from "react";

type MContextType = {
  value: number;
  setValue: () => void;
};

export const MContext = createContext<MContextType | undefined>(undefined);

export const useMContext = () => {
  const ctx = useContext(MContext);

  if (!ctx) {
    throw new Error("Ti pidor");
  }

  return ctx;
};
