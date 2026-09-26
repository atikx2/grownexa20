import { useEffect, useRef, useState } from "react";

export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const match = value.match(/^(\D*)([\d,.]+)(.*)$/);
  const target = match ? Number(match[2].replace(/,/g, "")) : NaN;
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || isNaN(target)) return;
    let raf = 0;
    const obs = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    obs.observe(ref.current);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration]);

  if (!match || isNaN(target)) return <span>{value}</span>;
  return <span ref={ref}>{match[1]}{n.toLocaleString("en-US")}{match[3]}</span>;
}
