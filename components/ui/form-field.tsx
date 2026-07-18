import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function FormField({
  id,
  label,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm text-muted" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextInput({
  id,
  label,
  error,
  className,
  ...props
}: TextFieldProps) {
  return (
    <FormField id={id} label={label} error={error} className={className}>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(error && "border-danger/60")}
        {...props}
      />
    </FormField>
  );
}

type TextAreaProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextTextarea({
  id,
  label,
  error,
  className,
  ...props
}: TextAreaProps) {
  return (
    <FormField id={id} label={label} error={error} className={className}>
      <Textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(error && "border-danger/60")}
        {...props}
      />
    </FormField>
  );
}
