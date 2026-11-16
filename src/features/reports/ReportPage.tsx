import { useT } from '../../preferences/LocaleProvider';
import {
  ButtonLink,
  StatCard,
  Panel,
  PanelHeading,
  AiPanel,
  DealTable,
  Empty,
  ErrorState,
  Loading,
  PageHeader,
} from '../../components';
import { usePriorityDeals } from '../deals/dealQueries';
import { useSalesReport } from './reportQueries';

import { Link } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock3,
  Handshake,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { compactMoney, money, titleCase } from '../../lib/format';

export function ReportPage() {
  const t = useT();
  const query = useSalesReport();
  const deals = usePriorityDeals();
  if (query.isPending) return <Loading />;
  if (query.isError) return <ErrorState error={query.error} retry={() => void query.refetch()} />;
  const report = query.data;
  const maxValue = Math.max(...report.stages.map((stage) => Number(stage.value)), 1);
  const decided = report.won_count + report.lost_count;
  return (
    <>
      <PageHeader
        eyebrow={t('ui.the_big_picture')}
        title={t('ui.sales_overview')}
        description={t('ui.your_relationships_your_pipeline_your_next_opportunity')}
      />
      <section className="overview-banner">
        <div>
          <span className="eyebrow light">{t('ui.a_little_clarity_goes_a_long_way')}</span>
          <h2>
            {' '}
            {t('ui.see_the_opportunity')} <br /> {t('ui.make_your_next_move')}{' '}
          </h2>
          <p>
            {' '}
            {t('ui.you_have')}{' '}
            <strong>
              {report.open_count} {t('ui.open_deals')}
            </strong>{' '}
            {t('ui.worth')} <strong>{money(report.pipeline_value)}</strong>.<br />{' '}
            {t('ui.let_s_turn_promising_conversations_into_lasting_partnerships')}{' '}
          </p>
          <ButtonLink variant="light" to="/assistant">
            <Sparkles size={16} /> {t('ui.ask_your_assistant')} <ArrowUpRight size={16} />
          </ButtonLink>
        </div>
        <div className="banner-visual" aria-hidden="true">
          <div className="visual-orbit" />
          <div className="visual-orbit second" />
          <div className="floating-card">
            <span className="mini-icon">
              <TrendingUp size={21} />
            </span>
            <small>{t('ui.open_pipeline')}</small>
            <strong>{compactMoney(report.pipeline_value)}</strong>
            <div className="mini-bars">
              {report.stages
                .filter((stage) => !['won', 'lost'].includes(stage.stage))
                .map((stage) => (
                  <i
                    key={stage.stage}
                    style={{ height: `${Math.max((Number(stage.value) / maxValue) * 100, 2)}%` }}
                    title={stage.label ?? titleCase(stage.stage)}
                  />
                ))}
            </div>
            <span className="mini-caption">{t('ui.room_for_your_next_big_win')}</span>
          </div>
          <span className="floating-check">
            <Check size={19} /> {t('ui.moving_forward')}{' '}
          </span>
          <Sparkles className="banner-sparkle" size={26} />
        </div>
      </section>
      <div className="stats-grid">
        {[
          {
            label: t('ui.open_pipeline'),
            value: money(report.pipeline_value),
            note: t('details.active', { count: report.open_count }),
            icon: CircleDollarSign,
            tone: 'green' as const,
          },
          {
            label: t('ui.won_deal_value'),
            value: money(report.won_value),
            note: t('details.won', { count: report.won_count }),
            icon: Target,
            tone: 'blue' as const,
          },
          {
            label: t('ui.total_deals'),
            value: String(report.total_deals),
            note: t('details.winRate', {
              count: decided ? Math.round((report.won_count / decided) * 100) : 0,
            }),
            icon: Handshake,
            tone: 'purple' as const,
          },
          {
            label: t('ui.lost_deals'),
            value: String(report.lost_count),
            note: t('details.lostValue', { value: money(report.lost_value) }),
            icon: ArrowDownRight,
            tone: 'sand' as const,
          },
        ].map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="report-grid">
        <Panel>
          <PanelHeading>
            <div>
              <h2>{t('ui.pipeline_by_stage')}</h2>
              <p>{t('ui.where_your_opportunities_stand_today')}</p>
            </div>
            <span className="tiny-label">{t('ui.all_deals')}</span>
          </PanelHeading>
          <div className="stage-chart">
            {report.stages.map((stage) => (
              <div className="chart-row" key={stage.stage}>
                <div className="chart-label">
                  <span className={`stage-dot ${stage.stage}`} />
                  {stage.label ?? titleCase(stage.stage)}
                  <small>{stage.count}</small>
                </div>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${stage.stage}`}
                    style={{ width: `${(Number(stage.value) / maxValue) * 100}%` }}
                    title={money(stage.value)}
                  />
                </div>
                <span className="chart-value">{compactMoney(stage.value)}</span>
              </div>
            ))}
          </div>
          <div className="panel-footnote">
            {' '}
            {t('ui.pipeline_value_includes_lead_qualified_proposal_and_negotiation')}{' '}
          </div>
        </Panel>
        <Panel>
          <PanelHeading>
            <div>
              <h2>{t('ui.top_relationships')}</h2>
              <p>{t('ui.customers_by_total_deal_value')}</p>
            </div>
            <Link className="icon-link" aria-label={t('ui.view_all_customers')} to="/customers">
              <ArrowUpRight size={18} />
            </Link>
          </PanelHeading>
          <div className="top-customers">
            {report.top_customers.length ? (
              report.top_customers.map((customer, index) => (
                <Link className="top-customer" key={customer.id} to={`/customers/${customer.id}`}>
                  <span className="rank">{String(index + 1).padStart(2, '0')}</span>
                  <span className={`company-avatar color-${customer.id % 5}`}>
                    {customer.company.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <strong>{customer.company}</strong>
                    <small>
                      {customer.deal_count} {t('ui.deals')}
                    </small>
                  </div>
                  <span className="top-value">{compactMoney(customer.total_value)}</span>
                </Link>
              ))
            ) : (
              <Empty title={t('ui.no_customer_activity_yet')} />
            )}
          </div>
        </Panel>
      </div>
      <div className="insight-strip">
        <div>
          <span className="insight-icon">
            <CalendarDays size={19} />
          </span>
          <p>
            <strong>
              {report.closing_this_month_count}{' '}
              {t('ui.open_deals_expected_to_close_this_month')}{' '}
            </strong>
            <span>
              {money(report.closing_this_month_value)}{' '}
              {t('ui.in_potential_value_expected_dates_not_realized_revenue')}{' '}
            </span>
          </p>
        </div>
        <Link to="/deals?closing=this_month&stage=open">
          {' '}
          {t('ui.review_deals')} <ArrowRight size={15} />
        </Link>
      </div>
      {report.overdue_count > 0 && (
        <div className="risk-strip">
          <Clock3 size={16} />
          <span>
            {report.overdue_count}{' '}
            {t(
              'ui.open_deals_have_a_past_expected_close_date_a_follow_up_could_bring_clarity',
            )}{' '}
          </span>
          <Link to="/deals?closing=overdue">
            {' '}
            {t('ui.review')} <ArrowUpRight size={14} />
          </Link>
        </div>
      )}
      <Panel>
        <PanelHeading>
          <div>
            <h2>{t('ui.high_value_opportunities')}</h2>
            <p>{t('ui.your_five_largest_open_deals')}</p>
          </div>
          <Link className="text-link" to="/deals">
            {' '}
            {t('ui.view_all_deals')} <ArrowRight size={15} />
          </Link>
        </PanelHeading>
        {deals.isPending ? (
          <Loading />
        ) : deals.isError ? (
          <ErrorState error={deals.error} retry={() => void deals.refetch()} />
        ) : (
          <DealTable deals={deals.data.data} />
        )}
      </Panel>
      <AiPanel
        endpoint="/api/reports/sales/ai-summary"
        title={t('ui.the_story_behind_your_numbers')}
        description={t('ui.get_a_grounded_summary_of_performance_risks_and_opportunities')}
      />
    </>
  );
}
