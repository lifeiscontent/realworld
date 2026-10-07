import { clsx } from 'clsx';
import type { ComponentProps } from 'react';

interface FieldProps {
  /** The label shows as the placeholder, like the Conduit templates. */
  label: string;
  name: string;
  size?: 'lg';
}

type TextFieldProps = FieldProps &
  Omit<ComponentProps<'input'>, 'size' | 'placeholder' | 'aria-label'>;

/** A text input in a form group. */
export function TextField({
  label,
  size,
  type = 'text',
  className,
  ...props
}: TextFieldProps) {
  return (
    <fieldset className="form-group">
      <input
        type={type}
        className={clsx(
          'form-control',
          size && `form-control-${size}`,
          className
        )}
        placeholder={label}
        aria-label={label}
        {...props}
      />
    </fieldset>
  );
}

type TextAreaProps = FieldProps &
  Omit<ComponentProps<'textarea'>, 'placeholder' | 'aria-label'>;

/** A multi-line text input in a form group. */
export function TextArea({
  label,
  size,
  rows = 8,
  className,
  ...props
}: TextAreaProps) {
  return (
    <fieldset className="form-group">
      <textarea
        rows={rows}
        className={clsx(
          'form-control',
          size && `form-control-${size}`,
          className
        )}
        placeholder={label}
        aria-label={label}
        {...props}
      />
    </fieldset>
  );
}
