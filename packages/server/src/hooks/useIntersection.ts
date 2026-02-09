import { RefObject, useEffect } from "react";

export function useIntersection(
  target: RefObject<HTMLElement | null>,
  callback?: () => void,
  options?: IntersectionObserverInit,
) {
  useEffect(() => {
    if (target.current && callback) {
      const callbackFN: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
          }
        });
      };

      const observer = new IntersectionObserver(callbackFN, {
        root: null,
        rootMargin: "0px",
        threshold: 1,
        ...options,
      });
      observer.observe(target.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [callback, options, target]);
}
