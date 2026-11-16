import { Panel, DealTable, ErrorState, Loading, PageHeader, Pagination } from '../../components';
import { useSearchParams } from 'react-router-dom';
import { useDeals } from './dealQueries';
import { useState } from 'react';

import { CircleDollarSign, Search } from 'lucide-react';
import { stages } from '../../lib/constants';
import { titleCase } from '../../lib/format';

export function DealsPage() {
  const [params] = useSearchParams();
  const [stage, setStage] = useState(params.get('stage') || '');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('value_desc');
  const customerId = params.get('customer_id') || '';
  const [closing, setClosing] = useState(params.get('closing') || '');
  const query = useDeals({ stage, page, search, sort, customer_id: customerId, closing });
  return (
    <>
      <PageHeader
        eyebrow="MOVE BUSINESS FORWARD"
        title="Deals"
        description="A clear view of every opportunity, from first hello to closed won."
        action={
          <span className="header-tag">
            <CircleDollarSign size={16} />
            {query.data?.meta.total ?? '—'} deals
          </span>
        }
      />
      <Panel>
        <div className="stage-tabs" role="group" aria-label="Filter by stage">
          {['', 'open', ...stages].map((value) => (
            <button
              className={stage === value ? 'selected' : ''}
              key={value}
              onClick={() => {
                setStage(value);
                setPage(1);
              }}
            >
              {value ? titleCase(value) : 'All deals'}
            </button>
          ))}
        </div>
        <div className="filterbar">
          <label className="search-input">
            <Search size={17} />
            <input
              aria-label="Search deals"
              placeholder="Search deals…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <div className="filter-options">
            <select
              aria-label="Closing date"
              value={closing}
              onChange={(event) => {
                setClosing(event.target.value);
                setPage(1);
              }}
            >
              <option value="">Any closing date</option>
              <option value="this_month">This month</option>
              <option value="overdue">Overdue & open</option>
            </select>
            <select
              aria-label="Sort deals"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
            >
              <option value="value_desc">Highest value first</option>
              <option value="value_asc">Lowest value first</option>
              <option value="close_asc">Closing soonest</option>
              <option value="newest">Newest first</option>
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
