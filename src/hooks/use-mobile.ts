import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile({
  breakpoint = MOBILE_BREAKPOINT,
}: {
  breakpoint?: number;
} = {}) {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [breakpoint]
  );

  const getSnapshot = React.useCallback(() => {
    return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
  }, [breakpoint]);

  const getServerSnapshot = () => {
    return false;
  };

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
