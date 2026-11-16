import type { ComponentProps } from 'react';

export function Panel({ className, ...props }: ComponentProps<'section'>) {
  return <section className={['panel', className].filter(Boolean).join(' ')} {...props} />;
}

export function PanelHeading({ className, ...props }: ComponentProps<'div'>) {
  return <div className={['panel-heading', className].filter(Boolean).join(' ')} {...props} />;
}
