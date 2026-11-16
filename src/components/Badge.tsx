import { titleCase } from '../lib/format';

export function Badge({ value, label }: { value: string; label?: string }) {
  return <span className={`badge badge-${value}`}>{label ?? titleCase(value)}</span>;
}
