"use client";

import { forwardRef, useId, useState } from "react";
import type { CSSProperties, FocusEvent, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Check, CircleAlert } from "lucide-react";

type BaseProps = {
  label: string;
  icon: ReactNode;
  valid?: boolean;
  error?: string | null;
  helpText?: string;
  className?: string;
  rootClassName?: string;
};

type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
    textarea?: false;
  };

type TextareaProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> & {
    textarea: true;
    rows?: number;
  };

type GlassInputProps = InputProps | TextareaProps;

const baseInput =
  "peer w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 pl-12 pr-10 text-sm text-white outline-none transition duration-200 placeholder:text-transparent focus:border-[color:var(--accent)] focus:bg-white/[0.07]";

function makeShadow(focused: boolean, style?: CSSProperties) {
  return {
    ...(style ?? {}),
    boxShadow: focused
      ? "0 0 0 1px rgba(255,255,255,0.05), 0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent)"
      : style?.boxShadow,
  } satisfies CSSProperties;
}

export const GlassInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, GlassInputProps>(function GlassInput(
  { label, icon, valid, error, helpText, className, rootClassName, textarea, ...props },
  ref,
) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const statusBorder = error ? "border-rose-400/50" : valid ? "border-emerald-400/50" : "border-white/10";
  const value = typeof props.value === "string" ? props.value : "";
  const isFloated = focused || value.length > 0;

  const handleFocus = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(true);
    props.onFocus?.(event as never);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(false);
    props.onBlur?.(event as never);
  };

  const inputClassName = `${baseInput} ${textarea ? "min-h-[128px] resize-none pt-7" : "h-14"} ${statusBorder} ${className ?? ""}`;

  return (
    <div className={rootClassName}>
      <label htmlFor={id} className="group relative block">
        <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/35 transition-colors duration-200 group-focus-within:text-[color:var(--accent)]">
          {icon}
        </div>
        <span
          className="pointer-events-none absolute left-12 top-4 origin-left text-[11px] uppercase tracking-[0.24em] text-white/42 transition-all duration-200"
          style={{
            transform: isFloated ? "translateY(0) scale(0.92)" : "translateY(10px) scale(1)",
            color: isFloated ? "var(--accent)" : undefined,
          }}
        >
          {label}
        </span>

        {textarea ? (
          <textarea
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={ref as any}
            id={id}
            aria-label={label}
            placeholder=" "
            className={inputClassName}
            style={makeShadow(focused, props.style as CSSProperties | undefined)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : (
          <input
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={ref as any}
            id={id}
            aria-label={label}
            placeholder=" "
            className={inputClassName}
            style={makeShadow(focused, props.style as CSSProperties | undefined)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )}

        <div
          className="pointer-events-none absolute inset-x-4 bottom-0 h-px origin-left bg-[color:var(--accent)] transition-transform duration-200"
          style={{ transform: isFloated ? "scaleX(1)" : "scaleX(0)" }}
        />
        {valid ? (
          <Check className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
        ) : error ? (
          <CircleAlert className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400" />
        ) : null}
      </label>
      {helpText ? <p className="mt-2 text-xs text-white/35">{helpText}</p> : null}
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </div>
  );
});
