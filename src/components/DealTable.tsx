import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dateLabel, money } from '../lib/format';
import type { Deal } from '../types';
import { Badge } from './Badge';
import { Empty } from './Feedback';

export function DealTable({
  deals,
  showCustomer = true,
}: {
  deals: Deal[];
  showCustomer?: boolean;
}) {
  if (!deals.length)
    return (
      <Empty title="No deals found" description="Deals matching your selection will appear here." />
    );
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Deal name</th>
            {showCustomer && <th>Customer</th>}
            <th>Value</th>
            <th>Stage</th>
            <th>Expected close</th>
            <th>
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.id}>
              <td>
                <Link className="strong-link" to={`/deals/${deal.id}`}>
                  {deal.title}
                </Link>
                <span className="cell-caption">DL-{String(deal.id).padStart(4, '0')}</span>
              </td>
              {showCustomer && (
                <td>
                  <Link to={`/customers/${deal.customer_id}`}>
                    {deal.customer?.company || 'View customer'}
                  </Link>
                </td>
              )}
              <td className="numeric">{money(deal.value)}</td>
              <td>
                <Badge value={deal.stage} />
              </td>
              <td className="muted">{dateLabel(deal.expected_close_date)}</td>
              <td>
                <Link
                  className="icon-link"
                  aria-label={`View ${deal.title}`}
                  to={`/deals/${deal.id}`}
                >
                  <ArrowUpRight size={17} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
