import { useT } from '../../preferences/LocaleProvider';
import { Panel, Badge, Empty, ErrorState, Loading, PageHeader, Pagination } from '../../components';
import { useCustomers } from './customerQueries';
import { useListFilters } from '../../hooks/useListFilters';

import { Link } from 'react-router-dom';
import { ArrowUpRight, Search, SlidersHorizontal, Users } from 'lucide-react';

export function CustomersPage() {
  const t = useT();
  const {
    filters: { search, status },
    page,
    setPage,
    setFilter,
  } = useListFilters({ search: '', status: '' });
  const query = useCustomers({ search, status, page });
  return (
    <>
      <PageHeader
        eyebrow={t('ui.your_network')}
        title={t('details.customers')}
        description={t('ui.the_people_and_companies_behind_your_next_opportunity')}
        action={
          <span className="header-tag">
            <Users size={16} />
            {query.data?.meta.total ?? '—'} {t('ui.customers')}{' '}
          </span>
        }
      />
      <Panel>
        <div className="filterbar">
          <label className="search-input">
            <Search size={17} />
            <input
              aria-label={t('ui.search_customers')}
              placeholder={t('ui.search_name_or_company')}
              value={search}
              onChange={(event) => {
                setFilter('search', event.target.value);
              }}
            />
          </label>
          <label className="select-label">
            <SlidersHorizontal size={16} />
            <select
              aria-label={t('ui.customer_status')}
              value={status}
              onChange={(event) => {
                setFilter('status', event.target.value);
              }}
            >
              <option value="">{t('ui.all_statuses')}</option>
              {['prospect', 'active', 'inactive'].map((value) => (
                <option key={value} value={value}>
                  {t('ui.' + value)}
                </option>
              ))}
            </select>
          </label>
        </div>
        {query.isPending ? (
          <Loading />
        ) : query.isError ? (
          <ErrorState error={query.error} retry={() => void query.refetch()} />
        ) : !query.data.data.length ? (
          <Empty title={t('ui.no_customers_found')} />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t('ui.customer')}</th>
                    <th>{t('ui.contact')}</th>
                    <th>{t('ui.industry')}</th>
                    <th>{t('ui.status')}</th>
                    <th>{t('ui.deals')}</th>
                    <th>
                      <span className="sr-only">{t('ui.open')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.data.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="company-cell">
                          <span className={`company-avatar color-${customer.id % 5}`}>
                            {customer.company.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <Link className="strong-link" to={`/customers/${customer.id}`}>
                              {customer.company}
                            </Link>
                            <span className="cell-caption">{customer.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="muted">{customer.email || t('ui.not_provided')}</td>
                      <td>{customer.industry}</td>
                      <td>
                        <Badge value={customer.status} label={customer.status_label} />
                      </td>
                      <td>{customer.deals_count}</td>
                      <td>
                        <Link
                          className="icon-link"
                          to={`/customers/${customer.id}`}
                          aria-label={t('details.view', { name: customer.company })}
                        >
                          <ArrowUpRight size={17} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination meta={query.data.meta} onChange={setPage} />
          </>
        )}
      </Panel>
    </>
  );
}
