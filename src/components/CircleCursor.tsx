import { useEffect, useRef } from "react";

export function CircleCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const move = (event: PointerEvent) => {
      const element = cursor.current;
      if (!element || !media.matches || event.pointerType === "touch") return;
      document.documentElement.classList.add("circle-cursor-active");
      element.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      element.classList.add("is-visible");
    };
    const hide = () => {
      cursor.current?.classList.remove("is-visible");
      document.documentElement.classList.remove("circle-cursor-active");
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    media.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      media.removeEventListener("change", hide);
    };
  }, []);

  return <div ref={cursor} className="circle-cursor" aria-hidden="true" />;
}