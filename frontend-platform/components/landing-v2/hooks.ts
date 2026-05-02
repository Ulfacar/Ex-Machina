'use client';

import { useState, useEffect, useRef } from 'react';

export function useReveal(rootMargin = "-10% 0px -10% 0px") {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin, threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

export function useCountUp(
  target: number,
  {
    duration = 1600,
    decimals = 0,
    suffix = "",
    prefix = "",
  }: {
    duration?: number;
    decimals?: number;
    suffix?: string;
    prefix?: string;
  } = {}
): [React.RefObject<HTMLSpanElement>, string] {
  const ref = useRef<HTMLSpanElement>(null!);
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const t0 = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - t0) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(target * eased);
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [target, duration]);

  const display = decimals
    ? val.toFixed(decimals)
    : Math.round(val).toLocaleString("ru-RU");
  return [ref, prefix + display + suffix];
}

export function fmtMoney(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function fmtRub(n: number): string {
  return Math.round(n).toLocaleString("ru-RU") + " сом";
}
