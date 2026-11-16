import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Page } from '../types';

export function Pagination({
  meta,
  onChange,
}: {
  meta: Page<unknown>['meta'];
  onChange: (page: number) => void;
}) {
  return (
    <div className="pagination">
      <span>
        {meta.total} result{meta.total === 1 ? '' : 's'} · Page {meta.current_page} of{' '}
        {meta.last_page}
      </span>
      <div>
        <button
          aria-label="Previous page"
          disabled={meta.current_page <= 1}
          onClick={() => onChange(meta.current_page - 1)}
        >
          <ArrowLeft size={16} />
        </button>
        <button
          aria-label="Next page"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onChange(meta.current_page + 1)}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
