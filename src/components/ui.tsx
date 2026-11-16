import { AlertCircle, ArrowLeft, ArrowRight, ArrowUpRight, LoaderCircle, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { api, dateLabel, errorMessage, money, titleCase } from '../lib/api';
import type { AiResult, Deal, Page } from '../types';

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <header className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</header>;
}
export function Badge({ value }: { value: string }) { return <span className={`badge badge-${value}`}>{titleCase(value)}</span>; }
export function Loading({ label = 'Loading your workspace…' }: { label?: string }) { return <div className="state" role="status"><LoaderCircle className="spin" size={24}/><p>{label}</p></div>; }
export function ErrorState({ error, retry }: { error: unknown; retry?: () => void }) { return <div className="state error-state" role="alert"><AlertCircle size={25}/><p>{errorMessage(error)}</p>{retry && <button className="button secondary" onClick={retry}>Try again</button>}</div>; }
export function Empty({ title = 'Nothing here yet', description = 'Try adjusting your filters.' }: { title?: string; description?: string }) { return <div className="state"><Search size={27}/><h3>{title}</h3><p>{description}</p></div>; }
export function Pagination({ meta, onChange }: { meta: Page<unknown>['meta']; onChange: (page: number) => void }) {
  return <div className="pagination"><span>{meta.total} result{meta.total === 1 ? '' : 's'} · Page {meta.current_page} of {meta.last_page}</span><div><button aria-label="Previous page" disabled={meta.current_page <= 1} onClick={() => onChange(meta.current_page - 1)}><ArrowLeft size={16}/></button><button aria-label="Next page" disabled={meta.current_page >= meta.last_page} onClick={() => onChange(meta.current_page + 1)}><ArrowRight size={16}/></button></div></div>;
}
export function DealTable({ deals, showCustomer = true }: { deals: Deal[]; showCustomer?: boolean }) {
  if (!deals.length) return <Empty title="No deals found" description="Deals matching your selection will appear here."/>;
  return <div className="table-wrap"><table><thead><tr><th>Deal name</th>{showCustomer && <th>Customer</th>}<th>Value</th><th>Stage</th><th>Expected close</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>{deals.map(deal => <tr key={deal.id}><td><Link className="strong-link" to={`/deals/${deal.id}`}>{deal.title}</Link><span className="cell-caption">DL-{String(deal.id).padStart(4, '0')}</span></td>{showCustomer && <td><Link to={`/customers/${deal.customer_id}`}>{deal.customer?.company || 'View customer'}</Link></td>}<td className="numeric">{money(deal.value)}</td><td><Badge value={deal.stage}/></td><td className="muted">{dateLabel(deal.expected_close_date)}</td><td><Link className="icon-link" aria-label={`View ${deal.title}`} to={`/deals/${deal.id}`}><ArrowUpRight size={17}/></Link></td></tr>)}</tbody></table></div>;
}
export function AiContent({ result }: { result: AiResult }) {
  const scalarFacts = Object.entries(result.facts).filter(([, value]) => typeof value === 'number' || typeof value === 'string');
  return <div className="ai-content"><div className="verified-label"><span/>Grounded in your CRM records</div>{scalarFacts.length > 0 && <div className="fact-grid">{scalarFacts.map(([key, value]) => <div key={key}><span>{titleCase(key)}</span><strong>{/value|amount/.test(key) && /^\d+(\.\d+)?$/.test(String(value)) ? money(String(value)) : String(value)}</strong></div>)}</div>}{result.sections.map((section, index) => <section className="ai-section" key={index}><h3>{section.title}</h3><p>{section.content}</p></section>)}{result.limitations.map((limitation, index) => <p className="note" key={index}>{limitation}</p>)}{result.sources.length > 0 && <div className="sources"><span>Sources</span>{result.sources.map((source, index) => source.type !== 'aggregate' && source.id ? <Link key={index} to={`/${source.type === 'deal' ? 'deals' : 'customers'}/${source.id}`}>{source.label}<ArrowUpRight size={12}/></Link> : <span className="source-chip" key={index}>{source.label}</span>)}</div>}<small className="muted">Generated {new Date(result.generated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · Review recommendations before acting.</small></div>;
}
export function AiPanel({ endpoint, title, description }: { endpoint: string; title: string; description: string }) {
  const mutation = useMutation({ mutationFn: async () => (await api.post<{ data: AiResult }>(endpoint)).data.data });
  return <section className="panel ai-panel"><div className="panel-heading"><div className="ai-heading"><span className="ai-icon"><Sparkles size={20}/></span><div><h2>{title}</h2><p>{description}</p></div></div><button className="button primary" disabled={mutation.isPending} onClick={() => mutation.mutate()}>{mutation.isPending ? <LoaderCircle className="spin" size={16}/> : <Sparkles size={16}/>} {mutation.isPending ? 'Analyzing…' : mutation.data ? 'Regenerate' : 'Generate summary'}</button></div>{mutation.isError && <ErrorState error={mutation.error} retry={() => mutation.mutate()}/>} {mutation.data && <AiContent result={mutation.data}/>} {!mutation.data && !mutation.isError && <div className="ai-placeholder"><Sparkles size={24}/><p>Turn your CRM data into a clear next step.</p><span>Generated on demand. Based only on records you can access.</span></div>}</section>;
}
