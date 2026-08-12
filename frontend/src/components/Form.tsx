import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FieldWrapper({ label, error, required, children }: FieldWrapperProps) {
  return (
    <label className="flex flex-col gap-1">
      {label && (
        <span className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-danger"> *</span>}
        </span>
      )}
      {children}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className, ...props }, ref) => (
    <FieldWrapper label={label} error={error} required={required}>
      <input
        ref={ref}
        required={required}
        className={`rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-primary ${className ?? ""}`}
        {...props}
      />
    </FieldWrapper>
  )
);
Input.displayName = "Input";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, className, children, ...props }, ref) => (
    <FieldWrapper label={label} error={error} required={required}>
      <select
        ref={ref}
        required={required}
        className={`rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-primary ${className ?? ""}`}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  )
);
Select.displayName = "Select";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <FieldWrapper label={label} error={error}>
      <textarea
        ref={ref}
        className={`rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-primary ${className ?? ""}`}
        {...props}
      />
    </FieldWrapper>
  )
);
Textarea.displayName = "Textarea";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const styles: Record<ButtonVariant, string> = {
    primary: "bg-primary text-white hover:bg-primary-dark disabled:bg-primary/50",
    secondary: "bg-white border border-border text-ink hover:bg-paper",
    danger: "bg-danger text-white hover:opacity-90 disabled:opacity-50",
    ghost: "text-primary hover:underline",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${styles[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}
