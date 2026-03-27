import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-brand-100 text-brand-700",
        secondary: "bg-gray-100 text-gray-700",
        pending: "bg-yellow-100 text-yellow-700",
        accepted: "bg-blue-100 text-blue-700",
        inProgress: "bg-purple-100 text-purple-700",
        completed: "bg-brand-100 text-brand-700",
        cancelled: "bg-red-100 text-red-700",
        verified: "bg-brand-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={clsx(badgeVariants({ variant }), className)} {...props} />;
}
