import { titleCase } from '../lib/api';

export function Badge({ value }: { value: string }) {
  return <span className={`badge badge-${value}`}>{titleCase(value)}</span>;
}
