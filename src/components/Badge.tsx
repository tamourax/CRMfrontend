import { titleCase } from '../lib/format';

export function Badge({ value }: { value: string }) {
  return <span className={`badge badge-${value}`}>{titleCase(value)}</span>;
}
