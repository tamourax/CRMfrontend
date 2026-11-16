import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  tone: 'green' | 'blue' | 'purple' | 'sand';
}

export function StatCard({ label, value, note, icon: Icon, tone }: StatCardProps) {
  return (
    <section className="stat-card">
      <div>
        <span>{label}</span>
        <span className={`stat-icon ${tone}`}>
          <Icon size={18} />
        </span>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </section>
  );
}
