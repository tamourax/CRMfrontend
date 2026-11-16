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
        <ArrowLeft size={15} /> {t('ui.all_customers')}{' '}
      </Link>
      <PageHeader
        eyebrow={t('ui.customer_profile')}
        title={customer.company}
        description={t('details.relationship', { name: customer.name })}
        action={<Badge value={customer.status} label={customer.status_label} />}
      />
      <OverviewCover
        variant="customer"
        label={t('customers.overview')}
        title={customer.name}
        imageAlt={t('ui.illustration_of_the_nile_and_cairo_business_district')}
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
            <h2>{t('ui.contact_company')}</h2>
            <Building2 size={18} />
          </PanelHeading>
          <dl className="detail-list">
            <div>
              <dt>{t('ui.contact_name')}</dt>
              <dd>{customer.name}</dd>
            </div>
            <div>
              <dt>
                <Mail size={14} /> {t('ui.email')}{' '}
              </dt>
              <dd>{customer.email || t('ui.not_provided')}</dd>
            </div>
            <div>
              <dt>
                <Phone size={14} /> {t('ui.phone')}{' '}
              </dt>
              <dd>{customer.phone || t('ui.not_provided')}</dd>
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
            <h2>{t('ui.relationship_notes')}</h2>
            <span className="tiny-label">{t('ui.internal')}</span>
          </PanelHeading>
          <p className="notes-text">
            {customer.notes || t('ui.no_notes_recorded_for_this_customer')}
          </p>
        </Panel>
      </div>
      <Panel>
        <PanelHeading>
          <div>
            <h2>{t('ui.associated_deals')}</h2>
            <p>
              {customer.deals?.length || 0} {t('ui.opportunities_in_this_relationship')}
            </p>
          </div>
          <Link className="text-link" to={`/deals?customer_id=${id}`}>
            {' '}
            {t('ui.view_in_deals')} <ArrowUpRight size={15} />
          </Link>
        </PanelHeading>
        <DealTable deals={customer.deals || []} showCustomer={false} />
      </Panel>
      <AiPanel
        key={id}
        endpoint={`/api/customers/${id}/ai-summary`}
        title={t('ui.relationship_intelligence')}
        description={t('ui.an_overview_of_the_relationship_opportunities_and_risks')}
      />
    </>
  );
}
