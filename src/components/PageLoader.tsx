import { useEffect, useState } from "react";
import { SafouLeaf } from "./SafouLeaf";

export const PageLoader = () => {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1900);
    return () => clearTimeout(t);
  }, []);
  if (gone) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center animate-leaf-out pointer-events-none">
      <div className="flex flex-col items-center gap-4">
        <SafouLeaf className="w-16 h-16 text-primary animate-pulse" />
        <p className="font-accent italic text-primary text-xl">Le Safoutier</p>
      </div>
    </div>
  );
};
