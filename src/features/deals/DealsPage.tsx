import { useT } from '../../preferences/LocaleProvider';
import { Panel, DealTable, ErrorState, Loading, PageHeader, Pagination } from '../../components';
import { useSearchParams } from 'react-router-dom';
import { useDeals } from './dealQueries';
import { useListFilters } from '../../hooks/useListFilters';

import { CircleDollarSign, Search } from 'lucide-react';
import { stages } from '../../lib/constants';

export function DealsPage() {
  const t = useT();
  const [params] = useSearchParams();
  const {
    filters: { stage, search, sort, closing },
    page,
    setPage,
    setFilter,
  } = useListFilters({
    stage: params.get('stage') || '',
    search: '',
    sort: 'value_desc',
    closing: params.get('closing') || '',
  });
  const customerId = params.get('customer_id') || '';
  const query = useDeals({ stage, page, search, sort, customer_id: customerId, closing });
  return (
    <>
      <PageHeader
        eyebrow={t('ui.move_business_forward')}
        title={t('details.deals')}
        description={t('ui.a_clear_view_of_every_opportunity_from_first_hello_to_closed_won')}
        action={
          <span className="header-tag">
            <CircleDollarSign size={16} />
            {query.data?.meta.total ?? '—'} {t('ui.deals')}{' '}
          </span>
        }
      />
      <Panel>
        <div className="stage-tabs" role="group" aria-label={t('ui.filter_by_stage')}>
          {['', 'open', ...stages].map((value) => (
            <button
              className={stage === value ? 'selected' : ''}
              key={value}
              onClick={() => {
                setFilter('stage', value);
              }}
            >
              {value ? t('ui.' + value) : t('ui.all_deals')}
            </button>
          ))}
        </div>
        <div className="filterbar">
          <label className="search-input">
            <Search size={17} />
            <input
              aria-label={t('ui.search_deals')}
              placeholder={t('ui.search_deals')}
              value={search}
              onChange={(event) => {
                setFilter('search', event.target.value);
              }}
            />
          </label>
          <div className="filter-options">
            <select
              aria-label={t('ui.closing_date')}
              value={closing}
              onChange={(event) => {
                setFilter('closing', event.target.value);
              }}
            >
              <option value="">{t('ui.any_closing_date')}</option>
              <option value="this_month">{t('ui.this_month')}</option>
              <option value="overdue">{t('ui.overdue_open')}</option>
            </select>
            <select
              aria-label={t('ui.sort_deals')}
              value={sort}
              onChange={(event) => {
                setFilter('sort', event.target.value);
              }}
            >
              <option value="value_desc">{t('ui.highest_value_first')}</option>
              <option value="value_asc">{t('ui.lowest_value_first')}</option>
              <option value="close_asc">{t('ui.closing_soonest')}</option>
              <option value="newest">{t('ui.newest_first')}</option>
            </select>
          </div>
        </div>
        {query.isPending ? (
          <Loading />
        ) : query.isError ? (
          <ErrorState error={query.error} retry={() => void query.refetch()} />
        ) : (
          <>
            <DealTable deals={query.data.data} />
            <Pagination meta={query.data.meta} onChange={setPage} />
          </>
        )}
      </Panel>
    </>
  );
}
