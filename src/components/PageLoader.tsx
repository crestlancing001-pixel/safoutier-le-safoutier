import { useEffect, useState } from "react";

export const PageLoader = () => {
  const [gone, setGone] = useState(false);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const f = setTimeout(() => setFading(true), 1100);
    const t = setTimeout(() => setGone(true), 1600);
    return () => { clearTimeout(f); clearTimeout(t); };
  }, []);
  if (gone) return null;
  return (
    <div
      className={`fixed inset-0 z-[100] bg-surface2 flex items-center justify-center transition-opacity duration-500 pointer-events-none ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="font-body text-3xl md:text-5xl font-black uppercase tracking-[0.15em] text-primary">
        LE SAFOUTIER
      </p>
    </div>
  );
};
