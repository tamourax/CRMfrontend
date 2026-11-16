import { useCustomer } from './queries';

import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Building2, Mail, Phone } from 'lucide-react';

import { AiPanel, Badge, DealTable, ErrorState, Loading, PageHeader } from '../../components';

export function CustomerPage() {
  const { id } = useParams();
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
        action={<Badge value={customer.status} />}
      />
      <div className="detail-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Contact & company</h2>
            <Building2 size={18} />
          </div>
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
              <dt>Industry</dt>
              <dd>{customer.industry}</dd>
            </div>
          </dl>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h2>Relationship notes</h2>
            <span className="tiny-label">INTERNAL</span>
          </div>
          <p className="notes-text">{customer.notes || 'No notes recorded for this customer.'}</p>
        </section>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Associated deals</h2>
            <p>{customer.deals?.length || 0} opportunities in this relationship</p>
          </div>
          <Link className="text-link" to={`/deals?customer_id=${id}`}>
            View in deals <ArrowUpRight size={15} />
          </Link>
        </div>
        <DealTable deals={customer.deals || []} showCustomer={false} />
      </section>
      <AiPanel
        key={id}
        endpoint={`/api/customers/${id}/ai-summary`}
        title="Relationship intelligence"
        description="An overview of the relationship, opportunities, and risks."
      />
    </>
  );
}
