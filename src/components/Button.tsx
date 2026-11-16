import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'light';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'primary',
  secondary: 'secondary',
  light: 'light-button',
};

function buttonClass(variant: ButtonVariant, className?: string) {
  return ['button', variantClasses[variant], className].filter(Boolean).join(' ');
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: ComponentProps<'button'> & { variant?: ButtonVariant }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = 'primary',
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
