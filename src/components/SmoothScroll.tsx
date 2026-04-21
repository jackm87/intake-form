"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const LENIS_ROUTES = ["/"];

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const enabled = LENIS_ROUTES.includes(pathname);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, [enabled]);

  return <>{children}</>;
}
