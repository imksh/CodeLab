import { useEffect, useCallback } from "react";

/**
 * Hook to manage mobile back button behavior.
 * When `isOpen` is true, it pushes a state to history so that pressing back
 * will trigger `onClose` instead of navigating away.
 */
const useMobileBack = (isOpen, onClose) => {
  const handlePopState = useCallback(
    (event) => {
      if (isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      // Push a new state to history when the view opens
      window.history.pushState({ mobileViewOpen: true }, "");
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, handlePopState]);
};

export default useMobileBack;
