import { useDeal } from './queries';

import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Building2, CalendarDays, CircleDollarSign } from 'lucide-react';
import { dateLabel, money } from '../../lib/format';

import { Badge, ErrorState, Loading, PageHeader } from '../../components';
import { useT } from '../../preferences/LocaleProvider';

export function DealPage() {
  const { id } = useParams();
  const t = useT();
  const query = useDeal(id);
  if (query.isPending) return <Loading />;
  if (query.isError) return <ErrorState error={query.error} retry={() => void query.refetch()} />;
  const deal = query.data;
  return (
    <>
      <Link className="back-link" to="/deals">
        <ArrowLeft size={15} />
        All deals
      </Link>
      <PageHeader
        eyebrow={`OPPORTUNITY · DL-${String(deal.id).padStart(4, '0')}`}
        title={deal.title}
        description="Every detail you need to keep this opportunity moving."
        action={<Badge value={deal.stage} label={deal.stage_label} />}
      />
      <section className="project-cover" aria-label={t('deals.projectOverview')}>
        <img src="/images/cairo-business-district.svg" alt="Illustration of a Cairo business district along the Nile" />
        <div className="project-cover-shade" />
        <div className="project-cover-copy">
          <span className="eyebrow">{t('deals.projectOverview')}</span>
          <h2>{deal.title}</h2>
          <p>{deal.customer?.company} · {deal.customer?.industry} · {deal.customer?.city || t('common.egypt')}</p>
        </div>
      </section>
      <div className="deal-highlights">
        <section className="panel">
          <CircleDollarSign size={22} />
          <span>Deal value</span>
          <strong>{money(deal.value)}</strong>
        </section>
        <section className="panel">
          <Building2 size={22} />
          <span>Customer</span>
          <Link className="deal-customer-link" to={`/customers/${deal.customer_id}`}>
            <span>
              <strong>{deal.customer?.company}</strong>
              <small>{deal.customer?.name} · {deal.customer?.industry} · {deal.customer?.city || t('common.egypt')}</small>
            </span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </section>
        <section className="panel">
          <CalendarDays size={22} />
          <span>Expected closing date</span>
          <strong>{dateLabel(deal.expected_close_date)}</strong>
        </section>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <h2>Project scope</h2>
        </div>
        <p className="notes-text">{deal.description || 'No description recorded.'}</p>
        {deal.stage === 'lost' && (
          <div className="lost-note">
            <h3>Reason for loss</h3>
            <p>{deal.lost_reason || 'The reason for this lost deal has not been recorded.'}</p>
          </div>
        )}
      </section>
      <section className="next-step">
        <div>
          <h2>A clearer next move.</h2>
          <p>Ask your assistant about this deal or the wider pipeline.</p>
        </div>
        <Link
          className="button primary"
          to={`/assistant?question=${encodeURIComponent(`Show details for deal ${deal.id}`)}`}
        >
          Ask assistant <ArrowUpRight size={16} />
        </Link>
      </section>
    </>
  );
}
