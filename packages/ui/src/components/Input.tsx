"use client";

import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          "h-10 w-full rounded-md border px-3 text-sm transition-colors",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 focus:border-brand-500",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
