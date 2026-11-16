import type { ReactNode } from 'react';

interface OverviewCoverProps {
  variant: 'customer' | 'project';
  label: string;
  title: string;
  description: ReactNode;
  imageAlt: string;
}

export function OverviewCover({
  variant,
  label,
  title,
  description,
  imageAlt,
}: OverviewCoverProps) {
  const className = `${variant}-cover`;
  return (
    <section className={className} aria-label={label}>
      <img src="/images/cairo-business-district.svg" alt={imageAlt} />
      <div className={`${className}-shade`} />
      <div className={`${className}-copy`}>
        <span className="eyebrow">{label}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
}
