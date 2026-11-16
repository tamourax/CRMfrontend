import { useQuery } from '@tanstack/react-query';
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
import { api, compactMoney, dateLabel, money, titleCase } from '../lib/api';
import type { Deal, Page, SalesReport } from '../types';
import { AiPanel, DealTable, Empty, ErrorState, Loading, PageHeader } from '../components/ui';

export function ReportPage() {
  const query = useQuery({
    queryKey: ['report'],
    queryFn: async () => (await api.get<{ data: SalesReport }>('/api/reports/sales')).data.data,
  });
  const deals = useQuery({
    queryKey: ['priority-deals'],
    queryFn: async () =>
      (
        await api.get<Page<Deal>>('/api/deals', {
          params: { stage: 'open', per_page: 5, sort: 'value_desc' },
        })
      ).data,
  });
  if (query.isPending) return <Loading />;
  if (query.isError) return <ErrorState error={query.error} retry={() => void query.refetch()} />;
  const report = query.data;
  const maxValue = Math.max(...report.stages.map((stage) => Number(stage.value)), 1);
  const decided = report.won_count + report.lost_count;
  return (
    <>
      <PageHeader
        eyebrow="THE BIG PICTURE"
        title="Sales overview"
        description="Your relationships, your pipeline, your next opportunity."
        action={
          <span className="date-chip">
            <CalendarDays size={16} />
            {dateLabel(report.as_of)}
          </span>
        }
      />
      <section className="overview-banner">
        <div>
          <span className="eyebrow light">A LITTLE CLARITY GOES A LONG WAY</span>
          <h2>
            See the opportunity.
            <br />
            Make your next move.
          </h2>
          <p>
            You have <strong>{report.open_count} open deals</strong> worth{' '}
            <strong>{money(report.pipeline_value)}</strong>.<br />
            Let’s turn promising conversations into lasting partnerships.
          </p>
          <Link className="button light-button" to="/assistant">
            <Sparkles size={16} />
            Ask your assistant
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="banner-visual" aria-hidden="true">
          <div className="visual-orbit" />
          <div className="visual-orbit second" />
          <div className="floating-card">
            <span className="mini-icon">
              <TrendingUp size={21} />
            </span>
            <small>Open pipeline</small>
            <strong>{compactMoney(report.pipeline_value)}</strong>
            <div className="mini-bars">
              {report.stages
                .filter((stage) => !['won', 'lost'].includes(stage.stage))
                .map((stage) => (
                  <i
                    key={stage.stage}
                    style={{ height: `${Math.max((Number(stage.value) / maxValue) * 100, 2)}%` }}
                    title={titleCase(stage.stage)}
                  />
                ))}
            </div>
            <span className="mini-caption">Room for your next big win.</span>
          </div>
          <span className="floating-check">
            <Check size={19} /> Moving forward
          </span>
          <Sparkles className="banner-sparkle" size={26} />
        </div>
      </section>
      <div className="stats-grid">
        {[
          {
            label: 'Open pipeline',
            value: money(report.pipeline_value),
            note: `${report.open_count} active opportunities`,
            icon: CircleDollarSign,
            tone: 'green',
          },
          {
            label: 'Won deal value',
            value: money(report.won_value),
            note: `${report.won_count} deals closed won`,
            icon: Target,
            tone: 'blue',
          },
          {
            label: 'Total deals',
            value: String(report.total_deals),
            note: `${decided ? Math.round((report.won_count / decided) * 100) : 0}% win rate among decided deals`,
            icon: Handshake,
            tone: 'purple',
          },
          {
            label: 'Lost deals',
            value: String(report.lost_count),
            note: `${money(report.lost_value)} in deal value`,
            icon: ArrowDownRight,
            tone: 'sand',
          },
        ].map((stat) => (
          <section className="stat-card" key={stat.label}>
            <div>
              <span>{stat.label}</span>
              <span className={`stat-icon ${stat.tone}`}>
                <stat.icon size={18} />
              </span>
            </div>
            <strong>{stat.value}</strong>
            <small>{stat.note}</small>
          </section>
        ))}
      </div>
      <div className="report-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Pipeline by stage</h2>
              <p>Where your opportunities stand today</p>
            </div>
            <span className="tiny-label">ALL DEALS</span>
          </div>
          <div className="stage-chart">
            {report.stages.map((stage) => (
              <div className="chart-row" key={stage.stage}>
                <div className="chart-label">
                  <span className={`stage-dot ${stage.stage}`} />
                  {titleCase(stage.stage)}
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
            Pipeline value includes Lead, Qualified, Proposal, and Negotiation.
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Top relationships</h2>
              <p>Customers by total deal value</p>
            </div>
            <Link className="icon-link" aria-label="View all customers" to="/customers">
              <ArrowUpRight size={18} />
            </Link>
          </div>
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
                    <small>{customer.deal_count} deals</small>
                  </div>
                  <span className="top-value">{compactMoney(customer.total_value)}</span>
                </Link>
              ))
            ) : (
              <Empty title="No customer activity yet" />
            )}
          </div>
        </section>
      </div>
      <div className="insight-strip">
        <div>
          <span className="insight-icon">
            <CalendarDays size={19} />
          </span>
          <p>
            <strong>
              {report.closing_this_month_count} open deals expected to close this month
            </strong>
            <span>
              {money(report.closing_this_month_value)} in potential value · Expected dates, not
              realized revenue
            </span>
          </p>
        </div>
        <Link to="/deals?closing=this_month&stage=open">
          Review deals
          <ArrowRight size={15} />
        </Link>
      </div>
      {report.overdue_count > 0 && (
        <div className="risk-strip">
          <Clock3 size={16} />
          <span>
            {report.overdue_count} open deals have a past expected close date. A follow-up could
            bring clarity.
          </span>
          <Link to="/deals?closing=overdue">
            Review <ArrowUpRight size={14} />
          </Link>
        </div>
      )}
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>High-value opportunities</h2>
            <p>Your five largest open deals</p>
          </div>
          <Link className="text-link" to="/deals">
            View all deals
            <ArrowRight size={15} />
          </Link>
        </div>
        {deals.isPending ? (
          <Loading />
        ) : deals.isError ? (
          <ErrorState error={deals.error} retry={() => void deals.refetch()} />
        ) : (
          <DealTable deals={deals.data.data} />
        )}
      </section>
      <AiPanel
        endpoint="/api/reports/sales/ai-summary"
        title="The story behind your numbers"
        description="Get a grounded summary of performance, risks, and opportunities."
      />
      <p className="report-disclaimer">
        Current snapshot · USD · {report.timezone} · No historical trend is inferred from this
        snapshot.
      </p>
    </>
  );
}
