import { clsx } from 'clsx';
import type { ComponentProps } from 'react';
import { Link } from 'react-router';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonStyle {
  variant: Variant;
  /** An outline button has a border and no fill. */
  outline?: boolean;
  size?: 'sm' | 'lg';
}

/** The classes of the Conduit theme for a button style. */
function buttonClass(
  { variant, outline, size }: ButtonStyle,
  className?: string
) {
  return clsx(
    'btn',
    size && `btn-${size}`,
    outline ? `btn-outline-${variant}` : `btn-${variant}`,
    className
  );
}

type ButtonProps = ButtonStyle & ComponentProps<'button'>;

export function Button({
  variant,
  outline,
  size,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, outline, size }, className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ButtonStyle & ComponentProps<typeof Link>;

/** A link that looks like a button. */
export function ButtonLink({
  variant,
  outline,
  size,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClass({ variant, outline, size }, className)}
      {...props}
    />
  );
}
