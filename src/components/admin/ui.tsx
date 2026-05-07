import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const PageHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
    <div>
      <h1 className="font-body text-2xl md:text-[28px] font-extrabold text-foreground">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Card = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("bg-[#1A1A1A] border border-white/10 border-t-[3px] border-t-primary rounded-xl p-6", className)}>
    {children}
  </div>
);

export const YBtn = ({ children, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...p}
    className={cn(
      "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md bg-primary text-primary-foreground text-xs font-bold uppercase tracking-[0.05em] hover:brightness-110 transition disabled:opacity-60",
      className,
    )}
  >
    {children}
  </button>
);

export const OutBtn = ({ children, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...p}
    className={cn(
      "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md border border-white/20 text-foreground text-xs font-bold uppercase tracking-[0.05em] hover:border-primary hover:text-primary transition",
      className,
    )}
  >
    {children}
  </button>
);

export const RedBtn = ({ children, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...p}
    className={cn(
      "inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md bg-[#E05C5C]/15 text-[#E05C5C] hover:bg-[#E05C5C] hover:text-white text-xs font-bold uppercase tracking-wider transition",
      className,
    )}
  >
    {children}
  </button>
);

export const Field = ({
  label, children,
}: { label: string; children: ReactNode }) => (
  <label className="block">
    <span className="text-xs uppercase tracking-wider text-foreground/80 block mb-2">{label}</span>
    {children}
  </label>
);

export const inputCls =
  "w-full bg-[#111111] border border-white/15 focus:border-primary outline-none rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-foreground/60";
