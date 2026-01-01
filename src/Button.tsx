import { useMContext } from "./context";

export const Button = () => {
  const ctx = useMContext();
  const { setValue, value } = ctx;
  return <button onClick={setValue}>{value}</button>;
};
