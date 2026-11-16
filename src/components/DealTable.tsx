import { useT } from '../preferences/LocaleProvider';
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
  const t = useT();
  if (!deals.length)
    return (
      <Empty
        title={t('ui.no_deals_found')}
        description={t('ui.deals_matching_your_selection_will_appear_here')}
      />
    );
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t('ui.deal_name')}</th>
            {showCustomer && <th>{t('ui.customer')}</th>}
            <th>{t('ui.value')}</th>
            <th>{t('ui.stage')}</th>
            <th>{t('ui.expected_close')}</th>
            <th>
              <span className="sr-only">{t('ui.open')}</span>
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
                    {deal.customer?.company || t('ui.view_customer')}
                  </Link>
                </td>
              )}
              <td className="numeric">{money(deal.value)}</td>
              <td>
                <Badge value={deal.stage} label={deal.stage_label} />
              </td>
              <td className="muted">{dateLabel(deal.expected_close_date)}</td>
              <td>
                <Link
                  className="icon-link"
                  aria-label={t('details.view', { name: deal.title })}
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
