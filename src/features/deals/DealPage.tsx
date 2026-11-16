import {
  ButtonLink,
  OverviewCover,
  Panel,
  PanelHeading,
  Badge,
  ErrorState,
  Loading,
  PageHeader,
} from '../../components';
import { useDeal } from './dealQueries';

import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Building2, CalendarDays, CircleDollarSign } from 'lucide-react';
import { dateLabel, money } from '../../lib/format';

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
        <ArrowLeft size={15} /> {t('ui.all_deals')}{' '}
      </Link>
      <PageHeader
        eyebrow={`OPPORTUNITY · DL-${String(deal.id).padStart(4, '0')}`}
        title={deal.title}
        description={t('ui.every_detail_you_need_to_keep_this_opportunity_moving')}
        action={<Badge value={deal.stage} label={deal.stage_label} />}
      />
      <OverviewCover
        variant="project"
        label={t('deals.projectOverview')}
        title={deal.title}
        imageAlt={t('ui.illustration_of_a_cairo_business_district_along_the_nile')}
        description={
          <>
            {deal.customer?.company} · {deal.customer?.industry} ·{' '}
            {deal.customer?.city || t('common.egypt')}
          </>
        }
      />
      <div className="deal-highlights">
        <Panel>
          <CircleDollarSign size={22} />
          <span>{t('ui.deal_value')}</span>
          <strong>{money(deal.value)}</strong>
        </Panel>
        <Panel>
          <Building2 size={22} />
          <span>{t('ui.customer')}</span>
          <Link className="deal-customer-link" to={`/customers/${deal.customer_id}`}>
            <span>
              <strong>{deal.customer?.company}</strong>
              <small>
                {deal.customer?.name} · {deal.customer?.industry} ·{' '}
                {deal.customer?.city || t('common.egypt')}
              </small>
            </span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </Panel>
        <Panel>
          <CalendarDays size={22} />
          <span>{t('ui.expected_closing_date')}</span>
          <strong>{dateLabel(deal.expected_close_date)}</strong>
        </Panel>
      </div>
      <Panel>
        <PanelHeading>
          <h2>{t('ui.project_scope')}</h2>
        </PanelHeading>
        <p className="notes-text">{deal.description || t('ui.no_description_recorded')}</p>
        {deal.stage === 'lost' && (
          <div className="lost-note">
            <h3>{t('ui.reason_for_loss')}</h3>
            <p>{deal.lost_reason || t('ui.the_reason_for_this_lost_deal_has_not_been_recorded')}</p>
          </div>
        )}
      </Panel>
      <section className="next-step">
        <div>
          <h2>{t('ui.a_clearer_next_move')}</h2>
          <p>{t('ui.ask_your_assistant_about_this_deal_or_the_wider_pipeline')}</p>
        </div>
        <ButtonLink
          variant="primary"
          to={`/assistant?question=${encodeURIComponent(`Show details for deal ${deal.id}`)}`}
        >
          {' '}
          {t('ui.ask_assistant')} <ArrowUpRight size={16} />
        </ButtonLink>
      </section>
    </>
  );
}
