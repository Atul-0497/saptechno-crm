"use client";

import React from "react";
import { clsx } from "clsx";
import { FormError } from "./FormError";
import { LucideIcon } from "lucide-react";

interface LuxuryFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}

export const LuxuryFieldWrapper = ({ label, error, children, hint, required }: LuxuryFieldProps) => (
  <div className="group space-y-2">
    <div className="flex items-center justify-between px-1">
      <label className="text-[12px] font-extrabold uppercase tracking-widest text-indigo-700/60 transition-colors group-focus-within:text-indigo-600 dark:text-slate-400 dark:group-focus-within:text-blue-400">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      {hint && <span className="text-[11px] font-medium text-slate-400">{hint}</span>}
    </div>
    <div className="relative">
      {children}
    </div>
    <FormError message={error} />
  </div>
);

interface LuxuryInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
}

export const LuxuryInput = React.forwardRef<HTMLInputElement, LuxuryInputProps>(
  ({ icon: Icon, error, className, ...props }, ref) => (
    <div className={clsx(
      "flex items-center rounded-xl border bg-white/90 px-4 shadow-sm transition-all focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:shadow-md dark:bg-slate-950",
      error
        ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-500/10"
        : "border-indigo-200/60 dark:border-slate-800",
      className
    )}>
      {Icon && <Icon size={18} className="text-indigo-400 dark:text-slate-500" />}
      <input
        ref={ref}
        {...props}
        className={clsx(
          "min-w-0 flex-1 border-0 bg-transparent px-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-white",
          props.type === "checkbox" ? "h-5 w-5 flex-none accent-indigo-600" : "h-14"
        )}
      />
    </div>
  )
);
LuxuryInput.displayName = "LuxuryInput";

interface LuxurySelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "placeholder"> {
  icon?: LucideIcon;
  error?: string;
  options: { label: string; value: string | number }[];
  placeholder?: string;
}

export const LuxurySelect = React.forwardRef<HTMLSelectElement, LuxurySelectProps>(
  ({ icon: Icon, error, options, className, ...props }, ref) => (
    <div className={clsx(
      "flex items-center rounded-xl border bg-white/90 px-4 shadow-sm transition-all focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:shadow-md dark:bg-slate-950",
      error
        ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-500/10"
        : "border-indigo-200/60 dark:border-slate-800",
      className
    )}>
      {Icon && <Icon size={18} className="text-indigo-400 dark:text-slate-500" />}
      <select
        ref={ref}
        {...props}
        className="h-14 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm font-bold text-slate-800 outline-none dark:text-slate-200"
      >
        <option value="" className="dark:bg-slate-900">{props.placeholder || "Select an option"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="dark:bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
);
LuxurySelect.displayName = "LuxurySelect";

interface LuxuryTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: LucideIcon;
  error?: string;
}

export const LuxuryTextarea = React.forwardRef<HTMLTextAreaElement, LuxuryTextareaProps>(
  ({ icon: Icon, error, className, ...props }, ref) => (
    <div className={clsx(
      "flex items-start rounded-xl border bg-white/90 px-4 py-4 shadow-sm transition-all focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:shadow-md dark:bg-slate-950",
      error
        ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-500/10"
        : "border-indigo-200/60 dark:border-slate-800",
      className
    )}>
      {Icon && <Icon size={18} className="mt-1 text-indigo-400 dark:text-slate-500" />}
      <textarea
        ref={ref}
        {...props}
        className="min-w-0 flex-1 resize-none border-0 bg-transparent px-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
      />
    </div>
  )
);
LuxuryTextarea.displayName = "LuxuryTextarea";

export const LuxurySection = ({
  title,
  subtitle,
  children,
  className,
  contentClassName,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) => (
  <div className={clsx(
    "rounded-2xl border border-indigo-100/70 bg-white/85 p-6 shadow-md shadow-indigo-100/30 backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/50 dark:shadow-none sm:p-8",
    className
  )}>
    <div className="mb-8 pl-1">
      <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-sm font-medium text-indigo-500/70 dark:text-slate-500">{subtitle}</p>
      )}
      <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
    </div>
    {/* contentClassName REPLACES the default grid — prevents class conflicts */}
    <div className={contentClassName ?? "grid gap-x-8 gap-y-10 sm:grid-cols-2"}>
      {children}
    </div>
  </div>
);
