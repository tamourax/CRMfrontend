import { useT } from '../preferences/LocaleProvider';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Page } from '../types';

export function Pagination({
  meta,
  onChange,
}: {
  meta: Page<unknown>['meta'];
  onChange: (page: number) => void;
}) {
  const t = useT();
  return (
    <div className="pagination">
      <span>
        {t('details.pagination', {
          total: meta.total,
          page: meta.current_page,
          last: meta.last_page,
        })}
      </span>
      <div>
        <button
          aria-label={t('ui.previous_page')}
          disabled={meta.current_page <= 1}
          onClick={() => onChange(meta.current_page - 1)}
        >
          <ArrowLeft size={16} />
        </button>
        <button
          aria-label={t('ui.next_page')}
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onChange(meta.current_page + 1)}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
