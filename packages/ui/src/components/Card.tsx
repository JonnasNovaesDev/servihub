import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-gray-200 bg-white p-6 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={clsx("mb-4 flex flex-col gap-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <h3 className={clsx("text-lg font-semibold text-gray-900", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={clsx("text-sm text-gray-600", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div className={clsx("mt-4 flex items-center", className)} {...props}>
      {children}
    </div>
  );
}
