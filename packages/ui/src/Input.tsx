import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, type = "text", value, disabled = false, className = "", ...props },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-primary-txt">
            {label}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          value={value}
          disabled={disabled}
          className={`
                        w-full rounded-lg border
                        px-4 py-3
                        outline-none transition-all duration-300
                        focus:border-primary-btn-bg
                        focus:ring-2
                        focus:ring-primary-btn-bg/20
                        disabled:cursor-not-allowed
                        disabled:backdrop-opacity-50
                        ${className}
                    `}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";
