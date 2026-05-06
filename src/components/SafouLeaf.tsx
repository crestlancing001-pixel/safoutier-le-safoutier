import { SVGProps } from "react";

export const SafouLeaf = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M32 4C18 14 10 26 10 38c0 12 9 22 22 22s22-10 22-22C54 26 46 14 32 4Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M32 6v54M32 60c-6-10-14-18-22-22M32 60c6-10 14-18 22-22M32 36c-5-4-10-7-16-9M32 36c5-4 10-7 16-9"
      stroke="hsl(var(--background))"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.55"
    />
  </svg>
);

export const LeafDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`}>
    <span className="h-px w-16 md:w-24 bg-primary/40" />
    <SafouLeaf className="w-6 h-6 text-primary rotate-12" />
    <span className="h-px w-16 md:w-24 bg-primary/40" />
  </div>
);
