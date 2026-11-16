import {
  OverviewCover,
  Panel,
  PanelHeading,
  AiPanel,
  Badge,
  DealTable,
  ErrorState,
  Loading,
  PageHeader,
} from '../../components';
import { useCustomer } from './customerQueries';

import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Building2, Mail, Phone } from 'lucide-react';

import { useT } from '../../preferences/LocaleProvider';

export function CustomerPage() {
  const { id } = useParams();
  const t = useT();
  const query = useCustomer(id);
  if (query.isPending) return <Loading />;
  if (query.isError) return <ErrorState error={query.error} retry={() => void query.refetch()} />;
  const customer = query.data;
  return (
    <>
      <Link className="back-link" to="/customers">
        <ArrowLeft size={15} />
        All customers
      </Link>
      <PageHeader
        eyebrow="CUSTOMER PROFILE"
        title={customer.company}
        description={`Your relationship with ${customer.name}.`}
        action={<Badge value={customer.status} label={customer.status_label} />}
      />
      <OverviewCover
        variant="customer"
        label={t('customers.overview')}
        title={customer.name}
        imageAlt="Illustration of the Nile and Cairo business district"
        description={
          <>
            {customer.industry} · {customer.city || t('common.egypt')} ·{' '}
            {t('customers.associatedDealsCount').replace(
              '{count}',
              String(customer.deals_count ?? customer.deals?.length ?? 0),
            )}
          </>
        }
      />
      <div className="detail-grid">
        <Panel>
          <PanelHeading>
            <h2>Contact & company</h2>
            <Building2 size={18} />
          </PanelHeading>
          <dl className="detail-list">
            <div>
              <dt>Contact name</dt>
              <dd>{customer.name}</dd>
            </div>
            <div>
              <dt>
                <Mail size={14} />
                Email
              </dt>
              <dd>{customer.email || 'Not provided'}</dd>
            </div>
            <div>
              <dt>
                <Phone size={14} />
                Phone
              </dt>
              <dd>{customer.phone || 'Not provided'}</dd>
            </div>
            <div>
              <dt>{t('customers.industryLocation')}</dt>
              <dd>
                {customer.industry}
                {customer.city ? ` · ${customer.city}, ${t('common.egypt')}` : ''}
              </dd>
            </div>
          </dl>
        </Panel>
        <Panel>
          <PanelHeading>
            <h2>Relationship notes</h2>
            <span className="tiny-label">INTERNAL</span>
          </PanelHeading>
          <p className="notes-text">{customer.notes || 'No notes recorded for this customer.'}</p>
        </Panel>
      </div>
      <Panel>
        <PanelHeading>
          <div>
            <h2>Associated deals</h2>
            <p>{customer.deals?.length || 0} opportunities in this relationship</p>
          </div>
          <Link className="text-link" to={`/deals?customer_id=${id}`}>
            View in deals <ArrowUpRight size={15} />
          </Link>
        </PanelHeading>
        <DealTable deals={customer.deals || []} showCustomer={false} />
      </Panel>
      <AiPanel
        key={id}
        endpoint={`/api/customers/${id}/ai-summary`}
        title="Relationship intelligence"
        description="An overview of the relationship, opportunities, and risks."
      />
    </>
  );
}
