import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search, SlidersHorizontal, Users } from 'lucide-react';
import { api, titleCase } from '../../lib/api';
import type { Customer, Page } from '../../types';
import { Badge, Empty, ErrorState, Loading, PageHeader, Pagination } from '../../components';

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ['customers', search, status, page],
    queryFn: async () =>
      (await api.get<Page<Customer>>('/api/customers', { params: { search, status, page } })).data,
  });
  return (
    <>
      <PageHeader
        eyebrow="YOUR NETWORK"
        title="Customers"
        description="The people and companies behind your next opportunity."
        action={
          <span className="header-tag">
            <Users size={16} />
            {query.data?.meta.total ?? '—'} customers
          </span>
        }
      />
      <section className="panel">
        <div className="filterbar">
          <label className="search-input">
            <Search size={17} />
            <input
              aria-label="Search customers"
              placeholder="Search name or company…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <label className="select-label">
            <SlidersHorizontal size={16} />
            <select
              aria-label="Customer status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {['prospect', 'active', 'inactive'].map((value) => (
                <option key={value} value={value}>
                  {titleCase(value)}
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
          <Empty title="No customers found" />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Industry</th>
                    <th>Status</th>
                    <th>Deals</th>
                    <th>
                      <span className="sr-only">Open</span>
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
                      <td className="muted">{customer.email || 'Not provided'}</td>
                      <td>{customer.industry}</td>
                      <td>
                        <Badge value={customer.status} />
                      </td>
                      <td>{customer.deals_count}</td>
                      <td>
                        <Link
                          className="icon-link"
                          to={`/customers/${customer.id}`}
                          aria-label={`View ${customer.company}`}
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
      </section>
    </>
  );
}
