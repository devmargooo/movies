import { useRef, useCallback } from "react";

export const useDebounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  const timerId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return useCallback(
    (...args: T) => {
      clearInterval(timerId.current);
      timerId.current = setTimeout(() => fn(...args), delay);
    },
    [delay, fn]
  );
};
